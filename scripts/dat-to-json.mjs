#!/usr/bin/env node
/**
 * DAT to JSON converter - Parses clrmamepro DAT files from Libretro
 * Usage: node scripts/dat-to-json.mjs input.dat output.json [--covers=covers.json]
 *
 * When a covers file is supplied, every entry gets the URL of its published
 * boxart. Only scraped names are used, so the generated URLs never 404.
 *
 * Boxarts are published under the full DAT name, tags included, so they are
 * matched entry by entry. What that misses is a game whose published boxart
 * belongs to a release this DAT does not list — a different revision, or a
 * region that never got dumped. Those are joined by base title into a second,
 * game-level layer, which the application falls back to when a release has no
 * boxart of its own.
 *
 * That second layer is kept **by region**, because a game has one boxart per
 * region and borrowing the European box for a Japanese release would be as
 * wrong as showing none. A published name that carries no region tag — a quarter
 * of them do not — goes under `*` and stands for the whole game.
 *
 * The base title and the region both come from the application's own functions,
 * imported rather than reimplemented: the same key groups the games in the
 * browser, names the folders on disk and looks up the boxarts here, and two
 * implementations of either would eventually disagree.
 */

import fs from 'fs';
import path from 'path';
import { boxartUrl } from './systems.mjs';
import { normalizeGameName, parseGameName, sanitizeName } from '../src/core/rom-grouping.ts';
import { ANY_REGION, REGIONS, regionsOf, videoStandardsOf } from '../src/core/rom-regions.ts';

/**
 * Parse clrmamepro DAT format with balanced parenthesis matching
 */
function parseDat(datContent) {
  const games = [];
  
  // Find all balanced game ( ... ) blocks
  let pos = 0;
  while (true) {
    // Find next "game ("
    const gameIdx = datContent.indexOf('game (', pos);
    if (gameIdx === -1) break;
    
    // Check that it's word-bounded (preceded by ) or whitespace or start)
    const before = gameIdx > 0 ? datContent[gameIdx - 1] : '\n';
    if (!/[\s\)]/.test(before)) {
      pos = gameIdx + 6;
      continue;
    }
    
    // Find the opening paren position (after "game ")
    let openIdx = gameIdx + 5; // Skip "game "
    while (openIdx < datContent.length && datContent[openIdx] !== '(') {
      openIdx++;
    }
    if (openIdx >= datContent.length) break;
    
    // Find balanced closing paren starting from the opening paren. Quoted
    // strings are skipped because game names may contain unbalanced
    // parenthesis, e.g. "Odekake Lester - Lelele no Le (^^; (Japan)".
    let parenIdx = openIdx;
    let depth = 0;
    
    while (parenIdx < datContent.length) {
      const ch = datContent[parenIdx];
      if (ch === '"') {
        const closingQuote = datContent.indexOf('"', parenIdx + 1);
        if (closingQuote === -1) break;
        parenIdx = closingQuote + 1;
        continue;
      }
      if (ch === '(') depth++;
      else if (ch === ')') {
        depth--;
        if (depth === 0) {
          // Found matching closing paren - content is between opening ( and closing )
          const gameBlock = datContent.substring(openIdx + 1, parenIdx).trim();
          
          if (gameBlock.length > 0) {
            const game = {};
            
            // Extract name
            const nameMatch = gameBlock.match(/name\s+"([^"]+)"/);
            if (nameMatch) {
              game.name = nameMatch[1];
            }
            
            // Extract description
            const descMatch = gameBlock.match(/description\s+"([^"]+)"/);
            if (descMatch) {
              game.description = descMatch[1];
            }

            // Extract the DAT's explicit release region when available.
            const regionMatch = gameBlock.match(/\bregion\s+"([^"]+)"/);
            if (regionMatch) {
              game.region = regionMatch[1];
            }
            
            // Extract ROMs. Game and ROM names may themselves contain parentheses,
            // so a simple `[^)]` matcher would truncate the ROM block prematurely.
            const romRegex = /rom\s*\(\s*name\s+"([^"]+)"\s+size\s+(\d+)\s+crc\s+([0-9a-fA-F]+)(?:[\s\S]*?\bmd5\s+([0-9a-fA-F]+))?[\s\S]*?\bsha1\s+([0-9a-fA-F]+)/g;
            game.roms = [];
            
            let romMatch;
            while ((romMatch = romRegex.exec(gameBlock)) !== null) {
              const rom = {
                name: romMatch[1],
                size: parseInt(romMatch[2], 10),
                crc: romMatch[3].toUpperCase(),
                md5: romMatch[4]?.toUpperCase(),
                sha1: romMatch[5].toUpperCase()
              };
              
              if (rom.name) {
                game.roms.push(rom);
              }
            }
            
            if (game.name && game.roms.length > 0) {
              games.push(game);
            }
          }
          
          pos = parenIdx + 1;
          break;
        }
      }
      parenIdx++;
    }
    
    if (parenIdx >= datContent.length) break; // No matching paren found
  }
  
  return games;
}

