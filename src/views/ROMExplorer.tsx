import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { JSX } from 'preact';
import { GearIcon, PlusIcon } from '../components/icons';
import { BrandLogo } from '../components/BrandLogo';
import { WelcomePanel } from '../components/WelcomePanel';
import { Tabs } from '../components/Tabs';
import { FileTree } from '../components/FileTree';
import { OrganizePanel } from '../components/OrganizePanel';
import { PreferencesModal } from '../components/PreferencesModal';
import { MediaDropModal, type DropDecision, type DropTarget } from '../components/MediaDropModal';
import { RomIntakeModal } from '../components/RomIntakeModal';
import { RomDetails } from '../components/RomDetails';
import { storageService, StorageNode, StorageStat } from '../services/StorageService';
import { RomLibrary, RomRecord, gameNameOf, systemOf } from '../services/RomLibraryService';
import { GameCatalogService } from '../services/GameCatalogService';
import { CoverService } from '../services/CoverService';
import { OrganizeService, type UndoRecord } from '../services/OrganizeService';
import { RomIntakeService, isPlaced, type IntakeItem, type IntakeProgress } from '../services/RomIntakeService';
import { ROMDatasetService } from '../services/ROMDatasetService';
import { isWizardFolder, WizardConfigService } from '../services/WizardConfigService';
import { setThemeMode, themeModeSignal } from '../services/ThemeService';
import { localePreferenceSignal, setLocalePreference, t } from '../services/I18nService';
import { HandleStoreService } from '../services/HandleStoreService';
import { buildWizardTree, type WizardGame, type WizardNode } from '../core/wizard-tree';
import { isSharedCover, pickCover, type StoredCovers } from '../core/rom-covers';
import { imageExtensionOf, isImageName, regionOfScope } from '../core/rom-media';
import { preferRegion, REGIONS, type Region } from '../core/rom-regions';
import { filterPlanForPath, type OrganizePlan } from '../core/rom-organize';
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

/** The folder a file is in, `''` being the root of the opened folder. */
function parentOf(path: string): string {
  const separator = path.lastIndexOf('/');
  return separator === -1 ? '' : path.slice(0, separator);
}

/**
 * The regions of the release one of whose files is open.
 *
 * A release is what carries a region, so the box shown for one of its files is
 * chosen among *its* regions and not among the game's: opening the Japanese dump
 * of a game you also have in Europe should show the Japanese box.
 */
function regionsOfFile(game: WizardGame, path?: string): Region[] | undefined {
  if (!path) return undefined;

  return game.variants.find((variant) => variant.files.some((file) => file.path === path))?.regions;
}

/** What a drop is about to do, held while the user reads it and says so. */
interface DropRequest {
  files: File[];
  target: DropTarget;
  /** Where the images go, absent when the target is a plain folder. */
  game?: { id: string; system: string };
  /** What the catalogue made of the files, when it was worth asking it. */
  intake?: IntakeItem[];
}

/**
 * True for a drop of files from outside the app. An internal drag carries paths
 * instead, and moving a ROM onto the details pane means nothing.
 */
function isFileDrag(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes('Files');
}

/**
 * What identifying a dropped game is doing, as a line for the tree.
 *
 * A disc image takes a while to read, so it is reported as a share of itself
 * rather than as one file among several: the wait is inside the file.
 */
function intakeNotice({ file, read, size, done, total }: IntakeProgress): string {
  const percent = size > 0 ? Math.min(100, Math.round((read / size) * 100)) : 100;

  return total > 1
    ? t('progress.identifyingFileOf', { file, percent, done: done + 1, total })
    : t('progress.identifyingFile', { file, percent });
}

