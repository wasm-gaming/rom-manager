/**
 * ROM Dataset Service
 * 
 * Manages ROM metadata lookup via IndexedDB
 * - Auto-initializes IndexedDB with game data
 * - Provides O(1) lookups by CRC32, MD5, or SHA1
 * - Caches data locally for offline use
 * 
 * Usage:
 *   const metadata = await ROMDatasetService.lookupByCrc('ABC123DE');
 *   const metadata = await ROMDatasetService.lookupBySha1('deadbeef...');
 */

export interface ROMMetadata {
  name: string;
  description?: string;
  fileName?: string;
  size?: number;
  crc?: string;
    md5?: string;
  sha1?: string;
    region?: string;
    videoStandard?: string;
    cover?: string;
}

interface DatasetMeta {
  source: string;
  totalGames: number;
  totalFiles: number;
  generated: string;
}

interface DatasetJSON {
  meta: DatasetMeta;
  list: ROMMetadata[];
}

interface DatasetIndexEntry {
  system: string;
  path: string;
  crc32: string;
}

interface DatasetIndex {
  files: DatasetIndexEntry[];
}

const DB_NAME = 'rom-manager-datasets';
const DB_VERSION = 3;
const STORE_ROMS = 'roms';
const META_STORE = 'datasetsMeta';
const DATASET_FORMAT_VERSION = 5;

export class ROMDatasetService {
  private static db: IDBDatabase | null = null;
  private static initialized: Promise<IDBDatabase>;

  /**
   * Initialize IndexedDB and load datasets
   */
  static {
    this.initialized = this.initializeDB();
  }

  /**
   * Initialize database schema
   */
  private static async initializeDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        this.db = db;

        // Auto-load datasets after DB is ready
        this.loadDatasets().catch((error) => {
          console.warn('Failed to auto-load datasets:', error.message);
        });

        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Replace the duplicated checksum stores with one ROM store and indexes.
        for (const storeName of ['gamesByCrc', 'gamesByMd5', 'gamesBySha1']) {
          if (db.objectStoreNames.contains(storeName)) {
            db.deleteObjectStore(storeName);
          }
        }

        if (!db.objectStoreNames.contains(STORE_ROMS)) {
          const romStore = db.createObjectStore(STORE_ROMS, { keyPath: 'crc' });
          romStore.createIndex('md5', 'md5', { unique: false });
          romStore.createIndex('sha1', 'sha1', { unique: false });
          romStore.createIndex('name', 'name', { unique: false });
        }

