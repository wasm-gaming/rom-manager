import { describe, expect, it } from 'vitest';
import { groupDatGames, type DatGame } from './rom-grouping';
import { matchGroupsWithLocalFiles, type LocalFile, type MatchResult } from './rom-matching';
import {
  buildWizardTree,
  type FolderEntry,
  type WizardGame,
  type WizardNode,
} from './wizard-tree';

function game(name: string, crc: string, fileName?: string): DatGame {
  return { name, crc, size: 1024, fileName: fileName ?? `${name}.md` };
}

function covered(name: string, crc: string, cover: string): DatGame {
  return { ...game(name, crc), cover };
}

function local(path: string, crc32: string): LocalFile {
  return { path, size: 1024, crc32 };
}

function file(path: string): FolderEntry {
  return { name: path.slice(path.lastIndexOf('/') + 1), path, kind: 'file' };
}

function folder(path: string): FolderEntry {
  return { name: path.slice(path.lastIndexOf('/') + 1), path, kind: 'directory' };
}

function match(games: DatGame[], files: LocalFile[]): MatchResult {
  return matchGroupsWithLocalFiles(groupDatGames(games), files);
}

function labels(nodes: WizardNode[]): string[] {
  return nodes.map((node) => node.label);
}

function gameRow(nodes: WizardNode[], label: string): WizardGame {
  const node = nodes.find((candidate) => candidate.label === label);
  if (!node || node.kind !== 'group') throw new Error(`No game row for ${label}`);
  return node;
}

function variantOf(row: WizardGame, key: string) {
  const variant = row.variants.find((candidate) => candidate.key === key);
  if (!variant) throw new Error(`No variant ${key}`);
  return variant;
}

