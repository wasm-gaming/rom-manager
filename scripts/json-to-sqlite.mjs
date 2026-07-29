#!/usr/bin/env node
/**
 * JSON to SQLite converter - Converts game file metadata JSON to SQLite database
 * Usage: node scripts/json-to-sqlite.mjs input.json output.db
 * 
 * Note: Requires better-sqlite3 to be installed:
 *   npm install --save-dev better-sqlite3
 */

import fs from 'fs';
import path from 'path';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node scripts/json-to-sqlite.mjs <input.json> <output.db>');
    process.exit(1);
  }
  
  const [inputFile, outputFile] = args;
  
  try {
    // Import better-sqlite3 dynamically
    let Database;
    try {
      const module = await import('better-sqlite3');
      Database = module.default;
    } catch (error) {
      console.error('❌ Error: better-sqlite3 not found');
      console.error('   Install it with: npm install --save-dev better-sqlite3');
      process.exit(1);
    }
    
    // Read JSON
    console.log(`📖 Reading JSON file: ${inputFile}`);
    const jsonContent = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
    
    // Delete existing DB if present
    if (fs.existsSync(outputFile)) {
      console.log(`🗑️  Removing existing database: ${outputFile}`);
      fs.unlinkSync(outputFile);
    }
    
    // Create database
    console.log(`💾 Creating SQLite database: ${outputFile}`);
    const db = new Database(outputFile);
    
    // Enable performance optimizations
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    
    // Create tables
    console.log('📋 Creating schema...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS games_by_crc (
        crc TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        fileName TEXT,
        size INTEGER,
        sha1 TEXT
      );
      
      CREATE TABLE IF NOT EXISTS games_by_sha1 (
        sha1 TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        fileName TEXT,
        size INTEGER,
        crc TEXT
      );
      
      CREATE INDEX IF NOT EXISTS idx_games_by_crc_name ON games_by_crc(name);
      CREATE INDEX IF NOT EXISTS idx_games_by_sha1_name ON games_by_sha1(name);
    `);
    
    // Insert data using transaction for performance
    console.log('⏳ Inserting data...');
    const insertCrc = db.prepare(`
      INSERT INTO games_by_crc (crc, name, description, fileName, size, sha1)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const insertSha1 = db.prepare(`
      INSERT INTO games_by_sha1 (sha1, name, description, fileName, size, crc)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const transaction = db.transaction((list) => {
      for (const game of list) {
        if (!game.crc) continue;
        insertCrc.run(
          game.crc,
          game.name,
          game.description || null,
          game.fileName || null,
          game.size || null,
          game.sha1 || null
        );
      }
      
      for (const game of list) {
        if (!game.sha1) continue;
        insertSha1.run(
          game.sha1,
          game.name,
          game.description || null,
          game.fileName || null,
          game.size || null,
          game.crc || null
        );
      }
    });
    
    if (!Array.isArray(jsonContent.list)) {
      throw new Error('Invalid dataset format: expected a list');
    }

    transaction(jsonContent.list);
    
    // Optimize database
    console.log('🔧 Optimizing database...');
    db.pragma('optimize');
    
    db.close();
    
    // Show stats
    const dbSize = fs.statSync(outputFile).size;
    const dbSizeKB = (dbSize / 1024).toFixed(2);
    const dbSizeMB = (dbSize / 1024 / 1024).toFixed(2);
    const crcCount = jsonContent.list.filter((game) => game.crc).length;
    const sha1Count = jsonContent.list.filter((game) => game.sha1).length;
    
    console.log('\n✅ Conversion successful!');
    console.log(`   CRC entries: ${crcCount}`);
    console.log(`   SHA1 entries: ${sha1Count}`);
    console.log(`   Database size: ${dbSizeMB} MB (${dbSizeKB} KB)`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
