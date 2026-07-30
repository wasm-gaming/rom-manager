/**
 * Matching the catalogue against what is actually on disk.
 *
 * The dataset describes every release that exists; this decides which of them
 * the user has. Files are matched by checksum and never by name, because the
 * local name is whatever the user or their previous tool happened to choose.
 */

import type { DatGame, GameGroup, GameVariant } from './rom-grouping';

/** A file found in the opened folder, already hashed. */
export interface LocalFile {
  /** Path relative to the library root, POSIX separators. */
  path: string;
  size: number;
  crc32: string;
}

export type MatchStatus = 'complete' | 'partial' | 'missing';

/** A file the dataset expects, and the local file that turned out to be it. */
export interface MatchedFile {
  entry: DatGame;
  local: LocalFile | null;
}

export interface MatchedVariant {
  variant: GameVariant;
  status: MatchStatus;
  files: MatchedFile[];
}

export interface MatchedGroup {
  group: GameGroup;
  status: MatchStatus;
  variants: MatchedVariant[];
}

export interface MatchResult {
  groups: MatchedGroup[];
  /** Files that match no known release: homebrew, hacks, bad dumps, junk. */
  unmatched: LocalFile[];
}

/**
 * Index the local files by checksum.
 *
 * A checksum can map to several files, because nothing stops the same ROM from
 * being present twice under different names.
 */
function indexByChecksum(files: LocalFile[]): Map<string, LocalFile[]> {
  const index = new Map<string, LocalFile[]>();

  for (const file of files) {
    const key = file.crc32.toUpperCase();
    const bucket = index.get(key);
    if (bucket) bucket.push(file);
    else index.set(key, [file]);
  }

  return index;
}

/**
 * The local file that is this DAT entry, if it is present.
 *
 * The size is checked on top of the checksum. CRC32 is only 32 bits wide and
 * the catalogue holds tens of thousands of entries per system, which is well
 * inside the range where a collision is likely rather than theoretical; the
 * size makes an accidental match far less likely and costs nothing, since the
 * scan already knows it.
 */
function findLocal(entry: DatGame, index: Map<string, LocalFile[]>): LocalFile | null {
  const candidates = index.get(entry.crc.toUpperCase());
  if (!candidates) return null;

  return candidates.find((file) => entry.size === undefined || file.size === entry.size) ?? null;
}

function statusOf(present: number, total: number): MatchStatus {
  if (present === 0) return 'missing';
  return present === total ? 'complete' : 'partial';
}

/**
 * Work out which releases of each game are present locally.
 *
 * Every group is reported, including the ones with nothing on disk: the
 * catalogue is what the user browses, and a missing game is exactly the thing
 * they may want to go and find.
 */
export function matchGroupsWithLocalFiles(
  groups: GameGroup[],
  files: LocalFile[],
): MatchResult {
  const index = indexByChecksum(files);
  const claimed = new Set<string>();

  const matched = groups.map((group) => {
    const variants = group.variants.map((variant) => {
      const matchedFiles = variant.files.map((entry) => {
        const local = findLocal(entry, index);
        if (local) claimed.add(local.path);
        return { entry, local };
      });

      return {
        variant,
        status: statusOf(matchedFiles.filter((file) => file.local).length, matchedFiles.length),
        files: matchedFiles,
      };
    });

    // One complete variant is enough to play the game, so the group counts as
    // complete even though the other regions and revisions are missing.
    const complete = variants.some((variant) => variant.status === 'complete');
    const anything = variants.some((variant) => variant.status !== 'missing');

    return {
      group,
      status: complete ? 'complete' : anything ? 'partial' : 'missing',
      variants,
    } satisfies MatchedGroup;
  });

  return {
    groups: matched,
    unmatched: files.filter((file) => !claimed.has(file.path)),
  };
}
