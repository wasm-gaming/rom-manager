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
import { applyPatch, crc32, crcHex } from '../helpers/patch';
import { AddService, systemOfPath, type AddOptions, type AddRefusal, type AddResult } from './AddService';
import { LibraryIndexService } from './LibraryIndexService';
import { ModService, type ModImportResult } from './ModService';
import { PlayGermadeMigration, type MigrationReport } from './PlayGermadeMigration';
import { RomLibrary } from './RomLibraryService';
import { storageService, type StorageNode } from './StorageService';

export const API_VERSION = 1;

export type { AddOptions, AddRefusal, AddResult, LibraryIndex, MigrationReport, ModImportResult };
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

/**
 * The app's intake, without its confirmation step: zips opened, ROMs identified by DAT
 * and placed, patches taken as mods after the ROMs, the indexes rewritten.
 */
export async function addFiles(files: readonly File[], options: AddOptions = {}): Promise<AddResult> {
  const node = await openLibrary();
  const preview = await AddService.preview(node, files);
  return AddService.apply(node, files, preview.items, options);
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
