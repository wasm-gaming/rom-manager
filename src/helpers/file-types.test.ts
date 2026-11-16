import { describe, expect, it } from 'vitest';
import {
  DISC_MIME,
  isHiddenName,
  isRomName,
  mimeOf,
  ROM_MIME,
  SAVE_MIME,
  UNKNOWN_MIME,
} from './file-types';
import { ROM_EXTENSIONS } from './rom-intake';
import { IMAGE_EXTENSIONS } from './rom-media';

describe('mimeOf', () => {
  it('reads every extension that names a system as a ROM', () => {
    const read = ROM_EXTENSIONS.map((extension) => mimeOf(`Sonic (USA).${extension}`));

    expect(new Set(read)).toEqual(new Set([ROM_MIME]));
  });

  it('reads every image the library keeps as an image', () => {
    const read = IMAGE_EXTENSIONS.map((extension) => mimeOf(`Sonic.case.${extension}`));

    expect(read.every((mime) => mime.startsWith('image/'))).toBe(true);
    expect(mimeOf('Sonic.case.jpg')).toBe('image/jpeg');
  });

  it('reads a disc image, an archive and a saved game', () => {
    expect(mimeOf('Final Fantasy VII (Disc 1).cue')).toBe(DISC_MIME);
    expect(mimeOf('Sonic.zip')).toBe('application/zip');
    expect(mimeOf('Sonic.srm')).toBe(SAVE_MIME);
  });

  it('keeps `.md` a Mega Drive game, which is what it is in a ROM folder', () => {
    expect(mimeOf('Sonic (USA).md')).toBe(ROM_MIME);
  });

  it('does not care how the extension is spelled', () => {
    expect(mimeOf('SONIC.SFC')).toBe(ROM_MIME);
  });

  it('reads a full path by its last segment', () => {
    expect(mimeOf('SNES/Super Mario World.sfc')).toBe(ROM_MIME);
  });

  it('claims nothing about a name that carries no extension', () => {
    expect(mimeOf('README')).toBe(UNKNOWN_MIME);
    expect(mimeOf('Sonic.xyz')).toBe(UNKNOWN_MIME);
  });

  it('reads a leading dot as part of the name and not as an extension', () => {
    expect(mimeOf('.DS_Store')).toBe(UNKNOWN_MIME);
    expect(isRomName('.DS_Store')).toBe(false);
  });
});

describe('isHiddenName', () => {
  it('is the files nobody put there on purpose', () => {
    expect(isHiddenName('.DS_Store')).toBe(true);
    expect(isHiddenName('.meta')).toBe(true);
    expect(isHiddenName('Super Mario World.sfc')).toBe(false);
  });
});
