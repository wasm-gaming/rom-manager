import { describe, expect, it } from 'vitest';
import {
  GLOBAL_SCOPE,
  imageExtensionOf,
  isImageName,
  mediaFileNameOf,
  parseMediaName,
  regionOfScope,
} from './rom-media';

describe('mediaFileNameOf', () => {
  it('names an image after the game, its region and its kind', () => {
    expect(mediaFileNameOf('Sonic', { kind: 'case', region: 'EU', extension: 'png' })).toBe(
      'Sonic.EU.case.png',
    );
  });

  it('leaves the region out when the image stands for the whole game', () => {
    expect(mediaFileNameOf('Sonic', { kind: 'background', extension: 'jpg' })).toBe(
      'Sonic.background.jpg',
    );
  });

  it('reads an unstated format as PNG', () => {
    expect(mediaFileNameOf('Sonic', { kind: 'case' })).toBe('Sonic.case.png');
  });
});

describe('parseMediaName', () => {
  it('reads back what mediaFileNameOf wrote', () => {
    const media = { gameId: 'Sonic', kind: 'case', region: 'US', extension: 'png' } as const;

    expect(parseMediaName(mediaFileNameOf(media.gameId, media))).toEqual(media);
  });

  it('reads a game image as belonging to no region', () => {
    expect(parseMediaName('Sonic.snap.jpg')).toEqual({
      gameId: 'Sonic',
      kind: 'snap',
      region: undefined,
      extension: 'jpg',
    });
  });

  it('keeps the dots of a game whose name has them', () => {
    // `Mr. Do!` and `Vs. Excitebike` are in the catalogue, so the segments are
    // read from the right where the vocabulary is closed.
    expect(parseMediaName('Mr. Do!.JP.case.png')).toEqual({
      gameId: 'Mr. Do!',
      kind: 'case',
      region: 'JP',
      extension: 'png',
    });
  });

  it('is nothing for a file that is not one of ours', () => {
    expect(parseMediaName('Sonic.md')).toBeUndefined();
    expect(parseMediaName('scan.json')).toBeUndefined();
    expect(parseMediaName('Sonic.EU.poster.png')).toBeUndefined();
    expect(parseMediaName('.case.png')).toBeUndefined();
  });

  it('does not mistake a region for the name of the game', () => {
    expect(parseMediaName('EU.case.png')).toEqual({
      gameId: 'EU',
      kind: 'case',
      region: undefined,
      extension: 'png',
    });
  });
});

describe('imageExtensionOf', () => {
  it('reads the format out of a published URL', () => {
    expect(imageExtensionOf('https://example.test/art/Sonic%20(USA).PNG')).toBe('png');
  });

  it('has nothing to say about a name that is not an image', () => {
    expect(imageExtensionOf('Sonic.md')).toBeUndefined();
    expect(imageExtensionOf(undefined)).toBeUndefined();
  });

  it('ignores a query string, which is not part of the name', () => {
    expect(imageExtensionOf('https://example.test/cover?id=7')).toBeUndefined();
    expect(imageExtensionOf('https://example.test/cover.jpg?w=200')).toBe('jpg');
  });
});

describe('isImageName', () => {
  it('tells a dropped image from a dropped ROM', () => {
    expect(isImageName('box.jpeg')).toBe(true);
    expect(isImageName('Sonic The Hedgehog 2 (World).md')).toBe(false);
  });
});

describe('regionOfScope', () => {
  it('is the region itself, and nothing for the whole game', () => {
    expect(regionOfScope('JP')).toBe('JP');
    expect(regionOfScope(GLOBAL_SCOPE)).toBeUndefined();
  });
});
