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
 * belongs to a release this DAT does not list — a different revision, a region
 * that never got dumped, or the European box of a game the DAT only lists as
 * `(World)`. Those are joined by base title into a second, game-level layer,
 * which the application falls back to when a release has no boxart *of that
 * region* of its own.
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
 * Iterate the contents of every `<tag> ( … )` block of a DAT.
 *
 * Parenthesis are balanced and quoted strings skipped, because a name may open
 * one that never closes — `Odekake Lester - Lelele no Le (^^; (Japan)` — and
 * counting it would swallow the rest of the file. A game and each of its ROM
 * entries are written the same way, so one scanner reads both, which is what
 * lets a ROM be read as a block instead of as a pattern.
 */
function* blocksOf(text, tag) {
  const opening = `${tag} (`;
  let pos = 0;

  for (;;) {
    const start = text.indexOf(opening, pos);
    if (start === -1) return;

    // The tag has to be a word of its own, so `rom (` does not match `prom (`.
    const before = start > 0 ? text[start - 1] : '\n';
    if (!/[\s)]/.test(before)) {
      pos = start + opening.length;
      continue;
    }

    const open = start + tag.length + 1;
    let index = open;
    let depth = 0;

    while (index < text.length) {
      const char = text[index];

      if (char === '"') {
        const closing = text.indexOf('"', index + 1);
        if (closing === -1) return;
        index = closing + 1;
        continue;
      }

      if (char === '(') depth++;
      else if (char === ')' && --depth === 0) break;

      index++;
    }

    if (index >= text.length) return;

    yield text.slice(open + 1, index).trim();
    pos = index + 1;
  }
}

/**
 * The file one ROM entry describes.
 *
 * Only the CRC32 is required. No-Intro and Redump publish MD5 and SHA1 as well,
 * but the catalogue of a system whose games ship as one whole romset carries the
 * CRC32 alone — and that is the checksum every lookup in this project is keyed
 * by, so an entry with nothing else is still a complete answer.
 */
function romOf(block) {
  const name = block.match(/\bname\s+"([^"]+)"/)?.[1];
  const crc = block.match(/\bcrc\s+([0-9a-fA-F]+)/)?.[1];
  if (!name || !crc) return null;

  const size = block.match(/\bsize\s+(\d+)/)?.[1];

  return {
    name,
    size: size === undefined ? undefined : Number(size),
    crc: crc.toUpperCase(),
    md5: block.match(/\bmd5\s+([0-9a-fA-F]+)/)?.[1]?.toUpperCase(),
    sha1: block.match(/\bsha1\s+([0-9a-fA-F]+)/)?.[1]?.toUpperCase(),
  };
}

/**
 * Parse clrmamepro DAT format with balanced parenthesis matching
 */
function parseDat(datContent) {
  const games = [];

  for (const block of blocksOf(datContent, 'game')) {
    if (!block) continue;

    const game = {
      name: block.match(/\bname\s+"([^"]+)"/)?.[1],
      description: block.match(/\bdescription\s+"([^"]+)"/)?.[1],
      // The DAT's explicit release region, when it carries one.
      region: block.match(/\bregion\s+"([^"]+)"/)?.[1],
      roms: [...blocksOf(block, 'rom')].map(romOf).filter(Boolean),
    };

    if (game.name && game.roms.length > 0) games.push(game);
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
 *
 * A name has to *say* the region to answer for it: `(World)` ships everywhere,
 * so its box only ever stands in for a region, and the browser already reaches
 * it through the release layer. Emitting it here would repeat that image under a
 * key that claims more than it should.
 */
function bestCover(candidates, region) {
  let best;

  for (const candidate of candidates) {
    if (region && (!candidate.regions.includes(region) || candidate.regions.length > 1)) continue;
    if (!best || outranks(candidate.name, best)) best = candidate.name;
  }

  return best;
}

/**
 * The game-level boxarts of one title: what entry-by-entry matching could not
 * reach, and nothing more.
 *
 * A region is filled only when the DAT actually ships that title there and no
 * matched release *of that region alone* already covers it. A world release does
 * not close the question: it ships to the three regions and its box is one
 * scan, so the box published as `(Europe)` is still the European one and still
 * worth carrying — that is what makes a preference of EU show it.
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

/**
 * The romsets of a system whose games ship as a set of files, keyed by the name
 * that identifies one.
 *
 * A romset is not a file with a checksum but a group of them, so what it
 * carries is the checksums of its members. One member is enough to name it —
 * every set holds at least one that belongs to no other — and the rest say how
 * much of it is there.
 *
 * The two catalogues of such a system are joined by that name and not by the
 * title, which they spell differently often enough to matter. The single-file
 * catalogue names each file after its romset, so the join key is already there.
 */
