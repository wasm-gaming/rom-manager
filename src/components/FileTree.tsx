import { JSX } from 'preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { StorageEntry, StorageNode } from '../services/StorageService';
import type { MatchStatus } from '../core/rom-matching';
import type { WizardNode } from '../core/wizard-tree';

interface FileTreeProps {
  node: StorageNode;
  /** ROM files the details pane is showing, so the rows can mirror it. */
  selectedFiles?: string[];
  /** Fires with every selected file, in tree order. Folders are left out. */
  onSelectionChange?: (paths: string[]) => void;
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
  /** Progress of a long operation, such as hashing a system to group it. */
  notice?: string;
}

/** The origin root, which the adapter addresses as an empty path. */
const ROOT = '';

/** Private payload for internal drags, so OS drops stay distinguishable. */
const DRAG_MIME = 'application/x-rom-manager-paths';

const ICONS: Record<VisibleRow['kind'], string> = {
  directory: '📁',
  file: '🎮',
  group: '📦',
  variant: '🏷',
  missing: '·',
};

const STATUS_TITLES = {
  complete: 'Every file is here',
  partial: 'Some files are missing',
  missing: 'Not in this folder',
} as const;

/**
 * A painted row.
 *
 * Grouping introduces rows that are not files: a game, and a variant of it.
 * They carry no path, which is what keeps them out of selection, drag and
 * delete — there is nothing on disk for those to act on.
 */
interface VisibleRow {
  key: string;
  depth: number;
  label: string;
  kind: 'directory' | 'file' | 'group' | 'variant' | 'missing';
  /** Real filesystem path, for the rows that have one. */
  path?: string;
  entry?: StorageEntry;
  status?: MatchStatus;
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
  onVisibleChange,
  isInitialized,
  onRemoved,
  canGroup,
  isGrouped,
  groupedRows,
  onGroupingNeeded,
  onToggleGrouping,
  notice,
}: FileTreeProps): JSX.Element {
  const [children, setChildren] = useState<Map<string, StorageEntry[]>>(new Map());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [anchor, setAnchor] = useState<string | undefined>();
  const [dropTarget, setDropTarget] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loaded listings are read back inside async operations, where the state
  // captured by the render would already be stale.
  const childrenRef = useRef<Map<string, StorageEntry[]>>(new Map());

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
        entry,
        expandable: entry.kind === 'directory',
      });

      if (entry.kind === 'directory' && expanded.has(entry.path)) walk(entry.path, depth + 1);
    };

    const pushGrouped = (nodes: WizardNode[], depth: number) => {
      for (const wizard of nodes) {
        if (wizard.kind === 'entry') {
          pushEntry(wizard.entry, depth);
          continue;
        }

        const branch = wizard.kind === 'group' || wizard.kind === 'variant';

        result.push({
          key: wizard.key,
          depth,
          label: wizard.label,
          kind: wizard.kind,
          path: wizard.kind === 'file' ? wizard.path : undefined,
          status: branch ? wizard.status : undefined,
          expandable: branch && wizard.children.length > 0,
        });

        if (branch && expanded.has(wizard.key)) pushGrouped(wizard.children, depth + 1);
      }
    };

    const walk = (path: string, depth: number) => {
      const grouped = groupedRows?.get(path);

      if (grouped) pushGrouped(grouped, depth);
      else for (const entry of children.get(path) || []) pushEntry(entry, depth);
    };

    walk(ROOT, 0);
    return result;
  }, [children, expanded, groupedRows]);

  useEffect(() => {
    onVisibleChange?.(rows.flatMap((row) => (row.path ? [row.path] : [])));
  }, [rows, onVisibleChange]);

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

  /**
   * Applies a selection and reports the files in it. Folders take part in the
   * selection — they can be dragged and deleted — but they carry no metadata,
   * so the details pane never hears about them.
   */
  const selectPaths = useCallback(
    (paths: Set<string>) => {
      setSelection(paths);

      const files = rows
        .filter((row) => row.kind === 'file' && row.path && paths.has(row.path))
        .map((row) => row.path!);

      onSelectionChange?.(files);
    },
    [rows, onSelectionChange],
  );

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

  /** Games and variants exist only on screen, so there is nothing to load. */
  const toggleBranch = (key: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (!next.delete(key)) next.add(key);
      return next;
    });
  };

  const handleRowClick = (event: MouseEvent, row: VisibleRow) => {
    if (!row.path) {
      if (row.expandable) toggleBranch(row.key);
      return;
    }

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
      await revealDirectory(directory);
      await refresh();
    });
  };

  const handleDragStart = (event: DragEvent, path: string) => {
    if (!event.dataTransfer) return;

    // Dragging an unselected row starts a fresh selection, like a file manager.
    const dragged = selection.has(path) ? Array.from(selection) : [path];
    if (!selection.has(path)) selectPaths(new Set([path]));

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
              row.path && selection.has(row.path) ? 'selected' : '',
              row.path && selectedFiles?.includes(row.path) ? 'active' : '',
              dropTarget === row.path ? 'drop-target' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ paddingLeft: `${0.5 + row.depth}rem` }}
            draggable={Boolean(row.path)}
            onClick={(event) => handleRowClick(event, row)}
            onDragStart={
              row.path ? (event) => handleDragStart(event, row.path!) : undefined
            }
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
                  if (row.kind === 'directory') void toggleDirectory(row.path!);
                  else toggleBranch(row.key);
                }}
                title={expanded.has(row.key) ? 'Collapse' : 'Expand'}
              >
                {expanded.has(row.key) ? '▾' : '▸'}
              </button>
            ) : (
              <span class="tree-caret" />
            )}
            <span class="tree-icon">{ICONS[row.kind]}</span>
            <span class="tree-name">{row.label}</span>

            {row.status && row.status !== 'complete' && (
              <span class="tree-status" title={STATUS_TITLES[row.status]}>
                {row.status === 'partial' ? '◐' : '○'}
              </span>
            )}

            {row.kind === 'file' && isInitialized?.(row.path!) && (
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
          </li>
        ))}

        {rows.length === 0 && <li class="tree-empty">Empty folder</li>}
      </ul>
    </div>
  );
}
