/**
 * The rows of a folder browsed grouped by game.
 *
 * This is a file browser, not a catalogue: only games with at least one file on
 * disk get a row. Showing the whole dataset would bury the twenty ROMs someone
 * actually has under the twenty thousand they do not.
 *
 * A game is **one row**, not a branch. The point of grouping is that fifteen
 * files of Sonic 2 read as one game, and a row that unfolds back into those
 * fifteen files gives that away again. So the row carries its releases as data
 * instead of as children, and the details pane is where they are read — every
 * release the catalogue knows, the missing ones included, because seeing which
 * siblings exist is the reason to group in the first place.
 */

import { coverKeyOf, coverOf, type Cover } from './rom-covers';
import type { MatchResult, MatchStatus } from './rom-matching';

/** A row of a real directory listing, as the storage layer reports it. */
export interface FolderEntry {
  name: string;
  path: string;
  kind: 'file' | 'directory';
}

/** A file a release is made of. */
export interface WizardFile {
  label: string;
  /** Absent when the catalogue expects the file and this folder has not got it. */
  path?: string;
}

/** One release of a game, and how much of it is here. */
export interface WizardVariant {
  key: string;
  status: MatchStatus;
  files: WizardFile[];
}

/** A game, as a single row. */
export interface WizardGame {
  kind: 'group';
  key: string;
  /** Canonical name of the game, which is also its name on disk. */
  id: string;
  label: string;
  /** Base title in its original DAT spelling. */
  title: string;
  status: MatchStatus;
  /** Every release the catalogue lists, present or not. */
  variants: WizardVariant[];
  /** Files of this game inside the folder, which is what the row acts on. */
  paths: string[];
  /** The boxart to show, when the catalogue knows of one. */
  cover?: Cover;
}

export type WizardNode =
  | WizardGame
  | { kind: 'entry'; key: string; label: string; entry: FolderEntry };

function nameOf(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

/** Every folder between `path` and `root`, so a covered branch can be hidden. */
function ancestorsOf(path: string, root: string): string[] {
  const ancestors: string[] = [];

  for (let cut = path.lastIndexOf('/'); cut > root.length; cut = path.lastIndexOf('/', cut - 1)) {
    ancestors.push(path.slice(0, cut));
  }

  return ancestors;
}

function fileNameOf(entry: { name: string; fileName?: string }): string {
  return entry.fileName ?? entry.name;
}

/**
 * Rows for a folder, with what the dataset recognises gathered under its game
 * and everything else left as it is on disk.
 *
 * A folder whose files all ended up inside a game is dropped: its contents are
 * already on screen, one level up and better organised. That is what turns a
 * disc game — a folder per variant, several files each — into a single row,
 * while a collection, which the scanner never looked into, stays untouched and
 * browsable.
 */
export function buildWizardTree(
  folder: string,
  entries: FolderEntry[],
  match: MatchResult,
  /** One boxart per game, for the games whose releases have none of their own. */
  covers: ReadonlyMap<string, string> = new Map(),
): WizardNode[] {
  const prefix = folder ? `${folder}/` : '';
  const nodes: WizardNode[] = [];
  const claimedFiles = new Set<string>();
  const claimedFolders = new Set<string>();

  for (const matched of match.groups) {
    if (matched.status === 'missing') continue;

    const id = matched.group.id;
    const variants: WizardVariant[] = [];
    const paths: string[] = [];
    /** Releases with something here, so the boxart shown is one of theirs. */
    const present = new Set<string>();

    for (const variant of matched.variants) {
      const files = variant.files.map((file): WizardFile => {
        const path = file.local?.path;

        // A game can be complete elsewhere in the library, so a file outside the
        // folder being browsed counts as missing from this listing.
        if (path === undefined || !path.startsWith(prefix)) {
          return { label: fileNameOf(file.entry) };
        }

        paths.push(path);
        present.add(variant.variant.key);
        claimedFiles.add(path);
        for (const ancestor of ancestorsOf(path, folder)) claimedFolders.add(ancestor);

        return { label: nameOf(path), path };
      });

      variants.push({ key: variant.variant.key, status: variant.status, files });
    }

    if (paths.length === 0) continue;

    nodes.push({
      kind: 'group',
      key: `group:${id}`,
      id,
      label: id,
      title: matched.group.title,
      status: matched.status,
      variants,
      paths,
      cover: coverOf(matched.group, {
        present,
        fallback: covers.get(coverKeyOf(matched.group)),
      }),
    });
  }

  for (const entry of entries) {
    const claimed =
      entry.kind === 'file' ? claimedFiles.has(entry.path) : claimedFolders.has(entry.path);

    if (!claimed) nodes.push({ kind: 'entry', key: entry.path, label: entry.name, entry });
  }

  return nodes;
}
