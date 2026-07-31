import { JSX } from 'preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { StorageEntry, StorageNode } from '../services/StorageService';
import type { MatchStatus } from '../core/rom-matching';
import type { WizardGame, WizardNode } from '../core/wizard-tree';
import { BundleIcon, FolderIcon, GameIcon } from './icons';

interface FileTreeProps {
  node: StorageNode;
  /** ROM files the details pane is showing, so the rows can mirror it. */
  selectedFiles?: string[];
  /** Fires with every selected file, in tree order. Folders are left out. */
  onSelectionChange?: (paths: string[]) => void;
  /** Fires with the game a row stands for, or nothing when a plain row is picked. */
  onGameChange?: (game?: WizardGame) => void;
  /**
   * Fires with the folder picked, or nothing when the selection is not exactly
   * one. It is what a file dropped on the details pane would be added to.
   */
  onFolderChange?: (path?: string) => void;
  /** Rows currently painted, so the owner can prefetch what they need. */
  onVisibleChange?: (paths: string[]) => void;
  /** True once a ROM has a record in the library. */
  isInitialized?: (path: string) => boolean;
  onRemoved?: (paths: string[]) => void;
  /** True when a folder can be browsed grouped by game at all. */
  canGroup?: (path: string) => boolean;
  /** True when a folder is currently browsed grouped by game. */
  isGrouped?: (path: string) => boolean;
  /** Grouped rows of a folder, absent while they are still being worked out. */
  groupedRows?: Map<string, WizardNode[]>;
  /** A grouped folder came on screen with no rows yet. */
  onGroupingNeeded?: (path: string) => void;
  onToggleGrouping?: (path: string) => void;
  /** Offered on the same folders as grouping: both need a dataset to work from. */
  onOrganize?: (path: string) => void;
  /** Progress of a long operation, such as hashing a system to group it. */
  notice?: string;
  /** Bumped by the owner to re-read what is on screen after it wrote a file. */
  refreshToken?: number;
}

/** The origin root, which the adapter addresses as an empty path. */
const ROOT = '';

/** Private payload for internal drags, so OS drops stay distinguishable. */
const DRAG_MIME = 'application/x-rom-manager-paths';

/** A `pending` row is left out: what stands in its slot is the spinner. */
const ICONS: Record<Exclude<VisibleRow['kind'], 'pending'>, () => JSX.Element> = {
  directory: FolderIcon,
  file: GameIcon,
  group: BundleIcon,
};

/** The mark of a row: its icon, or the spinner of a folder still being read. */
function RowIcon({ kind }: { kind: VisibleRow['kind'] }): JSX.Element {
  if (kind === 'pending') return <span class="tree-spinner" />;

  const Icon = ICONS[kind];
  return <Icon />;
}

const STATUS_TITLES = {
  complete: 'Every file is here',
  partial: 'Some files are missing',
  missing: 'Not in this folder',
} as const;

/**
 * A painted row.
 *
 * Grouping adds one kind of row that is not a file: a game. It does not unfold —
 * reading fifteen files as one game is the point of grouping — so its releases
 * are read in the details pane, and the row itself acts on every file of the
 * game at once: selecting it selects them, and so do dragging and deleting.
 *
 * It also adds a `pending` row, which stands in for a grouped folder whose games
 * are still being worked out. It holds no path, so nothing can be done to it.
 */
interface VisibleRow {
  key: string;
  depth: number;
  label: string;
  kind: 'directory' | 'file' | 'group' | 'pending';
  /** Real filesystem path, for the rows that are a single file or folder. */
  path?: string;
  /** Files on disk the row acts on. A game row has one per release it holds. */
  paths: string[];
  entry?: StorageEntry;
  status?: MatchStatus;
  /** The game a grouped row stands for, which is what the details pane shows. */
  game?: WizardGame;
  expandable: boolean;
}

function parentOf(path: string): string {
  const separator = path.lastIndexOf('/');
  return separator === -1 ? ROOT : path.slice(0, separator);
}

