import { describe, expect, it } from 'vitest';
import { addRowsOf, anyAdds, type RowFile } from './add-rows';
import type { LibraryIndex } from './library-index';

const TETRIS = { system: 'GAMEBOY', gameId: 'tetris', title: 'Tetris', variant: 'World-rev1' };
const SML = { system: 'GAMEBOY', gameId: 'super-mario-land', title: 'Super Mario Land', variant: 'World' };

const tetrisZip: RowFile = {
  name: 'Tetris.zip',
  items: [{ crc32: '46DF91AD', match: TETRIS, path: 'GAMEBOY/Tetris (World) (Rev 1).gb' }],
};

const LIBRARY: LibraryIndex = {
  version: 1,
  system: 'GAMEBOY',
  generatedAt: '2026-11-17T00:00:00Z',
  games: { 'super-mario-land': { title: 'Super Mario Land', versions: [{ path: 'GAMEBOY/SML.gb', crc: '90776841', regions: [], verified: true }], mods: [] } },
};

describe('addRowsOf', () => {
  it('names a recognized ROM by its DAT title, release and system', () => {
    expect(addRowsOf([tetrisZip], { indexes: [] })).toEqual([
      { name: 'Tetris.zip', kind: 'rom', state: 'recognized', title: 'Tetris', variant: 'World-rev1', system: 'GAMEBOY', adds: true },
    ]);
  });

  it('counts the other games of a zip', () => {
    const zip: RowFile = { name: 'pack.zip', items: [...tetrisZip.items!, { crc32: '90776841', match: SML, path: 'GAMEBOY/SML.gb' }] };
    expect(addRowsOf([zip], { indexes: [] })[0]).toMatchObject({ state: 'recognized', title: 'Tetris', more: 1 });
  });

  it('says a ROM the library has already', () => {
    const file: RowFile = { name: 'SML.gb', items: [{ crc32: '90776841', match: SML, path: 'GAMEBOY/SML.gb', taken: true }] };
    expect(addRowsOf([file], { indexes: [] })[0]).toMatchObject({ state: 'already', title: 'Super Mario Land', adds: false });
  });

  it('sends an unknown ROM to the given system, or adds nothing without one', () => {
    const file: RowFile = { name: 'homebrew.gba', items: [{}] };
    expect(addRowsOf([file], { indexes: [], system: 'GBA' })[0]).toMatchObject({ state: 'unknown', system: 'GBA', adds: true });
    expect(addRowsOf([file], { indexes: [], system: (name) => (name.endsWith('.gb') ? 'GAMEBOY' : undefined) })[0]).toMatchObject({ state: 'unknown', adds: false });
    expect(addRowsOf([file], { indexes: [] })[0]).toEqual({ name: 'homebrew.gba', kind: 'rom', state: 'unknown', adds: false });
  });

  it('gives the reason of a zip with nothing readable', () => {
    const file: RowFile = { name: 'locked.zip', items: [{ refused: 'encrypted' }] };
    expect(addRowsOf([file], { indexes: [] })[0]).toMatchObject({ state: 'refused', reason: 'encrypted', adds: false });
  });

  it('fits a BPS / UPS to a ROM on the list, and stops when that ROM is taken off', () => {
    const ups: RowFile = { name: 'Tetris DX colors.ups', patch: { format: 'ups', sourceCrc: '46df91ad' } };
    expect(addRowsOf([tetrisZip, ups], { indexes: [] })[1]).toEqual({
      name: 'Tetris DX colors.ups', kind: 'mod', state: 'mod', system: 'GAMEBOY', title: 'Tetris', fits: true, adds: true,
    });
    expect(addRowsOf([ups], { indexes: [] })[0]).toMatchObject({ state: 'mod-refused', reason: 'no-system', adds: false });
  });

  it('fits a BPS / UPS to a ROM in the library', () => {
    const bps: RowFile = { name: 'SML DX.bps', patch: { format: 'bps', sourceCrc: '90776841' } };
    expect(addRowsOf([bps], { indexes: [LIBRARY] })[0]).toMatchObject({ state: 'mod', title: 'Super Mario Land', fits: true });
  });

  it('assigns an IPS to the given game unchecked, or leaves it unassigned in the system', () => {
    const ips: RowFile = { name: 'hack.ips', patch: { format: 'ips' } };
    expect(addRowsOf([ips], { indexes: [LIBRARY], system: 'GAMEBOY', gameId: 'super-mario-land' })[0]).toMatchObject({
      state: 'mod', system: 'GAMEBOY', title: 'Super Mario Land', fits: false, adds: true,
    });
    expect(addRowsOf([ips], { indexes: [], system: 'GAMEBOY' })[0]).toEqual({ name: 'hack.ips', kind: 'mod', state: 'mod', system: 'GAMEBOY', adds: true });
  });

  it('refuses a file that is not a patch, or a damaged one', () => {
    const rows = addRowsOf(
      [{ name: 'a.ips', patch: { error: 'not-a-patch' } }, { name: 'b.bps', patch: { error: 'damaged' } }],
      { indexes: [], system: 'GAMEBOY' },
    );
    expect(rows.map((row) => [row.state, row.reason])).toEqual([['mod-refused', 'not-a-patch'], ['mod-refused', 'damaged']]);
    expect(anyAdds(rows)).toBe(false);
  });
});
