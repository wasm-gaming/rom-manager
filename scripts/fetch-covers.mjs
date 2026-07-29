#!/usr/bin/env node
/**
 * Scrape the boxart listings from thumbnails.libretro.com.
 *
 * Usage: node scripts/fetch-covers.mjs [output-dir] [--systems=a,b]
 *
 * The server exposes a plain directory index per system, so we read the real
 * list of published files instead of guessing URLs. The scraped names are
 * stored as `<output-dir>/<system>/covers.json` and later joined against the
 * DAT entries by `dat-to-json.mjs`.
 */

import fs from 'fs';
import path from 'path';
import {
  COVERS_FILE,
  DATASETS_DIR,
  selectSystems,
  systemDir,
} from './systems.mjs';

const THUMBNAILS_ORIGIN = 'https://thumbnails.libretro.com';
const BOXART_FOLDER = 'Named_Boxarts';

/**
 * Build a URL under the thumbnails origin, encoding each path segment.
 */
function thumbnailsUrl(...segments) {
  return `${THUMBNAILS_ORIGIN}/${segments.map(encodeURIComponent).join('/')}`;
}

/**
 * Extract the PNG file names from an Apache directory index.
 *
 * Only plain file names are accepted: entries containing a path separator are
 * navigation links (parent directory, sorting) and must be ignored.
 */
function parseListing(html) {
  const names = new Set();
  const hrefPattern = /href="([^"]+\.png)"/gi;

  let match;
  while ((match = hrefPattern.exec(html)) !== null) {
    const href = match[1];
    if (href.includes('/') || href.includes('?')) continue;

    let decoded;
    try {
      decoded = decodeURIComponent(href);
    } catch {
      continue;
    }

    if (decoded.includes('/') || decoded.includes('\\')) continue;

    names.add(decoded.slice(0, -'.png'.length));
  }

  return Array.from(names).sort();
}

async function fetchListing(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }

  return response.text();
}

async function main() {
  const args = process.argv.slice(2);
  const outputDir = args.find((value) => !value.startsWith('--')) || DATASETS_DIR;
  const systems = selectSystems(args);

  console.log('\n🖼️  Scraping boxarts from thumbnails.libretro.com...\n');
  console.log(`📍 Output directory: ${outputDir}\n`);

  let scraped = 0;
  let skipped = 0;
  let failed = 0;
  let totalCovers = 0;

  for (const system of systems) {
    const baseUrl = thumbnailsUrl(system.thumbnails, BOXART_FOLDER);

    process.stdout.write(`⏳ ${system.name.padEnd(30)} ... `);

    try {
      const listing = await fetchListing(`${baseUrl}/`);
      const list = parseListing(listing);

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
          type: BOXART_FOLDER,
          baseUrl,
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
      if (error.message.includes('HTTP 404')) {
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