function loadSets(setsFile, romsetsFile, games, covers) {
  if (!setsFile) return {};

  const titleOf = new Map(
    games.flatMap((game) =>
      game.roms.map((rom) => [rom.name.replace(/\.[^.]+$/, ''), game.name]),
    ),
  );

  const attributes = loadRomsets(romsetsFile);
  const sets = {};

  for (const set of parseDat(fs.readFileSync(setsFile, 'utf-8'))) {
    // The title the boxarts are published under wins: it is the one the covers
    // resolve against, and the one the rest of the app already speaks.
    const title = titleOf.get(set.name) ?? set.description ?? set.name;
    const attrs = attributes.get(set.name);

    sets[set.name] = {
      title,
      cover: covers.byName.get(sanitizeName(title)),
      // Distinct checksums, not files. Four romsets ship the same chip twice —
      // `ngfrog` has two identical `c` roms — and an archive lists both entries
      // with that one checksum, so counting files would leave a complete set
      // looking like it is missing one.
      members: [...new Set(set.roms.map((rom) => rom.crc))],
      ...(attrs ? { attrs } : {}),
    };
  }

  return sets;
}

/**
 * What a core needs to load a romset, which no checksum can answer.
 *
 * Encryption chips, RAM size and wait states are properties of the board, and
 * they live in the emulator's own catalogue rather than in a DAT. Only those
 * are kept: the name, the title and the publisher are description, and the
 * catalogues already carry them.
 *
 * The name may list alternate spellings joined by commas, and each one is a way
 * of naming the same romset.
 */
function loadRomsets(romsetsFile) {
  const attributes = new Map();
  if (!romsetsFile) return attributes;

  const described = new Set(['name', 'altname', 'altnamej', 'publisher', 'year']);
  const xml = fs.readFileSync(romsetsFile, 'utf-8');

  for (const [, declaration] of xml.matchAll(/<romset\s+([^>]*?)\/?>/g)) {
    const pairs = [...declaration.matchAll(/(\w+)="([^"]*)"/g)];
    const name = pairs.find(([, key]) => key === 'name')?.[2];
    if (!name) continue;

    const attrs = Object.fromEntries(
      pairs.filter(([, key]) => !described.has(key)).map(([, key, value]) => [key, value]),
    );

    if (Object.keys(attrs).length === 0) continue;
    for (const alternate of name.split(',')) attributes.set(alternate, attrs);
  }

  return attributes;
}

async function main() {
  const args = process.argv.slice(2);
  const positional = args.filter((value) => !value.startsWith('--'));
  const coversArg = args.find((value) => value.startsWith('--covers='));
  const setsArg = args.find((value) => value.startsWith('--sets='));
  const romsetsArg = args.find((value) => value.startsWith('--romsets='));

  if (positional.length < 2) {
    console.error(
      'Usage: node scripts/dat-to-json.mjs <input.dat> <output.json> [--covers=<covers.json>]' +
        ' [--sets=<sets.dat>] [--romsets=<romsets.xml>]',
    );
    process.exit(1);
  }

  const [inputFile, outputFile] = positional;
  const coversFile = coversArg?.slice('--covers='.length);
  const setsFile = setsArg?.slice('--sets='.length);
  const romsetsFile = romsetsArg?.slice('--romsets='.length);

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

      // Only a release of one region speaks for it. A world release covers the
      // three at once, and what it covers them with is a single scan.
      for (const region of regions) {
        entry.regions.add(region);
        if (cover && regions.length === 1) entry.covered.add(region);
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

    // A romset is a game of this system too, so its title takes part in the
    // cover layers exactly like a single file does — and a set the other
    // catalogue does not list is the only entry that title has.
    const sets = loadSets(setsFile, romsetsFile, games, covers);

    for (const set of Object.values(sets)) {
      const title = normalizeGameName(set.title);
      const entry = titles.get(title) ?? { regions: new Set(), covered: new Set(), matched: false };

      if (set.cover) entry.matched = true;
      titles.set(title, entry);
    }

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

    const setList = Object.values(sets);
    const members = setList.reduce((total, set) => total + set.members.length, 0);

    const output = {
      meta: {
        source: path.basename(inputFile),
        totalGames: games.length,
        totalFiles: list.length,
        totalCovers: withCover,
        totalGameCovers: gameCoverCount,
        totalGameCoverUrls: gameCoverUrls,
        ...(setList.length > 0
          ? { totalSets: setList.length, totalSetMembers: members }
          : {}),
        generated: new Date().toISOString()
      },
      covers: gameCovers,
      ...(setList.length > 0 ? { sets } : {}),
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
    if (setList.length > 0) {
      const withAttrs = setList.filter((set) => set.attrs).length;
      console.log(
        `   Sets: ${setList.length} with ${members} members, ` +
          `${setList.filter((set) => set.cover).length} with a cover, ${withAttrs} with attributes`,
      );
    }
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
