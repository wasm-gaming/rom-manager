import { beforeAll, describe, expect, it, vi } from 'vitest';
import { MemoryAdapter } from '@cloudauthn/vfs-sync';
import { crc32, crcHex } from '../helpers/patch';
import { makeUps } from '../helpers/patch.test-helper';
import { LibraryIndexService } from './LibraryIndexService';
import { RomIntakeService } from './RomIntakeService';
import { StorageNode, storageService } from './StorageService';
import * as sdk from './roms-sdk';

const rom = Uint8Array.from({ length: 512 }, (_, i) => (i * 7) & 0xff);
const hacked = rom.slice();
hacked[5] = 0xaa;
const file = (name: string, bytes: Uint8Array) => new File([bytes as BlobPart], name);

beforeAll(() => {
  // The library in memory instead of OPFS.
  vi.spyOn(storageService, 'createNodeInstance').mockImplementation(() => {
    const node = new StorageNode();
    node.initializeLibrary = () => node.attach(new MemoryAdapter('sdk'), 'library', 'library');
    return node;
  });
  // No datasets in unit tests: nothing is identified by DAT.
  vi.spyOn(RomIntakeService, 'identify').mockResolvedValue([]);
  // The index as a match would write it, for whatever is in MegaDrive/.
  vi.spyOn(LibraryIndexService, 'refreshMany').mockImplementation(async (node, systems) => {
    for (const system of systems) {
      const versions = [];
      for (const entry of await node.list(system).catch(() => [])) {
        const bytes = await node.readFile(entry.path);
        versions.push({ path: entry.path, crc: crcHex(crc32(bytes)), regions: [], verified: false });
      }
      await node.createDirectory('.meta').catch(() => {});
      await node.createDirectory(`.meta/${system}`).catch(() => {});
      const index = { version: 1, system, generatedAt: '2026-11-16T00:00:00.000Z', games: { homebrew: { title: 'Homebrew', versions, mods: [] } } };
      await node.writeFile(`.meta/${system}/index.json`, new TextEncoder().encode(JSON.stringify(index)));
    }
  });
});

describe('roms-sdk', () => {
  it('has a versioned API', () => {
    expect(sdk.API_VERSION).toBe(1);
  });

  it('adds a ROM no DAT knows to the system given, then its mod, and reads it back patched', async () => {
    const result = await sdk.addFiles([file('Homebrew.bin', rom), file('Hack.ups', makeUps(rom, hacked))], { system: 'MegaDrive' });
    expect(result.added).toEqual(['MegaDrive/Homebrew.bin']);
    expect(result.mods.added).toEqual([{ name: 'Hack', system: 'MegaDrive', gameId: 'homebrew' }]);
    expect(result.systems).toEqual(['MegaDrive']);

    const index = await sdk.readIndex('MegaDrive');
    const mod = index!.games.homebrew.mods[0];
    expect(mod).toMatchObject({ name: 'Hack', fits: crcHex(crc32(rom)) });
    const { rom: patched, crc } = await sdk.readRomWithMod('MegaDrive/Homebrew.bin', mod.path);
    expect(patched).toEqual(hacked);
    expect(crc).toBe(crcHex(crc32(hacked)));
    expect((await sdk.readIndexes()).map((i) => i.system)).toEqual(['MegaDrive']);
  });

  it('says what it did not take', async () => {
    const again = await sdk.addFiles([file('Homebrew.bin', rom)], { system: 'MegaDrive' });
    expect(again.already).toEqual(['Homebrew.bin']);
    const nowhere = await sdk.addFiles([file('Mystery.bin', rom)]);
    expect(nowhere.refused).toEqual([{ name: 'Mystery.bin', reason: 'unknown' }]);
    const bySystem = await sdk.addFiles([file('Other.gb', hacked)], { system: (name) => (name.endsWith('.gb') ? 'GAMEBOY' : undefined) });
    expect(bySystem.added).toEqual(['GAMEBOY/Other.gb']);
  });

  it('a mod that does not apply throws a PatchError with its code', async () => {
    const index = await sdk.readIndex('MegaDrive');
    await expect(sdk.readRomWithMod('GAMEBOY/Other.gb', index!.games.homebrew.mods[0].path)).rejects.toMatchObject({ code: 'wrong-source' });
  });

  it('removes a mod and a version', async () => {
    const index = await sdk.readIndex('MegaDrive');
    await sdk.removeMod('MegaDrive', index!.games.homebrew.mods[0].sha1);
    expect((await sdk.readIndex('MegaDrive'))!.games.homebrew.mods).toEqual([]);
    vi.spyOn(LibraryIndexService, 'refresh').mockResolvedValue(undefined);
    await sdk.removeVersion('MegaDrive/Homebrew.bin');
    await expect(sdk.readFile('MegaDrive/Homebrew.bin')).rejects.toThrow();
  });

  it('knows whether the migration ran', async () => {
    expect(await sdk.migrated()).toBe(false);
  });
});
