import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { JSX } from 'preact';
import { Tabs } from '../components/Tabs';
import { FileTree } from '../components/FileTree';
import { RomDetails } from '../components/RomDetails';
import { storageService, StorageNode, StorageStat } from '../services/StorageService';
import { RomLibrary, RomRecord, gameNameOf, systemOf } from '../services/RomLibraryService';
import {
  storeService,
  originsSignal,
  activeOriginIdSignal,
  loadingSignal,
  errorSignal,
  Origin,
} from '../services/StoreService';

/** Key behind the tree badges: a record is named after the game, not the file. */
function gameKey(romPath: string): string {
  return `${systemOf(romPath)}/${gameNameOf(romPath)}`;
}

export function ROMExplorer(): JSX.Element {
  const [storageNodes, setStorageNodes] = useState<Map<string, StorageNode>>(new Map());
  const [records, setRecords] = useState<Map<string, RomRecord | null>>(new Map());
  const [stats, setStats] = useState<Map<string, StorageStat | null>>(new Map());
  const [covers, setCovers] = useState<Map<string, string>>(new Map());
  const [initialised, setInitialised] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState(false);

  /** Systems whose library folder has already been listed. */
  const indexedSystems = useRef<Set<string>>(new Set());
  /** Object URLs minted for local covers, revoked when they are replaced. */
  const objectUrls = useRef<string[]>([]);

  const originsMap =
    originsSignal.value instanceof Map ? originsSignal.value : new Map<string, Origin>();
  const activeOriginId = activeOriginIdSignal.value;
  const activeOrigin = activeOriginId ? originsMap.get(activeOriginId) : undefined;
  const activeNode = activeOriginId ? storageNodes.get(activeOriginId) : undefined;
  const selection = activeOrigin?.selection || [];

  useEffect(() => {
    return () => {
      for (const url of objectUrls.current) URL.revokeObjectURL(url);
    };
  }, []);

  const releaseCovers = () => {
    for (const url of objectUrls.current) URL.revokeObjectURL(url);
    objectUrls.current = [];
  };

  /**
   * Loads what the details pane needs for a selection: records, file facts and
   * covers. ROM bytes are deliberately left out — a selected ROM can be
   * gigabytes long, and nothing on screen needs its contents.
   */
  const loadSelection = useCallback(async (node: StorageNode, paths: string[]) => {
    const library = new RomLibrary(node);
    const loaded = await library.readMany(paths);

    const statEntries = await Promise.all(
      paths.map(async (path) => [path, await node.stat(path)] as const),
    );

    releaseCovers();
    const coverEntries = await Promise.all(
      paths.map(async (path) => {
        const url = await library.coverUrl(path, loaded.get(path)?.cover);
        if (url?.startsWith('blob:')) objectUrls.current.push(url);
        return [path, url] as const;
      }),
    );

    setRecords(loaded);
    setStats(new Map(statEntries));
    setCovers(
      new Map(
        coverEntries.filter((entry): entry is readonly [string, string] => Boolean(entry[1])),
      ),
    );
  }, []);

  const handleOpenFolder = async () => {
    try {
      storeService.setLoading(true);
      storeService.setError(undefined);

      const nodeInstance = storageService.createNodeInstance();
      const opened = await nodeInstance.initialize();
      if (!opened) return;

      const path = nodeInstance.getPath();
      const name = path?.split('/').pop() || 'Folder';
      const originId = `origin-${Date.now()}`;

      setStorageNodes((current) => new Map(current).set(originId, nodeInstance));
      storeService.addOrigin({ id: originId, name, path, selection: [] });
    } catch (err) {
      storeService.setError(err instanceof Error ? err.message : 'Failed to open folder');
    } finally {
      storeService.setLoading(false);
    }
  };

  const handleSelectOrigin = (originId: string) => {
    indexedSystems.current = new Set();
    setInitialised(new Set());
    setEditing(false);
    storeService.setActiveOrigin(originId);
  };

  const handleCloseOrigin = (originId: string) => {
    storeService.removeOrigin(originId);
    setStorageNodes((current) => {
      const next = new Map(current);
      next.delete(originId);
      return next;
    });
  };

  const handleSelectionChange = async (paths: string[]) => {
    setEditing(false);
    storeService.setSelection(paths);

    if (!activeNode) return;

    try {
      storeService.setError(undefined);
      await loadSelection(activeNode, paths);
    } catch (err) {
      storeService.setError(err instanceof Error ? err.message : 'Failed to read the selection');
    }
  };

  /**
   * Lists `.meta/<System>` once per system, which is all the tree needs to tell
   * an initialised ROM from a plain file.
   */
  const handleVisibleChange = useCallback(
    async (paths: string[]) => {
      if (!activeNode) return;

      const systems = new Set(paths.map(systemOf).filter(Boolean));
      const pending = Array.from(systems).filter((system) => !indexedSystems.current.has(system));
      if (pending.length === 0) return;

      const library = new RomLibrary(activeNode);
      const found = await Promise.all(
        pending.map(async (system) => [system, await library.initializedGames(system)] as const),
      );

      for (const system of pending) indexedSystems.current.add(system);

      setInitialised((current) => {
        const next = new Set(current);
        for (const [system, games] of found) {
          for (const game of games) next.add(`${system}/${game}`);
        }
        return next;
      });
    },
    [activeNode],
  );

  const loadContent = useCallback(
    async (path: string): Promise<ArrayBuffer> => {
      if (!activeNode) throw new Error('No folder is open');

      const bytes = await activeNode.readFile(path);
      // Checksums want a plain ArrayBuffer, so detach the view from the pool.
      const content = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(content).set(bytes);
      return content;
    },
    [activeNode],
  );

  /**
   * Writes a record, downloading a cover the dataset only knows as a URL so the
   * library keeps working offline. A blocked download is not fatal: the record
   * then keeps the remote reference.
   */
  const persist = async (library: RomLibrary, path: string, record: RomRecord) => {
    let stored = record;

    if (record.cover?.startsWith('https://')) {
      try {
        stored = { ...record, cover: await library.saveCover(path, record.cover) };
      } catch {
        stored = record;
      }
    }

    await library.write(path, stored);
  };

  const handleSave = async (path: string, record: RomRecord) => {
    if (!activeNode) return;

    await persist(new RomLibrary(activeNode), path, record);

    setInitialised((current) => new Set(current).add(gameKey(path)));
    setEditing(false);
    await loadSelection(activeNode, selection);
  };

  const handleSaveMany = async (changes: Partial<RomRecord>) => {
    if (!activeNode) return;

    const library = new RomLibrary(activeNode);

    for (const path of selection) {
      const record = records.get(path);
      if (!record) continue;

      await persist(library, path, { ...record, ...changes });
    }

    setEditing(false);
    await loadSelection(activeNode, selection);
  };

  const handleRemoved = (paths: string[]) => {
    const affected = selection.some((selected) =>
      paths.some((path) => selected === path || selected.startsWith(`${path}/`)),
    );

    if (!affected) return;

    setEditing(false);
    storeService.setSelection([]);
    releaseCovers();
    setRecords(new Map());
    setStats(new Map());
    setCovers(new Map());
  };

  return (
    <div class="rom-explorer">
      <header class="explorer-header">
        <h1>ROM Manager</h1>
        <Tabs
          origins={Array.from(originsMap.values())}
          activeOriginId={activeOriginId}
          onSelectOrigin={handleSelectOrigin}
          onClose={handleCloseOrigin}
          onAddOrigin={handleOpenFolder}
        />
      </header>

      {errorSignal.value && <div class="error-message">{errorSignal.value}</div>}

      {originsMap.size === 0 ? (
        <div class="empty-state-full">
          <p>No folders opened</p>
          <button onClick={handleOpenFolder} disabled={loadingSignal.value}>
            {loadingSignal.value ? 'Opening...' : 'Open Folder'}
          </button>
        </div>
      ) : (
        <div class="explorer-container">
          {activeNode && (
            <FileTree
              key={activeOriginId}
              node={activeNode}
              selectedFiles={selection}
              onSelectionChange={handleSelectionChange}
              onVisibleChange={handleVisibleChange}
              isInitialized={(path) => initialised.has(gameKey(path))}
              onRemoved={handleRemoved}
            />
          )}

          <div class="details-pane">
            <RomDetails
              paths={selection}
              records={records}
              stats={stats}
              covers={covers}
              editing={editing}
              onEdit={() => setEditing(true)}
              onCancelEdit={() => setEditing(false)}
              onSave={handleSave}
              onSaveMany={handleSaveMany}
              loadContent={loadContent}
            />
          </div>
        </div>
      )}
    </div>
  );
}
