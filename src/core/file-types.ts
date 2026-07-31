/**
 * What a file in the library is, as far as its name can say.
 *
 * A listing hands over names, not contents: the storage layer reports handles,
 * so asking the browser for a file's own MIME would be one call per row, and for
 * a `.sfc` the answer it gives is the empty string. So the table is ours, keyed
 * by extension, and what it produces is a MIME type — a vocabulary that already
 * exists, groups into families, and gives the icons something to be chosen by.
 *
 * None of this decides what a file *is*. A game is settled by its checksum
 * against a catalogue, and that answer arrives later and from elsewhere; this is
 * only what a row can honestly claim while it is being painted. Which is why
 * everything unaccounted for lands on `application/octet-stream` — an unknown
 * blob — rather than on a guess.
 */

import { IMAGE_EXTENSIONS } from './rom-media';
import { romExtensionOf, ROM_EXTENSIONS } from './rom-intake';

/**
 * The types with no registered name of their own.
 *
 * A ROM has never had a MIME type — the `x-` prefix is what that is for — and
 * the disc images and save files of emulation have none either. The rest of the
 * table uses the registered spelling, so `image/jpeg` and not `image/jpg`.
 */
export const ROM_MIME = 'application/x-rom';
export const DISC_MIME = 'application/x-disc-image';
export const SAVE_MIME = 'application/x-save-data';
export const UNKNOWN_MIME = 'application/octet-stream';

/** One `image/*` per format the library keeps, spelled as the registry does. */
const IMAGE_MIMES: Readonly<Record<string, string>> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
};

/**
 * Everything that is not a ROM and not an image, which are the two lists this
 * module borrows rather than repeats.
 *
 * A disc image is listed here and not among the ROMs on purpose: `.cue` and
 * `.iso` name no system, and what the browser has to say about one is that it is
 * part of a disc release. `.bin` is absent for the opposite reason — it is
 * already in the system table, for the Mega Drive and half the disc systems at
 * once — so it keeps the gamepad, which is the most a name can say about it.
 */
const OTHER_MIMES: Readonly<Record<string, string>> = {
  cue: DISC_MIME,
  iso: DISC_MIME,
  chd: DISC_MIME,
  gdi: DISC_MIME,
  ccd: DISC_MIME,
  toc: DISC_MIME,
  m3u: DISC_MIME,

  srm: SAVE_MIME,
  sav: SAVE_MIME,
  state: SAVE_MIME,
  mcr: SAVE_MIME,
  mcd: SAVE_MIME,

  zip: 'application/zip',
  '7z': 'application/x-7z-compressed',
  rar: 'application/vnd.rar',
  gz: 'application/gzip',

  txt: 'text/plain',
  md: 'text/markdown',
  nfo: 'text/plain',
  log: 'text/plain',
  csv: 'text/csv',
  json: 'application/json',
  xml: 'application/xml',
  dat: 'application/xml',
};

/**
 * The whole table, built once.
 *
 * The two borrowed lists go in first and the rest on top, so a collision would
 * be resolved by this file and not by whichever module happened to load first.
 * There is one worth naming: `md` is Mega Drive in the system table and Markdown
 * everywhere else. It stays a ROM, because this is a ROM manager and a folder of
 * `.md` files here is a shelf of Mega Drive games.
 */
const MIME_BY_EXTENSION: ReadonlyMap<string, string> = new Map([
  ...Object.entries(OTHER_MIMES),
  ...IMAGE_EXTENSIONS.map((extension) => [extension, IMAGE_MIMES[extension]] as const),
  ...ROM_EXTENSIONS.map((extension) => [extension, ROM_MIME] as const),
]);

/**
 * The MIME type a name claims, `application/octet-stream` when it claims none.
 *
 * `.DS_Store` is the case worth stating: a leading dot is not an extension, so
 * the name carries none, and an unknown blob is exactly what it is.
 */
export function mimeOf(name: string): string {
  return MIME_BY_EXTENSION.get(romExtensionOf(name)) ?? UNKNOWN_MIME;
}

/** True for a ROM by its name alone, which is all a listing can tell. */
export function isRomName(name: string): boolean {
  return mimeOf(name) === ROM_MIME;
}

/**
 * True for the files an operating system leaves behind: `.DS_Store`, `.meta`,
 * `Thumbs.db` if it had a dot in front.
 *
 * They are shown — a browser that hides what is on disk is lying about the disk —
 * but shown dimmed, because nobody put them there on purpose.
 */
export function isHiddenName(name: string): boolean {
  return name.startsWith('.');
}
