import { describe, expect, it } from 'vitest';
import { buildLibraryIndex, gameIdOf, modFit, ownerOfCrc, parseLibraryIndex, slugOf, type ModRecord } from './library-index';
import { groupDatGames, type DatGame } from './rom-grouping';
import { matchGroupsWithLocalFiles } from './rom-matching';

const dat: DatGame[] = [
  { name: 'Sonic The Hedgehog 2 (World) (Rev A)', size: 1048576, crc: 'aaaaaaaa' },
  { name: 'Sonic The Hedgehog 2 (World)', size: 1048576, crc: 'bbbbbbbb' },
  { name: 'Streets of Rage (Japan)', size: 524288, crc: 'cccccccc' },
];

describe('library index', () => {
  it('gameId is play.germade’s slug of the normalized title (pinned against its code)', () => {
    expect(gameIdOf('Sonic The Hedgehog 2 (World) (Rev A)')).toBe('sonic-the-hedgehog-2');
    expect(gameIdOf('Legend of Zelda, The - A Link to the Past (USA)')).toBe('legend-of-zelda-the-a-link-to-the-past');
    expect(gameIdOf("Super Mario World 2 + Yoshi's Island (Japan)")).toBe('super-mario-world-2-plus-yoshi-s-island');
    expect(gameIdOf('Pokémon Émeraude (France)')).toBe('poke-mon-e-meraude');
    expect(gameIdOf("Street Fighter II' - Special Champion Edition (Europe)")).toBe('street-fighter-ii-special-champion-edition');
    expect(slugOf('***')).toBe('rom');
  });

  const match = matchGroupsWithLocalFiles(groupDatGames(dat), [
    { path: 'MegaDrive/Sonic The Hedgehog 2.World-revA.md', size: 1048576, crc32: 'AAAAAAAA' },
    { path: 'MegaDrive/My Homebrew (v1.2).bin', size: 4096, crc32: '12345678' },
  ]);
  const mods: ModRecord[] = [
    { sha1: 'f'.repeat(40), name: 'Delta', format: 'bps', file: `${'f'.repeat(40)}.bps`, sourceCrc: 'AAAAAAAA', targetCrc: 'DDDDDDDD', gameId: 'sonic-the-hedgehog-2', addedAt: '2026-11-16T00:00:00.000Z' },
    { sha1: 'e'.repeat(40), name: 'Loose', format: 'ips', file: `${'e'.repeat(40)}.ips`, addedAt: '2026-11-16T00:00:00.000Z' },
    { sha1: 'd'.repeat(40), name: 'For a missing game', format: 'ups', file: `${'d'.repeat(40)}.ups`, sourceCrc: 'CCCCCCCC', gameId: 'streets-of-rage', addedAt: '2026-11-16T00:00:00.000Z' },
  ];
  const index = buildLibraryIndex('MegaDrive', match, mods, new Date('2026-11-16T12:00:00Z'));

  it('pins the shape (version 1)', () => {
    expect(index).toEqual({
      version: 1,
      system: 'MegaDrive',
      generatedAt: '2026-11-16T12:00:00.000Z',
      games: {
        'my-homebrew': {
          title: 'My Homebrew',
          versions: [{ path: 'MegaDrive/My Homebrew (v1.2).bin', crc: '12345678', size: 4096, regions: [], verified: false }],
          mods: [],
        },
        'sonic-the-hedgehog-2': {
          title: 'Sonic The Hedgehog 2',
          versions: [
            {
              path: 'MegaDrive/Sonic The Hedgehog 2.World-revA.md',
              crc: 'AAAAAAAA',
              size: 1048576,
              variant: 'World-revA',
              regions: ['EU', 'US', 'JP'],
              revision: 'revA',
              verified: true,
            },
          ],
          mods: [
            {
              sha1: 'f'.repeat(40),
              name: 'Delta',
              format: 'bps',
              path: `.meta/MegaDrive/mods/${'f'.repeat(40)}.bps`,
              sourceCrc: 'AAAAAAAA',
              targetCrc: 'DDDDDDDD',
              fits: 'AAAAAAAA',
            },
          ],
        },
        'streets-of-rage': {
          title: 'streets-of-rage',
          versions: [],
          mods: [{ sha1: 'd'.repeat(40), name: 'For a missing game', format: 'ups', path: `.meta/MegaDrive/mods/${'d'.repeat(40)}.ups`, sourceCrc: 'CCCCCCCC' }],
        },
      },
    });
  });

  it('finds the owner of a CRC and reads an index back', () => {
    expect(ownerOfCrc([index], 'aaaaaaaa')).toEqual({ system: 'MegaDrive', gameId: 'sonic-the-hedgehog-2' });
    expect(ownerOfCrc([index], '00000000')).toBeUndefined();
    expect(parseLibraryIndex(JSON.parse(JSON.stringify(index)))).toEqual(index);
    expect(parseLibraryIndex({ version: 2, system: 'x', games: {} })).toBeUndefined();
    expect(parseLibraryIndex(null)).toBeUndefined();
  });

  it('says whether a mod fits', () => {
    expect(modFit({ sourceCrc: 'AAAAAAAA' }, [{ crc: 'aaaaaaaa' }])).toBe('fits');
    expect(modFit({ sourceCrc: 'BBBBBBBB' }, [{ crc: 'AAAAAAAA' }])).toBe('other');
    expect(modFit({}, [{ crc: 'AAAAAAAA' }])).toBe('unknown');
  });
});