/** «Identifying that file», or «identifying those five», as the drop happens. */
function identifyingNotice(files: File[]): string {
  return files.length > 1
    ? t('progress.identifyingMany', { count: files.length })
    : t('progress.identifying', { file: files[0].name });
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
  /** The folder picked in the tree, which is where a dropped file would go. */
  const [folder, setFolder] = useState<string | undefined>();
  /** The boxart on screen for that game, and the region it is the box of. */
  const [gameCover, setGameCover] = useState<{ url: string; publishedUrl?: string; region?: Region } | undefined>();
  /** A drop waiting to be confirmed, and what is being written once it is. */
  const [drop, setDrop] = useState<DropRequest | undefined>();
  const [dropBusy, setDropBusy] = useState<string | undefined>();
  const [dropError, setDropError] = useState<string | undefined>();
  /** True while files are over the details pane, so it can say it takes them. */
  const [dropping, setDropping] = useState(false);
  /** Games dropped with nothing picked, once identified and awaiting a yes. */
  const [intake, setIntake] = useState<IntakeItem[] | undefined>();
  const [intakeBusy, setIntakeBusy] = useState<string | undefined>();
  const [intakeError, setIntakeError] = useState<string | undefined>();
  /** Bumped when an image is written, so the pane picks the new boxart up. */
  const [mediaVersion, setMediaVersion] = useState(0);
  /** Bumped when a file is written, so the tree lists it without remounting. */
  const [refreshToken, setRefreshToken] = useState(0);
  /** The organize preview, once one has been worked out and not yet dismissed. */
  const [organize, setOrganize] = useState<
    { system: string; plan: OrganizePlan; applied?: UndoRecord } | undefined
  >();
  const [organizeBusy, setOrganizeBusy] = useState<string | undefined>();
  /** Whether the preferences panel is open. */
  const [preferences, setPreferences] = useState(false);
  /** Whether the initial landing view is being shown. */
  const [showLanding, setShowLanding] = useState(false);
  /** Bumped to remount the tree after the files underneath it have moved. */
  const [treeVersion, setTreeVersion] = useState(0);

  /** Systems whose library folder has already been listed. */
  const indexedSystems = useRef<Set<string>>(new Set());
  /** Folders whose grouped rows are already being worked out. */
  const grouping = useRef<Set<string>>(new Set());
  /** Object URLs minted for local covers, revoked when they are replaced. */
  const objectUrls = useRef<string[]>([]);
  /** Persisted handles restored from IndexedDB on startup. */
  const restoredHandles = useRef<Map<string, FileSystemDirectoryHandle>>(new Map());

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

  /** Restore persisted directory handles from IndexedDB on startup. */
  useEffect(() => {
    HandleStoreService.loadAll()
      .then((storedEntries) => {
        for (const entry of storedEntries) {
          restoredHandles.current.set(entry.id, entry.handle);
          storeService.addOrigin({
            id: entry.id,
            name: entry.name,
            path: entry.name,
            selection: [],
            locked: true,
          });
        }
        try {
          const lastActiveId = localStorage.getItem('rom-manager:active-origin-id');
          if (lastActiveId && storedEntries.some((entry) => entry.id === lastActiveId)) {
            storeService.setActiveOrigin(lastActiveId);
          }
        } catch {
          // Ignore storage errors
        }
      })
      .catch(() => undefined);
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
   * The boxart of the game on screen, chosen by the region preference over what
   * the catalogue publishes *and* what is already in `.meta` — an image added by
   * hand is the boxart of its region, so it takes part in the choice rather than
   * only serving it. Browsing is what puts the published ones there.
   *
   * With one file of the game open it is that release's regions the preference
   * chooses among, so the panel of a Japanese dump shows the Japanese box.
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

    const show = async () => {
      const system = systemOf(game.paths[0]);
      const stored: StoredCovers | undefined = await CoverService.storedCovers(
        activeNode,
        system,
        game.id,
      ).catch(() => undefined);

      const selectedVariant = gameFile
        ? game.variants.find((v) => v.files.some((f) => f.path === gameFile))
        : undefined;

      const cover = pickCover(game.covers, {
        present: regionsOfFile(game, gameFile) ?? game.presentRegions,
        order: regionOrder,
        stored,
        variantUrl: selectedVariant?.cover,
        variantRegion: selectedVariant?.regions[0],
      });

      const resolved = await CoverService.resolve(activeNode, system, game.id, cover);

      if (cancelled) {
        revoke(resolved?.url);
        return;
      }

      shown = resolved?.url;

      // Which box it is only gets said when the image is that region's own: a
      // world release's single scan is the box of the game, whichever region the
      // order happened to pick it for.
      const region =
        cover && !isSharedCover(game.covers, cover) ? cover.region : undefined;

      setGameCover(
        resolved
          ? { url: resolved.url, publishedUrl: cover?.url, region }
          : undefined,
      );
    };

    show().catch(() => setGameCover(undefined));

    return () => {
      cancelled = true;
      revoke(shown);
    };
  }, [activeNode, game, gameFile, regionOrder, mediaVersion]);

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

      setShowLanding(false);
      const path = nodeInstance.getPath();
      const name = path?.split('/').pop() || 'Folder';
      const originId = `origin-${Date.now()}`;

      setStorageNodes((current) => new Map(current).set(originId, nodeInstance));
      storeService.addOrigin({ id: originId, name, path, selection: [] });

      const handle = nodeInstance.getHandle();
      if (handle) {
        HandleStoreService.save({ id: originId, name, handle }).catch(() => undefined);
      }
    } catch (err) {
      storeService.setError(err instanceof Error ? err.message : t('errors.openFolder'));
    } finally {
      storeService.setLoading(false);
    }
  };

  const handleSelectOrigin = async (originId: string) => {
    setShowLanding(false);
    const origin = originsMap.get(originId);

    if (origin?.locked) {
      const savedHandle = restoredHandles.current.get(originId);
      if (savedHandle) {
        try {
          storeService.setLoading(true);
          storeService.setError(undefined);

          const nodeInstance = storageService.createNodeInstance();
          const authorized = await nodeInstance.initializeFromHandle(savedHandle);

          if (!authorized) {
            storeService.setError(t('errors.deniedFolder'));
            return;
          }

          setStorageNodes((current) => new Map(current).set(originId, nodeInstance));
          storeService.addOrigin({ ...origin, locked: false });
        } catch (err) {
          storeService.setError(err instanceof Error ? err.message : t('errors.savedFolder'));
          return;
        } finally {
          storeService.setLoading(false);
        }
      }
    }

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
        const [match, covers, entries, media] = await Promise.all([
          GameCatalogService.load(activeNode, system, (progress) =>
            setNotice(t('progress.reading', { path, done: progress.done, total: progress.total })),
          ),
          GameCatalogService.coversOf(system),
          activeNode.list(path),
          ROMDatasetService.mediaOf(system).catch(() => 'cartridge' as const),
        ]);

        setGroupedRows((current) =>
          new Map(current).set(
            path,
            buildWizardTree(path, entries, match, covers, media ?? 'cartridge'),
          ),
        );
      } catch (err) {
        storeService.setError(err instanceof Error ? err.message : t('errors.group', { path }));
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
        storeService.setError(err instanceof Error ? err.message : t('errors.viewMode'));
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
        storeService.setError(err instanceof Error ? err.message : t('errors.regionOrder'));
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
        setOrganizeBusy(t('organize.busy.reading', { system }));

        let plan = await OrganizeService.plan(activeNode, system, (done, total) =>
          setOrganizeBusy(t('organize.busy.readingProgress', { system, done, total })),
        );

        if (path !== system) {
          plan = filterPlanForPath(plan, path);
        }

        setOrganize({ system, plan });
      } catch (err) {
        storeService.setError(err instanceof Error ? err.message : t('errors.plan', { system }));
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
      setOrganizeBusy(t('organize.busy.moving'));

      const applied = await OrganizeService.apply(
        activeNode,
        organize.system,
        organize.plan,
        (done, total) => setOrganizeBusy(t('organize.busy.movingProgress', { done, total })),
      );

      setOrganize({ ...organize, applied });
      invalidateTree();
    } catch (err) {
      storeService.setError(err instanceof Error ? err.message : t('errors.organize'));
    } finally {
      setOrganizeBusy(undefined);
    }
  }, [activeNode, organize, invalidateTree]);

  const handleOrganizeUndo = useCallback(async () => {
    if (!activeNode || !organize?.applied) return;

    try {
      storeService.setError(undefined);
      setOrganizeBusy(t('organize.busy.undoing'));

      await OrganizeService.undo(activeNode, organize.applied);
      setOrganize(undefined);
      invalidateTree();
    } catch (err) {
      storeService.setError(err instanceof Error ? err.message : t('errors.undo'));
    } finally {
      setOrganizeBusy(undefined);
    }
  }, [activeNode, organize, invalidateTree]);

  const handleCloseOrigin = (originId: string) => {
    restoredHandles.current.delete(originId);
    HandleStoreService.remove(originId).catch(() => undefined);
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

  const handleFolderChange = useCallback((path?: string) => setFolder(path), []);

  /**
   * Where a file dropped on the details pane would go: the game on screen takes
   * images into its metadata and files into the folder its ROMs live in, and a
   * folder picked in the tree takes anything as it is.
   *
   * Anything else — a plain ROM, several of them, nothing at all — is not
   * somewhere a file can be put, and saying so is better than guessing.
   */
  const dropDestination = ():
    | { target: DropTarget; game?: { id: string; system: string } }
    | undefined => {
    if (game) {
      return {
        target: { kind: 'game', title: game.title, folder: parentOf(game.paths[0]) },
        game: { id: game.id, system: systemOf(game.paths[0]) },
      };
    }

    return folder === undefined ? undefined : { target: { kind: 'folder', path: folder } };
  };

  const handlePaneDragOver = (event: DragEvent) => {
    if (!isFileDrag(event)) return;

    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    setDropping(true);
  };

  const handlePaneDrop = (event: DragEvent) => {
    if (!isFileDrag(event)) return;

    event.preventDefault();
    setDropping(false);

    const files = Array.from(event.dataTransfer?.files ?? []);
    if (files.length === 0 || !activeNode) return;

    const destination = dropDestination();

    // With nothing picked there is nowhere the files were said to go, so they
    // are asked what they are: a game the catalogue knows brings its own answer.
    if (!destination) {
      void handleIntake(files);
      return;
    }

    storeService.setError(undefined);
    setDropError(undefined);
    void openDrop(files, destination);
  };

  /**
   * Opens the drop, asking the catalogue first what the folder is being given.
   *
   * A file dropped on a folder has two possible destinations — the folder, and
   * the one the release it turns out to be lives in — and the modal cannot offer
   * the second without knowing what the file is. Reading an archive's index is
   * what answers for a zipped game, so the common case costs nothing; a loose
   * ROM is hashed, with the same progress line the other road shows.
   *
   * Only for a folder, and only for what could be a game: an image is a boxart
   * and a drop on a game is a drop *for* that game, and neither has a second
   * destination to be offered.
   */
  const openDrop = async (
    files: File[],
    destination: { target: DropTarget; game?: { id: string; system: string } },
  ) => {
    const askable = files.some((file) => !isImageName(file.name));

    if (!activeNode || !askable) {
      setDrop({ files, ...destination });
      return;
    }

    try {
      setNotice(identifyingNotice(files));

      const items = await RomIntakeService.identify(activeNode, files, (progress) =>
        setNotice(intakeNotice(progress)),
      );

      setDrop({ files, ...destination, intake: items });
    } catch (err) {
      // The copy still works without an answer, so the drop opens anyway and
      // says why it is only offering the one destination.
      setDrop({ files, ...destination });
      setDropError(
        t('errors.catalogue', {
          reason: err instanceof Error ? err.message : t('errors.unknown'),
        }),
      );
    } finally {
      setNotice(undefined);
    }
  };

  /**
   * Works out which games were dropped, and offers to take them in.
   *
   * Nothing is written here: hashing the files is what says which system each
   * one belongs to, and the answer is shown for the user to confirm — creating
   * a system folder and copying a ROM into it is not something to do behind
   * their back off a drag they may have aimed at something else.
   */
  const handleIntake = async (files: File[]) => {
    if (!activeNode) return;

    try {
      storeService.setError(undefined);
      setIntakeError(undefined);
      setNotice(identifyingNotice(files));

      const items = await RomIntakeService.identify(activeNode, files, (progress) =>
        setNotice(intakeNotice(progress)),
      );

      // A refused archive opens the panel too: what it says is why nothing can
      // be done with it, which is the thing worth knowing.
      if (!items.some((item) => item.path || item.refused)) {
        storeService.setError(t('errors.noGame'));
        return;
      }

      setIntake(items);
    } catch (err) {
      storeService.setError(err instanceof Error ? err.message : t('errors.identify'));
    } finally {
      setNotice(undefined);
    }
  };

  /** Copies in the games the user has just confirmed, folders and all. */
  const handleIntakeConfirm = async () => {
    if (!activeNode || !intake) return;

    try {
      setIntakeError(undefined);

      const addedPaths = intake.filter(isPlaced).map((item) => item.path!).filter(Boolean);

      await RomIntakeService.apply(activeNode, intake, ({ file, done, total }) =>
        setIntakeBusy(
          total > 1
            ? t('progress.copyingOf', { file, done: done + 1, total })
            : t('progress.copying', { file }),
        ),
      );

      setIntake(undefined);

      // The ROMs that just landed are files nothing has hashed, and the system
      // folder they went into may not have been there at all.
      grouping.current.clear();
      setGroupedRows(new Map());
      setRefreshToken((token) => token + 1);

      if (addedPaths.length > 0) {
        setGameFile(undefined);
        await handleSelectionChange(addedPaths);
      }
    } catch (err) {
      setIntakeError(err instanceof Error ? err.message : t('errors.copyFiles'));
    } finally {
      setIntakeBusy(undefined);
    }
  };

  /**
   * Writes what the drop said it would: images into the metadata of the game,
   * under the name their kind and region give them, the files kept as they are
   * into the folder, and the ones taken in as games wherever the catalogue puts
   * them — which is `apply`'s business, folders, checksums and all.
   */
  const handleDropConfirm = async ({ images, files, intake: taken }: DropDecision) => {
    if (!activeNode || !drop) return;

    const { target } = drop;
    const directory = target.kind === 'game' ? target.folder : target.path;

    try {
      setDropError(undefined);

      for (const image of images) {
        if (!drop.game) break;

        setDropBusy(t('progress.saving', { file: image.file.name }));
        await CoverService.save(
          activeNode,
          drop.game.system,
          drop.game.id,
          {
            kind: image.kind,
            region: regionOfScope(image.scope),
            extension: imageExtensionOf(image.file.name),
          },
          new Uint8Array(await image.file.arrayBuffer()),
        );
      }

      const copiedPaths: string[] = [];
      for (const file of files) {
        setDropBusy(t('progress.copying', { file: file.name }));
        const path = directory ? `${directory}/${file.name}` : file.name;
        await activeNode.writeFile(path, new Uint8Array(await file.arrayBuffer()));
        copiedPaths.push(path);
      }

      const takenPaths: string[] = [];
      if (taken.length > 0) {
        await RomIntakeService.apply(activeNode, taken, ({ file, done, total }) =>
          setDropBusy(
            total > 1
              ? t('progress.addingOf', { file, done: done + 1, total })
              : t('progress.adding', { file }),
          ),
        );
        takenPaths.push(...taken.filter(isPlaced).map((item) => item.path!).filter(Boolean));
      }

      setDrop(undefined);
      if (images.length > 0) setMediaVersion((version) => version + 1);

      const addedPaths = takenPaths.length > 0 ? takenPaths : copiedPaths;

      if (files.length > 0 || taken.length > 0) {
        // A ROM that has just landed is a file nothing has hashed, so the rows
        // it belongs in have to be worked out again.
        grouping.current.clear();
        setGroupedRows(new Map());
        setRefreshToken((token) => token + 1);
      }

      if (addedPaths.length > 0) {
        setGameFile(undefined);
        await handleSelectionChange(addedPaths);
      }
    } catch (err) {
      setDropError(err instanceof Error ? err.message : t('errors.writeFiles'));
    } finally {
      setDropBusy(undefined);
    }
  };

  const handleSelectionChange = async (paths: string[]) => {
    setEditing(false);
    storeService.setSelection(paths);

    if (!activeNode) return;

    try {
      storeService.setError(undefined);
      await loadSelection(activeNode, paths);
    } catch (err) {
      storeService.setError(err instanceof Error ? err.message : t('errors.readSelection'));
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

  const handleGoInitialView = useCallback(() => {
    storeService.setSelection([]);
    setGame(undefined);
    setGameFile(undefined);
    setFolder(undefined);
    setEditing(false);
    setNotice(undefined);
    setOrganize(undefined);
    setShowLanding(true);
  }, []);

  return (
    <div class="rom-explorer">
      <header class="explorer-header">
        <div class="header-left">
          <h1
            class="explorer-title clickable"
            onClick={handleGoInitialView}
            title={t('app.name')}
          >
            <BrandLogo class="explorer-mark" />
            {t('app.name')}
          </h1>
          <button class="tab-add" onClick={handleOpenFolder} title={t('tabs.add')}>
            <PlusIcon />
          </button>
        </div>

        <div class="header-right">
          <Tabs
            origins={Array.from(originsMap.values())}
            activeOriginId={showLanding ? undefined : activeOriginId}
            onSelectOrigin={handleSelectOrigin}
            onClose={handleCloseOrigin}
          />
          <div class="header-right-actions">
            {/* The preference order, statically rendered as | EU | US | JP | while
                storing and updating region priority on click. */}
            <div class="header-regions" role="group" aria-label={t('header.regions.label')}>
              {REGIONS.map((region) => {
                const isPreferred = regionOrder[0] === region;
                return (
                  <button
                    key={region}
                    class={`header-region ${isPreferred ? 'on' : ''}`}
                    disabled={!activeNode || showLanding}
                    aria-pressed={isPreferred}
                    title={
                      isPreferred
                        ? t('header.regions.preferred', { region })
                        : t('header.regions.prefer', { region })
                    }
                    onClick={() => handleRegionOrderChange(preferRegion(regionOrder, region))}
                  >
                    {region}
                  </button>
                );
              })}
            </div>

            <button
              class="header-prefs"
              onClick={() => setPreferences(true)}
              title={t('header.preferences')}
            >
              <GearIcon />
            </button>
          </div>
        </div>
      </header>

      {errorSignal.value && <div class="error-message">{errorSignal.value}</div>}

      {originsMap.size === 0 || showLanding ? (
        // Initial view: shown before any folder is opened or when the title is clicked
        <WelcomePanel onOpenFolder={handleOpenFolder} loading={loadingSignal.value} />
      ) : activeOrigin?.locked || !activeNode ? (
        <div class="empty-state-full">
          <p>
            {t('library.locked.title', { name: activeOrigin?.name ?? t('system.folder') })}
          </p>
          <button
            onClick={() => activeOriginId && handleSelectOrigin(activeOriginId)}
            disabled={loadingSignal.value}
          >
            {loadingSignal.value
              ? t('library.opening')
              : t('library.locked.open', { name: activeOrigin?.name ?? t('system.folder') })}
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
              onFolderChange={handleFolderChange}
              onVisibleChange={handleVisibleChange}
              isInitialized={(path) => initialised.has(gameKey(path))}
              onRemoved={handleRemoved}
              canGroup={canGroup}
              isGrouped={isGrouped}
              groupedRows={groupedRows}
              onGroupingNeeded={handleGroupingNeeded}
              onToggleGrouping={handleToggleGrouping}
              onOrganize={handleOrganize}
              notice={notice ?? (organize ? undefined : organizeBusy)}
              refreshToken={refreshToken}
            />
          )}

          {/* The pane takes files from outside: an image for the game on screen,
              or anything at all for the folder picked in the tree. */}
          <div
            class={`details-pane ${dropping ? 'drop-target' : ''}`}
            onDragOver={handlePaneDragOver}
            onDragLeave={(event) => {
              const leaving = event.relatedTarget as Node | null;
              if (!leaving || !event.currentTarget.contains(leaving)) setDropping(false);
            }}
            onDrop={handlePaneDrop}
          >
            <RomDetails
              paths={gameFile ? [gameFile] : selection}
              game={gameFile ? undefined : game}
              folder={folder}
              wizardFolder={folder !== undefined && isGrouped(folder)}
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
              onOrganize={handleOrganize}
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

      {/* Mounted whether or not it is open: the dialog closes itself, and being
          still there is what lets it be seen doing so. */}
      <PreferencesModal
        open={preferences}
        themeMode={themeModeSignal.value}
        onThemeModeChange={setThemeMode}
        // The language is the browser's, like the theme, so it is never gated
        // on a library being open.
        locale={localePreferenceSignal.value}
        onLocaleChange={setLocalePreference}
        regionOrder={regionOrder}
        // The order lives in the library's `.meta`, so it can only be changed
        // while one is open.
        onRegionOrderChange={activeNode ? handleRegionOrderChange : undefined}
        onClose={() => setPreferences(false)}
      />

      {/* Only while there is a drop to read: what it says depends entirely on
          which files were dropped and where. */}
      {drop && (
        <MediaDropModal
          files={drop.files}
          target={drop.target}
          intake={drop.intake}
          busy={dropBusy}
          error={dropError}
          onConfirm={handleDropConfirm}
          onCancel={() => {
            if (dropBusy) return;
            setDrop(undefined);
            setDropError(undefined);
          }}
        />
      )}

      {/* Only once the drop has been identified: what it says is the answer. */}
      {intake && (
        <RomIntakeModal
          items={intake}
          busy={intakeBusy}
          error={intakeError}
          onConfirm={handleIntakeConfirm}
          onCancel={() => {
            if (intakeBusy) return;
            setIntake(undefined);
            setIntakeError(undefined);
          }}
        />
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
