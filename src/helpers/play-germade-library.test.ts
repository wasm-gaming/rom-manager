import { describe, expect, it } from 'vitest';
import { crcOf, intakeNameOf, parseOldIndex, systemFolderOf } from './play-germade-library';

const sha = (c: string) => c.repeat(40);

describe("play.germade's old library", () => {
  it('reads an index, dropping what does not look right', () => {
    const index = parseOldIndex({
      games: {
        sonic: {
          title: 'Sonic The Hedgehog',
          renamed: true,
          versions: [
            { sha1: sha('a'), file: `${sha('a')}.md`, name: 'World', crc32: 0x12345678, dat: { name: 'Sonic The Hedgehog (World)' } },
            { sha1: 'bad', file: 'x.md' },
            { sha1: sha('b'), file: '../../evil.md' },
          ],
        },
        empty: { title: 'Nothing', versions: [] },
      },
      mods: {
        [sha('c')]: { name: 'Hack', file: `${sha('c')}.ips`, gameId: 'sonic' },
        nope: { name: 'x', file: 'y' },
      },
      bios: { sha1: sha('d') },
    });
    expect(index).toEqual({
      games: {
        sonic: {
          title: 'Sonic The Hedgehog',
          renamed: true,
          versions: [{ sha1: sha('a'), file: `${sha('a')}.md`, name: 'World', crc32: 0x12345678, dat: { name: 'Sonic The Hedgehog (World)' } }],
        },
      },
      mods: [{ sha1: sha('c'), name: 'Hack', file: `${sha('c')}.ips`, gameId: 'sonic' }],
      bios: true,
    });
    expect(parseOldIndex(null)).toBeUndefined();
    expect(parseOldIndex({ games: 1 })).toBeUndefined();
  });

  it('names a ROM for the intake: DAT name, else set driver, else title', () => {
    const game = { title: 'Old Towers', versions: [] };
    expect(intakeNameOf('megadrive', game, { sha1: sha('a'), file: `${sha('a')}.md`, dat: { name: 'Sonic: The Hedgehog (World)' } })).toBe('Sonic The Hedgehog (World).md');
    expect(intakeNameOf('neogeo', game, { sha1: sha('a'), file: `${sha('a')}.zip`, name: 'mslug' })).toBe('mslug.zip');
    expect(intakeNameOf('megadrive', game, { sha1: sha('a'), file: `${sha('a')}.bin` })).toBe('Old Towers.bin');
  });

  it('puts what no DAT places in its system folder', () => {
    expect(systemFolderOf('megadrive', { file: 'x.md' })).toBe('MegaDrive');
    expect(systemFolderOf('snes', { file: 'x.sfc' })).toBe('SNES');
    expect(systemFolderOf('neogeo', { file: 'x.zip' })).toBe('NEOGEO');
    expect(systemFolderOf('gba', { file: 'x.gba' })).toBe('GBA');
    expect(systemFolderOf('gba', { file: 'x.gb' })).toBe('GAMEBOY');
    expect(systemFolderOf('gba', { platform: 'gbc', file: 'x.bin' })).toBe('GBC');
    expect(crcOf({ crc32: 0x1 })).toBe('00000001');
    expect(crcOf({})).toBeUndefined();
  });
});
