#!/usr/bin/env node
/**
 * Create sample datasets for testing
 * Generates minimal JSON datasets with common game files
 */

import fs from 'fs';
import path from 'path';
import { DATASETS_DIR, DATASET_FILE, INDEX_FILE, systemDir } from './systems.mjs';

const datasetsDir = DATASETS_DIR;

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

function calculateDatasetCRC32(dataset) {
  const copy = structuredClone(dataset);
  delete copy.meta.generated;
  return calculateCRC32(Buffer.from(JSON.stringify(copy), 'utf-8'));
}

// Sample ROMs for testing
const SAMPLE_DATASETS = {
  'Nintendo - NES': {
    'AFE05EEE': {
      name: 'Super Mario Bros.',
      description: 'Classic platformer',
      fileName: 'Super Mario Bros.nes'
    },
    '5F6B266B': {
      name: 'The Legend of Zelda',
      description: 'Classic adventure',
      fileName: 'The Legend of Zelda.nes'
    },
    '24667E4D': {
      name: 'Donkey Kong',
      description: 'Original arcade port',
      fileName: 'Donkey Kong.nes'
    }
  },
  'Nintendo - SNES': {
    'ABC123DE': {
      name: 'Super Mario World',
      description: 'SNES platformer',
      fileName: 'Super Mario World.smc'
    },
    'DEF45678': {
      name: 'The Legend of Zelda: A Link to the Past',
      description: 'SNES adventure',
      fileName: 'Zelda ALttP.smc'
    }
  },
  'Sega - Genesis': {
    '123456AB': {
      name: 'Sonic the Hedgehog',
      description: 'Genesis platformer',
      fileName: 'Sonic.md'
    },
    'CD789EF0': {
      name: 'Altered Beast',
      description: 'Genesis beat-em-up',
      fileName: 'Altered Beast.md'
    }
  }
};

function generateDataset(systemName, roms) {
  const list = Object.entries(roms).map(([crc, data]) => ({ ...data, crc }));

  return {
    meta: {
      source: `${systemName}.dat`,
      totalGames: Object.keys(roms).length,
      totalFiles: Object.keys(roms).length,
      generated: new Date().toISOString()
    },
    list
  };
}

async function main() {
  console.log('📝 Creating sample datasets for testing...\n');

  if (!fs.existsSync(datasetsDir)) {
    fs.mkdirSync(datasetsDir, { recursive: true });
  }

  const files = [];
  let totalROMs = 0;

  for (const [systemName, roms] of Object.entries(SAMPLE_DATASETS)) {
    const dataset = generateDataset(systemName, roms);
    const targetDir = systemDir(datasetsDir, systemName);
    const datasetPath = `${systemName}/${DATASET_FILE}`;
    const filepath = path.join(targetDir, DATASET_FILE);

    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(filepath, JSON.stringify(dataset, null, 2), 'utf-8');
    
    const size = fs.statSync(filepath).size;
    files.push({
      system: systemName,
      path: datasetPath,
      crc32: calculateDatasetCRC32(dataset),
    });
    totalROMs += Object.keys(roms).length;

    console.log(`✅ ${systemName}`);
    console.log(`   File: ${datasetPath}`);
    console.log(`   ROMs: ${Object.keys(roms).length}`);
    console.log(`   Size: ${(size / 1024).toFixed(2)} KB\n`);
  }

  // Update index.json
  const index = {
    files,
    description: 'Sample ROM metadata datasets for testing',
    source: 'Generated sample data',
    generatedAt: new Date().toISOString(),
    systemCount: files.length,
    totalROMCount: totalROMs
  };

  const indexPath = path.join(datasetsDir, INDEX_FILE);
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');

  console.log('='.repeat(50));
  console.log(`✅ Sample datasets created!`);
  console.log(`   Location: ${datasetsDir}`);
  console.log(`   Systems: ${files.length}`);
  console.log(`   Total ROMs: ${totalROMs}`);
  console.log(`\n📝 Test CRCs available:`);
  console.log(`   AFE05EEE - Super Mario Bros. (NES)`);
  console.log(`   ABC123DE - Super Mario World (SNES)`);
  console.log(`   123456AB - Sonic the Hedgehog (Genesis)`);
  console.log(`\n🎮 Start app: npm run dev`);
  console.log(`   Then: Select ROM → Click "🔍 Lookup Dataset"`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
