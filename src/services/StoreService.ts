import { $reactive, $toRaw } from 'jq79';
import { emptySettings, type WizardSettings } from './WizardConfigService';

/**
 * Origin represents an opened folder/location
 */
export interface Origin {
  id: string;
  name: string;
  path: string;
  /** ROM files currently selected in the tree, in tree order. */
  selection?: string[];
  /** True when restored from IndexedDB but not yet re-authorised by the user. */
  locked?: boolean;
  /** The app's own library (OPFS) — always there, never closed — or a folder on disk. */
  kind?: 'library' | 'folder';
}

/** The app-wide state, as one jq79 store: a template that reads it follows it. */
export interface AppState {
  /** The open origins (the library and any folders), in the order they were opened. */
  origins: Origin[];
  activeOriginId: string | undefined;
  loading: boolean;
  error: string | undefined;
  /**
   * Which folders of the open library are browsed grouped by game, mirroring its
   * `wizard.json`. Only the active library is held: the settings belong to the
   * folder on disk, so switching tabs reloads them from there.
   */
  wizardSettings: WizardSettings;
  /** Systems the dataset knows about, which is what makes a folder wizard by default. */
  knownSystems: string[];
}

export const appState = $reactive<AppState>({
  origins: [],
  activeOriginId: undefined,
  loading: false,
  error: undefined,
  wizardSettings: emptySettings(),
  knownSystems: [],
});

const ACTIVE_ORIGIN_KEY = 'rom-manager:active-origin-id';

/** The active origin is remembered between visits; storage may refuse, which is harmless. */
function remember(id: string | undefined): void {
  try {
    if (id) localStorage.setItem(ACTIVE_ORIGIN_KEY, id);
    else localStorage.removeItem(ACTIVE_ORIGIN_KEY);
  } catch {
    // Ignore storage errors
  }
}

export class StoreService {
  private static instance: StoreService;

  private constructor() {}

  static getInstance(): StoreService {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance;
  }

  // Origin management

  /** Adds an origin, or replaces the one with its id where it stands. */
  addOrigin(origin: Origin): void {
    const at = appState.origins.findIndex((candidate) => candidate.id === origin.id);
    appState.origins =
      at === -1
        ? [...appState.origins, origin]
        : appState.origins.map((candidate, index) => (index === at ? origin : candidate));
    if (!appState.activeOriginId) {
      appState.activeOriginId = origin.id;
      remember(origin.id);
    }
  }

  getOrigin(id: string): Origin | undefined {
    return appState.origins.find((origin) => origin.id === id);
  }

  getOrigins(): Origin[] {
    return [...appState.origins];
  }

  removeOrigin(id: string): void {
    appState.origins = appState.origins.filter((origin) => origin.id !== id);

    // If removed origin was active, switch to another
    if (appState.activeOriginId === id) {
      const nextActive = appState.origins[0]?.id;
      appState.activeOriginId = nextActive;
      remember(nextActive);
    }
  }

  setActiveOrigin(id: string): void {
    if (this.getOrigin(id)) {
      appState.activeOriginId = id;
      remember(id);
    }
  }

  getActiveOrigin(): Origin | undefined {
    const id = appState.activeOriginId;
    return id ? this.getOrigin(id) : undefined;
  }

  // File management for active origin
  setSelection(paths: string[]): void {
    const originId = appState.activeOriginId;
    if (!originId) return;
    appState.origins = appState.origins.map((origin) => (origin.id === originId ? { ...origin, selection: paths } : origin));
  }

  getSelection(): string[] {
    return this.getActiveOrigin()?.selection || [];
  }

  // Loading state
  setLoading(loading: boolean): void {
    appState.loading = loading;
  }

  isLoading(): boolean {
    return appState.loading;
  }

  // Error state
  setError(error: string | undefined): void {
    appState.error = error;
  }

  getError(): string | undefined {
    return appState.error;
  }

  setWizardSettings(settings: WizardSettings): void {
    appState.wizardSettings = settings;
  }

  /** The settings as plain data, for the services that read and write `wizard.json`. */
  getWizardSettings(): WizardSettings {
    return $toRaw(appState).wizardSettings;
  }

  setKnownSystems(systems: Set<string>): void {
    appState.knownSystems = Array.from(systems);
  }

  getKnownSystems(): Set<string> {
    return new Set($toRaw(appState).knownSystems);
  }

  clear(): void {
    appState.origins = [];
    appState.activeOriginId = undefined;
    appState.loading = false;
    appState.error = undefined;
    appState.wizardSettings = emptySettings();
  }
}

export const storeService = StoreService.getInstance();
