import { describe, expect, it } from 'vitest';
import { groupDatGames, type DatGame } from './rom-grouping';
import {
  coverFileNameOf,
  coverKeyOf,
  coverOf,
  storedCoverNamesOf,
  variantCoverUrl,
} from './rom-covers';

const BOXARTS = 'https://raw.githubusercontent.com/libretro-thumbnails/Sega_-_Mega_Drive_-_Genesis/HEAD/Named_Boxarts';

function game(name: string, crc: string, cover?: string): DatGame {
  return { name, crc, size: 1024, fileName: `${name}.md`, cover };
}

function groupOf(games: DatGame[]) {
  const [group] = groupDatGames(games);
  return group;
}

describe('coverOf', () => {
  it('takes the boxart of the release it belongs to', () => {
    const group = groupOf([game('Sonic (USA)', 'AAAA1111', `${BOXARTS}/Sonic%20(USA).png`)]);

    expect(coverOf(group)).toEqual({ url: `${BOXARTS}/Sonic%20(USA).png`, variantKey: 'USA' });
  });

  it('prefers the boxart of a release the user has', () => {
    // It is the box they own; showing another region's would be a small lie.
    const group = groupOf([
      game('Sonic (Europe)', 'AAAA1111', `${BOXARTS}/Sonic%20(Europe).png`),
      game('Sonic (Japan)', 'BBBB2222', `${BOXARTS}/Sonic%20(Japan).png`),
    ]);

    expect(coverOf(group, { present: new Set(['Japan']) })).toMatchObject({ variantKey: 'Japan' });
  });

  it('prefers a retail release over a beta', () => {
    const group = groupOf([
      game('Sonic (USA) (Beta)', 'AAAA1111', `${BOXARTS}/Sonic%20(USA)%20(Beta).png`),
      game('Sonic (USA)', 'BBBB2222', `${BOXARTS}/Sonic%20(USA).png`),
    ]);

    expect(coverOf(group)).toMatchObject({ variantKey: 'USA' });
  });

  it('falls back to the boxart of the game when no release has one', () => {
    const group = groupOf([game('Sonic (Japan) (Rev 1)', 'AAAA1111')]);
    const cover = coverOf(group, { fallback: `${BOXARTS}/Sonic%20(Japan).png` });

    // No variant key: the boxart stands for the game, and every release of it
    // resolves to the same stored file.
    expect(cover).toEqual({ url: `${BOXARTS}/Sonic%20(Japan).png` });
  });

  it('has no cover when neither the releases nor the game have one', () => {
    expect(coverOf(groupOf([game('Sonic (Japan)', 'AAAA1111')]))).toBeUndefined();
  });

  it('picks the same boxart whichever order the DAT lists the releases in', () => {
    const entries = [
      game('Sonic (Europe)', 'AAAA1111', `${BOXARTS}/Sonic%20(Europe).png`),
      game('Sonic (Japan)', 'BBBB2222', `${BOXARTS}/Sonic%20(Japan).png`),
      game('Sonic (USA)', 'CCCC3333', `${BOXARTS}/Sonic%20(USA).png`),
    ];

    const forwards = coverOf(groupOf(entries));
    const backwards = coverOf(groupOf([...entries].reverse()));

    expect(forwards).toEqual(backwards);
  });

  it('reads the boxart of a multi-disc release from whichever disc has one', () => {
    const group = groupOf([
      game('Final Fantasy VII (USA) (Disc 1)', 'AAAA1111'),
      game('Final Fantasy VII (USA) (Disc 2)', 'BBBB2222', `${BOXARTS}/FF7.png`),
    ]);

    expect(variantCoverUrl(group.variants[0])).toBe(`${BOXARTS}/FF7.png`);
  });
});

describe('coverKeyOf', () => {
  it('is the base title, which is how the dataset keys its game boxarts', () => {
    const group = groupOf([game('Sonic the Hedgehog 2 (World) (Rev A)', 'AAAA1111')]);

    expect(coverKeyOf(group)).toBe('Sonic the Hedgehog 2');
  });

  it('drops the checksum suffix a colliding title gets', () => {
    // No published boxart name carries that suffix, so looking up by group id
    // would find nothing.
    const [first, second] = groupDatGames([
      game('Wonder:Boy (USA)', 'AAAA1111'),
      game('Wonder_Boy (USA)', 'BBBB2222'),
    ]);

    expect(first.id).not.toBe(second.id);
    expect(coverKeyOf(first)).toBe('Wonder_Boy');
    expect(coverKeyOf(second)).toBe('Wonder_Boy');
  });
});

describe('coverFileNameOf', () => {
  it('names a release boxart after the game and the release', () => {
    expect(coverFileNameOf('Sonic', { url: `${BOXARTS}/Sonic%20(USA).png`, variantKey: 'USA' })).toBe(
      'Sonic.USA.case.png',
    );
  });

  it('names a game boxart after the game alone, so it is stored once', () => {
    expect(coverFileNameOf('Sonic', { url: `${BOXARTS}/Sonic%20(USA).png` })).toBe('Sonic.case.png');
  });

  it('keeps the format of the source image', () => {
    expect(coverFileNameOf('Sonic', { url: 'https://example.test/art/sonic.JPG' })).toBe(
      'Sonic.case.jpg',
    );
  });

  it('reads anything unexpected as a PNG', () => {
    expect(coverFileNameOf('Sonic', { url: 'https://example.test/cover?id=7' })).toBe(
      'Sonic.case.png',
    );
  });
});

describe('storedCoverNamesOf', () => {
  it('looks for the release boxart first and the game one after', () => {
    const cover = { url: `${BOXARTS}/Sonic%20(USA).png`, variantKey: 'USA' };

    expect(storedCoverNamesOf('Sonic', cover)).toEqual(['Sonic.USA.case.png', 'Sonic.case.png']);
  });

  it('looks for the game boxart when the dataset offers no URL at all', () => {
    // A boxart the user dropped in `.meta` by hand is still worth showing.
    expect(storedCoverNamesOf('Sonic')).toEqual(['Sonic.case.png']);
  });
});
