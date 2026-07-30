/**
 * The rows of a folder browsed grouped by game.
 *
 * This is a file browser, not a catalogue: only games with at least one file on
 * disk get a row. Showing the whole dataset would bury the twenty ROMs someone
 * actually has under the twenty thousand they do not. Within a game, though,
 * every variant is listed — including the ones that are missing — because
 * seeing which siblings exist is the reason to group in the first place.
 */

import type { MatchResult, MatchStatus } from './rom-matching';

/** A row of a real directory listing, as the storage layer reports it. */
export interface FolderEntry {
  name: string;
  path: string;
  kind: 'file' | 'directory';
}

export type WizardNode =
  | { kind: 'group'; key: string; label: string; status: MatchStatus; children: WizardNode[] }
  | { kind: 'variant'; key: string; label: string; status: MatchStatus; children: WizardNode[] }
  | { kind: 'file'; key: string; label: string; path: string }
  | { kind: 'missing'; key: string; label: string }
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
): WizardNode[] {
  const prefix = folder ? `${folder}/` : '';
  const nodes: WizardNode[] = [];
  const claimedFiles = new Set<string>();
  const claimedFolders = new Set<string>();

  for (const matched of match.groups) {
    if (matched.status === 'missing') continue;

    const id = matched.group.id;
    const children: WizardNode[] = [];
    let present = 0;

    for (const variant of matched.variants) {
      const files = variant.files.map((file, index): WizardNode => {
        const path = file.local?.path;

        if (path === undefined || !path.startsWith(prefix)) {
          return {
            kind: 'missing',
            key: `missing:${id}:${variant.variant.key}:${index}`,
            label: fileNameOf(file.entry),
          };
        }

        present += 1;
        claimedFiles.add(path);
        for (const ancestor of ancestorsOf(path, folder)) claimedFolders.add(ancestor);

        return { kind: 'file', key: path, label: nameOf(path), path };
      });

      children.push({
        kind: 'variant',
        key: `variant:${id}:${variant.variant.key}`,
        label: variant.variant.key,
        status: variant.status,
        children: files,
      });
    }

    // The match covers a whole system, so a game can be complete elsewhere and
    // have nothing in the folder being browsed.
    if (present === 0) continue;

    nodes.push({ kind: 'group', key: `group:${id}`, label: id, status: matched.status, children });
  }

  for (const entry of entries) {
    const claimed =
      entry.kind === 'file' ? claimedFiles.has(entry.path) : claimedFolders.has(entry.path);

    if (!claimed) nodes.push({ kind: 'entry', key: entry.path, label: entry.name, entry });
  }

  return nodes;
}
