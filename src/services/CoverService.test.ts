import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CoverService } from './CoverService';
import type { StorageNode } from './StorageService';

/** An in-memory stand-in for the opened folder. */
class FakeStorage {
  readonly files = new Map<string, Uint8Array>();
  readonly directories: string[] = [];

  put(path: string, content: string): void {
    this.files.set(path, new TextEncoder().encode(content));
  }

  async readFile(path: string): Promise<Uint8Array> {
    const content = this.files.get(path);
    if (content === undefined) throw new Error(`No such file: ${path}`);
    return content;
  }

  async writeFile(path: string, content: Uint8Array): Promise<void> {
    this.files.set(path, content);
  }

  async exists(path: string): Promise<boolean> {
    return this.files.has(path);
  }

  async createDirectory(path: string): Promise<void> {
    this.directories.push(path);
  }

  asNode(): StorageNode {
    return this as unknown as StorageNode;
  }
}

const COVER = { url: 'https://example.test/Sonic%20(USA).png', variantKey: 'USA' };

let storage: FakeStorage;

beforeEach(() => {
  storage = new FakeStorage();
  vi.stubGlobal('URL', { createObjectURL: () => 'blob:cover', revokeObjectURL: () => undefined });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function respondWith(bytes: number): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok: true, blob: async () => new Blob([new Uint8Array(bytes)]) })),
  );
}

describe('CoverService.stored', () => {
  it('finds the copy stored for the release', async () => {
    storage.put('.meta/MegaDrive/Sonic.USA.case.png', 'image');

    expect(await CoverService.stored(storage.asNode(), 'MegaDrive', 'Sonic', COVER)).toBe(
      'blob:cover',
    );
  });

  it('falls back to the copy stored for the game', async () => {
    // Stored earlier for another release of the same game: still this game's box.
    storage.put('.meta/MegaDrive/Sonic.case.png', 'image');

    expect(await CoverService.stored(storage.asNode(), 'MegaDrive', 'Sonic', COVER)).toBe(
      'blob:cover',
    );
  });

  it('finds a cover dropped in by hand when the dataset offers none', async () => {
    storage.put('.meta/MegaDrive/Sonic.case.png', 'image');

    expect(await CoverService.stored(storage.asNode(), 'MegaDrive', 'Sonic')).toBe('blob:cover');
  });

  it('has nothing to return when no copy was ever stored', async () => {
    expect(await CoverService.stored(storage.asNode(), 'MegaDrive', 'Sonic', COVER)).toBeUndefined();
  });
});

describe('CoverService.cache', () => {
  it('stores the boxart beside the metadata of its game', async () => {
    respondWith(1024);

    expect(await CoverService.cache(storage.asNode(), 'MegaDrive', 'Sonic', COVER)).toBe(true);
    expect(storage.files.has('.meta/MegaDrive/Sonic.USA.case.png')).toBe(true);
    expect(storage.directories).toContain('.meta/MegaDrive');
  });

  it('stores a game boxart once, whichever release asked for it', async () => {
    respondWith(1024);
    const game = { url: 'https://example.test/Sonic%20(Japan).png' };

    await CoverService.cache(storage.asNode(), 'MegaDrive', 'Sonic', game);
    await CoverService.cache(storage.asNode(), 'MegaDrive', 'Sonic', game);

    expect([...storage.files.keys()]).toEqual(['.meta/MegaDrive/Sonic.case.png']);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('does not download again what is already stored', async () => {
    respondWith(1024);
    storage.put('.meta/MegaDrive/Sonic.USA.case.png', 'image');

    expect(await CoverService.cache(storage.asNode(), 'MegaDrive', 'Sonic', COVER)).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('reports a blocked download instead of failing the caller', async () => {
    // A host that sends no CORS header is the normal case, not an error.
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch'); }));

    expect(await CoverService.cache(storage.asNode(), 'MegaDrive', 'Sonic', COVER)).toBe(false);
    expect(storage.files.size).toBe(0);
  });

  it('refuses an image too large to be a boxart', async () => {
    respondWith(9 * 1024 * 1024);

    expect(await CoverService.cache(storage.asNode(), 'MegaDrive', 'Sonic', COVER)).toBe(false);
    expect(storage.files.size).toBe(0);
  });

  it('refuses an empty response', async () => {
    respondWith(0);

    expect(await CoverService.cache(storage.asNode(), 'MegaDrive', 'Sonic', COVER)).toBe(false);
    expect(storage.files.size).toBe(0);
  });
});

describe('CoverService.resolve', () => {
  it('shows the stored copy without touching the network', async () => {
    respondWith(1024);
    storage.put('.meta/MegaDrive/Sonic.USA.case.png', 'image');

    expect(await CoverService.resolve(storage.asNode(), 'MegaDrive', 'Sonic', COVER)).toEqual({
      url: 'blob:cover',
      stored: true,
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('shows the remote boxart right away and stores a copy behind it', async () => {
    respondWith(1024);

    expect(await CoverService.resolve(storage.asNode(), 'MegaDrive', 'Sonic', COVER)).toEqual({
      url: COVER.url,
      stored: false,
    });

    // The copy is made without the browsing waiting for it.
    await vi.waitFor(() => expect(storage.files.size).toBe(1));
  });

  it('has nothing to show for a game with no boxart anywhere', async () => {
    expect(
      await CoverService.resolve(storage.asNode(), 'MegaDrive', 'Sonic'),
    ).toBeUndefined();
  });
});
