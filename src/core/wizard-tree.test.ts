import { describe, expect, it } from 'vitest';
import { groupDatGames, type DatGame } from './rom-grouping';
import { matchGroupsWithLocalFiles, type LocalFile, type MatchResult } from './rom-matching';
import { buildWizardTree, type FolderEntry, type WizardNode } from './wizard-tree';

function game(name: string, crc: string, fileName?: string): DatGame {
  return { name, crc, size: 1024, fileName: fileName ?? `${name}.md` };
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

function childrenOf(nodes: WizardNode[], label: string): WizardNode[] {
  const node = nodes.find((candidate) => candidate.label === label);
  return node && 'children' in node ? node.children : [];
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
    expect(labels(childrenOf(tree, 'Sonic the Hedgehog'))).toEqual(['USA']);
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

    const variants = childrenOf(tree, 'Sonic the Hedgehog');

    expect(labels(variants)).toEqual(['Europe', 'Japan', 'USA']);
    expect(variants.map((node) => ('status' in node ? node.status : undefined))).toEqual([
      'complete',
      'missing',
      'missing',
    ]);
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

  it('names a file row after the file on disk, not after the dataset', () => {
    // The row has to point at something the user can find in their folder.
    const games = [game('Sonic the Hedgehog (USA)', 'AAAA1111', 'Sonic the Hedgehog (USA).md')];
    const tree = buildWizardTree(
      'MegaDrive',
      [file('MegaDrive/sonic_u.bin')],
      match(games, [local('MegaDrive/sonic_u.bin', 'AAAA1111')]),
    );

    const [row] = childrenOf(childrenOf(tree, 'Sonic the Hedgehog'), 'USA');

    expect(row).toMatchObject({ kind: 'file', label: 'sonic_u.bin', path: 'MegaDrive/sonic_u.bin' });
  });

  it('names a missing file row after the dataset, which is all there is', () => {
    const games = [
      game('Final Fantasy VII (USA) (Disc 1)', 'AAAA1111', 'ff7-1.bin'),
      game('Final Fantasy VII (USA) (Disc 2)', 'BBBB2222', 'ff7-2.bin'),
    ];
    const tree = buildWizardTree(
      'PSX',
      [folder('PSX/Final Fantasy VII')],
      match(games, [local('PSX/Final Fantasy VII/USA/one.bin', 'AAAA1111')]),
    );

    const files = childrenOf(childrenOf(tree, 'Final Fantasy VII'), 'USA');

    expect(files.map((node) => [node.kind, node.label])).toEqual([
      ['file', 'one.bin'],
      ['missing', 'ff7-2.bin'],
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

    const keys: string[] = [];
    const collect = (nodes: WizardNode[]) => {
      for (const node of nodes) {
        keys.push(node.key);
        if ('children' in node) collect(node.children);
      }
    };
    collect(tree);

    expect(new Set(keys).size).toBe(keys.length);
  });

  it('lists nothing for an empty folder with nothing recognised', () => {
    expect(buildWizardTree('MegaDrive', [], { groups: [], unmatched: [] })).toEqual([]);
  });
});
