import { describe, expect, it } from 'vitest';
import { MemoryAdapter } from '@cloudauthn/vfs-sync';
import { LIBRARY_ORIGIN_ID, LIBRARY_PATH, StorageNode, canOpenFolders } from './StorageService';

const bytes = (text: string) => new TextEncoder().encode(text);
const text = (data: Uint8Array) => new TextDecoder().decode(data);

async function node(name: string, kind: 'library' | 'folder' = 'folder'): Promise<StorageNode> {
  const storage = new StorageNode();
  await storage.attach(new MemoryAdapter(name), kind, name);
  return storage;
}

describe('the library', () => {
  it('lives in its own OPFS folder, under one fixed origin id', () => {
    expect(LIBRARY_PATH).toBe('rom-manager/library');
    expect(LIBRARY_ORIGIN_ID).toBe('library');
  });

  it('knows its kind, and has no folder handle to remember', async () => {
    const library = await node('library', 'library');
    expect(library.kind).toBe('library');
    expect(library.getHandle()).toBeNull();
  });

  it('cannot open real folders where the browser has no picker (phones, Node)', () => {
    expect(canOpenFolders()).toBe(false);
  });
});

describe('syncing the library with a folder', () => {
  it('copies each side to the other', async () => {
    const library = await node('library', 'library');
    const folder = await node('folder');
    await library.writeFile('GBA/Kirby.gba', bytes('kirby'));
    await folder.writeFile('MegaDrive/Sonic.md', bytes('sonic'));

    const result = await library.syncWith(folder);

    expect(result.changed).toBe(true);
    expect(result.transferred).toEqual({ toA: 1, toB: 1 });
    expect(text(await library.readFile('MegaDrive/Sonic.md'))).toBe('sonic');
    expect(text(await folder.readFile('GBA/Kirby.gba'))).toBe('kirby');
  });

  it('is quiet when both sides already match', async () => {
    const library = await node('library', 'library');
    const folder = await node('folder');
    await library.writeFile('GB/Tetris.gb', bytes('tetris'));
    await library.syncWith(folder);

    const again = await library.syncWith(folder);
    expect(again.changed).toBe(false);
  });

  it('keeps both versions of a file changed on both sides', async () => {
    const library = await node('library', 'library');
    const folder = await node('folder');
    await library.writeFile('SNES/notes.txt', bytes('base'));
    await library.syncWith(folder);

    await library.writeFile('SNES/notes.txt', bytes('from the library'));
    await folder.writeFile('SNES/notes.txt', bytes('from the folder'));
    const { conflicts } = await library.syncWith(folder);

    expect(conflicts.length).toBe(1);
    const names = (await library.list('SNES')).map((entry) => entry.name);
    expect(names.length).toBe(2);
    expect(names).toContain('notes.txt');
  });
});
