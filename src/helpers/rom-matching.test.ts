import { describe, expect, it } from 'vitest';
import { groupDatGames } from './rom-grouping';
import { LocalFile, matchGroupsWithLocalFiles } from './rom-matching';

function local(path: string, crc32: string, size = 1024): LocalFile {
  return { path, crc32, size };
}

const groups = groupDatGames([
  { name: 'Sonic the Hedgehog (USA, Europe)', crc: '11111111', size: 1024 },
  { name: 'Sonic the Hedgehog (Japan)', crc: '22222222', size: 1024 },
  { name: 'Final Fantasy VII (USA) (Disc 1)', crc: 'AAAAAAAA', size: 1024 },
  { name: 'Final Fantasy VII (USA) (Disc 2)', crc: 'BBBBBBBB', size: 1024 },
]);

describe('matchGroupsWithLocalFiles', () => {
  it('reports a release whose every file is on disk as complete', () => {
    const { groups: matched } = matchGroupsWithLocalFiles(groups, [
      local('MegaDrive/whatever.md', '11111111'),
    ]);

    const sonic = matched.find((m) => m.group.id === 'Sonic the Hedgehog')!;

    expect(sonic.status).toBe('complete');
    expect(sonic.variants.find((v) => v.variant.key === 'USA+Europe')!.status).toBe('complete');
    expect(sonic.variants.find((v) => v.variant.key === 'Japan')!.status).toBe('missing');
  });

  it('matches by checksum, never by name', () => {
    // The local name is whatever the user's previous tool left behind.
    const { groups: matched } = matchGroupsWithLocalFiles(groups, [
      local('MegaDrive/sonic1.bin', '22222222'),
    ]);

    const sonic = matched.find((m) => m.group.id === 'Sonic the Hedgehog')!;
    const japan = sonic.variants.find((v) => v.variant.key === 'Japan')!;

    expect(japan.status).toBe('complete');
    expect(japan.files[0].local!.path).toBe('MegaDrive/sonic1.bin');
  });

  it('calls a release with only some of its discs partial', () => {
    const { groups: matched } = matchGroupsWithLocalFiles(groups, [
      local('PSX/ff7-disc1.bin', 'AAAAAAAA'),
    ]);

    const ff7 = matched.find((m) => m.group.id === 'Final Fantasy VII')!;

    expect(ff7.variants[0].status).toBe('partial');
    expect(ff7.status).toBe('partial');
    expect(ff7.variants[0].files.map((f) => f.local !== null)).toEqual([true, false]);
  });

  it('keeps reporting the games that are missing', () => {
    // The catalogue is what the user browses: a game they do not have is
    // precisely the one they may want to go looking for.
    const { groups: matched } = matchGroupsWithLocalFiles(groups, []);

    expect(matched).toHaveLength(2);
    expect(matched.every((m) => m.status === 'missing')).toBe(true);
  });

  it('refuses a checksum match when the size disagrees', () => {
    // CRC32 is 32 bits and a system holds tens of thousands of entries, so a
    // collision is likely rather than theoretical.
    const { groups: matched, unmatched } = matchGroupsWithLocalFiles(groups, [
      local('MegaDrive/other.md', '11111111', 2048),
    ]);

    expect(matched.find((m) => m.group.id === 'Sonic the Hedgehog')!.status).toBe('missing');
    expect(unmatched.map((f) => f.path)).toEqual(['MegaDrive/other.md']);
  });

  it('lists the files that belong to no known release', () => {
    const { unmatched } = matchGroupsWithLocalFiles(groups, [
      local('MegaDrive/sonic.md', '11111111'),
      local('MegaDrive/my-hack.md', 'DEADBEEF'),
    ]);

    expect(unmatched.map((f) => f.path)).toEqual(['MegaDrive/my-hack.md']);
  });

  it('lets one file satisfy every release that shares its checksum', () => {
    // The same dump is reused across releases often enough, and owning it
    // means owning all of them.
    const shared = groupDatGames([
      { name: 'Tetris (Japan)', crc: 'CAFEBABE', size: 512 },
      { name: 'Tetris (World)', crc: 'CAFEBABE', size: 512 },
    ]);

    const { groups: matched, unmatched } = matchGroupsWithLocalFiles(shared, [
      local('GAMEBOY/tetris.gb', 'CAFEBABE', 512),
    ]);

    expect(matched[0].variants.every((v) => v.status === 'complete')).toBe(true);
    expect(unmatched).toEqual([]);
  });

  it('ignores the case the checksums are written in', () => {
    const { groups: matched } = matchGroupsWithLocalFiles(groups, [
      local('MegaDrive/sonic.md', '11111111'.toLowerCase()),
    ]);

    expect(matched.find((m) => m.group.id === 'Sonic the Hedgehog')!.status).toBe('complete');
  });
});
