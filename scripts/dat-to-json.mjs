#!/usr/bin/env node
/**
 * DAT to JSON converter - Parses clrmamepro DAT files from Libretro
 * Usage: node scripts/dat-to-json.mjs input.dat output.json [--covers=covers.json]
 *
 * When a covers file is supplied, every entry gets the URL of its published
 * boxart. Only scraped names are used, so the generated URLs never 404.
 */

import fs from 'fs';
import path from 'path';

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
    
    // Find balanced closing paren starting from the opening paren
    let parenIdx = openIdx;
    let depth = 0;
    
    while (parenIdx < datContent.length) {
      const ch = datContent[parenIdx];
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
              game.videoStandard = inferVideoStandard(game.region);
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
 * Infer the television standard from known DAT regions. Multi-region ROMs
 * retain every applicable standard rather than guessing a single one.
 */
function inferVideoStandard(region) {
  const normalized = region.toLowerCase();
  const standards = [];

  if (/europe|australia|new zealand/.test(normalized)) standards.push('PAL');
  if (/usa|canada|japan|korea|asia/.test(normalized)) standards.push('NTSC');

  return standards.length > 0 ? standards.join(', ') : undefined;
}

/**
 * Reproduce the sanitization Libretro applies when publishing a thumbnail, so a
 * DAT game name can be matched against the scraped file names.
 */
function toThumbnailName(name) {
  return name.replace(/[&*/:`<>?\\|"]/g, '_');
}

/**
 * Build a `sanitized game name -> boxart URL` lookup from a scraped covers file.
 */
function loadCovers(coversFile) {
  if (!coversFile) return new Map();

  const covers = JSON.parse(fs.readFileSync(coversFile, 'utf-8'));
  const baseUrl = covers?.meta?.baseUrl;

  if (typeof baseUrl !== 'string' || !Array.isArray(covers.list)) {
    throw new Error(`Invalid covers file: ${coversFile}`);
  }

  return new Map(
    covers.list.map((name) => [name, `${baseUrl}/${encodeURIComponent(`${name}.png`)}`]),
  );
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
      console.log(`🖼️  Loaded ${covers.size} boxarts from: ${coversFile}`);
    }

    // Keep every ROM once. The application builds its lookup indexes in IndexedDB.
    const filesByCrc = new Map();
    
    games.forEach(game => {
      const cover = covers.get(toThumbnailName(game.name));

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
          videoStandard: game.videoStandard,
          cover
        };

        filesByCrc.set(rom.crc, metadata);
      });
    });

    const list = Array.from(filesByCrc.values());
    const withCover = list.filter((entry) => entry.cover).length;
    
    const output = {
      meta: {
        source: path.basename(inputFile),
        totalGames: games.length,
        totalFiles: list.length,
        totalCovers: withCover,
        generated: new Date().toISOString()
      },
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
    console.log(`   Covers: ${withCover}`);
    console.log(`   File size: ${fileSizeKB} KB`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
