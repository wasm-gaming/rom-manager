/**
 * Adding games the library does not have yet.
 *
 * Dropping a file on the app is the one way a ROM arrives without the user
 * having said where it goes, so this works it out: the file is hashed, the
 * catalogues its name makes plausible are read, and the release that answers
 * decides the system and the folder — which is then created if the library has
 * never held that system before.
 *
 * Split in two on purpose. `identify` only reads, and what it returns is what
 * the user is shown; `apply` is the half that writes, and it never runs until
 * they have said so.
 */

import {
  candidateSystemsOf,
  companionFolderOf,
  findRelease,
  intakeFolderOf,
  type DatasetSystem,
  type SystemMedia,
} from '../core/rom-intake';
import { streamCRC32 } from './ChecksumService';
import { GAME_MARKER } from './LibraryScanService';
import { ensureDir } from './OrganizeService';
import type { StorageNode } from './StorageService';

/** The release a dropped file turned out to be. */
export interface IntakeMatch {
  system: string;
  media: SystemMedia;
  gameId: string;
  /** Title as the catalogue spells it, which is what the user confirms. */
  title: string;
  /** The release inside the game: `USA`, `Japan-rev1`, `Europe-beta2`. */
  variant: string;
}

/** A dropped file and what is to become of it. */
export interface IntakeItem {
  file: File;
  /** Absent for a file no catalogue could hold, which is never hashed. */
  crc32?: string;
  /** The game it is, absent when no catalogue claims it. */
  match?: IntakeMatch;
  /** Where it would be written, absent when there is nowhere to put it. */
  path?: string;
  /** True when something already sits there, which is never overwritten. */
  taken?: boolean;
}

export interface IntakeProgress {
  file: string;
  /** Bytes of that file read so far, against its size. */
  read: number;
  size: number;
  /** Files finished, against how many were dropped. */
  done: number;
  total: number;
}

/** True for a file that has somewhere to go and nothing in the way. */
export function isPlaced(item: IntakeItem): boolean {
  return item.path !== undefined && !item.taken;
}

function parentOf(path: string): string {
  const separator = path.lastIndexOf('/');
  return separator === -1 ? '' : path.slice(0, separator);
}

export class RomIntakeService {
  /**
   * Work out what each dropped file is and where it would go, without writing
   * anything.
   *
   * A file whose name points at no catalogue is not hashed at all: reading six
   * hundred megabytes to learn nothing is not worth the wait.
   */
  static async identify(
    node: StorageNode,
    files: File[],
    onProgress?: (progress: IntakeProgress) => void,
  ): Promise<IntakeItem[]> {
    // Loaded here rather than at the top, as organizing does: the dataset module
    // opens IndexedDB as it loads, and copying files should not need a browser.
    const { ROMDatasetService } = await import('./ROMDatasetService');

    const available = await ROMDatasetService.listSystems();
    const items: IntakeItem[] = [];

    for (const [done, file] of files.entries()) {
      const candidates = candidateSystemsOf(file, available);

      if (candidates.length === 0) {
        items.push({ file });
        continue;
      }

      onProgress?.({ file: file.name, read: 0, size: file.size, done, total: files.length });

      const crc32 = await streamCRC32(file.stream(), (read) =>
        onProgress?.({ file: file.name, read, size: file.size, done, total: files.length }),
      );

      const found = await this.release(candidates, crc32, file.size);

      items.push({
        file,
        crc32,
        match: found?.match,
        path: found ? `${found.folder}/${file.name}` : undefined,
      });
    }

    return this.settle(node, items);
  }

  /**
   * The first catalogue that claims a checksum.
   *
   * Reading one means downloading it, so they are tried in turn and the search
   * stops at the first answer: a checksum belongs to one release, and the
   * candidates were narrowed by the file's own name to begin with.
   */
  private static async release(
    candidates: DatasetSystem[],
    crc32: string,
    size: number,
  ): Promise<{ match: IntakeMatch; folder: string } | undefined> {
    const { GameCatalogService } = await import('./GameCatalogService');

    for (const { system, media } of candidates) {
      let groups;
      try {
        groups = await GameCatalogService.catalogueOf(system);
      } catch {
        // A catalogue that cannot be read only costs this one candidate.
        continue;
      }

      const release = findRelease(groups, crc32, size);
      if (!release) continue;

      return {
        match: {
          system,
          media,
          gameId: release.group.id,
          title: release.group.title,
          variant: release.variant.key,
        },
        folder: intakeFolderOf(system, media, release.group, release.variant),
      };
    }

    return undefined;
  }

  /**
   * Settle where the rest of the drop goes, once every file has been looked up.
   *
   * A file no catalogue claims still has somewhere to go when it arrived with a
   * disc release that landed in a single folder, which is what
   * `companionFolderOf` decides. Every file that ends up with a path is then
   * checked against what is already on disk, because a name already taken is
   * one this never writes.
   */
  private static async settle(node: StorageNode, items: IntakeItem[]): Promise<IntakeItem[]> {
    const shared = companionFolderOf(
      items.flatMap((item) =>
        item.match && item.path ? [{ media: item.match.media, folder: parentOf(item.path) }] : [],
      ),
    );

    for (const item of items) {
      if (!item.path && shared) item.path = `${shared}/${item.file.name}`;
      if (item.path) item.taken = await node.exists(item.path);
    }

    return items;
  }

  /**
   * Copy in what the user confirmed, making the folders it needs.
   *
   * Only files with somewhere to go and nothing in the way are written: a name
   * already taken is left alone, because overwriting a ROM the user already has
   * is not something a drop should be able to do.
   */
  static async apply(
    node: StorageNode,
    items: IntakeItem[],
    onProgress?: (progress: { file: string; done: number; total: number }) => void,
  ): Promise<string[]> {
    const pending = items.filter(isPlaced);
    const made = new Set<string>();
    const written: string[] = [];

    for (const item of pending) {
      onProgress?.({ file: item.file.name, done: written.length, total: pending.length });

      await ensureDir(node, parentOf(item.path!), made);
      await node.writeFile(item.path!, new Uint8Array(await item.file.arrayBuffer()));
      written.push(item.path!);

      if (item.match?.media === 'disc') await this.mark(node, item.match, made);
    }

    return written;
  }

  /**
   * Mark a disc game's folder as a game.
   *
   * On a disc system a folder is either a game the manager keeps or a
   * collection the user curates, and the marker is the whole difference: without
   * it the scan walks straight past what was just added.
   */
  private static async mark(
    node: StorageNode,
    match: IntakeMatch,
    made: Set<string>,
  ): Promise<void> {
    const folder = `${match.system}/${match.gameId}`;
    const path = `${folder}/${GAME_MARKER}`;
    if (await node.exists(path)) return;

    await ensureDir(node, folder, made);
    await node.writeFile(
      path,
      new TextEncoder().encode(
        JSON.stringify({ gameId: match.gameId, title: match.title, system: match.system }, null, 2),
      ),
    );
  }
}
