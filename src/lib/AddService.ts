/**
 * Adding files to the library from outside the app: `roms-sdk.js` `addFiles`, and the add
 * dialog it opens (`openAddDialog`).
 *
 * In two halves, as the intake itself: `preview` only reads (what each ROM is, what each patch
 * says about itself), and is what the dialog shows; `apply` writes what was previewed, for the
 * files still on the list.
 */

import type { LibraryIndex } from '../helpers/library-index';
import type { RowPatch } from '../helpers/add-rows';
import { isPatchName, parsePatch, PatchError, crcHex } from '../helpers/patch';
import { LibraryIndexService } from './LibraryIndexService';
import { ModService, type ModImportResult } from './ModService';
import { RomIntakeService, isPlaced, itemsOf, type IntakeItem, type IntakeProgress } from './RomIntakeService';
import type { StorageNode } from './StorageService';

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

/** What a set of files is, before anything is written. */
export interface AddPreview {
  /** The intake's items for the ROM files (zips opened, DATs consulted). */
  items: IntakeItem[];
  /** What each patch file says about itself. */
  patches: Map<File, RowPatch>;
}

export const systemOfPath = (path: string): string => path.slice(0, Math.max(0, path.indexOf('/')));

async function patchOf(file: File): Promise<RowPatch> {
  try {
    const info = parsePatch(new Uint8Array(await file.arrayBuffer()));
    if (!info.valid) return { format: info.format, error: 'damaged' };
    return { format: info.format, ...(info.sourceCrc === null ? {} : { sourceCrc: crcHex(info.sourceCrc) }) };
  } catch (err) {
    return { error: err instanceof PatchError && err.code === 'not-a-patch' ? 'not-a-patch' : 'damaged' };
  }
}

export class AddService {
  /** Reads the files and says what each is. Writes nothing. */
  static async preview(node: StorageNode, files: readonly File[], onProgress?: (progress: IntakeProgress) => void): Promise<AddPreview> {
    const roms = files.filter((file) => !isPatchName(file.name));
    const patches = new Map<File, RowPatch>();
    for (const file of files) if (isPatchName(file.name)) patches.set(file, await patchOf(file));
    const items = roms.length > 0 ? await RomIntakeService.identify(node, [...roms], onProgress) : [];
    return { items, patches };
  }

  /** The library's indexes, which say where a BPS / UPS goes. */
  static indexes(node: StorageNode): Promise<LibraryIndex[]> {
    return LibraryIndexService.readAll(node);
  }

  /**
   * Writes `files` as `preview` saw them (`items` may hold more files' items: only those of
   * `files` are written). ROMs first, the indexes, then the mods, which find their game there.
   */
  static async apply(node: StorageNode, files: readonly File[], items: readonly IntakeItem[], options: AddOptions = {}): Promise<AddResult> {
    const patches = files.filter((file) => isPatchName(file.name));
    const roms = files.filter((file) => !isPatchName(file.name));
    const result: AddResult = { added: [], already: [], refused: [], mods: { added: [], duplicates: [], rejected: [] }, systems: [] };
    const touched = new Set<string>();

    if (roms.length > 0) {
      const mine = roms.flatMap((file) => itemsOf(file, items));
      const written = await RomIntakeService.apply(node, mine);
      result.added.push(...written);
      for (const path of written) touched.add(systemOfPath(path));
      for (const file of roms) {
        const own = itemsOf(file, mine);
        if (own.some(isPlaced)) continue;
        if (own.some((item) => item.match && item.taken)) {
          result.already.push(file.name);
          continue;
        }
        if (own.length > 0 && own.every((item) => item.refused)) {
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
}
