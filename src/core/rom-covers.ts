/**
 * Which boxarts a game has, which one to show, and what a stored copy is called.
 *
 * The catalogue publishes boxarts under the full DAT name, so a boxart belongs
 * to a release rather than to a game: `Sonic (Japan)` and `Sonic (USA)` have
 * different covers. Releases are what carry a region, so those boxarts fold
 * naturally into **one cover per region** — which is what a game keeps, and what
 * the region preference order then chooses among.
 *
 * A region takes the boxart that *says* it before one that merely includes it: a
 * world release ships everywhere, so its box stands for every region that has
 * nothing more specific, but the published `(Europe)` box beats it in Europe.
 * That ordering is the reason a preference of EU/US/JP shows the European box of
 * a game the DAT only lists as `(World)`.
 *
 * Most releases have no boxart of their own, though — betas, revisions and the
 * regions nobody scanned — so the dataset also carries a game-level layer, by
 * region where the published name says one, to fall back on.
 *
 * Pure TypeScript: picking a cover and naming its file are decisions, and
 * keeping them out of the download makes them testable on their own.
 */

import { normalizeGameName, type GameGroup, type GameVariant } from './rom-grouping';
import { COVER_KIND, imageExtensionOf, mediaFileNameOf } from './rom-media';
import { DEFAULT_REGION_ORDER, isRegion, type Region } from './rom-regions';

/** A boxart to show, and the region it speaks for. */
export interface Cover {
  /** The published image, absent when the only copy is one placed by hand. */
  url?: string;
  /** Name of the copy inside `.meta/<system>/`, when there is one already. */
  file?: string;
  /**
   * The region this boxart belongs to, absent when it stands for the whole
   * game. It is what decides the name of the stored copy, so the European and
   * the Japanese box of one game never overwrite each other.
   */
  region?: Region;
}

/** A published boxart, which is the only kind there is anything to download of. */
export type PublishedCover = Cover & { url: string };

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

/**
 * The copies of a game's boxarts that are already in `.meta/<system>/`, by the
 * region each belongs to and by file name.
 *
 * They take part in the choice and do not merely serve it: an image placed by
 * hand is a boxart *of its region*, so it makes that region an option even for a
 * game the catalogue has nothing for.
 */
export interface StoredCovers {
  byRegion: Partial<Record<Region, string>>;
  game?: string;
}

/**
 * Where the boxart of a release nobody could place goes: a release with no
 * region says nothing about one, so its boxart can only stand for the game.
 */
const GAME = 'game';

/**
 * How well a boxart answers for one region, lowest first.
 *
 * A release that ships to that region alone speaks for it; one that ships there
 * among others only stands in. Between the two sits the dataset's game-level
 * layer, which is published under a name that *does* say the region — so it is
 * worse than an exact release match and better than a world release's box.
 */
const FALLBACK_RANK = 2;

function rankOf(variant: GameVariant): number {
  const wide = variant.regions.length > 1 ? FALLBACK_RANK + 1 : 0;
  return wide + (variant.flags.length > 0 ? 1 : 0);
}

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
 * The boxarts of a game, one per region.
 *
 * Every region a release of the game ships to gets one, so a world release —
 * a sixth of the catalogue — has all three and the preference order has
 * something to choose among. Which boxart a region takes is `rankOf`: the
 * release that names it, a plain retail one before a beta, before what
 * `fallback` offers for it, before a release that merely includes it. Variants
 * arrive sorted by key, so equal ranks keep that order and the outcome does not
 * depend on how the DAT is listed.
 */
export function coversOf(group: GameGroup, fallback?: GameCovers): GameCovers {
  const best = new Map<Region | typeof GAME, { url: string; rank: number }>();

  // The game-level layer enters the race rather than being overwritten by it:
  // it is published under a name that says the region, which a world release's
  // box is not.
  for (const [region, url] of Object.entries(fallback?.byRegion ?? {})) {
    if (url && isRegion(region)) best.set(region, { url, rank: FALLBACK_RANK });
  }

  for (const variant of group.variants) {
    const url = variantCoverUrl(variant);
    if (!url) continue;

    const rank = rankOf(variant);
    const keys: Array<Region | typeof GAME> =
      variant.regions.length > 0 ? [...variant.regions] : [GAME];

    for (const key of keys) {
      const current = best.get(key);
      if (!current || rank < current.rank) best.set(key, { url, rank });
    }
  }

  const byRegion: Partial<Record<Region, string>> = {};
  for (const [key, { url }] of best) {
    if (key !== GAME) byRegion[key] = url;
  }

  const game = best.get(GAME)?.url ?? fallback?.game;

  return game ? { byRegion, game } : { byRegion };
}

