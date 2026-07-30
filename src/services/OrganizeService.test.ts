import { beforeEach, describe, expect, it } from 'vitest';
import type { OrganizePlan } from '../core/rom-organize';
import { OrganizeService, UNDO_DIR, type UndoRecord } from './OrganizeService';
import { scanCachePathOf } from './LibraryScanService';
import type { StorageEntry, StorageNode } from './StorageService';

/** An in-memory stand-in for the opened folder. */
class FakeStorage {
  readonly files = new Map<string, string>();
  readonly directories = new Set<string>();

  put(path: string, content = 'rom'): void {
    this.files.set(path, content);
  }

  async list(directory: string): Promise<StorageEntry[]> {
    const prefix = `${directory}/`;
    const entries = [...this.files.keys()]
      .filter((path) => path.startsWith(prefix) && !path.slice(prefix.length).includes('/'))
      .map((path) => ({ name: path.slice(prefix.length), path, kind: 'file' as const }));

    if (entries.length === 0) throw new Error(`No such directory: ${directory}`);
    return entries;
  }

  async exists(path: string): Promise<boolean> {
    return this.files.has(path);
  }

  async readFile(path: string): Promise<Uint8Array> {
    const content = this.files.get(path);
    if (content === undefined) throw new Error(`No such file: ${path}`);
    return new TextEncoder().encode(content);
  }

  async writeFile(path: string, content: Uint8Array): Promise<void> {
    this.files.set(path, new TextDecoder().decode(content));
  }

  async createDirectory(path: string): Promise<void> {
    this.directories.add(path);
  }

  async remove(path: string): Promise<void> {
    if (!this.files.delete(path)) throw new Error(`No such file: ${path}`);
  }

  async move(from: string, to: string): Promise<void> {
    const content = this.files.get(from);
    if (content === undefined) throw new Error(`No such file: ${from}`);
    this.files.delete(from);
    this.files.set(to, content);
  }

  asNode(): StorageNode {
    return this as unknown as StorageNode;
  }
}

function plan(overrides: Partial<OrganizePlan> = {}): OrganizePlan {
  return { moves: [], markers: [], conflicts: [], settled: 0, ...overrides };
}

function logOf(storage: FakeStorage): UndoRecord {
  const path = [...storage.files.keys()].find((key) => key.startsWith(`${UNDO_DIR}/`));
  if (!path) throw new Error('No undo log written');
  return JSON.parse(storage.files.get(path)!) as UndoRecord;
}

let storage: FakeStorage;

beforeEach(() => {
  storage = new FakeStorage();
});

describe('OrganizeService.apply', () => {
  it('moves the files the plan asks for', async () => {
    storage.put('MegaDrive/sonic.md');

    await OrganizeService.apply(
      storage.asNode(),
      'MegaDrive',
      plan({ moves: [{ from: 'MegaDrive/sonic.md', to: 'MegaDrive/Sonic.USA.md' }] }),
    );

    expect(storage.files.has('MegaDrive/sonic.md')).toBe(false);
    expect(storage.files.has('MegaDrive/Sonic.USA.md')).toBe(true);
  });

  it('takes the metadata along so notes are not orphaned', async () => {
    storage.put('MegaDrive/sonic.md');
    storage.put('.meta/MegaDrive/sonic.json', '{"title":"Sonic"}');

    await OrganizeService.apply(
      storage.asNode(),
      'MegaDrive',
      plan({ moves: [{ from: 'MegaDrive/sonic.md', to: 'MegaDrive/Sonic.USA.md' }] }),
    );

    expect(storage.files.has('.meta/MegaDrive/sonic.json')).toBe(false);
    expect(storage.files.get('.meta/MegaDrive/Sonic.USA.json')).toBe('{"title":"Sonic"}');
  });

  it('writes the log before moving anything', async () => {
    storage.put('MegaDrive/sonic.md');
    const seen: string[] = [];
    const node = storage.asNode();
    const move = node.move.bind(node);
    node.move = async (from: string, to: string) => {
      seen.push(...storage.files.keys());
      return move(from, to);
    };

    await OrganizeService.apply(
      node,
      'MegaDrive',
      plan({ moves: [{ from: 'MegaDrive/sonic.md', to: 'MegaDrive/Sonic.USA.md' }] }),
    );

    expect(seen.some((path) => path.startsWith(UNDO_DIR))).toBe(true);
  });

  it('drops the scan cache, whose paths the move just invalidated', async () => {
    storage.put('MegaDrive/sonic.md');
    storage.put(scanCachePathOf('MegaDrive'), '{}');

    await OrganizeService.apply(
      storage.asNode(),
      'MegaDrive',
      plan({ moves: [{ from: 'MegaDrive/sonic.md', to: 'MegaDrive/Sonic.USA.md' }] }),
    );

    expect(storage.files.has(scanCachePathOf('MegaDrive'))).toBe(false);
  });

  it('writes a game marker for a disc game', async () => {
    await OrganizeService.apply(
      storage.asNode(),
      'PSX',
      plan({
        markers: [{ path: 'PSX/Tekken/game.json', gameId: 'Tekken', title: 'Tekken', system: 'PSX' }],
      }),
    );

    expect(JSON.parse(storage.files.get('PSX/Tekken/game.json')!)).toEqual({
      gameId: 'Tekken',
      title: 'Tekken',
      system: 'PSX',
    });
    expect(logOf(storage).markers).toEqual(['PSX/Tekken/game.json']);
  });

  it('leaves a marker that already exists untouched', async () => {
    storage.put('PSX/Tekken/game.json', '{"title":"edited by hand"}');

    await OrganizeService.apply(
      storage.asNode(),
      'PSX',
      plan({
        markers: [{ path: 'PSX/Tekken/game.json', gameId: 'Tekken', title: 'Tekken', system: 'PSX' }],
      }),
    );

    expect(storage.files.get('PSX/Tekken/game.json')).toBe('{"title":"edited by hand"}');
    expect(logOf(storage).markers).toEqual([]);
  });

  it('reports progress over moves and markers together', async () => {
    storage.put('PSX/a.bin');
    const seen: Array<[number, number]> = [];

    await OrganizeService.apply(
      storage.asNode(),
      'PSX',
      plan({
        moves: [{ from: 'PSX/a.bin', to: 'PSX/Tekken/USA/a.bin' }],
        markers: [{ path: 'PSX/Tekken/game.json', gameId: 'Tekken', title: 'Tekken', system: 'PSX' }],
      }),
      (done, total) => seen.push([done, total]),
    );

    expect(seen.at(-1)).toEqual([2, 2]);
  });
});

