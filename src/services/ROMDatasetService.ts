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
  romName?: string;
  size?: number;
  crc?: string;
    md5?: string;
  sha1?: string;
    region?: string;
    videoStandard?: string;
}

interface DatasetMeta {
  source: string;
  totalGames: number;
  totalRoms: number;
  generated: string;
}

interface DatasetJSON {
  meta: DatasetMeta;
  gamesByCrc: Record<string, ROMMetadata>;
  gamesByMd5?: Record<string, ROMMetadata>;
  gamesBySha1: Record<string, ROMMetadata>;
}

const DB_NAME = 'rom-manager-datasets';
const DB_VERSION = 2;
const STORE_BY_CRC = 'gamesByCrc';
const STORE_BY_MD5 = 'gamesByMd5';
const STORE_BY_SHA1 = 'gamesBySha1';
const META_STORE = 'datasetsMeta';
const DATASET_FORMAT_VERSION = 2;

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

        // Store: gamesByCrc
        if (!db.objectStoreNames.contains(STORE_BY_CRC)) {
          const crcStore = db.createObjectStore(STORE_BY_CRC, { keyPath: 'crc' });
          crcStore.createIndex('name', 'name', { unique: false });
        }

        // Store: gamesByMd5
        if (!db.objectStoreNames.contains(STORE_BY_MD5)) {
          const md5Store = db.createObjectStore(STORE_BY_MD5, { keyPath: 'md5' });
          md5Store.createIndex('name', 'name', { unique: false });
        }

        // Store: gamesBySha1
        if (!db.objectStoreNames.contains(STORE_BY_SHA1)) {
          const sha1Store = db.createObjectStore(STORE_BY_SHA1, { keyPath: 'sha1' });
          sha1Store.createIndex('name', 'name', { unique: false });
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
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);

    if (!datasetsIndex || !datasetsIndex.files) {
      console.log('No dataset index found, skipping auto-load');
      return;
    }

    // Load each dataset
    for (const filename of datasetsIndex.files) {
      try {
        await this.loadDataset(filename);
      } catch (error) {
        console.warn(`Failed to load dataset ${filename}:`, error);
      }
    }
  }

  /**
   * Load a single dataset JSON file into IndexedDB
   */
  private static async loadDataset(filename: string): Promise<void> {
    const db = await this.getDB();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    // Check if already loaded
    const metaStore = db.transaction([META_STORE], 'readonly').objectStore(META_STORE);
    const existing = await new Promise<any>((resolve, reject) => {
      const req = metaStore.get(filename);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (existing?.formatVersion === DATASET_FORMAT_VERSION) {
      console.log(`✓ Dataset already loaded: ${filename}`);
      return;
    }

    // Fetch dataset
    const response = await fetch(`/datasets/${filename}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${filename}`);
    }

    const dataset: DatasetJSON = await response.json();
    console.log(`📥 Loading dataset: ${filename} (${dataset.meta.totalRoms} ROMs)`);

    // Insert into IndexedDB with transaction
    const transaction = db.transaction(
      [STORE_BY_CRC, STORE_BY_MD5, STORE_BY_SHA1, META_STORE],
      'readwrite'
    );

    // Insert CRC data
    const crcStore = transaction.objectStore(STORE_BY_CRC);
    for (const [crc, metadata] of Object.entries(dataset.gamesByCrc)) {
      crcStore.put({ crc, ...metadata });
    }

    // Insert MD5 data. Older generated datasets may not include this index.
    const md5Store = transaction.objectStore(STORE_BY_MD5);
    for (const [md5, metadata] of Object.entries(dataset.gamesByMd5 ?? {})) {
      md5Store.put({ md5, ...metadata });
    }

    // Insert SHA1 data
    const sha1Store = transaction.objectStore(STORE_BY_SHA1);
    for (const [sha1, metadata] of Object.entries(dataset.gamesBySha1)) {
      sha1Store.put({ sha1, ...metadata });
    }

    // Record metadata
    const metaStoreWrite = transaction.objectStore(META_STORE);
    metaStoreWrite.put({
      ...dataset.meta,
      source: filename,
      formatVersion: DATASET_FORMAT_VERSION,
      loadedAt: new Date().toISOString()
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log(`✅ Dataset loaded: ${filename}`);
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Lookup ROM by MD5 checksum
   */
  static async lookupByMd5(md5: string): Promise<ROMMetadata | null> {
    const db = await this.getDB();
    const store = db.transaction([STORE_BY_MD5], 'readonly').objectStore(STORE_BY_MD5);

    return new Promise((resolve, reject) => {
      const request = store.get(md5.toUpperCase());
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
    const store = db.transaction([STORE_BY_CRC], 'readonly').objectStore(STORE_BY_CRC);

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
    const store = db.transaction([STORE_BY_SHA1], 'readonly').objectStore(STORE_BY_SHA1);

    return new Promise((resolve, reject) => {
      const request = store.get(sha1.toUpperCase());
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
    const store = db.transaction([STORE_BY_CRC], 'readonly').objectStore(STORE_BY_CRC);
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
    totalRomsByCrc: number;
    totalRomsByMd5: number;
    totalRomsBySha1: number;
    datasets: Array<{ source: string; romCount: number }>;
  }> {
    const db = await this.getDB();

    const crcCount = await new Promise<number>((resolve, reject) => {
      const request = db
        .transaction([STORE_BY_CRC], 'readonly')
        .objectStore(STORE_BY_CRC)
        .count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    const sha1Count = await new Promise<number>((resolve, reject) => {
      const request = db
        .transaction([STORE_BY_SHA1], 'readonly')
        .objectStore(STORE_BY_SHA1)
        .count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    const md5Count = await new Promise<number>((resolve, reject) => {
      const request = db
        .transaction([STORE_BY_MD5], 'readonly')
        .objectStore(STORE_BY_MD5)
        .count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    const metaStore = db.transaction([META_STORE], 'readonly').objectStore(META_STORE);
    const datasets: Array<{ source: string; romCount: number }> = [];

    return new Promise((resolve, reject) => {
      const request = metaStore.openCursor();
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          datasets.push({
            source: cursor.value.source,
            romCount: cursor.value.totalRoms
          });
          cursor.continue();
        } else {
          resolve({
            totalRomsByCrc: crcCount,
            totalRomsByMd5: md5Count,
            totalRomsBySha1: sha1Count,
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
    const transaction = db.transaction(
      [STORE_BY_CRC, STORE_BY_MD5, STORE_BY_SHA1, META_STORE],
      'readwrite'
    );

    transaction.objectStore(STORE_BY_CRC).clear();
    transaction.objectStore(STORE_BY_MD5).clear();
    transaction.objectStore(STORE_BY_SHA1).clear();
    transaction.objectStore(META_STORE).clear();

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}
