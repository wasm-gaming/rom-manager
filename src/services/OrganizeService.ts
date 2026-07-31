/**
 * Applying the canonical layout to the files on disk.
 *
 * This is the only part of the manager that moves the user's ROMs, so it is
 * built around two rules: nothing runs without a plan the user has seen, and
 * everything it does is written down first so it can be undone.
 */

import { planOrganization, type MoveOperation, type OrganizePlan } from '../core/rom-organize';
import { scanCachePathOf, type SystemMedia } from './LibraryScanService';
import { META_DIR, recordPathOf } from './RomLibraryService';
import type { StorageNode } from './StorageService';

const UNDO_VERSION = 1;

export const UNDO_DIR = `${META_DIR}/undo`;

/** Everything one run of `apply` did, in the order it did it. */
export interface UndoRecord {
  version: number;
  id: string;
  system: string;
  createdAt: string;
  moves: MoveOperation[];
  /** `game.json` files this run created. Ones that already existed are not listed. */
  markers: string[];
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function undoPathOf(id: string): string {
  return `${UNDO_DIR}/${id}.json`;
}

function parentOf(path: string): string {
  const slash = path.lastIndexOf('/');
  return slash === -1 ? '' : path.slice(0, slash);
}

/**
 * Create a folder and every folder above it.
 *
 * `mkdir` only makes one level, and the same parents come up thousands of
 * times in a run, so what has been made is remembered.
 */
export async function ensureDir(node: StorageNode, path: string, made: Set<string>): Promise<void> {
  if (path === '' || made.has(path)) return;

  const parent = parentOf(path);
  if (parent) await ensureDir(node, parent, made);

  try {
    await node.createDirectory(path);
  } catch {
    // Already there, which is the common case.
  }

  made.add(path);
}

async function writeJson(node: StorageNode, path: string, value: unknown): Promise<void> {
  await node.createDirectory(parentOf(path)).catch(() => undefined);
  await node.writeFile(path, encoder.encode(JSON.stringify(value, null, 2)));
}

export class OrganizeService {
  /** Work out what organizing a system would do, without touching anything. */
  static async plan(
    node: StorageNode,
    system: string,
    onProgress?: (done: number, total: number) => void,
  ): Promise<OrganizePlan> {
    // Loaded here rather than at the top: the dataset module opens IndexedDB
    // as it loads, which would tie applying a plan to running in a browser.
    const { ROMDatasetService } = await import('./ROMDatasetService');
    const { GameCatalogService } = await import('./GameCatalogService');

    const media = await ROMDatasetService.mediaOf(system);
    if (!media) throw new Error(`No dataset available for system: ${system}`);

    const match = await GameCatalogService.load(node, system, (progress) => {
      onProgress?.(progress.done, progress.total);
    });

    return planOrganization(system, media as SystemMedia, match);
  }

  /**
   * Carry out a plan.
   *
   * The log is written before the first file moves rather than after the last
   * one, because a run that stops halfway is exactly the case where undoing
   * matters. `undo` checks each step, so a log describing more than actually
   * happened is harmless.
   */
  static async apply(
    node: StorageNode,
    system: string,
    plan: OrganizePlan,
    onProgress?: (done: number, total: number) => void,
  ): Promise<UndoRecord> {
    const id = new Date().toISOString().replace(/[:.]/g, '-');
    const record: UndoRecord = {
      version: UNDO_VERSION,
      id,
      system,
      createdAt: new Date().toISOString(),
      moves: plan.moves,
      markers: [],
    };

    await writeJson(node, undoPathOf(id), record);

    const made = new Set<string>();
    const done: MoveOperation[] = [];
    const total = plan.moves.length + plan.markers.length;

    for (const move of plan.moves) {
      await ensureDir(node, parentOf(move.to), made);
      await node.move(move.from, move.to);
      done.push(move);

      // Metadata is keyed by the path of the ROM, so it has to follow it or
      // the notes the user wrote would be orphaned by the move.
      const from = recordPathOf(move.from);
      const to = recordPathOf(move.to);

      if (from !== to && (await node.exists(from))) {
        await ensureDir(node, parentOf(to), made);
        await node.move(from, to);
        done.push({ from, to });
      }

      onProgress?.(done.length, total);
    }

    for (const marker of plan.markers) {
      if (await node.exists(marker.path)) continue;

      await ensureDir(node, parentOf(marker.path), made);
      await writeJson(node, marker.path, {
        gameId: marker.gameId,
        title: marker.title,
        system: marker.system,
      });
      record.markers.push(marker.path);
    }

    record.moves = done;
    await writeJson(node, undoPathOf(id), record);

    // Every path the cache knew is now wrong, and it rebuilds itself by
    // rehashing, so dropping it is the honest thing to do.
    await node.remove(scanCachePathOf(system)).catch(() => undefined);

    onProgress?.(total, total);
    return record;
  }

  /** The runs that can still be undone, newest first. */
  static async list(node: StorageNode): Promise<UndoRecord[]> {
    let entries;
    try {
      entries = await node.list(UNDO_DIR);
    } catch {
      return [];
    }

    const records: UndoRecord[] = [];

    for (const entry of entries) {
      if (entry.kind !== 'file' || !entry.name.endsWith('.json')) continue;

      try {
        const parsed = JSON.parse(decoder.decode(await node.readFile(entry.path))) as UndoRecord;
        if (parsed.version === UNDO_VERSION && Array.isArray(parsed.moves)) records.push(parsed);
      } catch {
        // A damaged log is skipped rather than blocking the rest.
      }
    }

    return records.sort((left, right) => right.id.localeCompare(left.id));
  }

  /**
   * Put a run back.
   *
   * Steps run in reverse and each is checked first, so undoing a run that
   * failed halfway, or that the user has partly changed by hand, moves back
   * what it still can instead of failing outright.
   */
  static async undo(node: StorageNode, record: UndoRecord): Promise<void> {
    const made = new Set<string>();

    for (const marker of record.markers) {
      await node.remove(marker).catch(() => undefined);
    }

    for (let index = record.moves.length - 1; index >= 0; index -= 1) {
      const move = record.moves[index];

      if (!(await node.exists(move.to)) || (await node.exists(move.from))) continue;

      await ensureDir(node, parentOf(move.from), made);
      await node.move(move.to, move.from);
    }

    await node.remove(scanCachePathOf(record.system)).catch(() => undefined);
    await node.remove(undoPathOf(record.id)).catch(() => undefined);
  }
}
