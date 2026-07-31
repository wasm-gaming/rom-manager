import { describe, expect, it } from 'vitest';
import { groupDatGames, type DatGame } from './rom-grouping';
import {
  CARTRIDGE_SIZE_LIMIT,
  candidateSystemsOf,
  companionFolderOf,
  findRelease,
  intakeFolderOf,
  romExtensionOf,
  type DatasetSystem,
} from './rom-intake';

const SYSTEMS: DatasetSystem[] = [
  { system: 'SNES', media: 'cartridge' },
  { system: 'MegaDrive', media: 'cartridge' },
  { system: 'Atari2600', media: 'cartridge' },
  { system: 'GameGear', media: 'cartridge' },
  { system: 'SMS', media: 'cartridge' },
  { system: 'PSX', media: 'disc' },
  { system: 'Saturn', media: 'disc' },
];

function names(file: { name: string; size: number }, available = SYSTEMS): string[] {
  return candidateSystemsOf(file, available).map((entry) => entry.system);
}

function game(name: string, crc: string, size = 1024): DatGame {
  return { name, crc, size, fileName: `${name}.sfc` };
}

describe('romExtensionOf', () => {
  it('reads the extension in lower case', () => {
    expect(romExtensionOf('Super Mario World (USA).SFC')).toBe('sfc');
  });

  it('is empty for a name that carries none', () => {
    expect(romExtensionOf('README')).toBe('');
  });

  it('does not read a dotfile as an extension', () => {
    expect(romExtensionOf('.DS_Store')).toBe('');
  });

  it('reads past a folder that holds a dot', () => {
    expect(romExtensionOf('My.Games/sonic.md')).toBe('md');
  });
});

describe('candidateSystemsOf', () => {
  it('names the system an extension points at', () => {
    expect(names({ name: 'smw.sfc', size: 512 * 1024 })).toEqual(['SNES']);
  });

  it('reads a copier extension as the system it dumps', () => {
    expect(names({ name: 'smw.smc', size: 512 * 1024 })).toEqual(['SNES']);
  });

  it('names every system that stores its games as raw dumps', () => {
    expect(names({ name: 'game.bin', size: 512 * 1024 })).toEqual([
      'MegaDrive',
      'Atari2600',
      'PSX',
      'Saturn',
    ]);
  });

  it('leaves the cartridges out for a file no cartridge could hold', () => {
    expect(names({ name: 'track01.bin', size: CARTRIDGE_SIZE_LIMIT + 1 })).toEqual([
      'PSX',
      'Saturn',
    ]);
  });

  it('keeps a cartridge that is exactly as big as the biggest one made', () => {
    expect(names({ name: 'game.md', size: CARTRIDGE_SIZE_LIMIT })).toEqual(['MegaDrive']);
  });

  it('leaves out systems the datasets do not cover', () => {
    expect(names({ name: 'sonic.gg', size: 1024 }, [{ system: 'SMS', media: 'cartridge' }])).toEqual(
      [],
    );
  });

  it('names nothing for a file that is not a ROM at all', () => {
    expect(names({ name: 'boxart.png', size: 1024 })).toEqual([]);
  });
});

describe('findRelease', () => {
  const groups = groupDatGames([
    game('Super Mario World (USA)', 'AAAA1111'),
    game('Super Mario World (Europe)', 'BBBB2222'),
  ]);

  it('finds the release a checksum names', () => {
    const found = findRelease(groups, 'BBBB2222', 1024);

    expect(found?.group.title).toBe('Super Mario World');
    expect(found?.variant.key).toBe('Europe');
    expect(found?.entry.crc).toBe('BBBB2222');
  });

  it('reads a checksum whatever case it comes in', () => {
    expect(findRelease(groups, 'aaaa1111', 1024)?.variant.key).toBe('USA');
  });

  it('refuses a checksum whose size does not match', () => {
    expect(findRelease(groups, 'AAAA1111', 2048)).toBeUndefined();
  });

  it('finds nothing for a file no entry claims', () => {
    expect(findRelease(groups, 'CCCC3333', 1024)).toBeUndefined();
  });
});

describe('companionFolderOf', () => {
  it('sends what came with a disc release into its folder', () => {
    expect(companionFolderOf([{ media: 'disc', folder: 'PSX/Final Fantasy VII/Europe' }])).toBe(
      'PSX/Final Fantasy VII/Europe',
    );
  });

  it('keeps every track of one release pointing at the same folder', () => {
    expect(
      companionFolderOf([
        { media: 'disc', folder: 'PSX/Final Fantasy VII/Europe' },
        { media: 'disc', folder: 'PSX/Final Fantasy VII/Europe' },
      ]),
    ).toBe('PSX/Final Fantasy VII/Europe');
  });

  it('sends nothing along with a cartridge', () => {
    expect(companionFolderOf([{ media: 'cartridge', folder: 'SNES' }])).toBeUndefined();
  });

  it('sends nothing along when the drop spans two releases', () => {
    expect(
      companionFolderOf([
        { media: 'disc', folder: 'PSX/Final Fantasy VII/Europe' },
        { media: 'disc', folder: 'PSX/Metal Gear Solid/Europe' },
      ]),
    ).toBeUndefined();
  });

  it('sends nothing along when no game was recognised at all', () => {
    expect(companionFolderOf([])).toBeUndefined();
  });
});

describe('intakeFolderOf', () => {
  const [group] = groupDatGames([game('Super Mario World (USA)', 'AAAA1111')]);

  it('leaves a cartridge loose in the system folder', () => {
    expect(intakeFolderOf('SNES', 'cartridge', group, group.variants[0])).toBe('SNES');
  });

  it('gives a disc release a folder of its own', () => {
    expect(intakeFolderOf('PSX', 'disc', group, group.variants[0])).toBe(
      'PSX/Super Mario World/USA',
    );
  });
});
