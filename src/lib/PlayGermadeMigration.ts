/**
 * The one-time move of play.germade's own ROM library into this one, when rom-manager is
 * play.germade's `/roms/` (same origin, so its OPFS `library/` is readable).
 *
 * - ROMs go through the normal intake, so the DATs name and place them; what no DAT
 *   knows is written to its system's folder under its own name.
 * - The indexes are written next, so the mods can find their games: a BPS / UPS by its
 *   source CRC, an IPS by the version it was assigned to.
 * - Titles the player renamed are kept in the placed file's record.
 * - `.meta/migrated-from-play-germade.json` marks it done, with what moved.
 *
 * The old folder is left alone: play.germade removes it once it reads the new index.
 */

import { ownerOfCrc } from '../helpers/library-index';
import { crc32, crcHex } from '../helpers/patch';
import {
  OLD_SYSTEMS,
  intakeNameOf,
  parseOldIndex,
  systemFolderOf,
  type OldGame,
  type OldIndex,
  type OldVersion,
} from '../helpers/play-germade-library';
import { LibraryIndexService } from './LibraryIndexService';
import { ModService, type ModImportResult } from './ModService';
import { META_DIR, RomLibrary, emptyRecord } from './RomLibraryService';
import { RomIntakeService, isPlaced, itemsOf } from './RomIntakeService';
import type { StorageNode } from './StorageService';

export const MIGRATION_MARKER = `${META_DIR}/migrated-from-play-germade.json`;

/** Read access to play.germade's old `library/` folder. */
export interface OldLibrary {
  /** A file under `library/<system>/`, e.g. `('snes', 'roms/<sha1>.sfc')`; undefined when missing. */
  read(system: string, path: string): Promise<Uint8Array | undefined>;
}

export interface MigrationReport {
  at: string;
  /** ROMs placed by the DATs. */
  placed: number;
  /** ROMs no DAT knows, written as they were. */
  copied: number;
  /** ROMs that were in this library already. */
  already: number;
  /** Files the old index named that were not there to read. */
  missing: number;
  mods: ModImportResult;
  /** Renamed titles carried over. */
  renamed: number;
  systems: string[];
}

/** play.germade's `library/` in this origin's OPFS. */
export function opfsOldLibrary(): OldLibrary {
  return {
    async read(system, path) {
      try {
        let dir = await navigator.storage.getDirectory();
        const parts = ['library', system, ...path.split('/')];
        for (const part of parts.slice(0, -1)) dir = await dir.getDirectoryHandle(part);
        const file = await (await dir.getFileHandle(parts[parts.length - 1])).getFile();
        return new Uint8Array(await file.arrayBuffer());
      } catch {
        return undefined;
      }
    },
  };
}

interface Taken {
  system: string;
  gameId: string;
  game: OldGame;
  version: OldVersion;
  file: File;
  crc: string;
}