        // Store: metadata tracking
        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE, { keyPath: 'source' });
        }
      };
    });
  }

  /**
   * Get database instance (wait for initialization)
   */
  private static async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return this.initialized;
  }

  /**
  * Load all datasets from datasets/
   */
  private static async loadDatasets(): Promise<void> {
    // Ensure database is initialized
    await this.getDB();

    // Get list of datasets
    const datasetsIndex = await fetch('/datasets/index.json')
      .then((r) => (r.ok ? (r.json() as Promise<DatasetIndex>) : null))
      .catch(() => null);

    if (!datasetsIndex || !Array.isArray(datasetsIndex.files)) {
      console.log('No dataset index found, skipping auto-load');
      return;
    }

    // Load each dataset
    for (const dataset of datasetsIndex.files) {
      if (!this.isValidDatasetIndexEntry(dataset)) {
        console.warn('Skipping invalid dataset index entry');
        continue;
      }

      try {
        await this.loadDataset(dataset);
      } catch (error) {
        console.warn(`Failed to load dataset ${dataset.path}:`, error);
      }
    }
  }

  private static isValidDatasetIndexEntry(value: unknown): value is DatasetIndexEntry {
    if (!value || typeof value !== 'object') return false;

    const entry = value as Record<string, unknown>;
    return (
      typeof entry.system === 'string' &&
      entry.system.length > 0 &&
      typeof entry.path === 'string' &&
      // Datasets live one folder deep, so anything else is a traversal attempt.
      /^[^/\\]+\/[^/\\]+\.json$/.test(entry.path) &&
      !entry.path.includes('..') &&
      typeof entry.crc32 === 'string' &&
      /^[A-Fa-f0-9]{8}$/.test(entry.crc32)
    );
  }

  private static isValidROMMetadata(value: unknown): value is ROMMetadata & { crc: string } {
    if (!value || typeof value !== 'object') return false;

    const rom = value as Record<string, unknown>;
    return (
      typeof rom.name === 'string' &&
      typeof rom.crc === 'string' &&
      /^[A-Fa-f0-9]{8}$/.test(rom.crc) &&
      (rom.md5 === undefined || (typeof rom.md5 === 'string' && /^[A-Fa-f0-9]{32}$/.test(rom.md5))) &&
      (rom.sha1 === undefined || (typeof rom.sha1 === 'string' && /^[A-Fa-f0-9]{40}$/.test(rom.sha1)))
    );
  }

  /**
   * Load a single dataset JSON file into IndexedDB
   */
  private static async loadDataset({ system, path, crc32 }: DatasetIndexEntry): Promise<void> {
    const db = await this.getDB();

    // Check if already loaded
    const metaStore = db.transaction([META_STORE], 'readonly').objectStore(META_STORE);
    const existing = await new Promise<any>((resolve, reject) => {
      const req = metaStore.get(path);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (
      existing?.formatVersion === DATASET_FORMAT_VERSION &&
      existing.crc32 === crc32
    ) {
      console.log(`✓ Dataset already loaded: ${path}`);
      return;
    }

    // Fetch dataset
    const response = await fetch(`/datasets/${path}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${path}`);
    }

    const dataset: DatasetJSON = await response.json();
    if (!Array.isArray(dataset.list)) {
      throw new Error(`Invalid dataset format: ${path}`);
    }

    console.log(`📥 Loading dataset: ${path} (${dataset.meta.totalFiles} files)`);

    // Build the checksum lookup indexes locally while inserting each ROM once.
    const transaction = db.transaction([STORE_ROMS, META_STORE], 'readwrite');
    const romStore = transaction.objectStore(STORE_ROMS);
    for (const rom of dataset.list) {
      if (this.isValidROMMetadata(rom)) {
        romStore.put({
          ...rom,
          crc: rom.crc.toUpperCase(),
          md5: rom.md5?.toUpperCase(),
          sha1: rom.sha1?.toUpperCase(),
          cover: this.sanitizeCoverUrl(rom.cover),
        });
      }
    }

    // Record metadata
    const metaStoreWrite = transaction.objectStore(META_STORE);
    metaStoreWrite.put({
      ...dataset.meta,
      source: path,
      system,
      crc32,
      formatVersion: DATASET_FORMAT_VERSION,
      loadedAt: new Date().toISOString()
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log(`✅ Dataset loaded: ${path}`);
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Only keep boxart URLs that are safe to feed to an <img> tag.
   */
  private static sanitizeCoverUrl(cover: unknown): string | undefined {
    return typeof cover === 'string' && cover.startsWith('https://') ? cover : undefined;
  }

  /**
   * Lookup ROM by MD5 checksum
   */
  static async lookupByMd5(md5: string): Promise<ROMMetadata | null> {
    const db = await this.getDB();
    const index = db.transaction([STORE_ROMS], 'readonly').objectStore(STORE_ROMS).index('md5');

    return new Promise((resolve, reject) => {
      const request = index.get(md5.toUpperCase());
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          const { md5: _md5, ...metadata } = result;
          resolve(metadata);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Lookup ROM by CRC32 checksum
   */
  static async lookupByCrc(crc: string): Promise<ROMMetadata | null> {
    const db = await this.getDB();
    const store = db.transaction([STORE_ROMS], 'readonly').objectStore(STORE_ROMS);

    return new Promise((resolve, reject) => {
      const request = store.get(crc.toUpperCase());
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          const { crc, ...metadata } = result;
          resolve(metadata);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Lookup ROM by SHA1 checksum
   */
  static async lookupBySha1(sha1: string): Promise<ROMMetadata | null> {
    const db = await this.getDB();
    const index = db.transaction([STORE_ROMS], 'readonly').objectStore(STORE_ROMS).index('sha1');

    return new Promise((resolve, reject) => {
      const request = index.get(sha1.toUpperCase());
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          const { sha1, ...metadata } = result;
          resolve(metadata);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Search games by name (returns up to limit results)
   */
  static async searchByName(query: string, limit = 10): Promise<ROMMetadata[]> {
    const db = await this.getDB();
    const store = db.transaction([STORE_ROMS], 'readonly').objectStore(STORE_ROMS);
    const nameIndex = store.index('name');

    const results: ROMMetadata[] = [];
    const queryUpper = query.toUpperCase();

    return new Promise((resolve, reject) => {
      const request = nameIndex.openCursor();
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && results.length < limit) {
          const { name, crc, ...metadata } = cursor.value;
          if (name.toUpperCase().includes(queryUpper)) {
            results.push({ name, ...metadata });
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get dataset statistics
   */
  static async getStats(): Promise<{
    totalFilesByCrc: number;
    totalFilesByMd5: number;
    totalFilesBySha1: number;
    datasets: Array<{ source: string; fileCount: number }>;
  }> {
    const db = await this.getDB();

    const fileCount = await new Promise<number>((resolve, reject) => {
      const request = db
        .transaction([STORE_ROMS], 'readonly')
        .objectStore(STORE_ROMS)
        .count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    const metaStore = db.transaction([META_STORE], 'readonly').objectStore(META_STORE);
    const datasets: Array<{ source: string; fileCount: number }> = [];

    return new Promise((resolve, reject) => {
      const request = metaStore.openCursor();
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          datasets.push({
            source: cursor.value.source,
            fileCount: cursor.value.totalFiles
          });
          cursor.continue();
        } else {
          resolve({
            totalFilesByCrc: fileCount,
            totalFilesByMd5: fileCount,
            totalFilesBySha1: fileCount,
            datasets
          });
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all indexed data (for refresh/reset)
   */
  static async clearData(): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_ROMS, META_STORE], 'readwrite');

    transaction.objectStore(STORE_ROMS).clear();
    transaction.objectStore(META_STORE).clear();

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}
