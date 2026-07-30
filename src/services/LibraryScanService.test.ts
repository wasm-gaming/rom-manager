import { beforeEach, describe, expect, it } from 'vitest';
import { calculateCRC32 } from './ChecksumService';
import { scanCachePathOf, scanSystem, type SystemMedia } from './LibraryScanService';
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

  /** Direct children of a folder, with subfolders inferred from the paths. */
  async list(directory: string): Promise<StorageEntry[]> {
    const prefix = `${directory}/`;
    const entries = new Map<string, StorageEntry>();

    for (const path of this.files.keys()) {
      if (!path.startsWith(prefix)) continue;

      const rest = path.slice(prefix.length);
      const slash = rest.indexOf('/');
      const name = slash === -1 ? rest : rest.slice(0, slash);

      entries.set(name, {
        name,
        path: `${prefix}${name}`,
        kind: slash === -1 ? 'file' : 'directory',
      });
    }

    if (entries.size === 0) throw new Error(`No such directory: ${directory}`);
    return [...entries.values()];
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

  async exists(path: string): Promise<boolean> {
    return this.files.has(path);
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

function scan(system = 'MegaDrive', media: SystemMedia = 'cartridge') {
  return scanSystem(storage.asNode(), system, media);
}

beforeEach(() => {
  storage = new FakeStorage();
  storage.put('MegaDrive/sonic.md', 'sonic rom');
  storage.put('MegaDrive/altered.md', 'altered beast rom');
});

describe('scanSystem', () => {
  it('hashes every ROM the first time and writes the cache', async () => {
    const files = await scan();

    expect(files).toHaveLength(2);
    expect(storage.reads).toBe(2);
    expect(storage.writes).toContain(CACHE);
    expect(files[0].crc32).toBe(await calculateCRC32(new TextEncoder().encode('sonic rom').buffer));
  });

  it('reuses the cached checksum instead of reading the file again', async () => {
    await scan();
    storage.reads = 0;

    const files = await scan();

    expect(storage.reads).toBe(0);
    expect(files).toHaveLength(2);
  });

  it('rehashes a file whose modification time moved', async () => {
    await scan();
    storage.reads = 0;
    storage.put('MegaDrive/sonic.md', 'sonic rom', 2);

    await scan();

    expect(storage.reads).toBe(1);
  });

  it('rehashes a file whose size changed even at the same timestamp', async () => {
    await scan();
    storage.reads = 0;
    storage.put('MegaDrive/sonic.md', 'a different sonic rom', 1);

    const files = await scan();

    expect(storage.reads).toBe(1);
    expect(files.find((file) => file.path === 'MegaDrive/sonic.md')!.crc32).toBe(
      await calculateCRC32(new TextEncoder().encode('a different sonic rom').buffer),
    );
  });

  it('does not rewrite a cache that nothing changed', async () => {
    await scan();
    storage.writes = [];

    await scan();

    expect(storage.writes).toEqual([]);
  });

  it('rebuilds a cache left by an older version', async () => {
    storage.put(CACHE, JSON.stringify({ version: 0, entries: {} }));

    await scan();

    expect(storage.reads).toBe(2);
  });

  it('rebuilds a cache that is not valid JSON', async () => {
    // The file sits in a folder the user can edit, so it is untrusted input.
    storage.put(CACHE, 'not json at all');

    const files = await scan();

    expect(files).toHaveLength(2);
    expect(storage.reads).toBe(2);
  });

  it('drops the damaged entries of a cache and keeps the sound ones', async () => {
    await scan();

    const cache = JSON.parse(new TextDecoder().decode(storage.files.get(CACHE)!.content));
    cache.entries['MegaDrive/sonic.md'].crc32 = 'nonsense';
    storage.put(CACHE, JSON.stringify(cache));
    storage.reads = 0;

    await scan();

    expect(storage.reads).toBe(1);
  });

  it('forgets the files that are no longer there', async () => {
    await scan();
    storage.files.delete('MegaDrive/altered.md');

    const files = await scan();
    const cache = JSON.parse(new TextDecoder().decode(storage.files.get(CACHE)!.content));

    expect(files).toHaveLength(1);
    expect(Object.keys(cache.entries)).toEqual(['MegaDrive/sonic.md']);
  });

  it('reports progress and says whether it had to hash', async () => {
    const progress: Array<{ done: number; hashed: boolean }> = [];
    const record = (update: { done: number; hashed: boolean }) =>
      progress.push({ done: update.done, hashed: update.hashed });

    await scanSystem(storage.asNode(), 'MegaDrive', 'cartridge', record);
    const first = [...progress];
    progress.length = 0;

    await scanSystem(storage.asNode(), 'MegaDrive', 'cartridge', record);

    expect(first).toEqual([
      { done: 1, hashed: true },
      { done: 2, hashed: true },
    ]);
    expect(progress.every((update) => !update.hashed)).toBe(true);
  });

  it('reports nothing for a system the library has no folder for', async () => {
    expect(await scan('SNES')).toEqual([]);
  });
});

describe('scanSystem and collections', () => {
  it('leaves any subfolder of a cartridge system alone', async () => {
    // There, ROMs live loose at the root, so a subfolder is a collection the
    // user curates by hand and the app never touches.
    storage.put('MegaDrive/Favoritos/sonic.md', 'a copy');

    const files = await scan();

    expect(files.map((file) => file.path)).toEqual(['MegaDrive/sonic.md', 'MegaDrive/altered.md']);
  });

  it('descends into a disc game folder, which its marker identifies', async () => {
    storage.put('PSX/Final Fantasy VII/game.json', '{}');
    storage.put('PSX/Final Fantasy VII/USA/disc1.bin', 'disc one');
    storage.put('PSX/Final Fantasy VII/USA/disc1.cue', 'cue sheet');

    const files = await scan('PSX', 'disc');

    expect(files.map((file) => file.path).sort()).toEqual([
      'PSX/Final Fantasy VII/USA/disc1.bin',
      'PSX/Final Fantasy VII/USA/disc1.cue',
    ]);
  });

  it('leaves a disc folder without the marker alone', async () => {
    // Game folders and collections sit side by side at the root of a disc
    // system, so the marker is the only thing that separates them.
    storage.put('PSX/Mi coleccion/whatever.bin', 'not ours');

    expect(await scan('PSX', 'disc')).toEqual([]);
  });

  it('does not hash the marker file itself', async () => {
    storage.put('PSX/Wipeout/game.json', '{}');
    storage.put('PSX/Wipeout/USA/wipeout.bin', 'a disc');

    const files = await scan('PSX', 'disc');

    expect(files.map((file) => file.path)).toEqual(['PSX/Wipeout/USA/wipeout.bin']);
  });

  it('still picks up a loose image at the root of a disc system', async () => {
    // An image that has not been organised into its folder yet has to be
    // recognised, or it could never be organised.
    storage.put('PSX/unsorted.bin', 'a stray disc');

    expect((await scan('PSX', 'disc')).map((file) => file.path)).toEqual(['PSX/unsorted.bin']);
  });
});
