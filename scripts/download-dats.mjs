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
  ROMSETS_FILE,
  SETS_FILE,
  formatBytes,
  selectSystems,
  systemDir,
} from './systems.mjs';

/**
 * Root of the catalogue repository. Each system declares its DAT from here and
 * not from `metadat/`, because the catalogues are not all in one folder: the
 * no-intro and redump ones are, and the ones describing a whole romset as a
 * single file sit in `dat/`.
 */
const LIBRETRO_BASE = 'https://raw.githubusercontent.com/libretro/libretro-database/master/';

/**
 * Rewrite an arcade catalogue as the DAT the converter reads, keeping only the
 * romsets of one machine.
 *
 * The catalogue is a 10.6 MB Logiqx XML describing 6,952 arcade sets, of which
 * the Neo Geo ones are 203. Storing it whole would put the largest file in the
 * repository there to be filtered on every build, and storing the subset as
 * XML would mean a second parser for a format this project reads nowhere else.
 *
 * `romof` is what says which machine a set belongs to, and it is the attribute
 * no No-Intro or Redump DAT carries. Members marked `merge` are dropped: those
 * are the BIOS, they are in every set of the machine, and a checksum shared by
 * all of them identifies none of them.
 */
function asDat(xml, machine, name) {
  const games = [];

  for (const [, attributes, body] of xml.matchAll(/<game\s+([^>]*)>([\s\S]*?)<\/game>/g)) {
    if (!new RegExp(`romof="${machine}"`).test(attributes)) continue;

    const set = attributes.match(/name="([^"]+)"/)?.[1];
    if (!set) continue;

    const description = body.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.trim();
    const members = [...body.matchAll(/<rom\s+([^/>]*)\/?>/g)]
      .map(([, rom]) => rom)
      .filter((rom) => !/\smerge="/.test(rom))
      .map((rom) => ({
        name: rom.match(/name="([^"]+)"/)?.[1],
        size: rom.match(/size="(\d+)"/)?.[1],
        crc: rom.match(/crc="([0-9a-fA-F]+)"/)?.[1],
      }))
      .filter((rom) => rom.name && rom.crc);

    if (members.length === 0) continue;

    games.push(
      [
        'game (',
        `\tname "${set}"`,
        description ? `\tdescription "${datString(description)}"` : null,
        ...members.map(
          (rom) =>
            `\trom ( name "${datString(rom.name)}"${rom.size ? ` size ${rom.size}` : ''}` +
            ` crc ${rom.crc.toUpperCase()} )`,
        ),
        ')',
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }

  return `${['clrmamepro (', `\tname "${name}"`, `\tdescription "${name}"`, ')'].join('\n')}\n\n${games.join('\n')}\n`;
}

/**
 * An XML value as a DAT string: entities resolved, and the one character the
 * format cannot hold turned into the one it can.
 *
 * A clrmamepro string is delimited by double quotes and has no escape for one,
 * so a name carrying it would end its own field. No Neo Geo set is named that
 * way today, and a straight quote is what the name would have been written with
 * anyway.
 */
function datString(value) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/"/g, "'");
}

/** Read a source that is transformed before being stored, rather than saved. */
async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);

  return response.text();
}

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

/**
 * Fetch what a system needs beyond its own catalogue, which today is only Neo
 * Geo: the romset members, and what the core needs to load one.
 *
 * Returns the bytes written, so a run reports what it actually stored.
 */
async function downloadSources(system, targetDir) {
  let written = 0;

  if (system.sets) {
    const xml = await fetchText(`${LIBRETRO_BASE}${encodeURI(system.sets.dat)}`);
    const dat = asDat(xml, system.sets.of, `${system.name} romsets`);
    const target = path.join(targetDir, SETS_FILE);

    fs.writeFileSync(target, dat, 'utf-8');
    written += fs.statSync(target).size;
    console.log(
      `   ${SETS_FILE.padEnd(27)} ✅ ${formatBytes(written)} ` +
        `(${dat.match(/^game \(/gm)?.length ?? 0} romsets out of ${formatBytes(xml.length)})`,
    );
  }

  if (system.romsets) {
    const target = path.join(targetDir, ROMSETS_FILE);
    await downloadFile(system.romsets, target);

    const size = fs.statSync(target).size;
    written += size;
    console.log(`   ${ROMSETS_FILE.padEnd(27)} ✅ ${formatBytes(size)}`);
  }

  return written;
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

      totalSize += await downloadSources(system, targetDir);
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
