/**
 * The library index other apps read: `.meta/<System>/index.json`.
 *
 * play.germade (and any launcher) needs, per system, the games, the versions of each
 * that are on disk, and their mods — without hashing or grouping the library again.
 * rom-manager already knows all of it, so it writes it down after every change.
 *
 * This is a contract: `version` changes when the shape does, and the shape is pinned
 * by `library-index.test.ts`. Pure functions only; the writing is `lib/LibraryIndexService`.
 */

import { normalizeGameName } from './rom-grouping';
import type { MatchResult } from './rom-matching';
import type { PatchFormat } from './patch';

export const LIBRARY_INDEX_VERSION = 1;

export interface IndexVersion {
  /** Library path of the version's (first) file. */
  path: string;
  /** Every file of the version, when it has more than one (multi-disc). */
  files?: string[];
  /** CRC32 of the first file, 8 upper-case hex digits — the version's key. */
  crc: string;
  size?: number;
  /** The release's key inside its game (`USA`, `Japan-rev1`), when a DAT knows it. */
  variant?: string;
  regions: string[];
  revision?: string;
  /** True when a DAT knows the release and every file of it is here. */
  verified: boolean;
}

/** A mod as other apps see it. `fits` names the version (by CRC) it applies to, when known. */
export interface IndexMod {
  sha1: string;
  name: string;
  format: PatchFormat;
  /** Library path of the patch file. */
  path: string;
  sourceCrc?: string;
  targetCrc?: string;
  fits?: string;
}

export interface IndexGame {
  title: string;
  versions: IndexVersion[];
  mods: IndexMod[];
}

export interface LibraryIndex {
  version: number;
  system: string;
  generatedAt: string;
  /** Keyed by `gameId`, see {@link slugOf}. */
  games: Record<string, IndexGame>;
}

/** A mod as `.meta/<System>/mods.json` keeps it. */
export interface ModRecord {
  sha1: string;
  name: string;
  format: PatchFormat;
  /** File name inside `.meta/<System>/mods/`. */
  file: string;
  /** For BPS / UPS: what the patch is made for, and what it makes. */
  sourceCrc?: string;
  targetCrc?: string;
  sourceSize?: number;
  targetSize?: number;
  /** The game it belongs to (a `gameId`), absent while unassigned. */
  gameId?: string;
  addedAt: string;
}

/**
 * A game's id: its normalized title, slugged. Letter for letter play.germade's `slug()`,
 * applied to the same normalized title it uses, so the saves engines keep in
 * `<engine>/<gameId>/` stay where they are.
 */
export function slugOf(text: string): string {
  return (
    text
      .normalize('NFKD')
      .toLowerCase()
      .replace(/\+/g, ' plus ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'rom'
  );
}

/** The gameId of a title as a DAT spells it (tags included or not). */
export const gameIdOf = (datName: string): string => slugOf(normalizeGameName(datName));

const baseNameOf = (path: string): string => {
  const name = path.slice(path.lastIndexOf('/') + 1);
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(0, dot) : name;
};

/** Where a mod's patch file lives in the library. */
export const modPathOf = (system: string, file: string): string => `.meta/${system}/mods/${file}`;

/**
 * The index of one system, from the catalogue matched against the disk and the
 * system's mods. Games with nothing on disk are left out; a mod assigned to a game
 * that is not here keeps that game in the index, with no versions.
 */
export function buildLibraryIndex(
  system: string,
  match: MatchResult,
  mods: readonly ModRecord[],
  now: Date = new Date(),
): LibraryIndex {
  const games: Record<string, IndexGame> = {};
  const gameFor = (id: string, title: string) => (games[id] ??= { title, versions: [], mods: [] });

  for (const matched of match.groups) {
    const present = matched.variants.filter((variant) => variant.files.some((file) => file.local));
    if (present.length === 0) continue;
    const id = gameIdOf(matched.group.variants[0]?.files[0]?.name ?? matched.group.title);
    const game = gameFor(id, matched.group.title);
    for (const { variant, status, files } of present) {
      const locals = files.flatMap((file) => (file.local ? [file.local] : []));
      const first = locals[0];
      game.versions.push({
        path: first.path,
        ...(locals.length > 1 ? { files: locals.map((local) => local.path) } : {}),
        crc: first.crc32.toUpperCase(),
        size: first.size,
        variant: variant.key,
        regions: [...variant.regions],
        ...(variant.revision ? { revision: variant.revision } : {}),
        verified: status === 'complete',
      });
    }
  }

  for (const file of match.unmatched) {
    const title = normalizeGameName(baseNameOf(file.path));
    gameFor(slugOf(title), title).versions.push({
      path: file.path,
      crc: file.crc32.toUpperCase(),
      size: file.size,
      regions: [],
      verified: false,
    });
  }

  attachMods({ system, games }, mods);

  const sorted: Record<string, IndexGame> = {};
  for (const id of Object.keys(games).sort()) sorted[id] = games[id];
  return { version: LIBRARY_INDEX_VERSION, system, generatedAt: now.toISOString(), games: sorted };
}

/**
 * Puts a system's mods on its games, in place: every game's `mods` is rebuilt, a mod
 * assigned to a game that is not here keeps that game (with no versions), and a game
 * that has neither versions nor mods any more is dropped.
 */
export function attachMods(index: Pick<LibraryIndex, 'system' | 'games'>, mods: readonly ModRecord[]): void {
  for (const game of Object.values(index.games)) game.mods = [];
  for (const mod of mods) {
    if (!mod.gameId) continue;
    const game = (index.games[mod.gameId] ??= { title: mod.gameId, versions: [], mods: [] });
    const fits = game.versions.find((version) => version.crc === mod.sourceCrc)?.crc;
    game.mods.push({
      sha1: mod.sha1,
      name: mod.name,
      format: mod.format,
      path: modPathOf(index.system, mod.file),
      ...(mod.sourceCrc ? { sourceCrc: mod.sourceCrc } : {}),
      ...(mod.targetCrc ? { targetCrc: mod.targetCrc } : {}),
      ...(fits ? { fits } : {}),
    });
  }
  for (const [id, game] of Object.entries(index.games)) {
    if (game.versions.length === 0 && game.mods.length === 0) delete index.games[id];
  }
}

/** The game (by id) one of whose versions is this CRC32, in any of the indexes given. */
export function ownerOfCrc(
  indexes: readonly LibraryIndex[],
  crc: string,
): { system: string; gameId: string } | undefined {
  const wanted = crc.toUpperCase();
  for (const index of indexes) {
    for (const [gameId, game] of Object.entries(index.games)) {
      if (game.versions.some((version) => version.crc === wanted)) return { system: index.system, gameId };
    }
  }
  return undefined;
}

/**
 * Whether a mod applies to one of a game's versions: `fits` for a BPS / UPS whose source
 * is here, `other` when it is made for a version that is not, `unknown` for IPS (which
 * says nothing about its source).
 */
export function modFit(mod: Pick<ModRecord, 'sourceCrc'>, versions: readonly { crc: string }[]): 'fits' | 'other' | 'unknown' {
  if (!mod.sourceCrc) return 'unknown';
  return versions.some((version) => version.crc.toUpperCase() === mod.sourceCrc) ? 'fits' : 'other';
}

/** Reads an index back, or undefined when it is not one this version understands. */
export function parseLibraryIndex(raw: unknown): LibraryIndex | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const index = raw as Partial<LibraryIndex>;
  if (index.version !== LIBRARY_INDEX_VERSION || typeof index.system !== 'string') return undefined;
  if (!index.games || typeof index.games !== 'object') return undefined;
  return index as LibraryIndex;
}
