/**
 * The images a game keeps in `.meta/<system>/`: what kinds there are, what a
 * kind belongs to, and what it is called on disk.
 *
 * A boxart was the first of these and for a while the only one, so its name —
 * `<Game>[.<region>].case.png` — is what the rest are modelled on: the game, the
 * region when the image belongs to one, the kind, and the format. Reading that
 * name back is what makes an image dropped in by hand indistinguishable from one
 * the catalogue provided, which is the whole point of naming them the same way.
 *
 * Pure TypeScript: naming a file and reading its name back are decisions, and a
 * single module for both is what keeps them each other's inverse.
 */

import { isRegion, REGIONS, type Region } from './rom-regions';

/** What an image of a game is a picture of. */
export type MediaKind = 'case' | 'background' | 'title' | 'snap' | 'logo';

/** Order the kinds are offered in, boxart first because it is the one shown. */
export const MEDIA_KINDS: readonly MediaKind[] = ['case', 'background', 'title', 'snap', 'logo'];

export const MEDIA_KIND_LABELS: Record<MediaKind, string> = {
  case: 'Carátula',
  background: 'Fondo',
  title: 'Pantalla de título',
  snap: 'Captura',
  logo: 'Logo',
};

/** The kind the details pane shows, and the only one the catalogue publishes. */
export const COVER_KIND: MediaKind = 'case';

export function isMediaKind(value: string): value is MediaKind {
  return (MEDIA_KINDS as readonly string[]).includes(value);
}

/**
 * What an image is a picture *of a region of*, or of the game as a whole.
 *
 * `global` is not a fourth region: it is the absence of one, which on disk is the
 * absence of the region segment. Saying it out loud is what lets an image be
 * offered as belonging to no region in particular.
 */
export const GLOBAL_SCOPE = 'global';

export type MediaScope = Region | typeof GLOBAL_SCOPE;

export const MEDIA_SCOPES: readonly MediaScope[] = [...REGIONS, GLOBAL_SCOPE];

export const MEDIA_SCOPE_LABELS: Record<MediaScope, string> = {
  EU: 'EU',
  US: 'US',
  JP: 'JP',
  global: 'Todas las regiones',
};

/** The region a scope names, absent when it stands for the whole game. */
export function regionOfScope(scope: MediaScope): Region | undefined {
  return scope === GLOBAL_SCOPE ? undefined : scope;
}

/** Formats an image may be stored as. Anything else is not an image at all. */
export const IMAGE_EXTENSIONS: readonly string[] = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif'];

/** `Sonic (USA).PNG` -> `png`, and nothing for a name that is not an image. */
export function imageExtensionOf(name: string | undefined): string | undefined {
  const file = (name ?? '').split(/[?#]/)[0].split('/').pop() ?? '';
  const dot = file.lastIndexOf('.');
  const extension = dot === -1 ? '' : file.slice(dot + 1).toLowerCase();

  return IMAGE_EXTENSIONS.includes(extension) ? extension : undefined;
}

/** True when a dropped file is an image this library knows how to keep. */
export function isImageName(name: string): boolean {
  return imageExtensionOf(name) !== undefined;
}

/** An image of a game, as its name on disk says it. */
export interface MediaName {
  gameId: string;
  kind: MediaKind;
  /** Absent when the image stands for the whole game. */
  region?: Region;
  extension: string;
}

/**
 * Name an image takes inside `.meta/<system>/`.
 *
 * The region segment is there exactly when the image belongs to one, so the
 * European and the Japanese box of a game never overwrite each other and a game
 * with a single image for all of them keeps a single file.
 */
export function mediaFileNameOf(
  gameId: string,
  media: { kind: MediaKind; region?: Region; extension?: string },
): string {
  const region = media.region ? `.${media.region}` : '';
  return `${gameId}${region}.${media.kind}.${media.extension ?? 'png'}`;
}

/**
 * The game, region and kind a stored image is of, or `undefined` for a name that
 * is not one of ours.
 *
 * Read from the right, because a game name may itself hold dots — `Mr. Do!` and
 * `Vs. Excitebike` are in the catalogue — while the segments after it are a
 * closed vocabulary and cannot be mistaken for part of the title.
 */
export function parseMediaName(fileName: string): MediaName | undefined {
  const parts = fileName.split('.');
  if (parts.length < 3) return undefined;

  const extension = parts.pop()!.toLowerCase();
  if (!IMAGE_EXTENSIONS.includes(extension)) return undefined;

  const kind = parts.pop()!;
  if (!isMediaKind(kind)) return undefined;

  // The region segment is optional, so a name without it leaves whatever the
  // title ends in where it was.
  const region = parts.length > 1 && isRegion(parts[parts.length - 1]) ? parts.pop() : undefined;
  const gameId = parts.join('.');

  return gameId.length > 0 ? { gameId, kind, region: region as Region | undefined, extension } : undefined;
}
