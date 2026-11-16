import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryAdapter } from '@cloudauthn/vfs-sync';
import { makeUps } from '../helpers/patch.test-helper';
import { LibraryIndexService } from './LibraryIndexService';
import { ModService } from './ModService';
import { MIGRATION_MARKER, PlayGermadeMigration, type OldLibrary } from './PlayGermadeMigration';
import { RomIntakeService } from './RomIntakeService';
import { RomLibrary } from './RomLibraryService';
import { StorageNode } from './StorageService';
import type { LibraryIndex } from '../helpers/library-index';

const rom = Uint8Array.from({ length: 1024 }, (_, i) => i & 0xff);
const hacked = rom.slice();
hacked[10] = 0x99;
const sha = (c: string) => c.repeat(40);

/** play.germade's old folder, in memory. */
function oldLibrary(files: Record<string, Uint8Array | object>): OldLibrary {
  return {
    async read(system, path) {
      const value = files[`${system}/${path}`];
      if (value === undefined) return undefined;
      return value instanceof Uint8Array ? value : new TextEncoder().encode(JSON.stringify(value));
    },
  };
}

async function library(): Promise<StorageNode> {
  const node = new StorageNode();
  await node.attach(new MemoryAdapter('migration'), 'library', 'library');
  return node;
}

afterEach(() => vi.restoreAllMocks());

describe('PlayGermadeMigration', () => {
  it('moves ROMs, mods and renamed titles in, once', async () => {
    const node = await library();
    // No dataset in tests: nothing is identified, so everything takes the copy path.
    vi.spyOn(RomIntakeService, 'identify').mockResolvedValue([]);
    // The index of what was copied, as a match would write it.
    vi.spyOn(LibraryIndexService, 'refreshMany').mockImplementation(async (n, systems) => {
      for (const system of systems) {
        if (system !== 'MegaDrive') continue;
        const index: LibraryIndex = {
          version: 1,
          system,
          generatedAt: '2026-11-16T00:00:00.000Z',
          games: { 'old-towers': { title: 'Old Towers', versions: [{ path: 'MegaDrive/Mis Torres.bin', crc: '0F1D2A3B', regions: [], verified: false }], mods: [] } },
        };
        await n.createDirectory('.meta').catch(() => {});
        await n.createDirectory('.meta/MegaDrive').catch(() => {});
        await n.writeFile(`.meta/${system}/index.json`, new TextEncoder().encode(JSON.stringify(index)));
      }
    });
    const ups = makeUps(rom, hacked);
    const ips = new Uint8Array([...new TextEncoder().encode('PATCH'), 0, 0, 1, 0, 1, 7, ...new TextEncoder().encode('EOF')]);
    const old = oldLibrary({
      'megadrive/index.json': {
        games: {
          'old-towers': { title: 'Mis Torres', renamed: true, versions: [{ sha1: sha('a'), file: `${sha('a')}.bin`, crc32: 0x0f1d2a3b }] },
        },
        mods: {
          [sha('c')]: { name: 'Tower Hack', file: `${sha('c')}.ips`, gameId: 'old-towers' },
          [sha('d')]: { name: 'Delta', file: `${sha('d')}.ups`, gameId: null },
          [sha('e')]: { name: 'Gone', file: `${sha('e')}.ips`, gameId: null },
        },
      },
      [`megadrive/roms/${sha('a')}.bin`]: rom,
      [`megadrive/patches/${sha('c')}.ips`]: ips,
      [`megadrive/patches/${sha('d')}.ups`]: ups,
    });

    const report = await PlayGermadeMigration.run(node, old);
    expect(report).toMatchObject({ placed: 0, copied: 1, already: 0, missing: 1, renamed: 1, systems: ['MegaDrive'] });
    expect(await node.exists('MegaDrive/Mis Torres.bin')).toBe(true);
    expect((await new RomLibrary(node).read('MegaDrive/Mis Torres.bin'))?.title).toBe('Mis Torres');

    const mods = await ModService.list(node, 'MegaDrive');
    expect(mods.find((mod) => mod.name === 'Tower Hack')?.gameId).toBe('old-towers'); // by its game's CRC
    expect(mods.find((mod) => mod.name === 'Delta')?.gameId).toBeUndefined(); // its source is not here
    expect(await node.exists(MIGRATION_MARKER)).toBe(true);

    expect(await PlayGermadeMigration.run(node, old)).toBeUndefined();
  });

  it('does nothing (and writes no marker) when there is no old library', async () => {
    const node = await library();
    expect(await PlayGermadeMigration.run(node, oldLibrary({}))).toBeUndefined();
    expect(await node.exists(MIGRATION_MARKER)).toBe(false);
  });
});
