#!/usr/bin/env node
/**
 * Download DAT files from the Libretro database.
 *
 * Usage: node scripts/download-dats.mjs [output-dir] [--systems=a,b]
 *
 * Each DAT is stored as `<output-dir>/<system>/source.dat` so every system
 * keeps its sources, covers and generated dataset together.
 */

import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import {
  DATASETS_DIR,
  DAT_FILE,
  formatBytes,
  selectSystems,
  systemDir,
} from './systems.mjs';

const LIBRETRO_BASE =
  'https://raw.githubusercontent.com/libretro/libretro-database/master/metadat/';

/**
 * Download a file to disk, leaving no partial artifact behind on failure.
 */
async function downloadFile(url, outputPath) {
  const response = await fetch(url);

  if (!response.ok || !response.body) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }

  const tempPath = `${outputPath}.download`;

  try {
    await pipeline(Readable.fromWeb(response.body), fs.createWriteStream(tempPath));
    fs.renameSync(tempPath, outputPath);
  } catch (error) {
    fs.rmSync(tempPath, { force: true });
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const outputDir = args.find((value) => !value.startsWith('--')) || DATASETS_DIR;
  const systems = selectSystems(args);

  console.log('\n🔄 Downloading DAT files from Libretro database...\n');
  console.log(`📍 Output directory: ${outputDir}\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  let totalSize = 0;

  for (const system of systems) {
    const targetDir = systemDir(outputDir, system.name);
    const outputPath = path.join(targetDir, DAT_FILE);
    const url = `${LIBRETRO_BASE}${encodeURI(system.dat)}`;

    process.stdout.write(`⏳ ${system.name.padEnd(30)} ... `);

    fs.mkdirSync(targetDir, { recursive: true });

    try {
      await downloadFile(url, outputPath);
      const size = fs.statSync(outputPath).size;
      totalSize += size;
      console.log(`✅ ${formatBytes(size)}`);
      downloaded++;
    } catch (error) {
      if (error.message.includes('HTTP 404')) {
        console.log('⏭️  Not found (skipped)');
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

  if (totalSize > 0) {
    console.log(`📊 Total size: ${formatBytes(totalSize)}`);
  }

  console.log('\n📝 Next steps:');
  console.log('   1. Scrape the boxart listings:  npm run dataset:fetch-covers');
  console.log('   2. Build the datasets:          npm run dataset:to-json\n');
}

main().catch((error) => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
