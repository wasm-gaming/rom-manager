import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { JSX } from 'preact';
import { Tabs } from '../components/Tabs';
import { FileTree } from '../components/FileTree';
import { OrganizePanel } from '../components/OrganizePanel';
import { RomDetails } from '../components/RomDetails';
import { storageService, StorageNode, StorageStat } from '../services/StorageService';
import { RomLibrary, RomRecord, gameNameOf, systemOf } from '../services/RomLibraryService';
import { GameCatalogService } from '../services/GameCatalogService';
import { CoverService } from '../services/CoverService';
import { OrganizeService, type UndoRecord } from '../services/OrganizeService';
import { ROMDatasetService } from '../services/ROMDatasetService';
import { isWizardFolder, WizardConfigService } from '../services/WizardConfigService';
import { buildWizardTree, type WizardGame, type WizardNode } from '../core/wizard-tree';
import { pickCover } from '../core/rom-covers';
import type { Region } from '../core/rom-regions';
import type { OrganizePlan } from '../core/rom-organize';
import {
  storeService,
  originsSignal,
  activeOriginIdSignal,
  loadingSignal,
  errorSignal,
  knownSystemsSignal,
  wizardSettingsSignal,
  Origin,
} from '../services/StoreService';

/** Key behind the tree badges: a record is named after the game, not the file. */
function gameKey(romPath: string): string {
  return `${systemOf(romPath)}/${gameNameOf(romPath)}`;
}

/**
 * The system a folder belongs to, which is the first segment of its path. A
 * system folder is its own system, so grouping also works one level down, in a
 * collection someone chose to browse grouped.
 */
function systemFolderOf(path: string): string {
  const separator = path.indexOf('/');
  return separator === -1 ? path : path.slice(0, separator);
}