function nameOf(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

function join(directory: string, name: string): string {
  return directory ? `${directory}/${name}` : name;
}

/** True when `path` is `directory` itself or one of its ancestors. */
function contains(path: string, directory: string): boolean {
  return directory === path || directory.startsWith(`${path}/`);
}

function parseDraggedPaths(payload: string): string[] {
  const parsed = JSON.parse(payload);
  if (!Array.isArray(parsed) || parsed.some((value) => typeof value !== 'string')) {
    throw new Error('Invalid drag payload');
  }
  return parsed;
}

export function FileTree({
  node,
  selectedFiles,
  onSelectionChange,
  onGameChange,
  onFolderChange,
  onVisibleChange,
  isInitialized,
  onRemoved,
  canGroup,
  isGrouped,
  groupedRows,
  onGroupingNeeded,
  onToggleGrouping,
  onOrganize,
  notice,
  refreshToken,
}: FileTreeProps): JSX.Element {
  const [children, setChildren] = useState<Map<string, StorageEntry[]>>(new Map());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selection, setSelection] = useState<Set<string>>(new Set());
  /** Key of the game row picked, which has no path of its own to be marked by. */
  const [selectedGame, setSelectedGame] = useState<string | undefined>();
  const [anchor, setAnchor] = useState<string | undefined>();
  const [dropTarget, setDropTarget] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loaded listings are read back inside async operations, where the state
  // captured by the render would already be stale.
  const childrenRef = useRef<Map<string, StorageEntry[]>>(new Map());
  /** The game handed to the panel, to tell a rebuilt row from the same old one. */
  const reportedGame = useRef<WizardGame | undefined>();

  const setDirectories = useCallback(
    (update: (current: Map<string, StorageEntry[]>) => Map<string, StorageEntry[]>) => {
      childrenRef.current = update(childrenRef.current);
      setChildren(childrenRef.current);
    },
    [],
  );

  const loadDirectory = useCallback(
    async (path: string) => {
      const entries = await node.list(path);
      setDirectories((current) => new Map(current).set(path, entries));
    },
    [node, setDirectories],
  );

  useEffect(() => {
    loadDirectory(ROOT).catch((err) =>
      setError(err instanceof Error ? err.message : 'Failed to read folder'),
    );
  }, [loadDirectory]);

  /**
   * Re-read every directory already on screen. Moves and deletions touch two
   * directories at once, so refreshing only one of them would show stale rows.
   */
  const refresh = useCallback(async () => {
    const paths = Array.from(childrenRef.current.keys());
    const listings = await Promise.all(
      paths.map(async (path) => [path, await node.list(path)] as const),
    );
    setDirectories(() => new Map(listings));
  }, [node, setDirectories]);

  /**
   * A file the owner has just written — an image dropped on the details pane, or
   * a ROM added to a folder — is on disk but not in what is on screen.
   */
  useEffect(() => {
    if (!refreshToken) return;
    refresh().catch(() => undefined);
  }, [refreshToken, refresh]);

  const run = async (operation: () => Promise<void>) => {
    try {
      setBusy(true);
      setError(undefined);
      await operation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setBusy(false);
    }
  };

  const entriesByPath = useMemo(() => {
    const map = new Map<string, StorageEntry>();
    for (const entries of children.values()) {
      for (const entry of entries) map.set(entry.path, entry);
    }
    return map;
  }, [children]);

  const rows = useMemo(() => {
    const result: VisibleRow[] = [];

    const pushEntry = (entry: StorageEntry, depth: number) => {
      result.push({
        key: entry.path,
        depth,
        label: entry.name,
        kind: entry.kind,
        path: entry.path,
        paths: [entry.path],
        entry,
        expandable: entry.kind === 'directory',
      });

      if (entry.kind === 'directory' && expanded.has(entry.path)) walk(entry.path, depth + 1);
    };

    const walk = (path: string, depth: number) => {
      const grouped = groupedRows?.get(path);

      if (!grouped) {
        // Hashing a whole system takes a while. Painting its files meanwhile
        // would show the very listing grouping is there to replace, and then
        // swap it out under the pointer once the games are known.
        if (isGrouped?.(path)) {
          result.push({
            key: `${path}/…`,
            depth,
            label: 'Reading games…',
            kind: 'pending',
            paths: [],
            expandable: false,
          });
          return;
        }

        for (const entry of children.get(path) || []) pushEntry(entry, depth);
        return;
      }

      for (const wizard of grouped) {
        if (wizard.kind === 'entry') {
          pushEntry(wizard.entry, depth);
          continue;
        }

        result.push({
          key: wizard.key,
          depth,
          label: wizard.label,
          kind: 'group',
          paths: wizard.paths,
          status: wizard.status,
          game: wizard,
          expandable: false,
        });
      }
    };

    walk(ROOT, 0);
    return result;
  }, [children, expanded, groupedRows, isGrouped]);

  useEffect(() => {
    onVisibleChange?.(rows.flatMap((row) => row.paths));
  }, [rows, onVisibleChange]);

  /** Every file the rows reach, in row order, the files inside games included. */
  const filePaths = useMemo(
    () => rows.flatMap((row) => (row.kind === 'directory' ? [] : row.paths)),
    [rows],
  );

  /**
   * Ask for the rows of a grouped folder the first time it is painted. Working
   * them out means hashing the whole system, so it waits until the folder is
   * actually on screen.
   */
  useEffect(() => {
    if (!onGroupingNeeded || !isGrouped) return;

    const folders = rows.filter((row) => row.kind === 'directory' && expanded.has(row.path!));
    for (const row of folders) {
      if (isGrouped(row.path!) && !groupedRows?.has(row.path!)) onGroupingNeeded(row.path!);
    }
  }, [rows, expanded, groupedRows, isGrouped, onGroupingNeeded]);

  /** The folder picked, when that is exactly what the selection is. */
  const folderOf = useCallback(
    (paths: Set<string>): string | undefined => {
      if (paths.size !== 1) return undefined;

      const [path] = Array.from(paths);
      return entriesByPath.get(path)?.kind === 'directory' ? path : undefined;
    },
    [entriesByPath],
  );

  /**
   * Applies a selection and reports the files in it. Folders carry no metadata,
   * so they are reported apart from the files: what the details pane can show of
   * one is nothing, but it is still somewhere a dropped file can go.
   *
   * A game is reported alongside its files: the details pane shows the game,
   * and the files are what a drag or a delete would act on.
   */
  const selectPaths = useCallback(
    (paths: Set<string>, game?: WizardGame) => {
      setSelection(paths);
      setSelectedGame(game?.key);
      reportedGame.current = game;

      onSelectionChange?.(filePaths.filter((path) => paths.has(path)));
      onGameChange?.(game);
      onFolderChange?.(folderOf(paths));
    },
    [filePaths, folderOf, onSelectionChange, onGameChange, onFolderChange],
  );

  /**
   * A game whose rows have been worked out again is a different object for the
   * same row — that is what happens when a ROM lands in the folder — so it is
   * picked again. Without this the panel would keep showing the releases the
   * folder held before, and its files would be the ones it held then.
   */
  useEffect(() => {
    if (!selectedGame) return;

    const row = rows.find((candidate) => candidate.key === selectedGame);
    if (row?.game && row.game !== reportedGame.current) selectPaths(new Set(row.paths), row.game);
  }, [rows, selectedGame, selectPaths]);

  /** Where new folders and uploads land: the selected folder, or root. */
  const targetDirectory = (): string => {
    const [path] = Array.from(selection);
    if (!path) return ROOT;
    return entriesByPath.get(path)?.kind === 'directory' ? path : parentOf(path);
  };

  const revealDirectory = async (path: string) => {
    if (path === ROOT) return;
    setExpanded((current) => new Set(current).add(path));
    if (!childrenRef.current.has(path)) await loadDirectory(path);
  };

  const toggleDirectory = async (path: string) => {
    if (expanded.has(path)) {
      setExpanded((current) => {
        const next = new Set(current);
        next.delete(path);
        return next;
      });
      return;
    }

    if (!childrenRef.current.has(path)) await loadDirectory(path);
    setExpanded((current) => new Set(current).add(path));
  };

  const handleRowClick = (event: MouseEvent, row: VisibleRow) => {
    // A game is one thing, so it is picked whole; the modifiers only make sense
    // over the plain rows.
    if (row.kind === 'group') {
      selectPaths(new Set(row.paths), row.game);
      setAnchor(row.paths[0]);
      return;
    }

    if (!row.path) return;

    const paths = rows.flatMap((candidate) => (candidate.path ? [candidate.path] : []));

    if (event.shiftKey && anchor) {
      const from = paths.indexOf(anchor);
      const to = paths.indexOf(row.path);

      if (from !== -1 && to !== -1) {
        const [start, end] = from < to ? [from, to] : [to, from];
        selectPaths(new Set(paths.slice(start, end + 1)));
        return;
      }
    }

    if (event.ctrlKey || event.metaKey) {
      const next = new Set(selection);
      if (next.has(row.path)) next.delete(row.path);
      else next.add(row.path);

      selectPaths(next);
      setAnchor(row.path);
      return;
    }

    selectPaths(new Set([row.path]));
    setAnchor(row.path);

    if (row.kind === 'directory') {
      void toggleDirectory(row.path);
    }
  };

  const handleCreateFolder = () => {
    const directory = targetDirectory();
    const name = window.prompt('New folder name');
    if (!name) return;

    if (/[/\\]/.test(name) || name === '.' || name === '..') {
      setError('A folder name cannot contain path separators');
      return;
    }

    void run(async () => {
      await node.createDirectory(join(directory, name));
      await revealDirectory(directory);
      await refresh();
    });
  };

  const addFiles = async (files: FileList, directory: string) => {
    await run(async () => {
      for (const file of Array.from(files)) {
        const content = new Uint8Array(await file.arrayBuffer());
        await node.writeFile(join(directory, file.name), content);
      }

      await revealDirectory(directory);
      await refresh();
    });
  };

  const handleDeleteSelected = () => {
    const paths = Array.from(selection);
    if (paths.length === 0) return;

    if (!window.confirm(`Delete ${paths.length} item(s)? This cannot be undone.`)) return;

    void run(async () => {
      for (const path of paths) await node.remove(path);

      selectPaths(new Set());
      setExpanded((current) => {
        const next = new Set(current);
        for (const path of current) {
          if (paths.some((removed) => contains(removed, path))) next.delete(path);
        }
        return next;
      });

      onRemoved?.(paths);
      await refresh();    });
  };

  const moveInto = async (directory: string, paths: string[]) => {
    await run(async () => {
      for (const path of paths) {
        // Dropping a folder on itself or on its own subtree would erase it.
        if (contains(path, directory)) continue;

        const target = join(directory, nameOf(path));
        if (target === path) continue;

        await node.move(path, target);
      }

      selectPaths(new Set());
      // Nothing lives at those paths anymore, so whatever was read from them —
      // the grouped rows above all — has to be worked out again.
      onRemoved?.(paths);
      await revealDirectory(directory);
      await refresh();
    });
  };

  const handleDragStart = (event: DragEvent, row: VisibleRow) => {
    if (!event.dataTransfer) return;

    // Dragging an unselected row starts a fresh selection, like a file manager.
    const held = row.paths.every((path) => selection.has(path));
    const dragged = held ? Array.from(selection) : row.paths;
    if (!held) selectPaths(new Set(row.paths), row.game);

    event.dataTransfer.setData(DRAG_MIME, JSON.stringify(dragged));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event: DragEvent, directory: string) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    setDropTarget(directory);
  };

  const handleDrop = (event: DragEvent, directory: string) => {
    event.preventDefault();
    event.stopPropagation();
    setDropTarget(undefined);

    const dropped = event.dataTransfer?.files;
    if (dropped && dropped.length > 0) {
      void addFiles(dropped, directory);
      return;
    }

    const payload = event.dataTransfer?.getData(DRAG_MIME);
    if (!payload) return;

    try {
      void moveInto(directory, parseDraggedPaths(payload));
    } catch {
      setError('Could not read the dragged items');
    }
  };

  return (
    <div class="file-tree">
      <div class="file-tree-header">
        <h3>Files</h3>
        <div class="file-tree-actions">
          <button
            onClick={handleCreateFolder}
            disabled={busy}
            title="New folder in the selected folder"
          >
            📁+
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            title="Add files to the selected folder"
          >
            ＋
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={busy || selection.size === 0}
            title="Delete selected"
          >
            🗑
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        class="file-tree-input"
        onChange={(event) => {
          const input = event.currentTarget;
          const directory = targetDirectory();
          if (input.files && input.files.length > 0) void addFiles(input.files, directory);
          input.value = '';
        }}
      />

      {error && <div class="file-tree-error">{error}</div>}
      {notice && <div class="file-tree-notice">{notice}</div>}

      <ul
        class={`file-tree-body ${dropTarget === ROOT ? 'drop-target' : ''}`}
        onDragOver={(event) => handleDragOver(event, ROOT)}
        onDragLeave={() => setDropTarget(undefined)}
        onDrop={(event) => handleDrop(event, ROOT)}
      >
        {rows.map((row) => (
          <li
            key={row.key}
            class={[
              'tree-item',
              row.kind,
              row.status ? `status-${row.status}` : '',
              (row.path ? selection.has(row.path) : selectedGame === row.key) ? 'selected' : '',
              row.path && selectedFiles?.includes(row.path) ? 'active' : '',
              // Rows with no path of their own are not a drop target: comparing
              // one to `dropTarget` would match every one of them while nothing
              // is being dragged.
              row.path !== undefined && dropTarget === row.path ? 'drop-target' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ paddingLeft: `${0.5 + row.depth * 0.6}rem` }}
            draggable={row.paths.length > 0}
            onClick={(event) => handleRowClick(event, row)}
            onDragStart={(event) => handleDragStart(event, row)}
            onDragOver={
              row.kind === 'directory' ? (event) => handleDragOver(event, row.path!) : undefined
            }
            onDrop={row.kind === 'directory' ? (event) => handleDrop(event, row.path!) : undefined}
          >
            {row.expandable ? (
              <button
                class="tree-caret"
                onClick={(event) => {
                  event.stopPropagation();
                  void toggleDirectory(row.path!);
                }}
                title={expanded.has(row.key) ? 'Collapse' : 'Expand'}
              >
                {expanded.has(row.key) ? '▾' : '▸'}
              </button>
            ) : (
              <span class="tree-caret" />
            )}
            <span class="tree-icon">
              <RowIcon kind={row.kind} />
            </span>
            <span class="tree-name">{row.label}</span>

            {row.status && row.status !== 'complete' && (
              <span class="tree-status" title={STATUS_TITLES[row.status]}>
                {row.status === 'partial' ? '◐' : '○'}
              </span>
            )}

            {row.kind !== 'directory' && row.paths.some((path) => isInitialized?.(path)) && (
              <span class="tree-badge" title="Has library metadata">
                ●
              </span>
            )}

            {row.kind === 'directory' && canGroup?.(row.path!) && (
              <button
                class={`tree-group-toggle ${isGrouped?.(row.path!) ? 'on' : ''}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleGrouping?.(row.path!);
                }}
                title={
                  isGrouped?.(row.path!) ? 'Browse this folder as it is' : 'Group this folder by game'
                }
              >
                ⊞
              </button>
            )}

            {row.kind === 'directory' && onOrganize && canGroup?.(row.path!) && (
              <button
                class="tree-organize"
                onClick={(event) => {
                  event.stopPropagation();
                  onOrganize(row.path!);
                }}
                title="Rename and sort this folder to match the catalogue"
              >
                ⇄
              </button>
            )}
          </li>
        ))}

        {/* Only once the root has actually been read: an empty tree is what a
            folder still being listed looks like too, and saying it is empty
            before knowing is a claim the next paint takes back. */}
        {rows.length === 0 && children.has(ROOT) && <li class="tree-empty">Empty folder</li>}
      </ul>
    </div>
  );
}
