#!/usr/bin/env node
/**
 * Build ROM datasets - Master script
 * Downloads DAT files, converts to JSON, and generates index
 * 
 * Usage: node scripts/build-datasets.mjs [--skip-download] [--systems system1,system2]
 *
 * npm scripts:
 * - npm run dataset:fetch-dat  Download the source DAT files.
 * - npm run dataset:to-json    Convert every available DAT file to JSON.
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const datasetsDir = path.join(projectRoot, 'static', 'datasets');

/**
 * Run a shell command and return promise
 */
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}: ${command} ${args.join(' ')}`));
      }
    });

    child.on('error', reject);
  });
}

/**
 * Generate index.json from available JSON files
 */
async function generateIndex() {
  console.log('\n📋 Generating index.json...');

  const files = fs
    .readdirSync(datasetsDir)
    .filter((f) => f.endsWith('.json') && f !== 'index.json');

  const index = {
    files,
    description: 'ROM metadata datasets (auto-indexed on app startup)',
    source: 'Generated from Libretro database DAT files',
    generatedAt: new Date().toISOString(),
    systemCount: files.length
  };

  fs.writeFileSync(
    path.join(datasetsDir, 'index.json'),
    JSON.stringify(index, null, 2),
    'utf-8'
  );

  console.log(`✅ Index generated with ${files.length} datasets`);
  files.forEach((f) => console.log(`   - ${f}`));
}

async function main() {
  const args = process.argv.slice(2);
  const skipDownload = args.includes('--skip-download');
  const systemsArg = args.find((a) => a.startsWith('--systems='));
  const systems = systemsArg ? systemsArg.split('=')[1].split(',') : null;

  console.log('🚀 ROM Dataset Builder');
  console.log(`📁 Output: ${datasetsDir}\n`);

  try {
    // Step 1: Download DAT files (optional)
    if (!skipDownload) {
      console.log('Step 1️⃣ : Download DAT files');
      console.log('━'.repeat(50));
      await runCommand('node', ['scripts/download-dats.mjs', datasetsDir]);
    } else {
      console.log('⏭️  Skipping download (--skip-download)');
    }

    // Step 2: Convert DAT to JSON
    const datFiles = fs
      .readdirSync(datasetsDir)
      .filter((f) => f.endsWith('.dat'));

    if (datFiles.length === 0) {
      console.log('\n⚠️  No DAT files found. Run without --skip-download to download them.');
      console.log('   Or place .dat files in:', datasetsDir);
      process.exit(1);
    }

    console.log(`\nStep 2️⃣ : Convert DAT → JSON (${datFiles.length} files)`);
    console.log('━'.repeat(50));

    for (const datFile of datFiles) {
      const baseName = path.basename(datFile, '.dat');
      const jsonFile = `${baseName}.json`;
      const datPath = path.join(datasetsDir, datFile);
      const jsonPath = path.join(datasetsDir, jsonFile);

      console.log(`\n📦 ${baseName}`);
      await runCommand('node', ['scripts/dat-to-json.mjs', datPath, jsonPath]);

      // Remove DAT after conversion (optional - comment out to keep)
      // fs.unlinkSync(datPath);
    }

    // Step 3: Generate index
    console.log('\n');
    await generateIndex();

    console.log('\n✅ All done!');
    console.log('\n📝 Next steps:');
    console.log('   1. The JSON files are ready in:', datasetsDir);
    console.log('   2. Datasets will auto-load on app startup');
    console.log('   3. To convert to SQLite later:');
    console.log('      npm run dataset:to-sqlite <file.json> <file.db>');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