export function ROMExplorer(): JSX.Element {
  const [storageNodes, setStorageNodes] = useState<Map<string, StorageNode>>(new Map());
  const [records, setRecords] = useState<Map<string, RomRecord | null>>(new Map());
  const [stats, setStats] = useState<Map<string, StorageStat | null>>(new Map());
  const [covers, setCovers] = useState<Map<string, string>>(new Map());
  const [initialised, setInitialised] = useState<Set<string>>(new Set());
  const [groupedRows, setGroupedRows] = useState<Map<string, WizardNode[]>>(new Map());
  const [notice, setNotice] = useState<string | undefined>();
  const [editing, setEditing] = useState(false);
  /** The game picked in the tree, shown instead of the files it holds. */
  const [game, setGame] = useState<WizardGame | undefined>();
  /** One file of that game, opened from its details. */
  const [gameFile, setGameFile] = useState<string | undefined>();
  /** The boxart on screen for that game, and the region it is the box of. */
  const [gameCover, setGameCover] = useState<{ url: string; region?: Region } | undefined>();
  /** The organize preview, once one has been worked out and not yet dismissed. */
  const [organize, setOrganize] = useState<
    { system: string; plan: OrganizePlan; applied?: UndoRecord } | undefined
  >();
  const [organizeBusy, setOrganizeBusy] = useState<string | undefined>();
  /** Bumped to remount the tree after the files underneath it have moved. */
  const [treeVersion, setTreeVersion] = useState(0);

  /** Systems whose library folder has already been listed. */
  const indexedSystems = useRef<Set<string>>(new Set());
  /** Folders whose grouped rows are already being worked out. */
  const grouping = useRef<Set<string>>(new Set());
  /** Object URLs minted for local covers, revoked when they are replaced. */
  const objectUrls = useRef<string[]>([]);

  const originsMap =
    originsSignal.value instanceof Map ? originsSignal.value : new Map<string, Origin>();
  const activeOriginId = activeOriginIdSignal.value;
  const activeOrigin = activeOriginId ? originsMap.get(activeOriginId) : undefined;
  const activeNode = activeOriginId ? storageNodes.get(activeOriginId) : undefined;
  const selection = activeOrigin?.selection || [];
  const wizardSettings = wizardSettingsSignal.value;
  const knownSystems = knownSystemsSignal.value;
  const regionOrder = wizardSettings.regionOrder;

  useEffect(() => {
    return () => {
      for (const url of objectUrls.current) URL.revokeObjectURL(url);
    };
  }, []);

  /** The systems the dataset covers, which is what a folder is grouped against. */
  useEffect(() => {
    ROMDatasetService.listSystems()
      .then((systems) => storeService.setKnownSystems(new Set(systems.map((it) => it.system))))
      .catch(() => storeService.setKnownSystems(new Set()));
  }, []);

  /** Grouping settings belong to the folder on disk, so every tab has its own. */
  useEffect(() => {
    if (!activeNode) return;

    WizardConfigService.read(activeNode)
      .then((settings) => storeService.setWizardSettings(settings))
      .catch(() => undefined);
  }, [activeNode]);

  /**
   * The boxart of the game on screen, chosen by the region preference: the copy
   * in `.meta` when there is one, the published image otherwise — and browsing
   * is what puts a copy there.
   */
  useEffect(() => {
    // The cover of the game left behind is about to be revoked, so it stops
    // being shown now rather than as a broken image.
    setGameCover(undefined);
    if (!activeNode || !game) return;

    let shown: string | undefined;
    let cancelled = false;

    const revoke = (url?: string) => {
      if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
    };

    const cover = pickCover(game.covers, {
      present: game.presentRegions,
      order: regionOrder,
    });

    CoverService.resolve(activeNode, systemOf(game.paths[0]), game.id, cover)
      .then((resolved) => {
        if (cancelled) {
          revoke(resolved?.url);
          return;
        }

        shown = resolved?.url;
        setGameCover(resolved ? { url: resolved.url, region: cover?.region } : undefined);
      })
      .catch(() => setGameCover(undefined));

    return () => {
      cancelled = true;
      revoke(shown);
    };
  }, [activeNode, game, regionOrder]);

  /**
   * Every boxart of a game already in the library is kept on disk, so its other
   * regions stay available with the network off — or with the provider gone.
   *
   * A game merely looked at keeps only the one on screen: this is what the
   * library gets and browsing does not, and a game is in the library once any of
   * its files has a record.
   */
  useEffect(() => {
    if (!activeNode || !game) return;
    if (!game.paths.some((path) => records.get(path))) return;

    void CoverService.cacheAll(activeNode, systemOf(game.paths[0]), game.id, game.covers);
  }, [activeNode, game, records]);

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
    grouping.current = new Set();
    setInitialised(new Set());
    setGroupedRows(new Map());
    setEditing(false);
    setGame(undefined);
    setGameFile(undefined);
    storeService.setActiveOrigin(originId);
  };

  /** Only a folder of a system the dataset covers can be grouped by game. */
  const canGroup = useCallback(
    (path: string) => knownSystems.has(systemFolderOf(path)),
    [knownSystems],
  );

  const isGrouped = useCallback(
    (path: string) => isWizardFolder(path, wizardSettings, knownSystems),
    [wizardSettings, knownSystems],
  );

  /**
   * Works out the rows of a grouped folder: what the system holds, hashed and
   * matched against its catalogue.
   *
   * A folder is only ever worked out once. Retrying on its own would turn a
   * failure into a loop, since the tree asks again on every paint; toggling the
   * folder is what clears the slate.
   */
  const handleGroupingNeeded = useCallback(
    async (path: string) => {
      if (!activeNode || grouping.current.has(path)) return;
      grouping.current.add(path);

      try {
        storeService.setError(undefined);

        const system = systemFolderOf(path);
        const [match, covers, entries] = await Promise.all([
          GameCatalogService.load(activeNode, system, (progress) =>
            setNotice(`Reading ${path}: ${progress.done} of ${progress.total}`),
          ),
          GameCatalogService.coversOf(system),
          activeNode.list(path),
        ]);

        setGroupedRows((current) =>
          new Map(current).set(path, buildWizardTree(path, entries, match, covers)),
        );
      } catch (err) {
        storeService.setError(err instanceof Error ? err.message : `Failed to group ${path}`);
      } finally {
        setNotice(undefined);
      }
    },
    [activeNode],
  );

  const handleToggleGrouping = useCallback(
    async (path: string) => {
      if (!activeNode) return;

      const systems = knownSystemsSignal.peek();
      const grouped = isWizardFolder(path, wizardSettingsSignal.peek(), systems);

      try {
        const settings = await WizardConfigService.setWizard(activeNode, path, !grouped, systems);
        storeService.setWizardSettings(settings);
      } catch (err) {
        storeService.setError(err instanceof Error ? err.message : 'Failed to save the view mode');
        return;
      }

      grouping.current.delete(path);
      setGroupedRows((current) => {
        const next = new Map(current);
        next.delete(path);
        return next;
      });
    },
    [activeNode],
  );

  /**
   * Records the order boxarts are preferred in. Nothing is read again: the rows
   * carry every region's boxart, so the panel simply picks another one.
   */
  const handleRegionOrderChange = useCallback(
    async (order: readonly Region[]) => {
      if (!activeNode) return;

      try {
        const settings = await WizardConfigService.setRegionOrder(activeNode, order);
        storeService.setWizardSettings(settings);
      } catch (err) {
        storeService.setError(
          err instanceof Error ? err.message : 'Failed to save the region order',
        );
      }
    },
    [activeNode],
  );

  /** Forget what was read from a folder whose files have just moved. */
  const invalidateTree = useCallback(() => {
    grouping.current.clear();
    setGroupedRows(new Map());
    storeService.setSelection([]);
    setRecords(new Map());
    setStats(new Map());
    setGame(undefined);
    setGameFile(undefined);
    setTreeVersion((version) => version + 1);
  }, []);

  /**
   * Works out what organizing a folder would do and shows it.
   *
   * Only the plan is built here. Nothing on disk changes until the user reads
   * the preview and says so, which is the whole point of splitting the two.
   */
  const handleOrganize = useCallback(
    async (path: string) => {
      if (!activeNode) return;

      const system = systemFolderOf(path);

      try {
        storeService.setError(undefined);
        setOrganizeBusy(`Reading ${system}...`);

        const plan = await OrganizeService.plan(activeNode, system, (done, total) =>
          setOrganizeBusy(`Reading ${system}: ${done} of ${total}`),
        );

        setOrganize({ system, plan });
      } catch (err) {
        storeService.setError(err instanceof Error ? err.message : `Failed to plan ${system}`);
      } finally {
        setOrganizeBusy(undefined);
      }
    },
    [activeNode],
  );

  const handleOrganizeConfirm = useCallback(async () => {
    if (!activeNode || !organize) return;

    try {
      storeService.setError(undefined);
      setOrganizeBusy('Moving files...');

      const applied = await OrganizeService.apply(
        activeNode,
        organize.system,
        organize.plan,
        (done, total) => setOrganizeBusy(`Moving files: ${done} of ${total}`),
      );

      setOrganize({ ...organize, applied });
      invalidateTree();
    } catch (err) {
      storeService.setError(err instanceof Error ? err.message : 'Failed to organize');
    } finally {
      setOrganizeBusy(undefined);
    }
  }, [activeNode, organize, invalidateTree]);

  const handleOrganizeUndo = useCallback(async () => {
    if (!activeNode || !organize?.applied) return;

    try {
      storeService.setError(undefined);
      setOrganizeBusy('Putting files back...');

      await OrganizeService.undo(activeNode, organize.applied);
      setOrganize(undefined);
      invalidateTree();
    } catch (err) {
      storeService.setError(err instanceof Error ? err.message : 'Failed to undo');
    } finally {
      setOrganizeBusy(undefined);
    }
  }, [activeNode, organize, invalidateTree]);

  const handleCloseOrigin = (originId: string) => {
    storeService.removeOrigin(originId);
    setStorageNodes((current) => {
      const next = new Map(current);
      next.delete(originId);
      return next;
    });
  };

  /**
   * A game picked in the tree. Its files arrive through the selection, so the
   * details of every release are already loaded when the game comes on screen.
   */
  const handleGameChange = useCallback((selected?: WizardGame) => {
    setEditing(false);
    setGameFile(undefined);
    setGame(selected);
  }, []);

  /** Opens one file of the game on screen, which the tree no longer lists. */
  const handleSelectFile = useCallback((path: string) => {
    setEditing(false);
    setGameFile(path);
  }, []);

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
    // The grouped rows were worked out when those files were still there, so the
    // folders they came from have to be read again. The scan cache survives, so
    // that is a listing and not a rehash.
    grouping.current.clear();
    setGroupedRows(new Map());

    const affected = selection.some((selected) =>
      paths.some((path) => selected === path || selected.startsWith(`${path}/`)),
    );

    if (!affected) return;

    setEditing(false);
    setGame(undefined);
    setGameFile(undefined);
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
              key={`${activeOriginId}:${treeVersion}`}
              node={activeNode}
              selectedFiles={selection}
              onSelectionChange={handleSelectionChange}
              onGameChange={handleGameChange}
              onVisibleChange={handleVisibleChange}
              isInitialized={(path) => initialised.has(gameKey(path))}
              onRemoved={handleRemoved}
              canGroup={canGroup}
              isGrouped={isGrouped}
              groupedRows={groupedRows}
              onGroupingNeeded={handleGroupingNeeded}
              onToggleGrouping={handleToggleGrouping}
              onOrganize={handleOrganize}
              regionOrder={regionOrder}
              onRegionOrderChange={handleRegionOrderChange}
              notice={notice ?? (organize ? undefined : organizeBusy)}
            />
          )}

          <div class="details-pane">
            <RomDetails
              paths={gameFile ? [gameFile] : selection}
              game={gameFile ? undefined : game}
              gameCover={gameCover}
              records={records}
              stats={stats}
              covers={covers}
              editing={editing}
              onEdit={() => setEditing(true)}
              onCancelEdit={() => setEditing(false)}
              onSave={handleSave}
              onSaveMany={handleSaveMany}
              onSelectFile={handleSelectFile}
              onBack={
                game && gameFile
                  ? { label: game.title, go: () => setGameFile(undefined) }
                  : undefined
              }
              loadContent={loadContent}
            />
          </div>
        </div>
      )}

      {organize && (
        <OrganizePanel
          system={organize.system}
          plan={organize.plan}
          applied={organize.applied}
          busy={organizeBusy}
          onConfirm={handleOrganizeConfirm}
          onUndo={handleOrganizeUndo}
          onClose={() => setOrganize(undefined)}
        />
      )}
    </div>
  );
}
