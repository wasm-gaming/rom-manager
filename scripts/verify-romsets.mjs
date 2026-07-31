#!/usr/bin/env node
/**
 * Check a generated dataset against a real collection of romsets.
 *
 * Usage: node --import ./scripts/ts-imports.mjs scripts/verify-romsets.mjs <folder> [--system=NEOGEO]
 *
 * A dataset is built out of catalogues, and a catalogue is a claim. This walks
 * a folder of archives and asks the dataset to name each one **without ever
 * reading its file name**, which is the property the whole design rests on:
 * a romset is what its members' checksums say it is, and not what somebody
 * called the zip.
 *
 * The corpus this was written against is the `neogeoaesmvscomplete` item on the
 * Internet Archive — https://archive.org/details/neogeoaesmvscomplete — which
 * holds the MAME, Final Burn Neo and Geolith romsets of the Neo Geo library,
 * 767 archives in total. Nothing of it is stored here: point the script at a
 * downloaded copy, or at any folder of romsets, and it reports what the dataset
 * recognizes.
 *
 * The archives are read with the application's own `zip-directory`, so what
 * this exercises is the code path the browser will take: the CRC32 of every
 * member is in the index at the tail of the file, and nothing is decompressed.
 */

import fs from 'fs';
import path from 'path';
import {
  ZIP_TAIL_LIMIT,
  findCentralDirectory,
  readCentralDirectory,
} from '../src/core/zip-directory.ts';
import { DATASETS_DIR, DATASET_FILE, systemDir } from './systems.mjs';

/**
 * The members an archive declares, read from its index alone.
 *
 * The tail is read first because that is where the index is; only then are the
 * bytes it points at read. Two small reads on a file that may be 90 MB.
 */
function membersOf(file) {
  const handle = fs.openSync(file, 'r');

  try {
    const size = fs.fstatSync(handle).size;
    const tailSize = Math.min(size, ZIP_TAIL_LIMIT);
    const tail = new Uint8Array(tailSize);
    fs.readSync(handle, tail, 0, tailSize, size - tailSize);

    const directory = findCentralDirectory(tail);
    if (!directory) return undefined;

    const bytes = new Uint8Array(directory.size);
    fs.readSync(handle, bytes, 0, directory.size, directory.offset);

    return readCentralDirectory(bytes, directory.count)
      .filter((entry) => !entry.directory)
      .map((entry) => entry.crc32);
  } finally {
    fs.closeSync(handle);
  }
}

/** Every archive under a folder, however deep it was organized. */
function* archivesOf(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const full = path.join(folder, entry.name);

    if (entry.isDirectory()) yield* archivesOf(full);
    else if (entry.name.toLowerCase().endsWith('.zip')) yield full;
  }
}

/**
 * What the dataset says a group of checksums is.
 *
 * A single file answers on its own. A romset is named by the members that
 * belong to it and to nothing else, and the share of it that is present says
 * whether what sits on disk is the whole game or part of one.
 */
function identify(dataset, checksums) {
  const found = checksums.map((crc) => dataset.byCrc.get(crc)).find(Boolean);
  if (found) return { kind: 'file', name: found.fileName ?? found.name, title: found.name };

  const scores = new Map();
  for (const crc of checksums) {
    for (const name of dataset.owners.get(crc) ?? []) {
      scores.set(name, (scores.get(name) ?? 0) + 1);
    }
  }

  let best;
  for (const [name, score] of scores) {
    if (!best || score > best.score) best = { name, score };
  }

  if (!best) return undefined;

  const set = dataset.sets[best.name];
  return {
    kind: 'set',
    name: best.name,
    title: set.title,
    coverage: best.score / set.members.length,
  };
}

function load(system) {
  const file = path.join(systemDir(DATASETS_DIR, system), DATASET_FILE);
  const dataset = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const sets = dataset.sets ?? {};

  const owners = new Map();
  for (const [name, set] of Object.entries(sets)) {
    for (const crc of set.members) {
      owners.set(crc, [...(owners.get(crc) ?? []), name]);
    }
  }

  return {
    file,
    sets,
    owners,
    byCrc: new Map(dataset.list.map((entry) => [entry.crc, entry])),
  };
}

function main() {
  const args = process.argv.slice(2);
  const folder = args.find((value) => !value.startsWith('--'));
  const system = args.find((value) => value.startsWith('--system='))?.slice('--system='.length);

  if (!folder || !system) {
    console.error(
      'Usage: node --import ./scripts/ts-imports.mjs scripts/verify-romsets.mjs <folder> --system=NEOGEO',
    );
    process.exit(1);
  }

  const dataset = load(system);
  console.log(`\n📖 ${dataset.file}`);
  console.log(
    `   ${dataset.byCrc.size} files, ${Object.keys(dataset.sets).length} sets, ` +
      `${dataset.owners.size} member checksums\n`,
  );

  const counts = { file: 0, set: 0, partial: 0, unknown: 0, renamed: 0 };
  const unknown = [];

  for (const archive of archivesOf(folder)) {
    const checksums = membersOf(archive);
    const match = checksums && identify(dataset, checksums);

    if (!match || (match.kind === 'set' && match.coverage < 1)) {
      counts[match ? 'partial' : 'unknown'] += 1;
      unknown.push(
        `${path.relative(folder, archive)}${
          match ? ` — ${(match.coverage * 100).toFixed(0)}% of ${match.name}` : ''
        }`,
      );
      continue;
    }

    counts[match.kind] += 1;

    // The point of the exercise: the name on disk was never read to get here.
    const stem = path.basename(archive, path.extname(archive));
    if (stem !== path.parse(match.name).name) counts.renamed += 1;
  }

  const identified = counts.file + counts.set;
  const total = identified + counts.partial + counts.unknown;

  console.log(`✅ ${identified} of ${total} identified (${((identified / total) * 100).toFixed(1)}%)`);
  console.log(`   by file checksum   ${counts.file}`);
  console.log(`   by set members     ${counts.set}`);
  console.log(`   incomplete sets    ${counts.partial}`);
  console.log(`   unknown            ${counts.unknown}`);
  console.log(`\n   ${counts.renamed} of them are not named after what they turned out to be`);

  if (unknown.length > 0) {
    console.log('\nNot identified:');
    for (const name of unknown) console.log(`   ${name}`);
  }
}

main();
