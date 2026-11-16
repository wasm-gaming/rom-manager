/**
 * Persists FSA directory handles in IndexedDB so opened folders survive a page
 * refresh. Handles are structured-cloneable, which is why IndexedDB works but
 * sessionStorage / localStorage do not.
 *
 * The database is a single object store keyed by origin ID. Writing is
 * fire-and-forget from the caller's perspective: a failed persist only means
 * the folder won't reappear after the next reload, which is the status quo.
 */

const DB_NAME = 'rom-manager-handles';
const DB_VERSION = 1;
const STORE_NAME = 'handles';

export interface StoredHandle {
  id: string;
  name: string;
  handle: FileSystemDirectoryHandle;
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx(
  db: IDBDatabase,
  mode: IDBTransactionMode,
): IDBObjectStore {
  return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
}

export class HandleStoreService {
  static async save(entry: StoredHandle): Promise<void> {
    const db = await open();
    try {
      await new Promise<void>((resolve, reject) => {
        const request = tx(db, 'readwrite').put(entry);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  }

  static async remove(id: string): Promise<void> {
    const db = await open();
    try {
      await new Promise<void>((resolve, reject) => {
        const request = tx(db, 'readwrite').delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  }

  static async loadAll(): Promise<StoredHandle[]> {
    const db = await open();
    try {
      return await new Promise<StoredHandle[]>((resolve, reject) => {
        const request = tx(db, 'readonly').getAll();
        request.onsuccess = () => resolve(request.result as StoredHandle[]);
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  }

  static async clear(): Promise<void> {
    const db = await open();
    try {
      await new Promise<void>((resolve, reject) => {
        const request = tx(db, 'readwrite').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  }
}