describe('buildWizardTree', () => {
  it('gathers a recognised file under its game', () => {
    const games = [game('Sonic the Hedgehog (USA)', 'AAAA1111')];
    const tree = buildWizardTree(
      'MegaDrive',
      [file('MegaDrive/sonic.bin')],
      match(games, [local('MegaDrive/sonic.bin', 'AAAA1111')]),
    );

    expect(labels(tree)).toEqual(['Sonic the Hedgehog']);
    expect(gameRow(tree, 'Sonic the Hedgehog').variants.map((it) => it.key)).toEqual(['USA']);
  });

  it('is a single row, with the releases carried as data', () => {
    // Fifteen files reading as one game is the point of grouping; a row that
    // unfolds back into them gives that away again.
    const games = [
      game('Sonic the Hedgehog 2 (World)', 'AAAA1111'),
      game('Sonic the Hedgehog 2 (World) (Beta)', 'BBBB2222'),
    ];
    const entries = [file('MegaDrive/sonic2.bin'), file('MegaDrive/sonic2beta.bin')];
    const tree = buildWizardTree(
      'MegaDrive',
      entries,
      match(games, [
        local('MegaDrive/sonic2.bin', 'AAAA1111'),
        local('MegaDrive/sonic2beta.bin', 'BBBB2222'),
      ]),
    );

    expect(tree).toHaveLength(1);
    expect(tree[0]).not.toHaveProperty('children');
    expect(gameRow(tree, 'Sonic the Hedgehog 2').paths).toEqual([
      'MegaDrive/sonic2.bin',
      'MegaDrive/sonic2beta.bin',
    ]);
  });

  it('lists the sibling variants even when they are missing', () => {
    // Seeing which siblings exist is the whole reason to group.
    const games = [
      game('Sonic the Hedgehog (USA)', 'AAAA1111'),
      game('Sonic the Hedgehog (Europe)', 'BBBB2222'),
      game('Sonic the Hedgehog (Japan)', 'CCCC3333'),
    ];
    const tree = buildWizardTree(
      'MegaDrive',
      [file('MegaDrive/sonic.bin')],
      match(games, [local('MegaDrive/sonic.bin', 'BBBB2222')]),
    );

    const { variants } = gameRow(tree, 'Sonic the Hedgehog');

    expect(variants.map((it) => it.key)).toEqual(['Europe', 'Japan', 'USA']);
    expect(variants.map((it) => it.status)).toEqual(['complete', 'missing', 'missing']);
  });

  it('leaves out the games with nothing on disk', () => {
    // A file browser has no business listing the twenty thousand ROMs the user
    // does not have.
    const games = [game('Sonic the Hedgehog (USA)', 'AAAA1111'), game('Golden Axe (USA)', 'DDDD44')];
    const tree = buildWizardTree(
      'MegaDrive',
      [file('MegaDrive/sonic.bin')],
      match(games, [local('MegaDrive/sonic.bin', 'AAAA1111')]),
    );

    expect(labels(tree)).toEqual(['Sonic the Hedgehog']);
  });

  it('shows an unrecognised file loose, as the plain listing would', () => {
    const games = [game('Sonic the Hedgehog (USA)', 'AAAA1111')];
    const entries = [file('MegaDrive/sonic.bin'), file('MegaDrive/homebrew.bin')];
    const tree = buildWizardTree(
      'MegaDrive',
      entries,
      match(games, [local('MegaDrive/sonic.bin', 'AAAA1111')]),
    );

    expect(labels(tree)).toEqual(['Sonic the Hedgehog', 'homebrew.bin']);
    expect(tree[1].kind).toBe('entry');
  });

  it('names a file after the file on disk, not after the dataset', () => {
    // It has to point at something the user can find in their folder.
    const games = [game('Sonic the Hedgehog (USA)', 'AAAA1111', 'Sonic the Hedgehog (USA).md')];
    const tree = buildWizardTree(
      'MegaDrive',
      [file('MegaDrive/sonic_u.bin')],
      match(games, [local('MegaDrive/sonic_u.bin', 'AAAA1111')]),
    );

    expect(variantOf(gameRow(tree, 'Sonic the Hedgehog'), 'USA').files).toEqual([
      { label: 'sonic_u.bin', path: 'MegaDrive/sonic_u.bin', crc: 'AAAA1111' },
    ]);
  });

  it('names a missing file after the dataset, which is all there is', () => {
    const games = [
      game('Final Fantasy VII (USA) (Disc 1)', 'AAAA1111', 'ff7-1.bin'),
      game('Final Fantasy VII (USA) (Disc 2)', 'BBBB2222', 'ff7-2.bin'),
    ];
    const tree = buildWizardTree(
      'PSX',
      [folder('PSX/Final Fantasy VII')],
      match(games, [local('PSX/Final Fantasy VII/USA/one.bin', 'AAAA1111')]),
    );

    // The checksum comes along with it: a file that is not here is not known by
    // its name, which the dataset made up, but by what it would hash to.
    expect(variantOf(gameRow(tree, 'Final Fantasy VII'), 'USA').files).toEqual([
      { label: 'one.bin', path: 'PSX/Final Fantasy VII/USA/one.bin', crc: 'AAAA1111' },
      { label: 'ff7-2.bin', crc: 'BBBB2222' },
    ]);
  });

  it('reports a half-present multi-disc release as partial', () => {
    const games = [
      game('Final Fantasy VII (USA) (Disc 1)', 'AAAA1111', 'ff7-1.bin'),
      game('Final Fantasy VII (USA) (Disc 2)', 'BBBB2222', 'ff7-2.bin'),
    ];
    const tree = buildWizardTree(
      'PSX',
      [],
      match(games, [local('PSX/Final Fantasy VII/USA/one.bin', 'AAAA1111')]),
    );

    expect(tree[0]).toMatchObject({ kind: 'group', status: 'partial' });
  });

  it('drops a folder whose files all ended up inside a game', () => {
    // Its contents are already on screen one level up, better organised.
    const games = [game('Wipeout (Europe)', 'AAAA1111', 'wipeout.bin')];
    const tree = buildWizardTree(
      'PSX',
      [folder('PSX/Wipeout')],
      match(games, [local('PSX/Wipeout/Europe/wipeout.bin', 'AAAA1111')]),
    );

    expect(labels(tree)).toEqual(['Wipeout']);
  });

  it('keeps a collection folder browsable', () => {
    // The scanner never looked inside it, so nothing there was claimed.
    const games = [game('Sonic the Hedgehog (USA)', 'AAAA1111')];
    const entries = [folder('MegaDrive/Favoritos'), file('MegaDrive/sonic.bin')];
    const tree = buildWizardTree(
      'MegaDrive',
      entries,
      match(games, [local('MegaDrive/sonic.bin', 'AAAA1111')]),
    );

    expect(labels(tree)).toEqual(['Sonic the Hedgehog', 'Favoritos']);
    expect(tree[1].kind).toBe('entry');
  });

  it('ignores the games whose files are outside the folder being browsed', () => {
    // A subfolder can be browsed grouped too, and it only owns its own files.
    const games = [
      game('Sonic the Hedgehog (USA)', 'AAAA1111'),
      game('Golden Axe (USA)', 'BBBB2222'),
    ];
    const files = [
      local('MegaDrive/sonic.bin', 'AAAA1111'),
      local('MegaDrive/Favoritos/axe.bin', 'BBBB2222'),
    ];

    const tree = buildWizardTree('MegaDrive/Favoritos', [], match(games, files));

    expect(labels(tree)).toEqual(['Golden Axe']);
  });

  it('lists a file held outside the folder as missing from it', () => {
    // The match covers the whole system, so a release present elsewhere in the
    // library is still not in the folder on screen.
    const games = [
      game('Golden Axe (USA)', 'AAAA1111'),
      game('Golden Axe (Japan)', 'BBBB2222', 'Golden Axe (Japan).md'),
    ];
    const files = [
      local('MegaDrive/Favoritos/axe.bin', 'AAAA1111'),
      local('MegaDrive/axe_j.bin', 'BBBB2222'),
    ];

    const row = gameRow(
      buildWizardTree('MegaDrive/Favoritos', [], match(games, files)),
      'Golden Axe',
    );

    expect(row.paths).toEqual(['MegaDrive/Favoritos/axe.bin']);
    expect(variantOf(row, 'Japan').files).toEqual([
      { label: 'Golden Axe (Japan).md', crc: 'BBBB2222' },
    ]);
  });

  it('gives every row a key of its own', () => {
    const games = [
      game('Sonic the Hedgehog (USA)', 'AAAA1111'),
      game('Sonic the Hedgehog (Europe)', 'BBBB2222'),
      game('Golden Axe (USA)', 'CCCC3333'),
    ];
    const tree = buildWizardTree(
      'MegaDrive',
      [file('MegaDrive/loose.bin')],
      match(games, [local('MegaDrive/sonic.bin', 'AAAA1111')]),
    );

    const keys = tree.map((node) => node.key);

    expect(new Set(keys).size).toBe(keys.length);
  });

  it('lists nothing for an empty folder with nothing recognised', () => {
    expect(buildWizardTree('MegaDrive', [], { groups: [], unmatched: [] })).toEqual([]);
  });

  it('carries every region of the boxart, not the one to show', () => {
    // The panel picks with the preference order, so changing it must not mean
    // reading the folder again.
    const games = [
      covered('Sonic (Europe)', 'AAAA1111', 'eu.png'),
      covered('Sonic (Japan)', 'BBBB2222', 'jp.png'),
    ];
    const tree = buildWizardTree(
      'MegaDrive',
      [file('MegaDrive/sonic.bin')],
      match(games, [local('MegaDrive/sonic.bin', 'BBBB2222')]),
    );

    expect(gameRow(tree, 'Sonic').covers).toEqual({ byRegion: { EU: 'eu.png', JP: 'jp.png' } });
  });

  it('reports the regions the files on disk ship to', () => {
    // Which is what makes the boxart shown the box of the release they own.
    const games = [game('Sonic (Europe)', 'AAAA1111'), game('Sonic (Japan)', 'BBBB2222')];
    const tree = buildWizardTree(
      'MegaDrive',
      [file('MegaDrive/sonic.bin')],
      match(games, [local('MegaDrive/sonic.bin', 'BBBB2222')]),
    );

    expect(gameRow(tree, 'Sonic').presentRegions).toEqual(['JP']);
  });

  it('reports all three regions for a world file, which ships everywhere', () => {
    const games = [game('Sonic (World)', 'AAAA1111')];
    const tree = buildWizardTree(
      'MegaDrive',
      [file('MegaDrive/sonic.bin')],
      match(games, [local('MegaDrive/sonic.bin', 'AAAA1111')]),
    );

    expect(gameRow(tree, 'Sonic').presentRegions).toEqual(['EU', 'US', 'JP']);
  });

  it('falls back to the boxart the dataset knows by title and region', () => {
    const games = [game('Sonic (Japan)', 'AAAA1111')];
    const tree = buildWizardTree(
      'MegaDrive',
      [file('MegaDrive/sonic.bin')],
      match(games, [local('MegaDrive/sonic.bin', 'AAAA1111')]),
      new Map([['Sonic', { byRegion: { JP: 'jp-rev1.png' } }]]),
    );

    expect(gameRow(tree, 'Sonic').covers.byRegion.JP).toBe('jp-rev1.png');
  });

  it('says which regions and standards each release supports', () => {
    const games = [game('Sonic (USA, Europe)', 'AAAA1111')];
    const tree = buildWizardTree(
      'MegaDrive',
      [file('MegaDrive/sonic.bin')],
      match(games, [local('MegaDrive/sonic.bin', 'AAAA1111')]),
    );

    expect(variantOf(gameRow(tree, 'Sonic'), 'USA+Europe')).toMatchObject({
      regions: ['EU', 'US'],
      videoStandards: ['PAL', 'NTSC'],
    });
  });
});
