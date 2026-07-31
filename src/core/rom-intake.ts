/**
 * Taking in a game that arrives from outside the library.
 *
 * A dropped file brings no folder with it, so where it belongs has to be worked
 * out from what it turns out to be. This module holds the part of that decision
 * that is pure: which catalogues are worth reading for a given file, which
 * release inside a catalogue its checksum names, and which folder that release
 * lives in.
 *
 * The file keeps the name it arrived with. Renaming to the catalogue spelling is
 * what organizing a system does — to every file at once, with a preview and an
 * undo — and a drop is a copy, not a rearrangement.
 */

import type { DatGame, GameGroup, GameVariant } from './rom-grouping';

export type SystemMedia = 'cartridge' | 'disc';

/** A system the datasets cover, and how it stores its games. */
export interface DatasetSystem {
  system: string;
  media: SystemMedia;
}

/**
 * Catalogues worth reading for a file with a given extension.
 *
 * The extension never decides what a file is — the checksum does — but reading
 * a catalogue means downloading it, so this is what keeps a dropped `.sfc` from
 * pulling in twenty datasets to answer a question one of them can. Extensions
 * are listed as the wild spells them, copier suffixes included, and not as the
 * datasets happen to name their entries.
 *
 * A raw `.bin` names no system at all, so every catalogue that stores its games
 * that way has to be looked in: cartridges first, because they are the small
 * downloads, and then the disc systems in the order a disc image is likely to
 * belong to one.
 */
const SYSTEMS_BY_EXTENSION: Readonly<Record<string, readonly string[]>> = {
  nes: ['NES'],
  unh: ['NES'],
  unf: ['NES'],
  unif: ['NES'],
  fds: ['NES'],
  sfc: ['SNES'],
  smc: ['SNES'],
  swc: ['SNES'],
  fig: ['SNES'],
  gb: ['GAMEBOY'],
  gbc: ['GBC'],
  gba: ['GBA'],
  z64: ['N64'],
  n64: ['N64'],
  v64: ['N64'],
  min: ['PokemonMini'],
  sms: ['SMS', 'GameGear'],
  gg: ['GameGear'],
  md: ['MegaDrive'],
  gen: ['MegaDrive'],
  smd: ['MegaDrive'],
  '32x': ['S32X'],
  pce: ['TGFX16'],
  sgx: ['TGFX16'],
  a26: ['Atari2600'],
  a52: ['ATARI5200'],
  a78: ['ATARI7800'],
  lnx: ['AtariLynx'],
  lyx: ['AtariLynx'],
  ws: ['WonderSwan'],
  wsc: ['WonderSwanColor'],
  bin: [
    'MegaDrive',
    'Atari2600',
    'ATARI7800',
    'ATARI5200',
    'S32X',
    'PSX',
    'Saturn',
    'MegaCD',
    'TGFX16-CD',
    'NeoGeo-CD',
  ],
};

/**
 * Ceiling above the largest cartridge there is, which is a Neo Geo one: the
 * `.neo` of Metal Slug 3 measures 90 MiB, well past the 64 MiB of Resident
 * Evil 2 on the N64 that this limit used to be cut to.
 *
 * A file bigger than this cannot be a cartridge whatever its extension says,
 * which is what keeps a disc track named `.bin` from downloading every
 * cartridge catalogue on the way to the right answer. The exact figure is a
 * round number and not a record: it only has to sit above the largest cartridge
 * and below a disc image.
 */
export const CARTRIDGE_SIZE_LIMIT = 100 * 1024 * 1024;

/** `Sonic (USA).md` -> `md`. Empty for a name that carries no extension. */
export function romExtensionOf(name: string): string {
  const file = name.split(/[/\\]/).pop() ?? '';
  const dot = file.lastIndexOf('.');

  return dot <= 0 ? '' : file.slice(dot + 1).toLowerCase();
}

/**
 * The catalogues a dropped file is worth looking up in, in the order they are
 * worth reading.
 *
 * Only systems the datasets actually cover come back, so a name that points at
 * one the app does not have is the same as a name that points at nothing.
 */
export function candidateSystemsOf(
  file: { name: string; size: number },
  available: readonly DatasetSystem[],
): DatasetSystem[] {
  const named = SYSTEMS_BY_EXTENSION[romExtensionOf(file.name)] ?? [];
  const known = new Map(available.map((entry) => [entry.system, entry]));

  return named
    .map((system) => known.get(system))
    .filter(
      (entry): entry is DatasetSystem =>
        entry !== undefined && (entry.media === 'disc' || file.size <= CARTRIDGE_SIZE_LIMIT),
    );
}

/** A release of a game, and the entry of it a checksum matched. */
export interface Release {
  group: GameGroup;
  variant: GameVariant;
  entry: DatGame;
}

/**
 * The release a checksum names inside a catalogue.
 *
 * The size is checked alongside it for the same reason matching a whole folder
 * does: CRC32 is 32 bits wide against tens of thousands of entries, so the size
 * is what keeps an accidental collision from being read as the game.
 */
export function findRelease(
  groups: readonly GameGroup[],
  crc32: string,
  size: number,
): Release | undefined {
  const wanted = crc32.toUpperCase();

  for (const group of groups) {
    for (const variant of group.variants) {
      for (const entry of variant.files) {
        if (entry.crc.toUpperCase() !== wanted) continue;
        if (entry.size !== undefined && entry.size !== size) continue;

        return { group, variant, entry };
      }
    }
  }

  return undefined;
}

/**
 * The folder a release lives in.
 *
 * The same layout organizing produces, so a game added by dropping it lands
 * where the manager would have put it and does not have to be moved afterwards:
 * cartridges loose in the system folder, discs in a folder of their own because
 * a release there is several files that have to stay together.
 */
export function intakeFolderOf(
  system: string,
  media: SystemMedia,
  group: GameGroup,
  variant: GameVariant,
): string {
  return media === 'disc' ? `${system}/${group.id}/${variant.key}` : system;
}

/**
 * The folder the files no catalogue claimed go in, when the rest of the drop
 * leaves no doubt about it.
 *
 * A disc release is several files that only work together, and the catalogue
 * lists the tracks and not the `.cue` that points at them, so what arrived with
 * one belongs in its folder. A cartridge takes nothing along — it is one file,
 * and an image dropped next to it is a boxart, which is a different thing
 * entirely — and neither does a drop spanning several releases, since there is
 * no answer there to be had.
 */
export function companionFolderOf(
  placed: readonly { media: SystemMedia; folder: string }[],
): string | undefined {
  const folders = new Set(
    placed.filter((entry) => entry.media === 'disc').map((entry) => entry.folder),
  );

  return folders.size === 1 ? [...folders][0] : undefined;
}
