import { describe, expect, it } from 'vitest';
import { groupDatGames, type DatGame } from './rom-grouping';
import {
  coverFileNameOf,
  coverKeyOf,
  coversOf,
  isSharedCover,
  pickCover,
  storableCoversOf,
  storedCoverNamesOf,
  systemAspectRatio,
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

  it('gives every region a world release ships to its boxart', () => {
    // It ships to all three, so all three have one — and the preference order
    // has something to choose among, which is why it exists.
    const group = groupOf([game('Sonic (World)', 'AAAA1111', `${BOXARTS}/Sonic%20(World).png`)]);

    expect(coversOf(group)).toEqual({
      byRegion: {
        EU: `${BOXARTS}/Sonic%20(World).png`,
        US: `${BOXARTS}/Sonic%20(World).png`,
        JP: `${BOXARTS}/Sonic%20(World).png`,
      },
    });
  });

  it('lets the box of a region beat the world release it ships alongside', () => {
    // Sonic 2 on Mega Drive: the DAT lists only world releases, and the box
    // published under the world name is the Japanese scan. A preference of EU
    // asked for the European box, and there is one published.
    const group = groupOf([
      game('Sonic 2 (World)', 'AAAA1111', `${BOXARTS}/Sonic%202%20(World).png`),
      game('Sonic 2 (Europe)', 'BBBB2222', `${BOXARTS}/Sonic%202%20(Europe).png`),
    ]);

    expect(coversOf(group).byRegion).toEqual({
      EU: `${BOXARTS}/Sonic%202%20(Europe).png`,
      US: `${BOXARTS}/Sonic%202%20(World).png`,
      JP: `${BOXARTS}/Sonic%202%20(World).png`,
    });
  });

  it('lets the box the dataset knows for a region beat a world release too', () => {
    // The European box of a release this DAT does not list is still the
    // European box; the world release's is only standing in for it.
    const group = groupOf([game('Sonic 2 (World)', 'AAAA1111', `${BOXARTS}/Sonic%202%20(World).png`)]);
    const covers = coversOf(group, { byRegion: { EU: `${BOXARTS}/Sonic%202%20(Europe).png` } });

    expect(covers.byRegion).toEqual({
      EU: `${BOXARTS}/Sonic%202%20(Europe).png`,
      US: `${BOXARTS}/Sonic%202%20(World).png`,
      JP: `${BOXARTS}/Sonic%202%20(World).png`,
    });
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

  it('prefers the copy on disk to the published image of the same region', () => {
    const stored = { byRegion: { EU: 'Sonic.EU.case.png' } };

    expect(pickCover(covers, { order: ['EU', 'US', 'JP'], stored })).toEqual({
      url: 'eu.png',
      file: 'Sonic.EU.case.png',
      region: 'EU',
    });
  });

  it('counts a boxart added by hand as the boxart of its region', () => {
    // The catalogue has nothing for this game, so without the stored copy there
    // would be no region to choose and nothing to show.
    const stored = { byRegion: { JP: 'Sonic.JP.case.jpg' } };

    expect(pickCover({ byRegion: {} }, { order: ['EU', 'US', 'JP'], stored })).toEqual({
      file: 'Sonic.JP.case.jpg',
      region: 'JP',
    });
  });

  it('shows an image added for the whole game before any published one', () => {
    // Someone put it there on purpose, and it serves every region — otherwise a
    // game the catalogue already has three covers for would never show it.
    const stored = { byRegion: {}, game: 'Sonic.case.png' };

    expect(pickCover(covers, { order: ['EU', 'US', 'JP'], stored })).toEqual({
      file: 'Sonic.case.png',
    });
  });

  it('still lets the order pick a region whose own image was added by hand', () => {
    const stored = { byRegion: { JP: 'Sonic.JP.case.png' }, game: 'Sonic.case.png' };

    expect(pickCover(covers, { order: ['JP', 'EU', 'US'], stored })).toEqual({
      url: 'jp.png',
      file: 'Sonic.JP.case.png',
      region: 'JP',
    });
  });

  it('falls back to a boxart added by hand for the game as a whole', () => {
    expect(pickCover({ byRegion: {} }, { stored: { byRegion: {}, game: 'Sonic.case.png' } })).toEqual(
      { file: 'Sonic.case.png' },
    );
  });
});

describe('isSharedCover', () => {
  const world = { byRegion: { EU: 'world.png', US: 'world.png', JP: 'world.png' } };

  it('is the box of the game when every region has that same image', () => {
    // One scan for a world release: naming a region for it would claim more
    // than the catalogue knows.
    expect(isSharedCover(world, { url: 'world.png', region: 'EU' })).toBe(true);
  });

  it('is the box of a region as soon as another region has a different one', () => {
    const covers = { byRegion: { EU: 'eu.png', US: 'world.png', JP: 'world.png' } };

    expect(isSharedCover(covers, { url: 'eu.png', region: 'EU' })).toBe(false);
    expect(isSharedCover(covers, { url: 'world.png', region: 'JP' })).toBe(false);
  });

  it('is never shared for an image added by hand, whose region the user said', () => {
    expect(isSharedCover(world, { url: 'world.png', file: 'Sonic.EU.case.png', region: 'EU' })).toBe(
      false,
    );
  });

  it('says nothing about a game with a boxart in one region only', () => {
    expect(isSharedCover({ byRegion: { JP: 'jp.png' } }, { url: 'jp.png', region: 'JP' })).toBe(
      false,
    );
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

  it('reads a stored copy under its own name, whatever format it is in', () => {
    const cover = { file: 'Sonic.US.case.webp', url: `${BOXARTS}/Sonic%20(USA).png`, region: 'US' as const };

    expect(storedCoverNamesOf('Sonic', cover)).toEqual([
      'Sonic.US.case.webp',
      'Sonic.US.case.png',
      'Sonic.case.png',
    ]);
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

describe('systemAspectRatio', () => {
  it('returns 1 / 1 for square boxart systems like Game Boy and PlayStation', () => {
    expect(systemAspectRatio('Game Boy')).toBe('1 / 1');
    expect(systemAspectRatio('Game Boy Color')).toBe('1 / 1');
    expect(systemAspectRatio('PlayStation')).toBe('1 / 1');
    expect(systemAspectRatio('Nintendo DS')).toBe('1 / 1');
  });

  it('returns 4 / 3 for horizontal boxart systems like GBA, N64 and SNES', () => {
    expect(systemAspectRatio('Game Boy Advance')).toBe('4 / 3');
    expect(systemAspectRatio('Nintendo 64')).toBe('4 / 3');
    expect(systemAspectRatio('Super Nintendo')).toBe('4 / 3');
    expect(systemAspectRatio('SNES')).toBe('4 / 3');
  });

  it('returns 3 / 4 for vertical boxart systems and unknown systems', () => {
    expect(systemAspectRatio('Nintendo Entertainment System')).toBe('3 / 4');
    expect(systemAspectRatio('Sega Genesis')).toBe('3 / 4');
    expect(systemAspectRatio('Mega Drive')).toBe('3 / 4');
    expect(systemAspectRatio(undefined)).toBe('3 / 4');
  });
});
