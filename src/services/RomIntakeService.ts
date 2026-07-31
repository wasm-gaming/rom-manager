/**
 * Adding games the library does not have yet.
 *
 * Dropping a file on the app is the one way a ROM arrives without the user
 * having said where it goes, so this works it out: the file is hashed, the
 * catalogues its name makes plausible are read, and the release that answers
 * decides the system and the folder — which is then created if the library has
 * never held that system before.
 *
 * An archive is opened first and each of its entries taken in on its own, since
 * a zipped game is what a game usually arrives as. It is unzipped rather than
 * kept as it is: the library is scanned by hashing its files against the
 * catalogue, and an archive would be a stranger there forever.
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
import { refusalOf, type ZipEntry, type ZipRefusal } from '../core/zip-directory';
import { extract, isArchive, readArchive } from './ArchiveService';
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

/** Where the bytes come from once there is a reason to read them. */
export type IntakeSource =
  | { kind: 'file'; file: File }
  | { kind: 'entry'; archive: File; entry: ZipEntry };

/** A game on its way in, and what is to become of it. */
export interface IntakeItem {
  /** The name it takes on disk: the file's own, or the archive entry's. */
  name: string;
  /** Size expanded, which is what says a cartridge from a disc image. */
  size: number;
  source: IntakeSource;
  /** The archive it came out of, absent for a file dropped as it is. */
  archive?: string;
  /** Absent for a file no catalogue could hold, which is never hashed. */
  crc32?: string;
  /** The game it is, absent when no catalogue claims it. */
  match?: IntakeMatch;
  /** Where it would be written, absent when there is nowhere to put it. */
  path?: string;
  /** True when something already sits there, which is never overwritten. */
  taken?: boolean;
  /** Why this one is not on the table at all, when that is the case. */
  refused?: ZipRefusal;
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

/** True for a game that has somewhere to go and nothing in the way. */
export function isPlaced(item: IntakeItem): boolean {
  return item.path !== undefined && !item.taken && !item.refused;
}

function parentOf(path: string): string {
  const separator = path.lastIndexOf('/');
  return separator === -1 ? '' : path.slice(0, separator);
}

/** `roms/Sonic (USA).md` -> `Sonic (USA).md`: folders inside an archive are not kept. */
function nameOf(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

export class RomIntakeService {
  /**
   * Work out what each dropped file is and where it would go, without writing
   * anything.
   *
   * A file whose name points at no catalogue is not hashed at all: reading six
   * hundred megabytes to learn nothing is not worth the wait. Neither is one
   * that came out of an archive, which already knows its own checksum — that is
   * what an archive keeps an index for.
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
    const items = await this.unpack(files);
    const total = items.length;

    for (const [done, item] of items.entries()) {
      if (item.refused) continue;

      const candidates = candidateSystemsOf(item, available);
      if (candidates.length === 0) continue;

      // An entry arrives knowing its own checksum; a loose file has to be read
      // from end to end for it.
      if (!item.crc32 && item.source.kind === 'file') {
        const report = (read: number) =>
          onProgress?.({ file: item.name, read, size: item.size, done, total });

        report(0);
        item.crc32 = await streamCRC32(item.source.file.stream(), report);
      }

      if (!item.crc32) continue;

      const found = await this.release(candidates, item.crc32, item.size);
      item.match = found?.match;
      item.path = found ? `${found.folder}/${item.name}` : undefined;
    }

    return this.settle(node, items);
  }

  /**
   * Turn the drop into the games it holds.
   *
   * An archive stands for its entries and not for itself, so it is opened and
   * each one taken in on its own — an archive of a whole system arrives as one
   * file and is a hundred games. One that cannot be read stays a single item
   * saying why, because a drop that silently does nothing is worse than one that
   * explains itself.
   */
  private static async unpack(files: File[]): Promise<IntakeItem[]> {
    const items: IntakeItem[] = [];

    for (const file of files) {
      const source = { kind: 'file', file } as const;

      if (!(await isArchive(file))) {
        items.push({ name: file.name, size: file.size, source });
        continue;
      }

      const contents = await readArchive(file).catch(() => ({ refused: 'damaged' as const }));

      if ('refused' in contents) {
        items.push({ name: file.name, size: file.size, source, refused: contents.refused });
        continue;
      }

      for (const entry of contents.entries) {
        if (entry.directory) continue;

        items.push({
          name: nameOf(entry.name),
          size: entry.size,
          source: { kind: 'entry', archive: file, entry },
          archive: file.name,
          // The index carries the checksum of the entry expanded, which is the
          // very thing the catalogues are keyed by. It is a claim until `apply`
          // checks it against the bytes.
          crc32: refusalOf(entry) ? undefined : entry.crc32,
          refused: refusalOf(entry),
        });
      }
    }

    return items;
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
      if (item.refused) continue;
      if (!item.path && shared) item.path = `${shared}/${item.name}`;
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
   *
   * An entry is expanded here and not before, and its checksum is checked
   * against the bytes that come out — so an archive whose index did not describe
   * what it held stops the run instead of quietly writing something else.
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
      onProgress?.({ file: item.name, done: written.length, total: pending.length });

      const bytes =
        item.source.kind === 'file'
          ? new Uint8Array(await item.source.file.arrayBuffer())
          : await extract(item.source.archive, item.source.entry);

      await ensureDir(node, parentOf(item.path!), made);
      await node.writeFile(item.path!, bytes);
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
