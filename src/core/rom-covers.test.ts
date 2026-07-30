import { describe, expect, it } from 'vitest';
import { groupDatGames, type DatGame } from './rom-grouping';
import {
  coverFileNameOf,
  coverKeyOf,
  coversOf,
  pickCover,
  storableCoversOf,
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

describe('coversOf', () => {
  it('keeps one boxart per region', () => {
    const group = groupOf([
      game('Sonic (Europe)', 'AAAA1111', `${BOXARTS}/Sonic%20(Europe).png`),
      game('Sonic (USA)', 'BBBB2222', `${BOXARTS}/Sonic%20(USA).png`),
      game('Sonic (Japan)', 'CCCC3333', `${BOXARTS}/Sonic%20(Japan).png`),
    ]);

    expect(coversOf(group)).toEqual({
      byRegion: {
        EU: `${BOXARTS}/Sonic%20(Europe).png`,
        US: `${BOXARTS}/Sonic%20(USA).png`,
        JP: `${BOXARTS}/Sonic%20(Japan).png`,
      },
    });
  });

  it('reads a region from every market its release shipped to', () => {
    // `Brazil` is the American box and `Australia` the European one; neither is
    // a region of its own.
    const group = groupOf([
      game('Sonic (Brazil)', 'AAAA1111', `${BOXARTS}/Sonic%20(Brazil).png`),
      game('Sonic (Australia)', 'BBBB2222', `${BOXARTS}/Sonic%20(Australia).png`),
    ]);

    expect(coversOf(group).byRegion).toEqual({
      EU: `${BOXARTS}/Sonic%20(Australia).png`,
      US: `${BOXARTS}/Sonic%20(Brazil).png`,
    });
  });

  it('prefers a retail release over a beta within the region', () => {
    const group = groupOf([
      game('Sonic (USA) (Beta)', 'AAAA1111', `${BOXARTS}/Sonic%20(USA)%20(Beta).png`),
      game('Sonic (USA)', 'BBBB2222', `${BOXARTS}/Sonic%20(USA).png`),
    ]);

    expect(coversOf(group).byRegion.US).toBe(`${BOXARTS}/Sonic%20(USA).png`);
  });

  it('turns the one boxart of a world release into the boxart of the game', () => {
    // It ships to all three regions, so three copies of it would be the same
    // image stored three times.
    const group = groupOf([game('Sonic (World)', 'AAAA1111', `${BOXARTS}/Sonic%20(World).png`)]);

    expect(coversOf(group)).toEqual({ byRegion: {}, game: `${BOXARTS}/Sonic%20(World).png` });
  });

  it('keeps the regions apart when only some of them share a boxart', () => {
    const group = groupOf([
      game('Sonic (USA, Europe)', 'AAAA1111', `${BOXARTS}/Sonic%20(USA,%20Europe).png`),
      game('Sonic (Japan)', 'BBBB2222', `${BOXARTS}/Sonic%20(Japan).png`),
    ]);

    expect(coversOf(group).byRegion).toEqual({
      EU: `${BOXARTS}/Sonic%20(USA,%20Europe).png`,
      US: `${BOXARTS}/Sonic%20(USA,%20Europe).png`,
      JP: `${BOXARTS}/Sonic%20(Japan).png`,
    });
  });

  it('fills a region no release of it has a boxart for', () => {
    const group = groupOf([
      game('Sonic (Europe)', 'AAAA1111', `${BOXARTS}/Sonic%20(Europe).png`),
      game('Sonic (Japan)', 'BBBB2222'),
    ]);

    const covers = coversOf(group, { byRegion: { JP: `${BOXARTS}/Sonic%20(Japan)%20(Rev%201).png` } });

    expect(covers.byRegion.JP).toBe(`${BOXARTS}/Sonic%20(Japan)%20(Rev%201).png`);
  });

  it('lets a release boxart win over the one the dataset guessed for its region', () => {
    const group = groupOf([game('Sonic (USA)', 'AAAA1111', `${BOXARTS}/Sonic%20(USA).png`)]);
    const covers = coversOf(group, { byRegion: { US: `${BOXARTS}/Sonic%20(Canada).png` } });

    expect(covers.byRegion.US).toBe(`${BOXARTS}/Sonic%20(USA).png`);
  });

  it('keeps the game-level boxart of a game whose releases have none', () => {
    const group = groupOf([game('Sonic (Japan) (Rev 1)', 'AAAA1111')]);
    const covers = coversOf(group, { byRegion: {}, game: `${BOXARTS}/Sonic.png` });

    expect(covers).toEqual({ byRegion: {}, game: `${BOXARTS}/Sonic.png` });
  });

  it('files the boxart of a release nobody could place under the game', () => {
    // With no region it says nothing about one, so it can only stand for the game.
    const group = groupOf([game('Sonic (Unknown)', 'AAAA1111', `${BOXARTS}/Sonic.png`)]);

    expect(coversOf(group)).toEqual({ byRegion: {}, game: `${BOXARTS}/Sonic.png` });
  });

  it('has no covers when neither the releases nor the dataset have one', () => {
    expect(coversOf(groupOf([game('Sonic (Japan)', 'AAAA1111')]))).toEqual({ byRegion: {} });
  });

  it('picks the same boxarts whichever order the DAT lists the releases in', () => {
    const entries = [
      game('Sonic (Europe)', 'AAAA1111', `${BOXARTS}/Sonic%20(Europe).png`),
      game('Sonic (Europe) (Rev 1)', 'DDDD4444', `${BOXARTS}/Sonic%20(Europe)%20(Rev%201).png`),
      game('Sonic (Japan)', 'BBBB2222', `${BOXARTS}/Sonic%20(Japan).png`),
      game('Sonic (USA)', 'CCCC3333', `${BOXARTS}/Sonic%20(USA).png`),
    ];

    expect(coversOf(groupOf(entries))).toEqual(coversOf(groupOf([...entries].reverse())));
  });

  it('reads the boxart of a multi-disc release from whichever disc has one', () => {
    const group = groupOf([
      game('Final Fantasy VII (USA) (Disc 1)', 'AAAA1111'),
      game('Final Fantasy VII (USA) (Disc 2)', 'BBBB2222', `${BOXARTS}/FF7.png`),
    ]);

    expect(variantCoverUrl(group.variants[0])).toBe(`${BOXARTS}/FF7.png`);
  });
});

describe('pickCover', () => {
  const covers = {
    byRegion: { EU: 'eu.png', US: 'us.png', JP: 'jp.png' },
  };

  it('follows the preferred order', () => {
    expect(pickCover(covers, { order: ['JP', 'EU', 'US'] })).toEqual({ url: 'jp.png', region: 'JP' });
  });

  it('defaults to EU before US before JP', () => {
    expect(pickCover(covers)).toEqual({ url: 'eu.png', region: 'EU' });
  });

  it('shows the box the user owns before the one they prefer', () => {
    // Showing the European box of a game only held as a Japanese dump would be
    // a small lie about what is on the card.
    expect(pickCover(covers, { present: ['JP'], order: ['EU', 'US', 'JP'] })).toEqual({
      url: 'jp.png',
      region: 'JP',
    });
  });

  it('uses the order to choose among the regions the user does own', () => {
    // The case of a world release: one file, shipped everywhere.
    expect(pickCover(covers, { present: ['EU', 'US', 'JP'], order: ['US', 'JP', 'EU'] })).toEqual({
      url: 'us.png',
      region: 'US',
    });
  });

  it('falls through the order when nothing the user owns has a boxart', () => {
    const partial = { byRegion: { EU: 'eu.png' } };

    expect(pickCover(partial, { present: ['JP'], order: ['US', 'JP', 'EU'] })).toEqual({
      url: 'eu.png',
      region: 'EU',
    });
  });

  it('falls back to the boxart of the game, which belongs to no region', () => {
    expect(pickCover({ byRegion: {}, game: 'game.png' }, { present: ['JP'] })).toEqual({
      url: 'game.png',
    });
  });

  it('has nothing to show for a game with no boxart at all', () => {
    expect(pickCover({ byRegion: {} })).toBeUndefined();
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
  it('names a region boxart after the game and the region', () => {
    expect(coverFileNameOf('Sonic', { url: `${BOXARTS}/Sonic%20(USA).png`, region: 'US' })).toBe(
      'Sonic.US.case.png',
    );
  });

  it('names a game boxart after the game alone, so it is stored once', () => {
    expect(coverFileNameOf('Sonic', { url: `${BOXARTS}/Sonic%20(World).png` })).toBe(
      'Sonic.case.png',
    );
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
  it('looks for the region boxart first and the game one after', () => {
    const cover = { url: `${BOXARTS}/Sonic%20(USA).png`, region: 'US' as const };

    expect(storedCoverNamesOf('Sonic', cover)).toEqual(['Sonic.US.case.png', 'Sonic.case.png']);
  });

  it('looks for the game boxart when the dataset offers no URL at all', () => {
    // A boxart the user dropped in `.meta` by hand is still worth showing.
    expect(storedCoverNamesOf('Sonic')).toEqual(['Sonic.case.png']);
  });
});

describe('storableCoversOf', () => {
  it('offers every region, so a game in the library needs no provider again', () => {
    expect(storableCoversOf({ byRegion: { EU: 'eu.png', JP: 'jp.png' }, game: 'game.png' })).toEqual([
      { url: 'eu.png', region: 'EU' },
      { url: 'jp.png', region: 'JP' },
      { url: 'game.png' },
    ]);
  });

  it('offers nothing for a game with no boxart', () => {
    expect(storableCoversOf({ byRegion: {} })).toEqual([]);
  });
});
