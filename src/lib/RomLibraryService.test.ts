import { beforeEach, describe, expect, it, vi } from 'vitest';
import { emptyRecord, RomLibrary } from './RomLibraryService';
import type { StorageEntry, StorageNode } from './StorageService';

/** An in-memory stand-in for the opened folder. */
class FakeStorage {
  readonly files = new Map<string, string>();

  put(path: string, content: unknown): void {
    this.files.set(path, typeof content === 'string' ? content : JSON.stringify(content));
  }

  async list(directory: string): Promise<StorageEntry[]> {
    const prefix = `${directory}/`;
    const entries = [...this.files.keys()]
      .filter((path) => path.startsWith(prefix) && !path.slice(prefix.length).includes('/'))
      .map((path) => ({
        name: path.slice(prefix.length),
        path,
        kind: 'file' as const,
      }));

    if (entries.length === 0) throw new Error(`No such directory: ${directory}`);
    return entries;
  }

  async readFile(path: string): Promise<Uint8Array> {
    const content = this.files.get(path);
    if (content === undefined) throw new Error(`No such file: ${path}`);
    return new TextEncoder().encode(content);
  }

  async writeFile(path: string, content: Uint8Array): Promise<void> {
    this.files.set(path, new TextDecoder().decode(content));
  }

  async remove(path: string): Promise<void> {
    if (!this.files.delete(path)) throw new Error(`No such file: ${path}`);
  }

  asNode(): StorageNode {
    return this as unknown as StorageNode;
  }
}

const NEW = '.meta/MegaDrive/Sonic.json';
const OLD = '.roms/MegaDrive/Sonic.json';
const ROM = 'MegaDrive/Sonic.md';

let storage: FakeStorage;
let library: RomLibrary;

beforeEach(() => {
  storage = new FakeStorage();
  library = new RomLibrary(storage.asNode());
});

describe('RomLibrary', () => {
  it('reads a record from the metadata folder', async () => {
    storage.put(NEW, { ...emptyRecord(), title: 'Sonic' });

    expect((await library.read(ROM))?.title).toBe('Sonic');
  });

  it('still reads a library written before the folder was renamed', async () => {
    storage.put(OLD, { ...emptyRecord(), title: 'From the old folder' });

    expect((await library.read(ROM))?.title).toBe('From the old folder');
  });

  it('prefers the current folder when a record exists in both', async () => {
    storage.put(OLD, { ...emptyRecord(), title: 'stale' });
    storage.put(NEW, { ...emptyRecord(), title: 'current' });

    expect((await library.read(ROM))?.title).toBe('current');
  });

  it('does not fall back to the old folder when the current record is damaged', async () => {
    // Falling back would quietly resurrect metadata the user has since edited.
    storage.put(OLD, { ...emptyRecord(), title: 'stale' });
    storage.put(NEW, 'not json');

    expect(await library.read(ROM)).toBeNull();
  });

  it('always writes to the current folder', async () => {
    storage.put(OLD, { ...emptyRecord(), title: 'from the old folder' });

    const record = (await library.read(ROM))!;
    await library.write(ROM, { ...record, title: 'edited' });

    expect(storage.files.has(NEW)).toBe(true);
    expect(JSON.parse(storage.files.get(NEW)!).title).toBe('edited');
  });

  it('deletes a record from both folders', async () => {
    // Leaving the old copy behind would bring the record back on the next read.
    storage.put(OLD, emptyRecord());
    storage.put(NEW, emptyRecord());

    await library.remove(ROM);

    expect(storage.files.has(NEW)).toBe(false);
    expect(storage.files.has(OLD)).toBe(false);
    expect(await library.read(ROM)).toBeNull();
  });

  it('deletes without complaining when only one folder has the record', async () => {
    storage.put(OLD, emptyRecord());

    await expect(library.remove(ROM)).resolves.toBeUndefined();
    expect(storage.files.has(OLD)).toBe(false);
  });

  it('lists the initialised games of both folders', async () => {
    storage.put('.roms/MegaDrive/Sonic.json', emptyRecord());
    storage.put('.meta/MegaDrive/Altered Beast.json', emptyRecord());
    storage.put('.meta/MegaDrive/cover.png', 'binary');

    expect(await library.initializedGames('MegaDrive')).toEqual(
      new Set(['Sonic', 'Altered Beast']),
    );
  });

  it('reports no initialised games for a system nobody has edited', async () => {
    expect(await library.initializedGames('SNES')).toEqual(new Set());
  });

  it('finds a cover left in the old folder', async () => {
    vi.stubGlobal('URL', { createObjectURL: () => 'blob:cover' });
    storage.put('.roms/MegaDrive/Sonic.cover.png', 'image bytes');

    expect(await library.coverUrl(ROM, 'Sonic.cover.png')).toBe('blob:cover');

    vi.unstubAllGlobals();
  });
});