describe('OrganizeService.undo', () => {
  it('puts the files back where they were', async () => {
    storage.put('MegaDrive/sonic.md');
    const node = storage.asNode();
    const record = await OrganizeService.apply(
      node,
      'MegaDrive',
      plan({ moves: [{ from: 'MegaDrive/sonic.md', to: 'MegaDrive/Sonic.USA.md' }] }),
    );

    await OrganizeService.undo(node, record);

    expect(storage.files.has('MegaDrive/sonic.md')).toBe(true);
    expect(storage.files.has('MegaDrive/Sonic.USA.md')).toBe(false);
  });

  it('removes the markers it created', async () => {
    const node = storage.asNode();
    const record = await OrganizeService.apply(
      node,
      'PSX',
      plan({
        markers: [{ path: 'PSX/Tekken/game.json', gameId: 'Tekken', title: 'Tekken', system: 'PSX' }],
      }),
    );

    await OrganizeService.undo(node, record);

    expect(storage.files.has('PSX/Tekken/game.json')).toBe(false);
  });

  it('undoes what it still can when a file was moved away by hand', async () => {
    storage.put('MegaDrive/a.md');
    storage.put('MegaDrive/b.md');
    const node = storage.asNode();
    const record = await OrganizeService.apply(
      node,
      'MegaDrive',
      plan({
        moves: [
          { from: 'MegaDrive/a.md', to: 'MegaDrive/A.USA.md' },
          { from: 'MegaDrive/b.md', to: 'MegaDrive/B.USA.md' },
        ],
      }),
    );

    storage.files.delete('MegaDrive/A.USA.md');
    await OrganizeService.undo(node, record);

    expect(storage.files.has('MegaDrive/a.md')).toBe(false);
    expect(storage.files.has('MegaDrive/b.md')).toBe(true);
  });

  it('forgets the log once the run is undone', async () => {
    storage.put('MegaDrive/sonic.md');
    const node = storage.asNode();
    const record = await OrganizeService.apply(
      node,
      'MegaDrive',
      plan({ moves: [{ from: 'MegaDrive/sonic.md', to: 'MegaDrive/Sonic.USA.md' }] }),
    );

    await OrganizeService.undo(node, record);

    expect(await OrganizeService.list(node)).toEqual([]);
  });
});

describe('OrganizeService.list', () => {
  it('has nothing to offer before anything was organized', async () => {
    expect(await OrganizeService.list(storage.asNode())).toEqual([]);
  });

  it('offers the newest run first', async () => {
    const node = storage.asNode();
    storage.put(`${UNDO_DIR}/2026-01-01.json`, JSON.stringify({ version: 1, id: '2026-01-01', system: 'A', moves: [], markers: [] }));
    storage.put(`${UNDO_DIR}/2026-06-01.json`, JSON.stringify({ version: 1, id: '2026-06-01', system: 'B', moves: [], markers: [] }));

    expect((await OrganizeService.list(node)).map((entry) => entry.system)).toEqual(['B', 'A']);
  });

  it('skips a damaged log instead of giving up', async () => {
    const node = storage.asNode();
    storage.put(`${UNDO_DIR}/bad.json`, 'not json');
    storage.put(`${UNDO_DIR}/good.json`, JSON.stringify({ version: 1, id: 'good', system: 'A', moves: [], markers: [] }));

    expect((await OrganizeService.list(node)).map((entry) => entry.id)).toEqual(['good']);
  });
});
