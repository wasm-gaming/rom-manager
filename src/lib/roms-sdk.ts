/**
 * `/roms/roms-sdk.js`: rom-manager's library as a module, for the app that hosts it.
 *
 * play.germade loads it at run time, the way it loads engine apps:
 *
 *     const roms = await import('/roms/roms-sdk.js');
 *     const index = await roms.readIndex('MegaDrive');
 *
 * It is the same code the `/roms/` app runs (the intake, the DATs, the mods, the index),
 * so the launcher adds, reads and removes without a second copy of any of it. No UI and
 * no store: services and helpers only. Datasets resolve against `/roms/`, the build's base.
 *
 * `API_VERSION` changes when a signature or a result shape does.
 */

import type { LibraryIndex } from '../helpers/library-index';
import { applyPatch, crc32, crcHex, isPatchName } from '../helpers/patch';
import { LibraryIndexService } from './LibraryIndexService';
import { ModService, type ModImportResult } from './ModService';
import { PlayGermadeMigration, type MigrationReport } from './PlayGermadeMigration';
import { RomIntakeService, isPlaced, itemsOf } from './RomIntakeService';
import { RomLibrary } from './RomLibraryService';
import { storageService, type StorageNode } from './StorageService';

export const API_VERSION = 1;

export type { LibraryIndex, MigrationReport, ModImportResult };
export { PatchError } from '../helpers/patch';

let library: Promise<StorageNode> | undefined;

/** The library in OPFS (`rom-manager/library/`), the same one the app opens. Opened once. */
export function openLibrary(): Promise<StorageNode> {
  library ??= (async () => {
    const node = storageService.createNodeInstance();
    await node.initializeLibrary();
    return node;
  })();
  library.catch(() => (library = undefined));
  return library;
}

const systemOfPath = (path: string): string => path.slice(0, Math.max(0, path.indexOf('/')));

/** One system's index, or undefined when it has none yet. */
export async function readIndex(system: string): Promise<LibraryIndex | undefined> {
  return LibraryIndexService.read(await openLibrary(), system);
}

/** Every system's index. */
export async function readIndexes(): Promise<LibraryIndex[]> {
  return LibraryIndexService.readAll(await openLibrary());
}

/** A file of the library by its path (a version's `path`, a mod's `path`), as bytes. */
export async function readFile(path: string): Promise<Uint8Array> {
  return (await openLibrary()).readFile(path);
}

/**
 * A ROM, with a mod applied in memory when `modPath` is given. Throws a `PatchError`
 * (with its `code`) when the mod does not apply. `crc` is the result's CRC32.
 */
export async function readRomWithMod(path: string, modPath?: string): Promise<{ rom: Uint8Array; crc: string }> {
  const node = await openLibrary();
  const original = await node.readFile(path);
  const rom = modPath ? applyPatch(original, await node.readFile(modPath)) : original;
  return { rom, crc: crcHex(crc32(rom)) };
}

export interface AddOptions {
  /**
   * Where a ROM no DAT knows goes (a rom-manager system folder, `MegaDrive`), or a
   * function that says so per file name. Without it, such ROMs are refused.
   */
  system?: string | ((fileName: string) => string | undefined);
  /** The game mods without a source CRC (IPS) belong to, by `gameId`. */
  gameId?: string;
}

export type AddRefusal = 'unknown' | 'archive' | 'not-a-rom';

export interface AddResult {
  /** Library paths written. */
  added: string[];
  /** Files that were in the library already (by checksum). */
  already: string[];
  refused: Array<{ name: string; reason: AddRefusal }>;
  mods: ModImportResult;
  /** Systems whose index was rewritten. */
  systems: string[];
}

/**
 * The app's intake, without its confirmation step: zips opened, ROMs identified by DAT
 * and placed, patches taken as mods after the ROMs, the indexes rewritten.
 */
export async function addFiles(files: readonly File[], options: AddOptions = {}): Promise<AddResult> {
  const node = await openLibrary();
  const patches = files.filter((file) => isPatchName(file.name));
  const roms = files.filter((file) => !isPatchName(file.name));
  const result: AddResult = { added: [], already: [], refused: [], mods: { added: [], duplicates: [], rejected: [] }, systems: [] };
  const touched = new Set<string>();

  if (roms.length > 0) {
    const items = await RomIntakeService.identify(node, [...roms]);
    const written = await RomIntakeService.apply(node, items);
    result.added.push(...written);
    for (const path of written) touched.add(systemOfPath(path));
    for (const file of roms) {
      const mine = itemsOf(file, items);
      if (mine.some(isPlaced)) continue;
      if (mine.some((item) => item.match && item.taken)) {
        result.already.push(file.name);
        continue;
      }
      if (mine.length > 0 && mine.every((item) => item.refused)) {
        result.refused.push({ name: file.name, reason: 'archive' });
        continue;
      }
      const system = typeof options.system === 'function' ? options.system(file.name) : options.system;
      if (!system) {
        result.refused.push({ name: file.name, reason: 'unknown' });
        continue;
      }
      const path = `${system}/${file.name}`;
      if (await node.exists(path)) {
        result.already.push(file.name);
        continue;
      }
      try {
        await node.createDirectory(system);
      } catch {
        // Already there.
      }
      await node.writeFile(path, new Uint8Array(await file.arrayBuffer()));
      result.added.push(path);
      touched.add(system);
    }
    // The indexes before the mods: a BPS / UPS finds its game there.
    await LibraryIndexService.refreshMany(node, touched);
  }

  if (patches.length > 0) {
    const system = typeof options.system === 'string' ? options.system : undefined;
    result.mods = await ModService.import(node, patches, { system, gameId: options.gameId });
    for (const added of result.mods.added) touched.add(added.system);
  }

  result.systems = [...touched].filter(Boolean).sort();
  return result;
}

/** Removes a version's file, its record, and rewrites its system's index. */
export async function removeVersion(path: string): Promise<void> {
  const node = await openLibrary();
  await node.remove(path);
  await new RomLibrary(node).remove(path).catch(() => {});
  await LibraryIndexService.refresh(node, systemOfPath(path));
}

/** Removes a mod (its record and its patch) and rewrites its system's index. */
export async function removeMod(system: string, sha1: string): Promise<void> {
  await ModService.remove(await openLibrary(), system, sha1);
}

/** Changes a mod's name, or the game it belongs to (`gameId: undefined` unassigns it). */
export async function updateMod(system: string, sha1: string, changes: { name?: string; gameId?: string | undefined }): Promise<void> {
  await ModService.update(await openLibrary(), system, sha1, changes);
}

/** Whether play.germade's old library has been moved in. */
export async function migrated(): Promise<boolean> {
  return PlayGermadeMigration.done(await openLibrary());
}

/** Moves play.germade's old OPFS `library/` in, once (see `PlayGermadeMigration`). */
export async function migrateFromPlayGermade(
  onProgress?: (step: { done: number; total: number }) => void,
): Promise<MigrationReport | undefined> {
  return PlayGermadeMigration.run(await openLibrary(), undefined, onProgress);
}
