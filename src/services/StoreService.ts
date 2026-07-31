import { signal } from '@preact/signals';
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
}

/**
 * Global store service using Preact signals for reactive state
 */

export const originsSignal = signal<Map<string, Origin>>(new Map());
export const activeOriginIdSignal = signal<string | undefined>();
export const loadingSignal = signal(false);
export const errorSignal = signal<string | undefined>();

/**
 * Which folders of the open library are browsed grouped by game, mirroring its
 * `wizard.json`. Only the active library is held: the settings belong to the
 * folder on disk, so switching tabs reloads them from there.
 */
export const wizardSettingsSignal = signal<WizardSettings>(emptySettings());

/** Systems the dataset knows about, which is what makes a folder wizard by default. */
export const knownSystemsSignal = signal<Set<string>>(new Set());

export class StoreService {
  private static instance: StoreService;

  private constructor() {}

  private getOriginsMap(): Map<string, Origin> {
    return originsSignal.value instanceof Map ? originsSignal.value : new Map<string, Origin>();
  }

  static getInstance(): StoreService {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance;
  }

  // Origin management
  addOrigin(origin: Origin): void {
    const origins = new Map(this.getOriginsMap());
    origins.set(origin.id, origin);
    originsSignal.value = origins;
    if (!activeOriginIdSignal.value) {
      activeOriginIdSignal.value = origin.id;
    }
  }

  getOrigin(id: string): Origin | undefined {
    return this.getOriginsMap().get(id);
  }

  getOrigins(): Origin[] {
    return Array.from(this.getOriginsMap().values());
  }

  removeOrigin(id: string): void {
    const origins = new Map(this.getOriginsMap());
    origins.delete(id);
    originsSignal.value = origins;

    // If removed origin was active, switch to another
    if (activeOriginIdSignal.value === id) {
      const remaining = Array.from(origins.keys());
      activeOriginIdSignal.value = remaining.length > 0 ? remaining[0] : undefined;
    }
  }

  setActiveOrigin(id: string): void {
    if (this.getOriginsMap().has(id)) {
      activeOriginIdSignal.value = id;
    }
  }

  getActiveOrigin(): Origin | undefined {
    const id = activeOriginIdSignal.value;
    return id ? this.getOriginsMap().get(id) : undefined;
  }

  // File management for active origin
  setSelection(paths: string[]): void {
    const originId = activeOriginIdSignal.value;
    if (!originId) return;

    const origins = new Map(this.getOriginsMap());
    const origin = origins.get(originId);
    if (origin) {
      origins.set(originId, { ...origin, selection: paths });
      originsSignal.value = origins;
    }
  }

  getSelection(): string[] {
    return this.getActiveOrigin()?.selection || [];
  }

  // Loading state
  setLoading(loading: boolean): void {
    loadingSignal.value = loading;
  }

  isLoading(): boolean {
    return loadingSignal.value;
  }

  // Error state
  setError(error: string | undefined): void {
    errorSignal.value = error;
  }

  getError(): string | undefined {
    return errorSignal.value;
  }

  setWizardSettings(settings: WizardSettings): void {
    wizardSettingsSignal.value = settings;
  }

  setKnownSystems(systems: Set<string>): void {
    knownSystemsSignal.value = systems;
  }

  clear(): void {
    originsSignal.value = new Map();
    activeOriginIdSignal.value = undefined;
    loadingSignal.value = false;
    errorSignal.value = undefined;
    wizardSettingsSignal.value = emptySettings();
  }
}

export const storeService = StoreService.getInstance();
