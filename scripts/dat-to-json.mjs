#!/usr/bin/env node
/**
 * DAT to JSON converter - Parses clrmamepro DAT files from Libretro
 * Usage: node scripts/dat-to-json.mjs input.dat output.json
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

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node scripts/dat-to-json.mjs <input.dat> <output.json>');
    process.exit(1);
  }
  
  const [inputFile, outputFile] = args;
  
  try {
    // Read DAT file
    console.log(`📖 Reading DAT file: ${inputFile}`);
    const datContent = fs.readFileSync(inputFile, 'utf-8');
    
    // Parse DAT
    console.log('⏳ Parsing DAT format...');
    const games = parseDat(datContent);
    
    // Create lookup index by CRC
    const gamesByCrc = {};
    const gamesByMd5 = {};
    const gamesBySha1 = {};
    
    games.forEach(game => {
      game.roms.forEach(rom => {
        const metadata = {
          name: game.name,
          description: game.description,
          romName: rom.name,
          size: rom.size,
          crc: rom.crc,
          md5: rom.md5,
          sha1: rom.sha1,
          region: game.region,
          videoStandard: game.videoStandard
        };

        if (rom.crc) gamesByCrc[rom.crc] = metadata;
        if (rom.md5) gamesByMd5[rom.md5] = metadata;
        if (rom.sha1) {
          gamesBySha1[rom.sha1] = metadata;
        }
      });
    });
    
    const output = {
      meta: {
        source: path.basename(inputFile),
        totalGames: games.length,
        totalRoms: Object.keys(gamesByCrc).length,
        generated: new Date().toISOString()
      },
      gamesByCrc,
      gamesByMd5,
      gamesBySha1
    };
    
    // Write JSON
    console.log(`✍️  Writing JSON to: ${outputFile}`);
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf-8');
    
    // Show stats
    const fileSize = fs.statSync(outputFile).size;
    const fileSizeKB = (fileSize / 1024).toFixed(2);
    
    console.log('\n✅ Conversion successful!');
    console.log(`   Games: ${games.length}`);
    console.log(`   Checksums (CRC): ${Object.keys(gamesByCrc).length}`);
    console.log(`   Checksums (MD5): ${Object.keys(gamesByMd5).length}`);
    console.log(`   Checksums (SHA1): ${Object.keys(gamesBySha1).length}`);
    console.log(`   File size: ${fileSizeKB} KB`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
