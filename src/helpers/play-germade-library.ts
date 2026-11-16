/**
 * play.germade's own ROM library, as it was before rom-manager became its `/roms/`:
 *
 *   library/<system>/index.json              games → versions, mods (and the Neo Geo BIOS)
 *   library/<system>/roms/<sha1>.<ext>       each ROM once
 *   library/<system>/patches/<sha1>.<ext>    each mod once
 *   library/<system>/bios/neogeo.zip         the Neo Geo BIOS
 *
 * Pure reading of that shape, so `lib/PlayGermadeMigration` can move it into the library.
 * The files sit in a folder the player could have touched: anything odd is dropped.
 */

import { normalizeGameName } from './rom-grouping';
import { crcHex } from './patch';

/** play.germade's library systems. */
export const OLD_SYSTEMS = ['megadrive', 'snes', 'gba', 'neogeo'] as const;
export type OldSystem = (typeof OLD_SYSTEMS)[number];

export interface OldVersion {
  sha1: string;
  /** `<sha1>.<ext>` inside `roms/`. */
  file: string;
  /** The DAT variant key, or (Neo Geo) the set's driver name. */
  name?: string;
  crc32?: number;
  platform?: 'gba' | 'gb' | 'gbc';
  /** The DAT entry it matched: `name` is the full No-Intro name. */
  dat?: { name?: string } | null;
}

export interface OldGame {
  title: string;
  renamed?: boolean;
  versions: OldVersion[];
}

export interface OldMod {
  sha1: string;
  name: string;
  /** `<sha1>.<format>` inside `patches/`. */
  file: string;
  gameId: string | null;
}

export interface OldIndex {
  games: Record<string, OldGame>;
  mods: OldMod[];
  /** The Neo Geo BIOS, when there is one (`bios/neogeo.zip`). */
  bios: boolean;
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const SHA1 = /^[0-9a-f]{40}$/;
/** A content-addressed file name: no folders, no way out of its directory. */
const isStoredName = (value: unknown): value is string => typeof value === 'string' && /^[0-9a-f]{40}\.[a-z0-9]{1,5}$/.test(value);

/** Reads an old `index.json`; undefined when it is not one. */
export function parseOldIndex(raw: unknown): OldIndex | undefined {
  if (!isObject(raw) || !isObject(raw.games)) return undefined;
  const games: Record<string, OldGame> = {};
  for (const [id, value] of Object.entries(raw.games)) {
    if (!isObject(value) || !Array.isArray(value.versions)) continue;
    const versions = value.versions.flatMap((v): OldVersion[] => {
      if (!isObject(v) || typeof v.sha1 !== 'string' || !SHA1.test(v.sha1) || !isStoredName(v.file)) return [];
      return [
        {
          sha1: v.sha1,
          file: v.file,
          ...(typeof v.name === 'string' ? { name: v.name } : {}),
          ...(typeof v.crc32 === 'number' ? { crc32: v.crc32 >>> 0 } : {}),
          ...(v.platform === 'gba' || v.platform === 'gb' || v.platform === 'gbc' ? { platform: v.platform } : {}),
          ...(isObject(v.dat) && typeof v.dat.name === 'string' ? { dat: { name: v.dat.name } } : {}),
        },
      ];
    });
    if (versions.length === 0) continue;
    games[id] = { title: typeof value.title === 'string' && value.title ? value.title : id, renamed: value.renamed === true, versions };
  }
  const mods = Object.entries(isObject(raw.mods) ? raw.mods : {}).flatMap(([sha1, value]): OldMod[] => {
    if (!SHA1.test(sha1) || !isObject(value) || !isStoredName(value.file)) return [];
    return [
      {
        sha1,
        name: typeof value.name === 'string' && value.name ? value.name : sha1.slice(0, 8),
        file: value.file,
        gameId: typeof value.gameId === 'string' && value.gameId ? value.gameId : null,
      },
    ];
  });
  return { games, mods, bios: isObject(raw.bios) };
}

const extensionOf = (file: string): string => file.slice(file.lastIndexOf('.'));

/**
 * The name a ROM is handed to the intake with. The intake identifies it by checksum
 * and renames it anyway; the name only matters for what no DAT knows, which keeps it:
 * the full DAT name, else the set's driver (Neo Geo: FBNeo finds a set by it), else the
 * game's title.
 */
export function intakeNameOf(system: string, game: OldGame, version: OldVersion): string {
  const extension = extensionOf(version.file);
  if (version.dat?.name) return `${normalizeFileName(version.dat.name)}${extension}`;
  if (system === 'neogeo' && version.name) return `${normalizeFileName(version.name)}${extension}`;
  return `${normalizeGameName(game.title)}${extension}`;
}

/** A DAT name as a file name: the characters a file system refuses are dropped. */
function normalizeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '').trim() || 'rom';
}

/** The rom-manager system a version belongs in, when no DAT places it. */
export function systemFolderOf(system: string, version: Pick<OldVersion, 'platform' | 'file'>): string {
  if (system === 'megadrive') return 'MegaDrive';
  if (system === 'snes') return 'SNES';
  if (system === 'neogeo') return 'NEOGEO';
  const platform = version.platform ?? (/\.gbc$/i.test(version.file) ? 'gbc' : /\.gb$/i.test(version.file) ? 'gb' : 'gba');
  return platform === 'gb' ? 'GAMEBOY' : platform === 'gbc' ? 'GBC' : 'GBA';
}

/** The CRC32 of a version as rom-manager writes it, when the old index has it. */
export const crcOf = (version: Pick<OldVersion, 'crc32'>): string | undefined =>
  version.crc32 === undefined ? undefined : crcHex(version.crc32);
