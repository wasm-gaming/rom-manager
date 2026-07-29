import { JSX } from 'preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { StorageEntry, StorageNode } from '../services/StorageService';

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
}

/** The origin root, which the adapter addresses as an empty path. */
const ROOT = '';

/** Private payload for internal drags, so OS drops stay distinguishable. */
const DRAG_MIME = 'application/x-rom-manager-paths';

interface VisibleRow {
  entry: StorageEntry;
  depth: number;
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

    const walk = (path: string, depth: number) => {
      for (const entry of children.get(path) || []) {
        result.push({ entry, depth });
        if (entry.kind === 'directory' && expanded.has(entry.path)) {
          walk(entry.path, depth + 1);
        }
      }
    };

    walk(ROOT, 0);
    return result;
  }, [children, expanded]);

  useEffect(() => {
    onVisibleChange?.(rows.map((row) => row.entry.path));
  }, [rows, onVisibleChange]);

  /**
   * Applies a selection and reports the files in it. Folders take part in the
   * selection — they can be dragged and deleted — but they carry no metadata,
   * so the details pane never hears about them.
   */
  const selectPaths = useCallback(
    (paths: Set<string>) => {
      setSelection(paths);

      const files = rows
        .filter((row) => row.entry.kind === 'file' && paths.has(row.entry.path))
        .map((row) => row.entry.path);

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

  const handleRowClick = (event: MouseEvent, entry: StorageEntry) => {
    const paths = rows.map((row) => row.entry.path);

    if (event.shiftKey && anchor) {
      const from = paths.indexOf(anchor);
      const to = paths.indexOf(entry.path);

      if (from !== -1 && to !== -1) {
        const [start, end] = from < to ? [from, to] : [to, from];
        selectPaths(new Set(paths.slice(start, end + 1)));
        return;
      }
    }

    if (event.ctrlKey || event.metaKey) {
      const next = new Set(selection);
      if (next.has(entry.path)) next.delete(entry.path);
      else next.add(entry.path);

      selectPaths(next);
      setAnchor(entry.path);
      return;
    }

    selectPaths(new Set([entry.path]));
    setAnchor(entry.path);

    if (entry.kind === 'directory') {
      void toggleDirectory(entry.path);
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

  const handleDragStart = (event: DragEvent, entry: StorageEntry) => {
    if (!event.dataTransfer) return;

    // Dragging an unselected row starts a fresh selection, like a file manager.
    const dragged = selection.has(entry.path) ? Array.from(selection) : [entry.path];
    if (!selection.has(entry.path)) selectPaths(new Set([entry.path]));

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

      <ul
        class={`file-tree-body ${dropTarget === ROOT ? 'drop-target' : ''}`}
        onDragOver={(event) => handleDragOver(event, ROOT)}
        onDragLeave={() => setDropTarget(undefined)}
        onDrop={(event) => handleDrop(event, ROOT)}
      >
        {rows.map(({ entry, depth }) => (
          <li
            key={entry.path}
            class={[
              'tree-item',
              entry.kind,
              selection.has(entry.path) ? 'selected' : '',
              selectedFiles?.includes(entry.path) ? 'active' : '',
              dropTarget === entry.path ? 'drop-target' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ paddingLeft: `${0.5 + depth}rem` }}
            draggable
            onClick={(event) => handleRowClick(event, entry)}
            onDragStart={(event) => handleDragStart(event, entry)}
            onDragOver={
              entry.kind === 'directory' ? (event) => handleDragOver(event, entry.path) : undefined
            }
            onDrop={
              entry.kind === 'directory' ? (event) => handleDrop(event, entry.path) : undefined
            }
          >
            {entry.kind === 'directory' ? (
              <button
                class="tree-caret"
                onClick={(event) => {
                  event.stopPropagation();
                  void toggleDirectory(entry.path);
                }}
                title={expanded.has(entry.path) ? 'Collapse' : 'Expand'}
              >
                {expanded.has(entry.path) ? '▾' : '▸'}
              </button>
            ) : (
              <span class="tree-caret" />
            )}
            <span class="tree-icon">{entry.kind === 'directory' ? '📁' : '🎮'}</span>
            <span class="tree-name">{entry.name}</span>
            {entry.kind === 'file' && isInitialized?.(entry.path) && (
              <span class="tree-badge" title="Has library metadata">
                ●
              </span>
            )}
          </li>
        ))}

        {rows.length === 0 && <li class="tree-empty">Empty folder</li>}
      </ul>
    </div>
  );
}
