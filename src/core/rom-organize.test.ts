import { describe, expect, it } from 'vitest';
import { groupDatGames, type DatGame } from './rom-grouping';
import { matchGroupsWithLocalFiles, type LocalFile, type MatchResult } from './rom-matching';
import { planOrganization, type OrganizePlan } from './rom-organize';

function game(name: string, crc: string, fileName?: string): DatGame {
  return { name, crc, size: 1024, fileName: fileName ?? `${name}.md` };
}

function local(path: string, crc32: string): LocalFile {
  return { path, size: 1024, crc32 };
}

function match(games: DatGame[], files: LocalFile[]): MatchResult {
  return matchGroupsWithLocalFiles(groupDatGames(games), files);
}

function moves(plan: OrganizePlan): string[] {
  return plan.moves.map((move) => `${move.from} -> ${move.to}`);
}

describe('planOrganization', () => {
  it('renames a cartridge to title, variant and extension', () => {
    const games = [game('Sonic the Hedgehog (USA)', 'AAAA1111', 'Sonic the Hedgehog (USA).md')];
    const plan = planOrganization(
      'MegaDrive',
      'cartridge',
      match(games, [local('MegaDrive/sonic.md', 'AAAA1111')]),
    );

    expect(moves(plan)).toEqual(['MegaDrive/sonic.md -> MegaDrive/Sonic the Hedgehog.USA.md']);
    expect(plan.conflicts).toEqual([]);
    expect(plan.markers).toEqual([]);
  });

  it('takes the extension from the dataset, not from the file on disk', () => {
    const games = [game('Sonic the Hedgehog (USA)', 'AAAA1111', 'Sonic the Hedgehog (USA).md')];
    const plan = planOrganization(
      'MegaDrive',
      'cartridge',
      match(games, [local('MegaDrive/sonic.gen', 'AAAA1111')]),
    );

    expect(moves(plan)).toEqual(['MegaDrive/sonic.gen -> MegaDrive/Sonic the Hedgehog.USA.md']);
  });

  it('gives a disc release a folder per game and per variant', () => {
    const games = [
      game('Final Fantasy VII (USA) (Disc 1)', 'AAAA1111', 'Final Fantasy VII (USA) (Disc 1).bin'),
      game('Final Fantasy VII (USA) (Disc 2)', 'BBBB2222', 'Final Fantasy VII (USA) (Disc 2).bin'),
    ];
    const plan = planOrganization(
      'PSX',
      'disc',
      match(games, [local('ff7/d1.bin', 'AAAA1111'), local('ff7/d2.bin', 'BBBB2222')]),
    );

    expect(moves(plan)).toEqual([
      'ff7/d1.bin -> PSX/Final Fantasy VII/USA/Final Fantasy VII (USA) (Disc 1).bin',
      'ff7/d2.bin -> PSX/Final Fantasy VII/USA/Final Fantasy VII (USA) (Disc 2).bin',
    ]);
    expect(plan.markers).toEqual([
      {
        path: 'PSX/Final Fantasy VII/game.json',
        gameId: 'Final Fantasy VII',
        title: 'Final Fantasy VII',
        system: 'PSX',
      },
    ]);
  });

  it('does not mark a disc game that is not on disk at all', () => {
    const games = [
      game('Final Fantasy VII (USA) (Disc 1)', 'AAAA1111', 'ff7d1.bin'),
      game('Tekken (USA)', 'CCCC3333', 'tekken.bin'),
    ];
    const plan = planOrganization('PSX', 'disc', match(games, [local('a/ff7.bin', 'AAAA1111')]));

    expect(plan.markers.map((marker) => marker.gameId)).toEqual(['Final Fantasy VII']);
  });

  it('leaves files that are already in place alone', () => {
    const games = [game('Sonic the Hedgehog (USA)', 'AAAA1111', 'Sonic the Hedgehog (USA).md')];
    const plan = planOrganization(
      'MegaDrive',
      'cartridge',
      match(games, [local('MegaDrive/Sonic the Hedgehog.USA.md', 'AAAA1111')]),
    );

    expect(plan.moves).toEqual([]);
    expect(plan.conflicts).toEqual([]);
    expect(plan.settled).toBe(1);
  });

  it('never touches a file the dataset does not recognise', () => {
    const games = [game('Sonic the Hedgehog (USA)', 'AAAA1111')];
    const plan = planOrganization(
      'MegaDrive',
      'cartridge',
      match(games, [local('MegaDrive/Favoritos/hack.bin', 'DEADBEEF')]),
    );

    expect(plan.moves).toEqual([]);
    expect(plan.settled).toBe(0);
  });

  it('moves nothing when two files claim the same name', () => {
    // A DAT can list two releases under one name; the grouping then reads them
    // as one variant holding two files that both want the canonical name.
    const games = [
      game('RealSports Basketball (USA) (Proto)', 'AAAA1111', 'RealSports (1982).a52'),
      game('RealSports Basketball (USA) (Proto)', 'BBBB2222', 'RealSports (1983).a52'),
    ];
    const plan = planOrganization(
      'ATARI5200',
      'cartridge',
      match(games, [local('a.a52', 'AAAA1111'), local('b.a52', 'BBBB2222')]),
    );

    expect(plan.moves).toEqual([]);
    expect(plan.conflicts.map((conflict) => conflict.reason)).toEqual([
      'duplicate-target',
      'duplicate-target',
    ]);
  });

  it('refuses to overwrite an unrecognised file sitting on the target name', () => {
    const games = [game('Sonic the Hedgehog (USA)', 'AAAA1111', 'Sonic the Hedgehog (USA).md')];
    const plan = planOrganization(
      'MegaDrive',
      'cartridge',
      match(games, [
        local('MegaDrive/sonic.md', 'AAAA1111'),
        local('MegaDrive/Sonic the Hedgehog.USA.md', 'DEADBEEF'),
      ]),
    );

    expect(plan.moves).toEqual([]);
    expect(plan.conflicts).toEqual([
      {
        reason: 'target-taken',
        from: 'MegaDrive/sonic.md',
        to: 'MegaDrive/Sonic the Hedgehog.USA.md',
      },
    ]);
  });

  it('orders moves so one never overwrites a file still waiting to move', () => {
    const games = [
      game('Sonic the Hedgehog (USA)', 'AAAA1111', 'Sonic the Hedgehog (USA).md'),
      game('Sonic the Hedgehog (Europe)', 'BBBB2222', 'Sonic the Hedgehog (Europe).md'),
    ];
    // The Europe copy sits exactly where the USA copy has to land.
    const plan = planOrganization(
      'MegaDrive',
      'cartridge',
      match(games, [
        local('MegaDrive/Sonic the Hedgehog.USA.md', 'BBBB2222'),
        local('MegaDrive/sonic-usa.md', 'AAAA1111'),
      ]),
    );

    expect(moves(plan)).toEqual([
      'MegaDrive/Sonic the Hedgehog.USA.md -> MegaDrive/Sonic the Hedgehog.Europe.md',
      'MegaDrive/sonic-usa.md -> MegaDrive/Sonic the Hedgehog.USA.md',
    ]);
    expect(plan.conflicts).toEqual([]);
  });

  it('reports files that want each other places instead of guessing', () => {
    const games = [
      game('Sonic the Hedgehog (USA)', 'AAAA1111', 'Sonic the Hedgehog (USA).md'),
      game('Sonic the Hedgehog (Europe)', 'BBBB2222', 'Sonic the Hedgehog (Europe).md'),
    ];
    const plan = planOrganization(
      'MegaDrive',
      'cartridge',
      match(games, [
        local('MegaDrive/Sonic the Hedgehog.USA.md', 'BBBB2222'),
        local('MegaDrive/Sonic the Hedgehog.Europe.md', 'AAAA1111'),
      ]),
    );

    expect(plan.moves).toEqual([]);
    expect(plan.conflicts.map((conflict) => conflict.reason)).toEqual(['cycle', 'cycle']);
  });

  it('keeps a name without extension usable', () => {
    const games = [game('Sonic the Hedgehog (USA)', 'AAAA1111', 'sonic')];
    const plan = planOrganization(
      'MegaDrive',
      'cartridge',
      match(games, [local('MegaDrive/sonic.bin', 'AAAA1111')]),
    );

    expect(moves(plan)).toEqual(['MegaDrive/sonic.bin -> MegaDrive/Sonic the Hedgehog.USA']);
  });

  it('reports nothing to do for an empty library', () => {
    const plan = planOrganization('MegaDrive', 'cartridge', match([], []));

    expect(plan).toEqual({ moves: [], markers: [], conflicts: [], settled: 0 });
  });
});
