import { JSX } from 'preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { FileTreeProps, StorageEntryData, VisibleRow, WizardGameData } from './FileTree/types';
import {
  contains,
  DRAG_MIME,
  join,
  nameOf,
  parentOf,
  parseDraggedPaths,
  ROOT,
} from './FileTree/utils';
import { FileTreeHeader } from './FileTree/FileTreeHeader';
import { FileTreeNode } from './FileTree/FileTreeNode';

export type { FileTreeProps, VisibleRow };

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
  labels = {},
}: FileTreeProps): JSX.Element {
  const [children, setChildren] = useState<Map<string, StorageEntryData[]>>(new Map());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [selectedGame, setSelectedGame] = useState<string | undefined>();
  const [anchor, setAnchor] = useState<string | undefined>();
  const [dropTarget, setDropTarget] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const childrenRef = useRef<Map<string, StorageEntryData[]>>(new Map());
  const reportedGame = useRef<WizardGameData | undefined>();

  const setDirectories = useCallback(
    (update: (current: Map<string, StorageEntryData[]>) => Map<string, StorageEntryData[]>) => {
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
      setError(err instanceof Error ? err.message : 'Failed to read directory'),
    );
  }, [loadDirectory]);

  const refresh = useCallback(async () => {
    const paths = Array.from(childrenRef.current.keys());
    const listings = await Promise.all(
      paths.map(async (path) => [path, await node.list(path)] as const),
    );
    setDirectories(() => new Map(listings));
  }, [node, setDirectories]);

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
    const map = new Map<string, StorageEntryData>();
    for (const entries of children.values()) {
      for (const entry of entries) map.set(entry.path, entry);
    }
    return map;
  }, [children]);

  const rows = useMemo(() => {
    const result: VisibleRow[] = [];

    const pushEntry = (entry: StorageEntryData, depth: number) => {
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
        if (isGrouped?.(path)) {
          result.push({
            key: `${path}/…`,
            depth,
            label: labels.reading ?? 'Reading games…',
            kind: 'pending',
            paths: [],
            expandable: false,
          });
          return;
        }

        for (const entry of children.get(path) || []) pushEntry(entry, depth);
        return;
      }

      for (const wizard of grouped as any[]) {
        if (wizard.kind === 'entry') {
          pushEntry(wizard.entry, depth);
        } else {
          const game = wizard.kind === 'game' ? wizard.game : wizard;
          if (game) {
            result.push({
              key: `${path}:${game.id || game.key}`,
              depth,
              label: game.title,
              kind: 'group',
              paths: game.paths,
              status: game.status,
              game,
              expandable: false,
            });
          }
        }
      }
    };

    walk(ROOT, 0);
    return result;
  }, [children, expanded, groupedRows, isGrouped, labels.reading]);

  useEffect(() => {
    if (!groupedRows) return;
    for (const row of rows) {
      if (row.kind === 'pending' && row.key.endsWith('/…')) {
        const path = row.key.slice(0, -2);
        onGroupingNeeded?.(path);
      }
    }
  }, [rows, groupedRows, onGroupingNeeded]);

  const selectPaths = useCallback(
    (paths: Set<string>, game?: WizardGameData) => {
      setSelection(paths);
      onSelectionChange?.(Array.from(paths));

      if (game !== reportedGame.current) {
        reportedGame.current = game;
        onGameChange?.(game);
      }

      const folder = paths.size === 1 ? Array.from(paths)[0] : undefined;
      const directory = folder && entriesByPath.get(folder)?.kind === 'directory' ? folder : undefined;
      onFolderChange?.(directory);
    },
    [entriesByPath, onFolderChange, onGameChange, onSelectionChange],
  );

  useEffect(() => {
    if (!selectedFiles) return;

    const current = Array.from(selection);
    if (
      current.length === selectedFiles.length &&
      current.every((path, i) => path === selectedFiles[i])
    ) {
      return;
    }

    setSelection(new Set(selectedFiles));
  }, [selectedFiles, selection]);

  useEffect(() => {
    onVisibleChange?.(rows.flatMap((row) => row.paths));
  }, [rows, onVisibleChange]);

  const revealDirectory = useCallback(
    async (path: string) => {
      const parts = path.split('/');
      let current = '';

      for (let i = 0; i < parts.length; i++) {
        current = current ? `${current}/${parts[i]}` : parts[i];
        if (!childrenRef.current.has(current)) await loadDirectory(current);
        setExpanded((prev) => new Set(prev).add(current));
      }
    },
    [loadDirectory],
  );

  const toggleDirectory = useCallback(
    async (path: string) => {
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
    },
    [expanded, loadDirectory],
  );

  const selectRow = useCallback(
    (row: VisibleRow) => {
      setSelectedGame(row.kind === 'group' ? row.key : undefined);
      if (row.kind === 'group') {
        selectPaths(new Set(row.paths), row.game);
        setAnchor(row.paths[0]);
      } else if (row.path) {
        selectPaths(new Set([row.path]));
        setAnchor(row.path);
      }
      requestAnimationFrame(() => {
        document.querySelector('.tree-item.selected')?.scrollIntoView({ block: 'nearest' });
      });
    },
    [selectPaths],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName.toLowerCase();
        if (
          tagName === 'input' ||
          tagName === 'textarea' ||
          tagName === 'select' ||
          (activeEl as HTMLElement).isContentEditable
        ) {
          return;
        }
      }

      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        return;
      }

      if (rows.length === 0) return;

      const currentIndex = rows.findIndex((row) =>
        row.path ? selection.has(row.path) : selectedGame === row.key,
      );

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (currentIndex === -1) {
          selectRow(rows[0]);
        } else if (currentIndex > 0) {
          selectRow(rows[currentIndex - 1]);
        }
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (currentIndex === -1) {
          selectRow(rows[0]);
        } else if (currentIndex < rows.length - 1) {
          selectRow(rows[currentIndex + 1]);
        }
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (currentIndex === -1) {
          selectRow(rows[0]);
          return;
        }
        const currentRow = rows[currentIndex];
        if (currentRow.kind === 'directory' && currentRow.path) {
          if (expanded.has(currentRow.path)) {
            void toggleDirectory(currentRow.path);
          }
        } else {
          for (let i = currentIndex - 1; i >= 0; i--) {
            if (rows[i].kind === 'directory' && rows[i].depth < currentRow.depth) {
              selectRow(rows[i]);
              break;
            }
          }
        }
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (currentIndex === -1) {
          selectRow(rows[0]);
          return;
        }
        const currentRow = rows[currentIndex];
        if (currentRow.kind === 'directory' && currentRow.path) {
          if (!expanded.has(currentRow.path)) {
            void revealDirectory(currentRow.path);
          }
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    rows,
    selection,
    selectedGame,
    expanded,
    groupedRows,
    selectPaths,
    selectRow,
    toggleDirectory,
    revealDirectory,
  ]);

  const targetDirectory = (): string => {
    const [path] = Array.from(selection);
    if (!path) return ROOT;
    return entriesByPath.get(path)?.kind === 'directory' ? path : parentOf(path);
  };

  const handleRowClick = (event: MouseEvent, row: VisibleRow) => {
    setSelectedGame(row.kind === 'group' ? row.key : undefined);
    if (row.kind === 'group') {
      selectPaths(new Set(row.paths), row.game);
      setAnchor(row.paths[0]);
      return;
    }

    if (!row.path) return;

    const paths = rows.flatMap((candidate) => (candidate.path ? [candidate.path] : []));

    if (event.shiftKey && anchor && paths.includes(anchor) && paths.includes(row.path)) {
      const from = paths.indexOf(anchor);
      const to = paths.indexOf(row.path);
      const slice = paths.slice(Math.min(from, to), Math.max(from, to) + 1);
      selectPaths(new Set(slice));
      return;
    }

    if (event.metaKey || event.ctrlKey) {
      const next = new Set(selection);
      if (next.has(row.path)) next.delete(row.path);
      else next.add(row.path);
      selectPaths(next);
      setAnchor(row.path);
      return;
    }

    selectPaths(new Set([row.path]));
    setAnchor(row.path);
  };

  const handleCreateFolder = () => {
    if (!node.createDirectory) return;

    const target = targetDirectory();
    const suggested = join(target, 'new-folder');
    const name = window.prompt('Directory name:', suggested);
    if (!name) return;

    void run(async () => {
      await node.createDirectory?.(name);
      await revealDirectory(name);
      await refresh();
      selectPaths(new Set([name]));
    });
  };

  const addFiles = async (files: FileList | File[], destination: string) => {
    if (!node.writeFile && !node.write) return;

    await run(async () => {
      const written: string[] = [];

      for (const file of Array.from(files)) {
        const path = join(destination, file.name);
        const bytes = new Uint8Array(await file.arrayBuffer());
        if (node.writeFile) {
          await node.writeFile(path, bytes);
        } else if (node.write) {
          await node.write(path, bytes.buffer);
        }
        written.push(path);
      }

      await revealDirectory(destination);
      await refresh();
      if (written.length > 0) selectPaths(new Set(written));
    });
  };

  const handleDeleteSelected = () => {
    if (selection.size === 0 || (!node.remove && !node.delete)) return;

    const paths = Array.from(selection);
    const names = paths.map((path) => nameOf(path)).join(', ');
    if (!window.confirm(`Delete ${names}?`)) return;

    void run(async () => {
      for (const path of paths) {
        if (node.remove) {
          await node.remove(path);
        } else if (node.delete) {
          await node.delete(path);
        }
      }

      onRemoved?.(paths);
      selectPaths(new Set());
      await refresh();
    });
  };

  const moveInto = async (directory: string, paths: string[]) => {
    if (!node.move) return;

    const valid = paths.filter((path) => !contains(path, directory));
    if (valid.length === 0) return;

    await run(async () => {
      const moved: string[] = [];

      for (const path of valid) {
        const destination = join(directory, nameOf(path));
        await node.move?.(path, destination);
        moved.push(destination);
      }

      await revealDirectory(directory);
      await refresh();
      selectPaths(new Set(moved));
    });
  };

  const handleDragStart = (event: DragEvent, row: VisibleRow) => {
    if (!event.dataTransfer) return;

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
      setError('Invalid drag operation');
    }
  };

  const statusLabels: Record<string, string> = {
    complete: labels.statusComplete ?? 'Complete',
    partial: labels.statusPartial ?? 'Partial',
    missing: labels.statusMissing ?? 'Missing',
  };

  return (
    <div class="file-tree">
      <FileTreeHeader
        busy={busy}
        hasSelection={selection.size > 0}
        onCreateFolder={handleCreateFolder}
        onAddFiles={() => fileInputRef.current?.click()}
        onDeleteSelected={handleDeleteSelected}
        labels={{
          newFolder: labels.collapseAll,
          addFiles: labels.expandAll,
          delete: labels.delete,
        }}
      />

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
          <FileTreeNode
            key={row.key}
            row={row}
            selection={selection}
            selectedGame={selectedGame}
            selectedFiles={selectedFiles}
            dropTarget={dropTarget}
            expanded={expanded}
            isGrouped={isGrouped}
            isInitialized={isInitialized}
            canGroup={canGroup}
            onToggleDirectory={(path) => void toggleDirectory(path)}
            onRowClick={handleRowClick}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onToggleGrouping={onToggleGrouping}
            onOrganize={onOrganize}
            statusLabels={statusLabels}
          />
        ))}

        {rows.length === 0 && children.has(ROOT) && <li class="tree-empty">Empty directory</li>}
      </ul>
    </div>
  );
}
