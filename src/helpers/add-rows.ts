/**
 * The rows of the "add" dialog (`roms-sdk.js` `openAddDialog`): what each dropped file is and
 * what "Añadir" will do with it, before anything is written.
 *
 * Pure: it reads what the intake's `identify` found for each file (the shapes below are the
 * parts of `IntakeItem` it needs), what each patch says about itself, and the library's
 * indexes. The dialog recomputes the rows whenever a file is dropped or taken off the list, so
 * a mod "fits" only while the ROM it was made for is still on the list or in the library.
 */

import { ownerOfCrc, type LibraryIndex } from './library-index';
import type { PatchFormat } from './patch';

/** The parts of an intake item the rows read. */
export interface RowItem {
  crc32?: string;
  match?: { system: string; gameId: string; title: string; variant: string };
  path?: string;
  taken?: boolean;
  refused?: string;
}

/** What a patch file said about itself when read. */
export interface RowPatch {
  format?: PatchFormat;
  /** 8 upper-case hex digits, for BPS / UPS. */
  sourceCrc?: string;
  error?: 'not-a-patch' | 'damaged';
}

/** One dropped file: a ROM (or a zip) with its intake items, or a patch. */
export interface RowFile {
  name: string;
  items?: readonly RowItem[];
  patch?: RowPatch;
}

export interface RowContext {
  /** Where a ROM no DAT knows goes, as `addFiles` takes it. */
  system?: string | ((fileName: string) => string | undefined);
  /** The game an IPS (or an unowned BPS / UPS) is assigned to. */
  gameId?: string;
  indexes: readonly LibraryIndex[];
}

export type AddRowState =
  /** A DAT knows it, and it will be written. */
  | 'recognized'
  /** A DAT knows it, and the library has it already. */
  | 'already'
  /** No DAT knows it: it goes to `system` when there is one, else it is not added. */
  | 'unknown'
  /** A zip with nothing readable in it (`reason` is the zip refusal). */
  | 'refused'
  /** A patch that will be added (`title` is its game, absent while unassigned). */
  | 'mod'
  /** A patch that will not be added (`reason`: not-a-patch, damaged, no-system). */
  | 'mod-refused';

export interface AddRow {
  name: string;
  kind: 'rom' | 'mod';
  state: AddRowState;
  /** The game: the DAT's title for a ROM, the owner's for a mod. */
  title?: string;
  /** The release inside the game (`World-rev1`). */
  variant?: string;
  /** The system it goes to. */
  system?: string;
  /** More games in the same zip, beyond the one named. */
  more?: number;
  reason?: string;
  /** For a mod: true when a BPS / UPS was made for a ROM here; false for one assigned unchecked. */
  fits?: boolean;
  /** Whether "Añadir" writes something for this file. */
  adds: boolean;
}

const systemFor = (context: RowContext, name: string): string | undefined =>
  typeof context.system === 'function' ? context.system(name) : context.system;

/** The row of a ROM file (or a zip of them). */
export function romRowOf(file: RowFile, context: RowContext): AddRow {
  const items = file.items ?? [];
  const known = items.filter((item) => item.match);
  const placed = known.filter((item) => item.path && !item.taken && !item.refused);

  if (placed.length > 0) {
    const { title, variant, system } = placed[0].match!;
    return { name: file.name, kind: 'rom', state: 'recognized', title, variant, system, adds: true, ...(placed.length > 1 ? { more: placed.length - 1 } : {}) };
  }
  if (known.some((item) => item.taken)) {
    const { title, variant, system } = known.find((item) => item.taken)!.match!;
    return { name: file.name, kind: 'rom', state: 'already', title, variant, system, adds: false };
  }
  if (items.length > 0 && items.every((item) => item.refused)) {
    return { name: file.name, kind: 'rom', state: 'refused', reason: items[0].refused, adds: false };
  }
  const system = systemFor(context, file.name);
  return { name: file.name, kind: 'rom', state: 'unknown', ...(system ? { system } : {}), adds: Boolean(system) };
}

/** The game a BPS / UPS was made for, among the ROMs on the list. */
function ownerInDrop(rows: readonly AddRow[], files: readonly RowFile[], crc: string) {
  for (const [i, file] of files.entries()) {
    const row = rows[i];
    if (!row || row.kind !== 'rom' || (row.state !== 'recognized' && row.state !== 'already')) continue;
    const item = file.items?.find((candidate) => candidate.match && candidate.crc32?.toUpperCase() === crc);
    if (item) return { system: item.match!.system, title: item.match!.title };
  }
  return undefined;
}

const titleIn = (indexes: readonly LibraryIndex[], system: string, gameId: string): string | undefined =>
  indexes.find((index) => index.system === system)?.games[gameId]?.title;

/** Every file's row, in the order given. ROMs first, so a mod can find its game among them. */
export function addRowsOf(files: readonly RowFile[], context: RowContext): AddRow[] {
  const rows: AddRow[] = files.map((file) => (file.patch ? undefined : romRowOf(file, context))) as AddRow[];

  for (const [i, file] of files.entries()) {
    const patch = file.patch;
    if (!patch) continue;
    const base = { name: file.name, kind: 'mod' as const };

    if (patch.error) {
      rows[i] = { ...base, state: 'mod-refused', reason: patch.error, adds: false };
      continue;
    }
    const crc = patch.sourceCrc?.toUpperCase();
    const library = crc ? ownerOfCrc(context.indexes, crc) : undefined;
    if (library) {
      rows[i] = { ...base, state: 'mod', system: library.system, title: titleIn(context.indexes, library.system, library.gameId), fits: true, adds: true };
      continue;
    }
    const dropped = crc ? ownerInDrop(rows, files, crc) : undefined;
    if (dropped) {
      rows[i] = { ...base, state: 'mod', system: dropped.system, title: dropped.title, fits: true, adds: true };
      continue;
    }
    const system = typeof context.system === 'string' ? context.system : undefined;
    if (!system) {
      rows[i] = { ...base, state: 'mod-refused', reason: 'no-system', adds: false };
      continue;
    }
    const title = context.gameId ? titleIn(context.indexes, system, context.gameId) ?? context.gameId : undefined;
    rows[i] = { ...base, state: 'mod', system, ...(title ? { title, fits: false } : {}), adds: true };
  }

  return rows;
}

/** Whether "Añadir" has anything to do. */
export const anyAdds = (rows: readonly AddRow[]): boolean => rows.some((row) => row.adds);
