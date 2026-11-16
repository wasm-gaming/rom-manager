/**
 * Mods: IPS / BPS / UPS patches kept beside the library, never applied to the stored ROM.
 *
 * - The patch itself: `.meta/<System>/mods/<sha1>.<format>`, outside the ROM folders, so
 *   scans and organizing never see it.
 * - What is known about it: `.meta/<System>/mods.json` (name, format, CRCs, the game it
 *   belongs to by `gameId`).
 *
 * A BPS / UPS names the ROM it is made for by CRC32, so it finds its game in the
 * library indexes. An IPS says nothing: it goes to the game on screen, or waits
 * unassigned in the system on screen. Every change rewrites the mods of the index.
 */

import { ownerOfCrc, type ModRecord } from '../helpers/library-index';
import { crcHex, modNameOf, parsePatch, PatchError } from '../helpers/patch';
import { calculateSHA1 } from './ChecksumService';
import { LibraryIndexService, readMods, writeMods } from './LibraryIndexService';
import { META_DIR } from './RomLibraryService';
import type { StorageNode } from './StorageService';

export const modsDirOf = (system: string): string => `${META_DIR}/${system}/mods`;

/** Where the mods being added are going, as far as the screen says. */
export interface ModContext {
  system?: string;
  gameId?: string;
}

export type ModRefusal = 'not-a-patch' | 'damaged' | 'no-system';

export interface ModImportResult {
  added: Array<{ name: string; system: string; gameId?: string }>;
  duplicates: string[];
  rejected: Array<{ name: string; reason: ModRefusal }>;
}

async function ensureModsDir(node: StorageNode, system: string): Promise<void> {
  for (const path of [META_DIR, `${META_DIR}/${system}`, modsDirOf(system)]) {
    try {
      await node.createDirectory(path);
    } catch {
      // Already there.
    }
  }
}

export class ModService {
  static list(node: StorageNode, system: string): Promise<ModRecord[]> {
    return readMods(node, system);
  }

  /** Takes patch files in. Returns what happened, for the screen to say. */
  static async import(node: StorageNode, files: readonly File[], context: ModContext = {}): Promise<ModImportResult> {
    const result: ModImportResult = { added: [], duplicates: [], rejected: [] };
    const indexes = await LibraryIndexService.readAll(node);
    const registries = new Map<string, ModRecord[]>();
    const registryOf = async (system: string) => {
      let mods = registries.get(system);
      if (!mods) registries.set(system, (mods = await readMods(node, system)));
      return mods;
    };

    for (const file of files) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      let info;
      try {
        info = parsePatch(bytes);
      } catch (err) {
        result.rejected.push({ name: file.name, reason: err instanceof PatchError && err.code === 'not-a-patch' ? 'not-a-patch' : 'damaged' });
        continue;
      }
      if (!info.valid) {
        result.rejected.push({ name: file.name, reason: 'damaged' });
        continue;
      }
      const sourceCrc = info.sourceCrc === null ? undefined : crcHex(info.sourceCrc);
      const owner = sourceCrc ? ownerOfCrc(indexes, sourceCrc) : undefined;
      const system = owner?.system ?? context.system;
      if (!system) {
        result.rejected.push({ name: file.name, reason: 'no-system' });
        continue;
      }
      const gameId = owner?.gameId ?? (context.system === system ? context.gameId : undefined);
      const sha1 = (await calculateSHA1(bytes.buffer as ArrayBuffer)).toLowerCase();
      const mods = await registryOf(system);
      if (mods.some((mod) => mod.sha1 === sha1)) {
        result.duplicates.push(file.name);
        continue;
      }
      const record: ModRecord = {
        sha1,
        name: modNameOf(file.name),
        format: info.format,
        file: `${sha1}.${info.format}`,
        ...(sourceCrc ? { sourceCrc } : {}),
        ...(info.targetCrc !== null ? { targetCrc: crcHex(info.targetCrc) } : {}),
        ...(info.sourceSize !== null ? { sourceSize: info.sourceSize } : {}),
        ...(info.targetSize !== null ? { targetSize: info.targetSize } : {}),
        ...(gameId ? { gameId } : {}),
        addedAt: new Date().toISOString(),
      };
      await ensureModsDir(node, system);
      await node.writeFile(`${modsDirOf(system)}/${record.file}`, bytes);
      mods.push(record);
      result.added.push({ name: record.name, system, ...(gameId ? { gameId } : {}) });
    }

    for (const [system, mods] of registries) {
      if (!result.added.some((added) => added.system === system)) continue;
      await writeMods(node, system, mods);
      await LibraryIndexService.updateMods(node, system);
    }
    return result;
  }

  /** Changes one mod's record (its name, or the game it belongs to; `gameId: undefined` unassigns it). */
  static async update(
    node: StorageNode,
    system: string,
    sha1: string,
    changes: { name?: string; gameId?: string | undefined },
  ): Promise<ModRecord[]> {
    const mods = await readMods(node, system);
    const next = mods.map((mod) => {
      if (mod.sha1 !== sha1) return mod;
      const updated: ModRecord = { ...mod };
      const name = changes.name?.trim();
      if (name) updated.name = name;
      if ('gameId' in changes) {
        if (changes.gameId) updated.gameId = changes.gameId;
        else delete updated.gameId;
      }
      return updated;
    });
    await writeMods(node, system, next);
    await LibraryIndexService.updateMods(node, system);
    return next;
  }

  /** Removes a mod: its record and its patch file. */
  static async remove(node: StorageNode, system: string, sha1: string): Promise<ModRecord[]> {
    const mods = await readMods(node, system);
    const gone = mods.find((mod) => mod.sha1 === sha1);
    const next = mods.filter((mod) => mod.sha1 !== sha1);
    await writeMods(node, system, next);
    if (gone) await node.remove(`${modsDirOf(system)}/${gone.file}`).catch(() => {});
    await LibraryIndexService.updateMods(node, system);
    return next;
  }

  /** The patch bytes, for whoever applies it. */
  static read(node: StorageNode, system: string, mod: Pick<ModRecord, 'file'>): Promise<Uint8Array> {
    return node.readFile(`${modsDirOf(system)}/${mod.file}`);
  }
}