/**
 * The boxart to show for a game, given what the user has, what is already on
 * disk, and how they want regions ordered.
 *
 * The regions the user's own files ship to come first: it is the box they own,
 * and showing another region's would be a small lie. The order is what decides
 * among them — which is the whole point for a world release, whose single file
 * ships to all three — and it decides again over the rest when nothing the user
 * has got has a boxart at all.
 *
 * What a region has to offer is, in turn: the image stored for it, then any image
 * stored for the game as a whole, then the published one. Both stored layers come
 * first because someone put them there on purpose, and the game-wide one serves
 * every region — which is what makes an image added for the whole game show up at
 * all on a game the catalogue already has three covers for.
 */
export function pickCover(
  covers: GameCovers,
  options: {
    present?: Iterable<Region>;
    order?: readonly Region[];
    /** Copies in `.meta`, which include whatever was added by hand. */
    stored?: StoredCovers;
  } = {},
): Cover | undefined {
  const order = options.order ?? DEFAULT_REGION_ORDER;
  const present = new Set(options.present ?? []);

  const coverOf = (region: Region): Cover | undefined => {
    const file = options.stored?.byRegion[region];
    if (file) return { url: covers.byRegion[region], file, region };

    // Stored for the game as a whole: it serves this region, and it is the box
    // *of the game*, so no region is claimed for it.
    if (options.stored?.game) return { file: options.stored.game };

    const url = covers.byRegion[region];
    return url ? { url, region } : undefined;
  };

  for (const region of order) {
    const cover = present.has(region) ? coverOf(region) : undefined;
    if (cover) return cover;
  }

  for (const region of order) {
    const cover = coverOf(region);
    if (cover) return cover;
  }

  const file = options.stored?.game;
  return file || covers.game ? { url: covers.game, file } : undefined;
}

/**
 * True when the boxart chosen is the one every region of the game has anyway.
 *
 * That is the world release with nothing published for its regions: one scan,
 * three regions, and calling it the European box because the order asked for EU
 * would claim more than the catalogue knows. It is still stored per region — the
 * region is what the preference chose and what the file is named after — but on
 * screen it is the box *of the game*. An image added by hand never is: its region
 * is what the user said it was.
 */
export function isSharedCover(covers: GameCovers, cover: Cover): boolean {
  if (cover.file || !cover.url) return false;

  const urls = Object.values(covers.byRegion).filter(Boolean);
  return urls.length > 1 && urls.every((url) => url === cover.url);
}

/**
 * Name the stored copy of a boxart takes inside `.meta/<system>/`.
 *
 * A copy already on disk keeps the name it is on disk under; anything else is
 * named after the game, the region it belongs to and the format of the URL. The
 * extension comes from the URL alone and never from the response, so the name of
 * an already stored boxart can be worked out without downloading it.
 */
export function coverFileNameOf(gameId: string, cover: Cover): string {
  if (cover.file) return cover.file;

  return mediaFileNameOf(gameId, {
    kind: COVER_KIND,
    region: cover.region,
    extension: imageExtensionOf(cover.url),
  });
}

/**
 * Names a stored boxart of a game may go by, best first.
 *
 * The boxart of the region asked for is preferred, and the game-level one is
 * still accepted: a copy stored earlier for the whole game is a better answer
 * than no cover at all.
 */
export function storedCoverNamesOf(gameId: string, cover?: Cover): string[] {
  const names = new Set<string>();

  if (cover) names.add(coverFileNameOf(gameId, cover));
  if (cover?.file && cover.url) {
    names.add(coverFileNameOf(gameId, { url: cover.url, region: cover.region }));
  }

  names.add(mediaFileNameOf(gameId, { kind: COVER_KIND }));

  return [...names];
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
export function storableCoversOf(covers: GameCovers): PublishedCover[] {
  const stored: PublishedCover[] = Object.entries(covers.byRegion)
    .filter(([, url]) => Boolean(url))
    .map(([region, url]) => ({ url: url as string, region: region as Region }));

  if (covers.game) stored.push({ url: covers.game });

  return stored;
}