/**
 * Region names of an entry, as the application reads them: the tags of the name
 * first, and the DAT's own `region` field only when the name carries none.
 *
 * That order matters because the field is unreliable — missing for a third of
 * the NES entries and never carrying `World` — while the name almost always has
 * a region tag.
 */
function datRegionsOf(game) {
  const { regions } = parseGameName(game.name);
  if (regions.length > 0) return regions;

  return game.region ? [game.region] : [];
}

/**
 * How well a boxart name stands in for a whole game.
 *
 * Lower sorts first. A plain retail release beats a beta or a prototype, and
 * among equals the least decorated name wins, so a game borrows a cover that
 * looks like the game rather than like one of its oddities. The name itself
 * breaks the remaining ties, so the choice never depends on listing order.
 */
function coverRank(name) {
  const parsed = parseGameName(name);
  return [parsed.flags.length > 0 ? 1 : 0, parsed.tags.length, name.length, name];
}

function outranks(name, current) {
  const candidate = coverRank(name);
  const incumbent = coverRank(current);

  for (let i = 0; i < candidate.length; i++) {
    if (candidate[i] !== incumbent[i]) return candidate[i] < incumbent[i];
  }

  return false;
}

/**
 * Read a scraped covers file into the two lookups the join needs: one keyed by
 * the published name, for the exact match, and one keyed by base title, for the
 * game-level fallback.
 *
 * The candidates of a title keep the regions their name claims, because the
 * fallback is resolved region by region.
 */
function loadCovers(coversFile) {
  if (!coversFile) return { byName: new Map(), byTitle: new Map(), boxart: () => undefined };

  const covers = JSON.parse(fs.readFileSync(coversFile, 'utf-8'));
  const repository = covers?.meta?.repository;

  if (typeof repository !== 'string' || !Array.isArray(covers.list)) {
    throw new Error(`Invalid covers file: ${coversFile}`);
  }

  const byName = new Map();
  const byTitle = new Map();

  for (const name of covers.list) {
    if (typeof name !== 'string' || name.length === 0) continue;

    byName.set(name, boxartUrl(repository, name));

    const title = normalizeGameName(name);
    const candidates = byTitle.get(title);
    const candidate = { name, regions: regionsOf(parseGameName(name).regions) };

    if (candidates) candidates.push(candidate);
    else byTitle.set(title, [candidate]);
  }

  return { byName, byTitle, boxart: (name) => boxartUrl(repository, name) };
}

/**
 * Best published boxart of a title for one region, or for the game as a whole
 * when no region is asked for.
 */
function bestCover(candidates, region) {
  let best;

  for (const candidate of candidates) {
    if (region && !candidate.regions.includes(region)) continue;
    if (!best || outranks(candidate.name, best)) best = candidate.name;
  }

  return best;
}

/**
 * The game-level boxarts of one title: what entry-by-entry matching could not
 * reach, and nothing more.
 *
 * A region is filled only when the DAT actually ships that title there and no
 * matched release of it already covers the region.
 *
 * The `*` entry is the last resort, for a title with no boxart placed in any
 * region at all — because its entries carry no region, or because the only
 * published names are of regions the DAT does not ship it to. Without it the
 * games whose published name has no region tag, a quarter of them, would lose
 * the cover they have today; with it emitted any more freely it would only
 * repeat a boxart the browser already reaches by falling through the regions.
 */
