import { afterEach, describe, expect, it, vi } from 'vitest';
import { LibraryStorageService, formatBytes } from './LibraryStorageService';

function stubStorage(storage: unknown) {
  vi.stubGlobal('navigator', { storage });
}

afterEach(() => vi.unstubAllGlobals());

describe('LibraryStorageService.status', () => {
  it('reads usage, quota and persistence', async () => {
    stubStorage({
      estimate: async () => ({ usage: 1024, quota: 4096 }),
      persisted: async () => true,
    });
    expect(await LibraryStorageService.status()).toEqual({ usage: 1024, quota: 4096, persistent: true });
  });

  it('says "unknown" where the Storage API is missing', async () => {
    stubStorage(undefined);
    expect(await LibraryStorageService.status()).toEqual({ usage: null, quota: null, persistent: null });
  });
});

describe('LibraryStorageService.persist', () => {
  it('asks once, and not again when already granted', async () => {
    const persist = vi.fn(async () => true);
    stubStorage({ persisted: async () => true, persist });
    expect(await LibraryStorageService.persist()).toBe(true);
    expect(persist).not.toHaveBeenCalled();
  });

  it('returns what the browser answered', async () => {
    stubStorage({ persisted: async () => false, persist: async () => false });
    expect(await LibraryStorageService.persist()).toBe(false);
  });

  it('is false where it cannot be asked', async () => {
    stubStorage({});
    expect(await LibraryStorageService.persist()).toBe(false);
  });
});

describe('formatBytes', () => {
  it('speaks in the largest unit that fits', () => {
    expect(formatBytes(512, 'en')).toBe('512 B');
    expect(formatBytes(1536, 'en')).toBe('1.5 KB');
    expect(formatBytes(5 * 1024 ** 3, 'en')).toBe('5 GB');
    expect(formatBytes(1.25 * 1024 ** 2, 'es')).toBe('1,3 MB');
  });
});
