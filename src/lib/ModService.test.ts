import { describe, expect, it } from 'vitest';
import { MemoryAdapter } from '@cloudauthn/vfs-sync';
import { LIBRARY_INDEX_VERSION, type LibraryIndex } from '../helpers/library-index';
import { bytes, makeUps } from '../helpers/patch.test-helper';
import { crc32, crcHex } from '../helpers/patch';
import { indexPathOf, LibraryIndexService, modsRegistryPathOf } from './LibraryIndexService';
import { ModService, modsDirOf } from './ModService';
import { StorageNode } from './StorageService';

const rom = Uint8Array.from({ length: 64 }, (_, i) => i);
const hacked = (() => {
  const target = rom.slice();
  target[3] = 0xee;
  return target;
})();

async function library(): Promise<StorageNode> {
  const node = new StorageNode();
  await node.attach(new MemoryAdapter('mods'), 'library', 'library');
  const index: LibraryIndex = {
    version: LIBRARY_INDEX_VERSION,
    system: 'MegaDrive',
    generatedAt: '2026-11-16T00:00:00.000Z',
    games: {
      'sonic-the-hedgehog-2': {
        title: 'Sonic The Hedgehog 2',
        versions: [{ path: 'MegaDrive/Sonic The Hedgehog 2.md', crc: crcHex(crc32(rom)), regions: [], verified: true }],
        mods: [],
      },
    },
  };
  await node.createDirectory('.meta');
  await node.createDirectory('.meta/MegaDrive');
  await node.writeFile(indexPathOf('MegaDrive'), new TextEncoder().encode(JSON.stringify(index)));
  return node;
}

const file = (name: string, content: Uint8Array) => new File([content as BlobPart], name);

describe('ModService', () => {
  it('a UPS finds its game by source CRC; the index lists it as fitting', async () => {
    const node = await library();
    const result = await ModService.import(node, [file('Sonic 2 Hack.ups', makeUps(rom, hacked))]);
    expect(result.added).toEqual([{ name: 'Sonic 2 Hack', system: 'MegaDrive', gameId: 'sonic-the-hedgehog-2' }]);
    const [mod] = await ModService.list(node, 'MegaDrive');
    expect(mod).toMatchObject({ format: 'ups', sourceCrc: crcHex(crc32(rom)), targetCrc: crcHex(crc32(hacked)), gameId: 'sonic-the-hedgehog-2' });
    expect(await node.exists(`${modsDirOf('MegaDrive')}/${mod.file}`)).toBe(true);
    const index = await LibraryIndexService.read(node, 'MegaDrive');
    expect(index?.games['sonic-the-hedgehog-2'].mods).toEqual([
      expect.objectContaining({ name: 'Sonic 2 Hack', fits: crcHex(crc32(rom)), path: `.meta/MegaDrive/mods/${mod.file}` }),
    ]);
  });

  it('an IPS goes to the game on screen, else stays unassigned in the system on screen, else is refused', async () => {
    const node = await library();
    const ips = (n: number) => bytes('PATCH', [0, 0, 1], [0, 1], [n], 'EOF');
    const toGame = await ModService.import(node, [file('a.ips', ips(1))], { system: 'MegaDrive', gameId: 'sonic-the-hedgehog-2' });
    expect(toGame.added[0].gameId).toBe('sonic-the-hedgehog-2');
    const loose = await ModService.import(node, [file('b.ips', ips(2))], { system: 'MegaDrive' });
    expect(loose.added[0]).toEqual({ name: 'b', system: 'MegaDrive' });
    const nowhere = await ModService.import(node, [file('c.ips', ips(3))]);
    expect(nowhere.rejected).toEqual([{ name: 'c.ips', reason: 'no-system' }]);
    const again = await ModService.import(node, [file('a copy.ips', ips(1))], { system: 'MegaDrive' });
    expect(again.duplicates).toEqual(['a copy.ips']);
  });

  it('refuses what is not a patch, and a damaged one', async () => {
    const node = await library();
    const damaged = makeUps(rom, hacked);
    damaged[6] ^= 1;
    const result = await ModService.import(node, [file('x.ups', bytes('hello world, not a patch')), file('y.ups', damaged)], { system: 'MegaDrive' });
    expect(result.rejected).toEqual([
      { name: 'x.ups', reason: 'not-a-patch' },
      { name: 'y.ups', reason: 'damaged' },
    ]);
    expect(await node.exists(modsRegistryPathOf('MegaDrive'))).toBe(false);
  });

  it('renames, unassigns, reassigns and removes', async () => {
    const node = await library();
    await ModService.import(node, [file('Hack.ups', makeUps(rom, hacked))]);
    const [mod] = await ModService.list(node, 'MegaDrive');
    await ModService.update(node, 'MegaDrive', mod.sha1, { name: '  Better name ' });
    expect((await ModService.list(node, 'MegaDrive'))[0].name).toBe('Better name');
    await ModService.update(node, 'MegaDrive', mod.sha1, { gameId: undefined });
    expect((await ModService.list(node, 'MegaDrive'))[0].gameId).toBeUndefined();
    expect((await LibraryIndexService.read(node, 'MegaDrive'))?.games['sonic-the-hedgehog-2'].mods).toEqual([]);
    await ModService.update(node, 'MegaDrive', mod.sha1, { gameId: 'sonic-the-hedgehog-2' });
    expect((await LibraryIndexService.read(node, 'MegaDrive'))?.games['sonic-the-hedgehog-2'].mods).toHaveLength(1);
    await ModService.remove(node, 'MegaDrive', mod.sha1);
    expect(await ModService.list(node, 'MegaDrive')).toEqual([]);
    expect(await node.exists(`${modsDirOf('MegaDrive')}/${mod.file}`)).toBe(false);
  });

  it('drops registry entries that do not look right', async () => {
    const node = await library();
    await node.writeFile(
      modsRegistryPathOf('MegaDrive'),
      new TextEncoder().encode(JSON.stringify({ version: 1, mods: [{ sha1: 'nope' }, { sha1: 'a'.repeat(40), format: 'ips', file: '../../evil' }] })),
    );
    expect(await ModService.list(node, 'MegaDrive')).toEqual([]);
  });
});
