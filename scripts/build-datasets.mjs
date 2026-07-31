#!/usr/bin/env node
/**
 * Build ROM datasets - Master script
 *
 * Converts every downloaded DAT into the dataset consumed by the application,
 * joining it with the scraped boxarts, and regenerates the index.
 *
 * Usage: node scripts/build-datasets.mjs [--skip-download] [--systems=a,b]
 *
 * npm scripts:
 * - npm run dataset:fetch-dat     Download the source DAT files.
 * - npm run dataset:fetch-covers  Scrape the boxart listings.
 * - npm run dataset:to-json       Convert every available DAT file to JSON.
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import {
  COVERS_FILE,
  DATASETS_DIR,
  DATASET_FILE,
  DAT_FILE,
  INDEX_FILE,
  PROJECT_ROOT,
  ROMSETS_FILE,
  SETS_FILE,
  SYSTEMS,
  selectSystems,
  systemDir,
} from './systems.mjs';

/**
 * Calculate the CRC32 of a file so clients can detect changed datasets without
 * downloading their contents.
 */
function calculateCRC32(content) {
  let crc = 0xffffffff;

  for (let i = 0; i < content.length; i++) {
    crc ^= content[i];
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }

  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, '0').toUpperCase();
}

function calculateDatasetCRC32(content) {
  const dataset = JSON.parse(content.toString('utf-8'));

  // `generated` is volatile and must not invalidate an otherwise unchanged cache.
  delete dataset.meta?.generated;
  return calculateCRC32(Buffer.from(JSON.stringify(dataset), 'utf-8'));
}

/**
 * Run a script in a child process, inheriting the Node flags of this run so
 * options such as `--use-system-ca` keep applying.
 */
function runScript(script, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [...process.execArgv, script, ...args], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}: ${script} ${args.join(' ')}`));
      }
    });

    child.on('error', reject);
  });
}

/**
 * Generate index.json from the datasets available on disk.
 *
 * Every system is listed with the path of its dataset, relative to the datasets
 * folder, so the application can fetch it directly.
 *
 * The listing is driven by SYSTEMS rather than by whatever sits in the folder:
 * datasets of systems dropped from the supported list may still be on disk, and
 * they must not end up in the index.
 */
function generateIndex() {
  console.log('\n📋 Generating index.json...');

  const files = SYSTEMS.filter((system) =>
    fs.existsSync(path.join(systemDir(DATASETS_DIR, system.name), DATASET_FILE)),
  ).map((system) => ({
    system: system.name,
    media: system.media,
    path: `${system.name}/${DATASET_FILE}`,
    crc32: calculateDatasetCRC32(
      fs.readFileSync(path.join(systemDir(DATASETS_DIR, system.name), DATASET_FILE)),
    ),
  }));

  const index = {
    files,
    description: 'ROM metadata datasets (auto-indexed on app startup)',
    source: 'Generated from Libretro database DAT files',
    generatedAt: new Date().toISOString(),
    systemCount: files.length
  };

  fs.writeFileSync(
    path.join(DATASETS_DIR, INDEX_FILE),
    JSON.stringify(index, null, 2),
    'utf-8'
  );

  console.log(`✅ Index generated with ${files.length} datasets`);
  files.forEach(({ path: datasetPath, crc32 }) => console.log(`   - ${datasetPath} (${crc32})`));
}

async function main() {
  const args = process.argv.slice(2);
  const skipDownload = args.includes('--skip-download');
  const systems = selectSystems(args);
  const systemsArg = args.filter((value) => value.startsWith('--systems='));

  console.log('🚀 ROM Dataset Builder');
  console.log(`📁 Output: ${DATASETS_DIR}\n`);

  try {
    // Step 1: Download DAT files (optional)
    if (!skipDownload) {
      console.log('Step 1️⃣ : Download DAT files');
      console.log('━'.repeat(50));
      await runScript('scripts/download-dats.mjs', [DATASETS_DIR, ...systemsArg]);
    } else {
      console.log('⏭️  Skipping download (--skip-download)');
    }

    // Step 2: Convert DAT to JSON, joining the scraped boxarts when available
    const pending = systems
      .map((system) => ({ system, dir: systemDir(DATASETS_DIR, system.name) }))
      .filter(({ dir }) => fs.existsSync(path.join(dir, DAT_FILE)));

    if (pending.length === 0) {
      console.log('\n⚠️  No DAT files found. Run: npm run dataset:fetch-dat');
      process.exit(1);
    }

    console.log(`\nStep 2️⃣ : Convert DAT → JSON (${pending.length} systems)`);
    console.log('━'.repeat(50));

    let missingCovers = 0;

    for (const { system, dir } of pending) {
      const coversPath = path.join(dir, COVERS_FILE);
      const hasCovers = fs.existsSync(coversPath);

      if (!hasCovers) missingCovers++;

      // A system whose games ship as a romset brings two more sources along.
      // They are passed only when they are on disk, so a partial download
      // produces a smaller dataset instead of failing the whole run.
      const extra = [
        [SETS_FILE, '--sets'],
        [ROMSETS_FILE, '--romsets'],
      ]
        .map(([file, flag]) => [path.join(dir, file), flag])
        .filter(([source]) => fs.existsSync(source))
        .map(([source, flag]) => `${flag}=${source}`);

      console.log(`\n📦 ${system.name}`);
      await runScript('scripts/dat-to-json.mjs', [
        path.join(dir, DAT_FILE),
        path.join(dir, DATASET_FILE),
        ...(hasCovers ? [`--covers=${coversPath}`] : []),
        ...extra,
      ]);
    }

    // Step 3: Generate index
    console.log('\n');
    generateIndex();

    if (missingCovers > 0) {
      console.log(
        `\n⚠️  ${missingCovers} system(s) built without boxarts. Run: npm run dataset:fetch-covers`,
      );
    }

    console.log('\n✅ All done!');
    console.log('\n📝 Next steps:');
    console.log('   1. The datasets are ready in:', DATASETS_DIR);
    console.log('   2. Datasets will auto-load on app startup');
    console.log('   3. To convert to SQLite later:');
    console.log('      npm run dataset:json-to-sqlite <dataset.json> <file.db>');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
