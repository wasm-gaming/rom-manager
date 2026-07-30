/**
 * Which boxarts a game has, which one to show, and what a stored copy is called.
 *
 * The catalogue publishes boxarts under the full DAT name, so a boxart belongs
 * to a release rather than to a game: `Sonic (Japan)` and `Sonic (USA)` have
 * different covers. Releases are what carry a region, so those boxarts fold
 * naturally into **one cover per region** — which is what a game keeps, and what
 * the region preference order then chooses among.
 *
 * Most releases have no boxart of their own, though — betas, revisions and the
 * regions nobody scanned — so the dataset also carries a game-level layer, by
 * region where the published name says one, to fall back on.
 *
 * Pure TypeScript: picking a cover and naming its file are decisions, and
 * keeping them out of the download makes them testable on their own.
 */

import { normalizeGameName, type GameGroup, type GameVariant } from './rom-grouping';
import { DEFAULT_REGION_ORDER, REGIONS, type Region } from './rom-regions';

/** A boxart to show, and the region it speaks for. */
export interface Cover {
  url: string;
  /**
   * The region this boxart belongs to, absent when it stands for the whole
   * game. It is what decides the name of the stored copy, so the European and
   * the Japanese box of one game never overwrite each other.
   */
  region?: Region;
}

/**
 * Every boxart a game has.
 *
 * The same shape describes what the dataset publishes for a title and what the
 * browser ends up with after merging the releases over it, so the two never
 * need translating into one another.
 */
export interface GameCovers {
  /** Boxart of each region the game has one for. */
  byRegion: Partial<Record<Region, string>>;
  /** Boxart of the game, shown for a region with none of its own. */
  game?: string;
}

/** Marks a stored boxart, from the `<Game>.<region>.case.png` of the layout. */
const COVER_TAG = 'case';

/** Image formats a boxart may be stored as; anything else is read as PNG. */
const COVER_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif']);

/**
 * Where the boxart of a release nobody could place goes: a release with no
 * region says nothing about one, so its boxart can only stand for the game.
 */
const GAME = 'game';

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

/** Every region some release of a game ships to. */
function regionsOfGroup(group: GameGroup): Region[] {
  const regions = new Set<Region>();
  for (const variant of group.variants) {
    for (const region of variant.regions) regions.add(region);
  }
  return REGIONS.filter((region) => regions.has(region));
}

/**
 * The boxarts of a game, one per region.
 *
 * A region takes the boxart of a release that ships there, a plain retail one
 * before a beta or a prototype; a world release ships everywhere, so its boxart
 * stands for all three regions at once. Variants arrive sorted by key, so equal
 * ranks keep that order and the outcome does not depend on how the DAT is
 * listed. What no release covers is filled from `fallback`, the dataset's
 * game-level layer.
 *
 * When every region of the game resolves to the same image, the result is a
 * single boxart *of the game* rather than three identical ones: that is the
 * world release, a sixth of the catalogue, and it is what keeps the same bytes
 * from being stored once per region.
 */
export function coversOf(group: GameGroup, fallback?: GameCovers): GameCovers {
  const best = new Map<Region | typeof GAME, { url: string; rank: number }>();

  for (const variant of group.variants) {
    const url = variantCoverUrl(variant);
    if (!url) continue;

    const rank = variant.flags.length > 0 ? 1 : 0;
    const keys: Array<Region | typeof GAME> =
      variant.regions.length > 0 ? [...variant.regions] : [GAME];

    for (const key of keys) {
      const current = best.get(key);
      if (!current || rank < current.rank) best.set(key, { url, rank });
    }
  }

  const byRegion: Partial<Record<Region, string>> = { ...fallback?.byRegion };
  for (const [key, { url }] of best) {
    if (key !== GAME) byRegion[key] = url;
  }

  const game = best.get(GAME)?.url ?? fallback?.game;

  // Collapsing needs two regions to be worth anything: a game released in one
  // region only has a boxart *of that region*, and saying so costs no space.
  const regions = regionsOfGroup(group);
  const first = regions[0];
  const shared =
    regions.length > 1 && regions.every((region) => byRegion[region] === byRegion[first]);

  if (shared && byRegion[first]) return { byRegion: {}, game: byRegion[first] };

  return game ? { byRegion, game } : { byRegion };
}

/**
 * The boxart to show for a game, given what the user has and how they want
 * regions ordered.
 *
 * The regions the user's own files ship to come first: it is the box they own,
 * and showing another region's would be a small lie. The order is what decides
 * among them — which is the whole point for a world release, whose single file
 * ships to all three — and it decides again over the rest when nothing the user
 * has got has a boxart at all.
 */
export function pickCover(
  covers: GameCovers,
  options: { present?: Iterable<Region>; order?: readonly Region[] } = {},
): Cover | undefined {
  const order = options.order ?? DEFAULT_REGION_ORDER;
  const present = new Set(options.present ?? []);

  for (const region of order) {
    const url = covers.byRegion[region];
    if (url && present.has(region)) return { url, region };
  }

  for (const region of order) {
    const url = covers.byRegion[region];
    if (url) return { url, region };
  }

  return covers.game ? { url: covers.game } : undefined;
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
 * The region segment is there exactly when the boxart belongs to one, which is
 * what keeps a game whose regions share an image from being downloaded once per
 * region: all of them resolve to the same single file.
 *
 * The extension comes from the URL alone and never from the response, so the
 * name of an already stored boxart can be worked out without downloading it.
 */
export function coverFileNameOf(gameId: string, cover: Cover): string {
  const region = cover.region ? `.${cover.region}` : '';
  return `${gameId}${region}.${COVER_TAG}.${extensionOf(cover.url)}`;
}

/**
 * Names a stored boxart of a game may go by, best first.
 *
 * The boxart of the region asked for is preferred, and the game-level one is
 * still accepted: a copy stored earlier for the whole game is a better answer
 * than no cover at all.
 */
export function storedCoverNamesOf(gameId: string, cover?: Cover): string[] {
  const names = cover ? [coverFileNameOf(gameId, cover)] : [];
  const game = `${gameId}.${COVER_TAG}.png`;

  return names.includes(game) ? names : [...names, game];
}

/**
 * Every boxart of a game that is worth keeping on disk.
 *
 * A game the user has taken into the library keeps *all* of its regions and not
 * only the one on screen, which is what makes changing the preference order
 * later work with the network off. Two regions sharing an image are still
 * stored once each: they are separate files, and one of them going missing
 * would send that region back to the network.
 */
export function storableCoversOf(covers: GameCovers): Cover[] {
  const stored: Cover[] = Object.entries(covers.byRegion)
    .filter(([, url]) => Boolean(url))
    .map(([region, url]) => ({ url: url as string, region: region as Region }));

  if (covers.game) stored.push({ url: covers.game });

  return stored;
}
