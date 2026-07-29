#!/usr/bin/env node
/**
 * Create sample datasets for testing
 * Generates minimal JSON datasets with common ROMs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const datasetsDir = path.join(__dirname, '..', 'static', 'datasets');

// Sample ROMs for testing
const SAMPLE_DATASETS = {
  'Nintendo - NES': {
    'AFE05EEE': {
      name: 'Super Mario Bros.',
      description: 'Classic platformer',
      romName: 'Super Mario Bros.nes'
    },
    '5F6B266B': {
      name: 'The Legend of Zelda',
      description: 'Classic adventure',
      romName: 'The Legend of Zelda.nes'
    },
    '24667E4D': {
      name: 'Donkey Kong',
      description: 'Original arcade port',
      romName: 'Donkey Kong.nes'
    }
  },
  'Nintendo - SNES': {
    'ABC123DE': {
      name: 'Super Mario World',
      description: 'SNES platformer',
      romName: 'Super Mario World.smc'
    },
    'DEF45678': {
      name: 'The Legend of Zelda: A Link to the Past',
      description: 'SNES adventure',
      romName: 'Zelda ALttP.smc'
    }
  },
  'Sega - Genesis': {
    '123456AB': {
      name: 'Sonic the Hedgehog',
      description: 'Genesis platformer',
      romName: 'Sonic.md'
    },
    'CD789EF0': {
      name: 'Altered Beast',
      description: 'Genesis beat-em-up',
      romName: 'Altered Beast.md'
    }
  }
};

function generateDataset(systemName, roms) {
  const gamesByCrc = {};
  const gamesBySha1 = {};

  // Use CRC as both key and fallback SHA1 for demo
  Object.entries(roms).forEach(([crc, data]) => {
    gamesByCrc[crc] = { ...data, sha1: crc };
    gamesBySha1[crc] = { ...data, crc };
  });

  return {
    meta: {
      source: `${systemName}.dat`,
      totalGames: Object.keys(roms).length,
      totalRoms: Object.keys(roms).length,
      generated: new Date().toISOString()
    },
    gamesByCrc,
    gamesBySha1
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
    const filename = `${systemName}.json`;
    const filepath = path.join(datasetsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(dataset, null, 2), 'utf-8');
    
    const size = fs.statSync(filepath).size;
    files.push(filename);
    totalROMs += Object.keys(roms).length;

    console.log(`✅ ${systemName}`);
    console.log(`   File: ${filename}`);
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

  const indexPath = path.join(datasetsDir, 'index.json');
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
