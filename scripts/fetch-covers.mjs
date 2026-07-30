#!/usr/bin/env node
/**
 * Scrape the boxart listings of the libretro thumbnail collection.
 *
 * Usage: node scripts/fetch-covers.mjs [output-dir] [--systems=a,b]
 *
 * The listing comes from the GitHub repository that backs each system
 * (`libretro-thumbnails/<System_Name>`), because thumbnails.libretro.com
 * stopped serving its directory index and now answers 403 to it. The images are
 * read from the same repository, which is what lets the application store a
 * copy of a boxart locally — see `boxartUrl` in `systems.mjs`.
 *
 * The scraped names are stored as `<output-dir>/<system>/covers.json` and
 * later joined against the DAT entries by `dat-to-json.mjs`, which builds each
 * URL from the recorded `repository`.
 *
 * The GitHub API allows 60 requests/hour anonymously and this script spends
 * two per system, so a full run fits but a second one within the hour may not.
 * Set GITHUB_TOKEN to raise the limit.
 */

import fs from 'fs';
import path from 'path';
import {
  BOXART_FOLDER,
  COVERS_FILE,
  DATASETS_DIR,
  repositoryOf,
  selectSystems,
  systemDir,
} from './systems.mjs';

const GITHUB_API = 'https://api.github.com';
const THUMBNAILS_OWNER = 'libretro-thumbnails';
const BRANCHES = ['master', 'main'];

async function githubJson(url) {
  const headers = { 'User-Agent': 'rom-manager', Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });

  if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
    throw new Error('GitHub API rate limit exhausted; set GITHUB_TOKEN and retry');
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }

  return response.json();
}

/**
 * List the boxart names published for a system.
 *
 * The root tree is read first to locate the `Named_Boxarts` subtree, so only
 * that folder is downloaded instead of the whole repository, which also holds
 * the snapshot and title-screen collections.
 */
async function fetchBoxartNames(repository) {
  const treesUrl = `${GITHUB_API}/repos/${THUMBNAILS_OWNER}/${repository}/git/trees`;

  let root;
  for (const branch of BRANCHES) {
    try {
      root = await githubJson(`${treesUrl}/${branch}`);
      break;
    } catch (error) {
      if (!error.message.startsWith('HTTP 404')) throw error;
    }
  }

  if (!root) {
    throw new Error(`HTTP 404: ${treesUrl}/${BRANCHES[0]}`);
  }

  const folder = root.tree.find(
    (entry) => entry.path === BOXART_FOLDER && entry.type === 'tree',
  );

  if (!folder) return [];

  const listing = await githubJson(`${treesUrl}/${folder.sha}`);

  if (listing.truncated) {
    throw new Error(`Listing of ${repository}/${BOXART_FOLDER} was truncated by the API`);
  }

  return listing.tree
    .filter((entry) => entry.type === 'blob' && entry.path.toLowerCase().endsWith('.png'))
    .map((entry) => entry.path.slice(0, -'.png'.length))
    .sort();
}

async function main() {
  const args = process.argv.slice(2);
  const outputDir = args.find((value) => !value.startsWith('--')) || DATASETS_DIR;
  const systems = selectSystems(args);

  console.log('\n🖼️  Scraping boxarts from the libretro-thumbnails repositories...\n');
  console.log(`📍 Output directory: ${outputDir}\n`);

  let scraped = 0;
  let skipped = 0;
  let failed = 0;
  let totalCovers = 0;

  for (const system of systems) {
    const repository = repositoryOf(system.thumbnails);

    process.stdout.write(`⏳ ${system.name.padEnd(30)} ... `);

    try {
      const list = await fetchBoxartNames(repository);

      if (list.length === 0) {
        console.log('⏭️  No boxarts published (skipped)');
        skipped++;
        continue;
      }

      const targetDir = systemDir(outputDir, system.name);
      fs.mkdirSync(targetDir, { recursive: true });

      const covers = {
        meta: {
          system: system.name,
          thumbnails: system.thumbnails,
          repository,
          type: BOXART_FOLDER,
          total: list.length,
          generated: new Date().toISOString(),
        },
        list,
      };

      fs.writeFileSync(
        path.join(targetDir, COVERS_FILE),
        JSON.stringify(covers, null, 2),
        'utf-8',
      );

      console.log(`✅ ${list.length} boxarts`);
      totalCovers += list.length;
      scraped++;
    } catch (error) {
      if (error.message.startsWith('HTTP 404')) {
        console.log('⏭️  Not available (skipped)');
        skipped++;
      } else {
        console.log(`❌ ${error.message}`);
        failed++;
      }
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Scraped: ${scraped}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`🖼️  Boxarts indexed: ${totalCovers}`);

  console.log('\n📝 Next step:');
  console.log('   npm run dataset:to-json\n');
}

main().catch((error) => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