function gameCoversOf(entry, candidates, boxart) {
  const covers = {};

  for (const region of REGIONS) {
    if (!entry.regions.has(region) || entry.covered.has(region)) continue;

    const name = bestCover(candidates, region);
    if (name) covers[region] = boxart(name);
  }

  if (!entry.matched && Object.keys(covers).length === 0) {
    const name = bestCover(candidates);
    if (name) covers[ANY_REGION] = boxart(name);
  }

  return covers;
}

async function main() {
  const args = process.argv.slice(2);
  const positional = args.filter((value) => !value.startsWith('--'));
  const coversArg = args.find((value) => value.startsWith('--covers='));

  if (positional.length < 2) {
    console.error(
      'Usage: node scripts/dat-to-json.mjs <input.dat> <output.json> [--covers=<covers.json>]',
    );
    process.exit(1);
  }

  const [inputFile, outputFile] = positional;
  const coversFile = coversArg?.slice('--covers='.length);
  
  try {
    // Read DAT file
    console.log(`📖 Reading DAT file: ${inputFile}`);
    const datContent = fs.readFileSync(inputFile, 'utf-8');
    
    // Parse DAT
    console.log('⏳ Parsing DAT format...');
    const games = parseDat(datContent);

    const covers = loadCovers(coversFile);
    if (coversFile) {
      console.log(`🖼️  Loaded ${covers.byName.size} boxarts from: ${coversFile}`);
    }

    // Keep every ROM once. The application builds its lookup indexes in IndexedDB.
    const filesByCrc = new Map();
    /**
     * Base titles the DAT lists: the regions they ship to, the regions a matched
     * release already covers, and whether any release was matched at all.
     */
    const titles = new Map();

    games.forEach(game => {
      const cover = covers.byName.get(sanitizeName(game.name));
      const title = normalizeGameName(game.name);
      const datRegions = datRegionsOf(game);
      const regions = regionsOf(datRegions);
      const videoStandard = videoStandardsOf(datRegions).join(', ') || undefined;

      let entry = titles.get(title);
      if (!entry) {
        entry = { regions: new Set(), covered: new Set(), matched: false };
        titles.set(title, entry);
      }

      for (const region of regions) {
        entry.regions.add(region);
        if (cover) entry.covered.add(region);
      }

      if (cover) entry.matched = true;

      game.roms.forEach(rom => {
        const metadata = {
          name: game.name,
          description: game.description,
          fileName: rom.name,
          size: rom.size,
          crc: rom.crc,
          md5: rom.md5,
          sha1: rom.sha1,
          region: game.region,
          videoStandard,
          cover
        };

        filesByCrc.set(rom.crc, metadata);
      });
    });

    // The fallback layer only carries what the exact match could not reach, and
    // only for games this DAT actually lists: a boxart for a game the user
    // cannot own would never be shown.
    const gameCovers = {};
    for (const [title, entry] of titles) {
      const fallback = gameCoversOf(entry, covers.byTitle.get(title) ?? [], covers.boxart);
      if (Object.keys(fallback).length > 0) gameCovers[title] = fallback;
    }

    const list = Array.from(filesByCrc.values());
    const withCover = list.filter((entry) => entry.cover).length;
    const gameCoverCount = Object.keys(gameCovers).length;
    const gameCoverUrls = Object.values(gameCovers).reduce(
      (total, fallback) => total + Object.keys(fallback).length,
      0,
    );

    const output = {
      meta: {
        source: path.basename(inputFile),
        totalGames: games.length,
        totalFiles: list.length,
        totalCovers: withCover,
        totalGameCovers: gameCoverCount,
        totalGameCoverUrls: gameCoverUrls,
        generated: new Date().toISOString()
      },
      covers: gameCovers,
      list
    };

    // Write JSON
    console.log(`✍️  Writing JSON to: ${outputFile}`);
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf-8');

    // Show stats
    const fileSize = fs.statSync(outputFile).size;
    const fileSizeKB = (fileSize / 1024).toFixed(2);

    console.log('\n✅ Conversion successful!');
    console.log(`   Games: ${games.length}`);
    console.log(`   Files: ${list.length}`);
    console.log(
      `   Covers: ${withCover} by name, ${gameCoverUrls} by title over ${gameCoverCount} games`,
    );
    console.log(`   File size: ${fileSizeKB} KB`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
