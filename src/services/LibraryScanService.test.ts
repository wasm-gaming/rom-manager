import { beforeEach, describe, expect, it } from 'vitest';
import { calculateCRC32 } from './ChecksumService';
import { scanCachePathOf, scanSystem } from './LibraryScanService';
import type { StorageEntry, StorageNode, StorageStat } from './StorageService';

interface FakeFile {
  content: Uint8Array;
  mtime: number;
}

/**
 * An in-memory stand-in for the opened folder, counting how many files it was
 * actually made to read: the whole point of the cache is that this stays low.
 */
class FakeStorage {
  readonly files = new Map<string, FakeFile>();
  reads = 0;
  writes: string[] = [];

  put(path: string, content: string, mtime = 1): void {
    this.files.set(path, { content: new TextEncoder().encode(content), mtime });
  }

  async *walkFiles(prefix: string): AsyncGenerator<StorageEntry> {
    for (const path of this.files.keys()) {
      if (!path.startsWith(`${prefix}/`)) continue;
      yield { name: path.slice(path.lastIndexOf('/') + 1), path, kind: 'file' };
    }
  }

  async stat(path: string): Promise<StorageStat | null> {
    const file = this.files.get(path);
    return file ? { kind: 'file', size: file.content.length, mtime: file.mtime } : null;
  }

  async readFile(path: string): Promise<Uint8Array> {
    const file = this.files.get(path);
    if (!file) throw new Error(`No such file: ${path}`);
    return file.content;
  }

  async readStream(path: string): Promise<ReadableStream<Uint8Array>> {
    const content = await this.readFile(path);
    this.reads += 1;

    return new ReadableStream({
      start(controller) {
        controller.enqueue(content);
        controller.close();
      },
    });
  }

  async writeFile(path: string, content: Uint8Array): Promise<void> {
    this.writes.push(path);
    this.files.set(path, { content, mtime: 1 });
  }

  async createDirectory(): Promise<void> {}

  asNode(): StorageNode {
    return this as unknown as StorageNode;
  }
}

const CACHE = scanCachePathOf('MegaDrive');

let storage: FakeStorage;

beforeEach(() => {
  storage = new FakeStorage();
  storage.put('MegaDrive/sonic.md', 'sonic rom');
  storage.put('MegaDrive/altered.md', 'altered beast rom');
});

describe('scanSystem', () => {
  it('hashes every ROM the first time and writes the cache', async () => {
    const files = await scanSystem(storage.asNode(), 'MegaDrive');

    expect(files).toHaveLength(2);
    expect(storage.reads).toBe(2);
    expect(storage.writes).toContain(CACHE);
    expect(files[0].crc32).toBe(await calculateCRC32(new TextEncoder().encode('sonic rom').buffer));
  });

  it('reuses the cached checksum instead of reading the file again', async () => {
    await scanSystem(storage.asNode(), 'MegaDrive');
    storage.reads = 0;

    const files = await scanSystem(storage.asNode(), 'MegaDrive');

    expect(storage.reads).toBe(0);
    expect(files).toHaveLength(2);
  });

  it('rehashes a file whose modification time moved', async () => {
    await scanSystem(storage.asNode(), 'MegaDrive');
    storage.reads = 0;
    storage.put('MegaDrive/sonic.md', 'sonic rom', 2);

    await scanSystem(storage.asNode(), 'MegaDrive');

    expect(storage.reads).toBe(1);
  });

  it('rehashes a file whose size changed even at the same timestamp', async () => {
    await scanSystem(storage.asNode(), 'MegaDrive');
    storage.reads = 0;
    storage.put('MegaDrive/sonic.md', 'a different sonic rom', 1);

    const files = await scanSystem(storage.asNode(), 'MegaDrive');

    expect(storage.reads).toBe(1);
    expect(files.find((f) => f.path === 'MegaDrive/sonic.md')!.crc32).toBe(
      await calculateCRC32(new TextEncoder().encode('a different sonic rom').buffer),
    );
  });

  it('does not rewrite a cache that nothing changed', async () => {
    await scanSystem(storage.asNode(), 'MegaDrive');
    storage.writes = [];

    await scanSystem(storage.asNode(), 'MegaDrive');

    expect(storage.writes).toEqual([]);
  });

  it('rebuilds a cache left by an older version', async () => {
    storage.put(CACHE, JSON.stringify({ version: 0, entries: {} }));

    await scanSystem(storage.asNode(), 'MegaDrive');

    expect(storage.reads).toBe(2);
  });

  it('rebuilds a cache that is not valid JSON', async () => {
    // The file sits in a folder the user can edit, so it is untrusted input.
    storage.put(CACHE, 'not json at all');

    const files = await scanSystem(storage.asNode(), 'MegaDrive');

    expect(files).toHaveLength(2);
    expect(storage.reads).toBe(2);
  });

  it('drops the damaged entries of a cache and keeps the sound ones', async () => {
    await scanSystem(storage.asNode(), 'MegaDrive');

    const cache = JSON.parse(new TextDecoder().decode(storage.files.get(CACHE)!.content));
    cache.entries['MegaDrive/sonic.md'].crc32 = 'nonsense';
    storage.put(CACHE, JSON.stringify(cache));
    storage.reads = 0;

    await scanSystem(storage.asNode(), 'MegaDrive');

    expect(storage.reads).toBe(1);
  });

  it('forgets the files that are no longer there', async () => {
    await scanSystem(storage.asNode(), 'MegaDrive');
    storage.files.delete('MegaDrive/altered.md');

    const files = await scanSystem(storage.asNode(), 'MegaDrive');
    const cache = JSON.parse(new TextDecoder().decode(storage.files.get(CACHE)!.content));

    expect(files).toHaveLength(1);
    expect(Object.keys(cache.entries)).toEqual(['MegaDrive/sonic.md']);
  });

  it('reports progress and says whether it had to hash', async () => {
    const progress: Array<{ done: number; hashed: boolean }> = [];

    await scanSystem(storage.asNode(), 'MegaDrive', (p) =>
      progress.push({ done: p.done, hashed: p.hashed }),
    );
    const first = [...progress];
    progress.length = 0;

    await scanSystem(storage.asNode(), 'MegaDrive', (p) =>
      progress.push({ done: p.done, hashed: p.hashed }),
    );

    expect(first).toEqual([
      { done: 1, hashed: true },
      { done: 2, hashed: true },
    ]);
    expect(progress.every((p) => !p.hashed)).toBe(true);
  });
});
