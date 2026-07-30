/**
 * Hashing the ROMs of a system, with the results cached on disk.
 *
 * Every file has to be hashed to be identified, and a library runs to
 * gigabytes, so the result is kept in `.meta/<system>/scan.json` keyed by path.
 * The cache holds no information of its own: deleting it only costs the time
 * to hash everything again.
 */

import { streamCRC32 } from './ChecksumService';
import { META_DIR } from './RomLibraryService';
import type { StorageEntry, StorageNode } from './StorageService';
import type { LocalFile } from '../core/rom-matching';

const SCAN_VERSION = 1;

export type SystemMedia = 'cartridge' | 'disc';

/**
 * Marks a folder as a game the app manages, as opposed to a collection the
 * user curates by hand. Only disc systems have it, since only there does a
 * release need a folder of its own.
 */
export const GAME_MARKER = 'game.json';

interface ScanEntry {
  size: number;
  /** Epoch milliseconds, used together with the size to spot an edited file. */
  mtime: number;
  crc32: string;
}

interface ScanCache {
  version: number;
  entries: Record<string, ScanEntry>;
}

export interface ScanProgress {
  /** Path currently being hashed. */
  path: string;
  done: number;
  total: number;
  /** False when the checksum came from the cache and nothing was read. */
  hashed: boolean;
}

export function scanCachePathOf(system: string): string {
  return `${META_DIR}/${system}/scan.json`;
}

function isScanEntry(value: unknown): value is ScanEntry {
  if (!value || typeof value !== 'object') return false;

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.size === 'number' &&
    typeof entry.mtime === 'number' &&
    typeof entry.crc32 === 'string' &&
    /^[A-Fa-f0-9]{8}$/.test(entry.crc32)
  );
}

/**
 * Read the cache, ignoring anything about it that does not look right.
 *
 * The file sits in a folder the user can edit, so it is untrusted input; a
 * damaged entry is dropped rather than trusted, and the file is rebuilt.
 */
async function readCache(node: StorageNode, system: string): Promise<Map<string, ScanEntry>> {
  const entries = new Map<string, ScanEntry>();

  let raw: unknown;
  try {
    raw = JSON.parse(new TextDecoder().decode(await node.readFile(scanCachePathOf(system))));
  } catch {
    return entries;
  }

  if (!raw || typeof raw !== 'object') return entries;

  const cache = raw as Partial<ScanCache>;
  if (cache.version !== SCAN_VERSION || !cache.entries || typeof cache.entries !== 'object') {
    return entries;
  }

  for (const [path, entry] of Object.entries(cache.entries)) {
    if (isScanEntry(entry)) entries.set(path, entry);
  }

  return entries;
}

async function writeCache(
  node: StorageNode,
  system: string,
  entries: Map<string, ScanEntry>,
): Promise<void> {
  const cache: ScanCache = { version: SCAN_VERSION, entries: Object.fromEntries(entries) };

  await node.createDirectory(`${META_DIR}/${system}`);
  await node.writeFile(scanCachePathOf(system), new TextEncoder().encode(JSON.stringify(cache)));
}

/**
 * The ROMs of a system, leaving collections alone.
 *
 * A collection is a folder the user curates by hand, and the app never touches
 * what is inside one. Telling it apart from a managed folder depends on the
 * medium: a cartridge system keeps its ROMs loose at the root, so any subfolder
 * is a collection; on a disc system game folders and collections sit side by
 * side, so the marker file is what separates them.
 */
async function collectFiles(
  node: StorageNode,
  system: string,
  media: SystemMedia,
): Promise<StorageEntry[]> {
  let entries: StorageEntry[];

  try {
    entries = await node.list(system);
  } catch {
    // The library has no folder for this system.
    return [];
  }

  const files: StorageEntry[] = [];

  for (const entry of entries) {
    // A loose file at the root counts either way: on a disc system it is an
    // image that has not been organised into its folder yet.
    if (entry.kind === 'file') {
      files.push(entry);
      continue;
    }

    if (media === 'cartridge') continue;
    if (!(await node.exists(`${entry.path}/${GAME_MARKER}`))) continue;

    for await (const file of node.walkFiles(entry.path)) {
      if (file.name !== GAME_MARKER) files.push(file);
    }
  }

  return files;
}

/**
 * Hash every ROM of a system, reusing the cached checksum where the file has
 * not changed.
 *
 * Size and modification time together decide whether a cached checksum still
 * applies. That is what every build tool uses and it is the best available
 * here: the File System Access API exposes nothing cheaper, and the only
 * alternative is reading the file, which is exactly what the cache avoids.
 */
export async function scanSystem(
  node: StorageNode,
  system: string,
  media: SystemMedia,
  onProgress?: (progress: ScanProgress) => void,
): Promise<LocalFile[]> {
  const files = await collectFiles(node, system, media);

  const cached = await readCache(node, system);
  const fresh = new Map<string, ScanEntry>();
  const result: LocalFile[] = [];
  let done = 0;

  for (const file of files) {
    const stat = await node.stat(file.path);
    if (!stat) continue;

    const known = cached.get(file.path);
    const reusable = known && known.size === stat.size && known.mtime === stat.mtime;

    const crc32 = reusable
      ? known.crc32
      : await streamCRC32(await node.readStream(file.path));

    fresh.set(file.path, { size: stat.size, mtime: stat.mtime, crc32 });
    result.push({ path: file.path, size: stat.size, crc32 });

    done += 1;
    onProgress?.({ path: file.path, done, total: files.length, hashed: !reusable });
  }

  // Rewriting an unchanged cache would touch the disk on every open, so it is
  // only written when the scan actually found something different.
  const unchanged =
    fresh.size === cached.size &&
    [...fresh].every(([path, entry]) => cached.get(path)?.crc32 === entry.crc32);

  if (!unchanged) await writeCache(node, system, fresh);

  return result;
}
