/**
 * Which boxart belongs to a game, and what the stored copy is called.
 *
 * The catalogue publishes boxarts under the full DAT name, so a boxart belongs
 * to a release rather than to a game: `Sonic (Japan)` and `Sonic (USA)` have
 * different covers. Most releases have none, though — betas, revisions and the
 * regions nobody scanned — so the dataset also carries one boxart per game,
 * joined by base title, to fall back on.
 *
 * Pure TypeScript: picking a cover and naming its file are decisions, and
 * keeping them out of the download makes them testable on their own.
 */

import { normalizeGameName, type GameGroup, type GameVariant } from './rom-grouping';

/** A boxart to show, and where it came from. */
export interface Cover {
  url: string;
  /**
   * The release this boxart belongs to, absent when it stands for the whole
   * game. It is what decides the name of the stored copy, so a game and its
   * Japanese release never overwrite each other.
   */
  variantKey?: string;
}

/** Marks a stored boxart, from the `<Game>.<variant>.case.png` of the layout. */
const COVER_TAG = 'case';

/** Image formats a boxart may be stored as; anything else is read as PNG. */
const COVER_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif']);

/**
 * Key a game is looked up by in the dataset's game-level cover map.
 *
 * The map is built by the dataset build from `normalizeGameName` of every
 * published boxart name, so the lookup has to use the same function on the
 * group's title. The group's own id cannot be used: two different titles that
 * sanitize to one name get a checksum suffix, which no boxart name carries.
 */
export function coverKeyOf(group: GameGroup): string {
  return normalizeGameName(group.title);
}

/** The boxart published for a release, which the dataset attaches file by file. */
export function variantCoverUrl(variant: GameVariant): string | undefined {
  return variant.files.find((file) => file.cover)?.cover;
}

/**
 * How good a release is at representing its game, lower being better.
 *
 * A release the user has on disk wins, because that is the box they own; among
 * the rest a plain retail release beats a beta or a prototype. Variants arrive
 * sorted by key, so equal ranks keep that order and the choice is stable.
 */
function rankOf(variant: GameVariant, present: ReadonlySet<string>): number {
  return (present.has(variant.key) ? 0 : 2) + (variant.flags.length > 0 ? 1 : 0);
}

/**
 * The boxart to show for a game.
 *
 * `present` names the releases found on disk, so a library holding only the
 * Japanese release shows the Japanese box. When no release has a boxart of its
 * own, the game-level `fallback` is used, and the result is then marked as
 * belonging to the game rather than to any one release.
 */
export function coverOf(
  group: GameGroup,
  options: { present?: ReadonlySet<string>; fallback?: string } = {},
): Cover | undefined {
  const present = options.present ?? new Set<string>();

  let best: { variant: GameVariant; url: string; rank: number } | undefined;

  for (const variant of group.variants) {
    const url = variantCoverUrl(variant);
    if (!url) continue;

    const rank = rankOf(variant, present);
    if (!best || rank < best.rank) best = { variant, url, rank };
  }

  if (best) return { url: best.url, variantKey: best.variant.key };
  return options.fallback ? { url: options.fallback } : undefined;
}

/** `.../Sonic%20(USA).png` -> `png`. Anything unexpected is read as PNG. */
function extensionOf(url: string): string {
  const name = url.split(/[?#]/)[0].split('/').pop() ?? '';
  const dot = name.lastIndexOf('.');
  const extension = dot === -1 ? '' : name.slice(dot + 1).toLowerCase();

  return COVER_EXTENSIONS.has(extension) ? extension : 'png';
}

/**
 * Name the stored copy of a boxart takes inside `.meta/<system>/`.
 *
 * The variant segment is there exactly when the boxart is that release's own,
 * which is what keeps a game-level boxart from being downloaded once per
 * release: every release of the game resolves to the same single file.
 *
 * The extension comes from the URL alone and never from the response, so the
 * name of an already stored boxart can be worked out without downloading it.
 */
export function coverFileNameOf(gameId: string, cover: Cover): string {
  const variant = cover.variantKey ? `.${cover.variantKey}` : '';
  return `${gameId}${variant}.${COVER_TAG}.${extensionOf(cover.url)}`;
}

/**
 * Names a stored boxart of a game may go by, best first.
 *
 * A release's own boxart is preferred, and the game-level one is still accepted:
 * a copy stored earlier for another release of the same game is a better answer
 * than no cover at all.
 */
export function storedCoverNamesOf(gameId: string, cover?: Cover): string[] {
  const names = cover ? [coverFileNameOf(gameId, cover)] : [];
  const game = `${gameId}.${COVER_TAG}.png`;

  return names.includes(game) ? names : [...names, game];
}
