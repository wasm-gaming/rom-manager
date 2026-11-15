/**
 * The browser's side of keeping the library: how much room it takes, how much there is,
 * and whether the browser has promised not to clear it.
 *
 * OPFS is "best-effort" storage until `navigator.storage.persist()` is granted: under
 * pressure — or, on Safari, after days without a visit to a site not installed to the
 * home screen — the browser may clear it. A ROM library is worth asking for more.
 * Every call degrades to "unknown" where the Storage API is missing.
 */

export interface LibraryStorageStatus {
  /** Bytes this origin uses (the library and anything else it stores), when known. */
  usage: number | null;
  /** Bytes the browser lets this origin use, when known. */
  quota: number | null;
  /** True once the browser promised to keep the data; null when it cannot say. */
  persistent: boolean | null;
}

type StorageManagerLike = Partial<Pick<StorageManager, 'estimate' | 'persist' | 'persisted'>>;

function manager(): StorageManagerLike | null {
  return (globalThis.navigator?.storage as StorageManagerLike | undefined) ?? null;
}

export const LibraryStorageService = {
  /** Usage, quota and persistence, each `null` when the browser does not say. */
  async status(): Promise<LibraryStorageStatus> {
    const storage = manager();
    const estimate = await storage?.estimate?.().catch(() => undefined);
    const persistent = storage?.persisted ? await storage.persisted().catch(() => null) : null;
    return {
      usage: typeof estimate?.usage === 'number' ? estimate.usage : null,
      quota: typeof estimate?.quota === 'number' ? estimate.quota : null,
      persistent,
    };
  },

  /**
   * Asks the browser to keep the library. Chromium decides on its own (an installed or
   * often-used site gets it), Firefox asks the user. Returns what the browser answered;
   * false when it cannot be asked.
   */
  async persist(): Promise<boolean> {
    const storage = manager();
    if (!storage?.persist) return false;
    if (storage.persisted && (await storage.persisted().catch(() => false))) return true;
    return storage.persist().catch(() => false);
  },
};

/** "1,2 GB" — bytes for people, in the given locale. */
export function formatBytes(bytes: number, locale?: string): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  const digits = unit === 0 || value >= 100 ? 0 : 1;
  return `${value.toLocaleString(locale, { maximumFractionDigits: digits })} ${units[unit]}`;
}
