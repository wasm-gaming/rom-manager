#!/usr/bin/env node
/**
 * Download DAT files from Libretro database
 * Usage: node scripts/download-dats.mjs [output-dir]
 * 
 * Downloads latest .dat files from libretro-database GitHub repo
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Accept self-signed certificates for development
const agent = new https.Agent({
  rejectUnauthorized: false,
});

// Popular systems from Libretro database (verified working)
const SYSTEMS = [
  // Nintendo cartridge systems
  { name: 'Nintendo - SNES', path: 'no-intro/Nintendo - Super Nintendo Entertainment System.dat' },
  { name: 'Nintendo - Game Boy', path: 'no-intro/Nintendo - Game Boy.dat' },
  { name: 'Nintendo - Game Boy Color', path: 'no-intro/Nintendo - Game Boy Color.dat' },
  { name: 'Nintendo - Game Boy Advance', path: 'no-intro/Nintendo - Game Boy Advance.dat' },
  { name: 'Nintendo - GameCube', path: 'redump/Nintendo - GameCube.dat' },
  { name: 'Nintendo - Wii', path: 'redump/Nintendo - Wii.dat' },
  
  // Sega systems
  { name: 'Sega - Genesis', path: 'no-intro/Sega - Mega Drive - Genesis.dat' },
  { name: 'Sega - Game Gear', path: 'no-intro/Sega - Game Gear.dat' },
  { name: 'Sega - Saturn', path: 'redump/Sega - Saturn.dat' },
  { name: 'Sega - Dreamcast', path: 'redump/Sega - Dreamcast.dat' },
  
  // Sony systems
  { name: 'Sony - PlayStation', path: 'redump/Sony - PlayStation.dat' },
  { name: 'Sony - PlayStation 2', path: 'redump/Sony - PlayStation 2.dat' },
  { name: 'Sony - PSP', path: 'no-intro/Sony - PlayStation Portable.dat' },
  
  // Atari systems
  { name: 'Atari - 2600', path: 'no-intro/Atari - 2600.dat' },
  { name: 'Atari - 5200', path: 'no-intro/Atari - 5200.dat' },
  { name: 'Atari - 7800', path: 'no-intro/Atari - 7800.dat' },
  { name: 'Atari - Lynx', path: 'no-intro/Atari - Lynx.dat' },
  
  // Commodore systems
  { name: 'Commodore - 64', path: 'no-intro/Commodore - 64.dat' },
  { name: 'Commodore - Amiga', path: 'no-intro/Commodore - Amiga.dat' },
];

const LIBRETRO_BASE = 'https://raw.githubusercontent.com/libretro/libretro-database/master/metadat/';

/**
 * Download file from URL
 */
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https
      .get(url, { agent }, (response) => {
        if (response.statusCode === 404) {
          reject(new Error(`404 Not Found: ${url}`));
          return;
        }
        
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${url}`));
          return;
        }
        
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(outputPath);
        });
      })
      .on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Delete on error
        reject(err);
      });
  });
}

/**
 * Get file size in human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

async function main() {
  const args = process.argv.slice(2);
  const outputDir = args[0] || path.join(__dirname, '..', 'static', 'datasets');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    console.log(`📁 Creating directory: ${outputDir}`);
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log(`\n🔄 Downloading DAT files from Libretro database...\n`);
  console.log(`📍 Output directory: ${outputDir}\n`);
  
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  const totalSize = [];
  
  for (const system of SYSTEMS) {
    const filename = `${system.name}.dat`;
    const outputPath = path.join(outputDir, filename);
    const url = `${LIBRETRO_BASE}${system.path}`;
    
    process.stdout.write(`⏳ ${system.name.padEnd(30)} ... `);
    
    try {
      await downloadFile(url, outputPath);
      const size = fs.statSync(outputPath).size;
      totalSize.push(size);
      console.log(`✅ ${formatBytes(size)}`);
      downloaded++;
    } catch (error) {
      if (error.message.includes('404')) {
        console.log(`⏭️  Not found (skipped)`);
        skipped++;
      } else {
        console.log(`❌ ${error.message}`);
        failed++;
      }
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Downloaded: ${downloaded}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (totalSize.length > 0) {
    const total = totalSize.reduce((a, b) => a + b, 0);
    console.log(`📊 Total size: ${formatBytes(total)}`);
  }
  
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Convert every downloaded DAT file to JSON:`);
  console.log(`      npm run dataset:to-json`);
  console.log(`\n   2. Place JSON files in: ${outputDir}/`);
  console.log(`   3. Datasets will be auto-indexed on app startup\n`);
}

main().catch((error) => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