async function readIndex(old: OldLibrary, system: string): Promise<OldIndex | undefined> {
  const bytes = await old.read(system, 'index.json');
  if (!bytes) return undefined;
  try {
    return parseOldIndex(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return undefined;
  }
}

const emptyMods = (): ModImportResult => ({ added: [], duplicates: [], rejected: [] });

export class PlayGermadeMigration {
  static async done(node: StorageNode): Promise<boolean> {
    return node.exists(MIGRATION_MARKER);
  }

  /**
   * Moves the old library in, once. Returns what happened, or undefined when it had
   * already been done or there was nothing to move (the marker is written either way
   * once something was read, so it never runs twice).
   */
  static async run(
    node: StorageNode,
    old: OldLibrary = opfsOldLibrary(),
    onProgress?: (step: { done: number; total: number }) => void,
  ): Promise<MigrationReport | undefined> {
    if (await this.done(node)) return undefined;

    const indexes = new Map<string, OldIndex>();
    for (const system of OLD_SYSTEMS) {
      const index = await readIndex(old, system);
      if (index && (Object.keys(index.games).length > 0 || index.mods.length > 0 || index.bios)) indexes.set(system, index);
    }
    if (indexes.size === 0) return undefined;

    const report: MigrationReport = {
      at: new Date().toISOString(),
      placed: 0,
      copied: 0,
      already: 0,
      missing: 0,
      mods: emptyMods(),
      renamed: 0,
      systems: [],
    };

    // ROMs (and the Neo Geo BIOS), read once each.
    const taken: Taken[] = [];
    for (const [system, index] of indexes) {
      for (const [gameId, game] of Object.entries(index.games)) {
        for (const version of game.versions) {
          const bytes = await old.read(system, `roms/${version.file}`);
          if (!bytes) {
            report.missing += 1;
            continue;
          }
          const crc = version.crc32 !== undefined ? crcHex(version.crc32) : crcHex(crc32(bytes));
          const file = new File([bytes as BlobPart], intakeNameOf(system, game, version));
          taken.push({ system, gameId, game, version, file, crc });
        }
      }
      if (index.bios) {
        const bytes = await old.read(system, 'bios/neogeo.zip');
        if (bytes) {
          const game: OldGame = { title: 'neogeo', versions: [] };
          const version: OldVersion = { sha1: '0'.repeat(40), file: `${'0'.repeat(40)}.zip`, name: 'neogeo' };
          taken.push({ system, gameId: 'neogeo', game, version, file: new File([bytes as BlobPart], 'neogeo.zip'), crc: crcHex(crc32(bytes)) });
        } else {
          report.missing += 1;
        }
      }
    }

    const total = taken.length;
    onProgress?.({ done: 0, total });

    // The intake places what a DAT knows; the rest is written to its system's folder.
    const items = total > 0 ? await RomIntakeService.identify(node, taken.map((t) => t.file)) : [];
    const written = await RomIntakeService.apply(node, items);
    const pathsOf = new Map<Taken, string[]>();
    const touched = new Set<string>();
    let done = 0;
    for (const entry of taken) {
      const mine = itemsOf(entry.file, items);
      const placed = mine.filter(isPlaced).map((item) => item.path!).filter((path) => written.includes(path));
      const there = mine.filter((item) => item.match && item.taken && item.path).map((item) => item.path!);
      if (placed.length > 0) {
        report.placed += 1;
        pathsOf.set(entry, placed);
      } else if (there.length > 0) {
        report.already += 1;
        pathsOf.set(entry, there);
      } else {
        const folder = systemFolderOf(entry.system, entry.version);
        const path = `${folder}/${entry.file.name}`;
        if (await node.exists(path)) {
          report.already += 1;
        } else {
          try {
            await node.createDirectory(folder);
          } catch {
            // Already there.
          }
          await node.writeFile(path, new Uint8Array(await entry.file.arrayBuffer()));
          report.copied += 1;
        }
        pathsOf.set(entry, [path]);
      }
      for (const path of pathsOf.get(entry) ?? []) touched.add(path.slice(0, path.indexOf('/')));
      onProgress?.({ done: ++done, total });
    }

    // The indexes first: the mods find their games there.
    await LibraryIndexService.refreshMany(node, touched);
    const newIndexes = await LibraryIndexService.readAll(node);

    for (const [system, index] of indexes) {
      for (const mod of index.mods) {
        const bytes = await old.read(system, `patches/${mod.file}`);
        if (!bytes) {
          report.missing += 1;
          continue;
        }
        const extension = mod.file.slice(mod.file.lastIndexOf('.'));
        const file = new File([bytes as BlobPart], `${mod.name}${extension}`);
        // The game it was assigned to, found again by one of its versions' CRC32.
        const owned = mod.gameId ? taken.filter((t) => t.system === system && t.gameId === mod.gameId) : [];
        const owner = owned.map((t) => ownerOfCrc(newIndexes, t.crc)).find(Boolean);
        const fallback = owned[0] ? systemFolderOf(system, owned[0].version) : systemFolderOf(system, { file: mod.file });
        const result = await ModService.import(node, [file], owner ?? { system: fallback });
        report.mods.added.push(...result.added);
        report.mods.duplicates.push(...result.duplicates);
        report.mods.rejected.push(...result.rejected);
      }
    }

    // Titles the player chose.
    const library = new RomLibrary(node);
    for (const entry of taken) {
      if (!entry.game.renamed) continue;
      for (const path of pathsOf.get(entry) ?? []) {
        const record = (await library.read(path)) ?? emptyRecord();
        await library.write(path, { ...record, title: entry.game.title });
        report.renamed += 1;
      }
    }

    report.systems = [...touched].sort();
    try {
      await node.createDirectory(META_DIR);
    } catch {
      // Already there.
    }
    await node.writeFile(MIGRATION_MARKER, new TextEncoder().encode(`${JSON.stringify(report, null, 2)}\n`));
    return report;
  }
}
