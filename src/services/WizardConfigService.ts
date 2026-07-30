/**
 * Which folders the user browses grouped by game, persisted in
 * `.meta/wizard.json`.
 *
 * Whether a folder is browsed grouped is always an explicit, stored decision
 * rather than something inferred while walking the disk: a heuristic would
 * silently change how the library looks when a file is added or removed.
 */

import { META_DIR } from './RomLibraryService';
import type { StorageNode } from './StorageService';

const WIZARD_VERSION = 1;

export const WIZARD_CONFIG_PATH = `${META_DIR}/wizard.json`;

export interface WizardSettings {
  /**
   * Folders whose mode was chosen explicitly, keyed by path relative to the
   * library root. A system folder missing from here is still wizard: only the
   * exceptions are stored.
   */
  folders: Record<string, boolean>;
}

export function emptySettings(): WizardSettings {
  return { folders: {} };
}

/**
 * Whether a folder is browsed grouped by game.
 *
 * System folders default to wizard, because grouping is the point of the app.
 * Anything else — collections above all — defaults to a plain listing and has
 * to be turned on deliberately.
 */
export function isWizardFolder(
  path: string,
  settings: WizardSettings,
  systems: Set<string>,
): boolean {
  const explicit = settings.folders[path];
  if (typeof explicit === 'boolean') return explicit;

  return systems.has(path);
}

/**
 * A stored path has to be a plain relative path: it is used to look up folders,
 * and the file lives where the user can edit it.
 */
function isSafeFolderKey(path: string): boolean {
  return (
    path.length > 0 &&
    !path.startsWith('/') &&
    !path.includes('\\') &&
    !path.split('/').includes('..')
  );
}

function parseSettings(raw: unknown): WizardSettings {
  if (!raw || typeof raw !== 'object') return emptySettings();

  const source = raw as Record<string, unknown>;
  if (source.version !== WIZARD_VERSION) return emptySettings();
  if (!source.folders || typeof source.folders !== 'object') return emptySettings();

  const folders: Record<string, boolean> = {};
  for (const [path, mode] of Object.entries(source.folders as Record<string, unknown>)) {
    if (typeof mode === 'boolean' && isSafeFolderKey(path)) folders[path] = mode;
  }

  return { folders };
}

export class WizardConfigService {
  /** Settings of an opened library, falling back to the defaults. */
  static async read(node: StorageNode): Promise<WizardSettings> {
    try {
      const bytes = await node.readFile(WIZARD_CONFIG_PATH);
      return parseSettings(JSON.parse(new TextDecoder().decode(bytes)));
    } catch {
      // No file yet, or one damaged beyond use: the defaults are sound.
      return emptySettings();
    }
  }

  static async write(node: StorageNode, settings: WizardSettings): Promise<void> {
    const stored = { version: WIZARD_VERSION, folders: settings.folders };

    await node.createDirectory(META_DIR);
    await node.writeFile(
      WIZARD_CONFIG_PATH,
      new TextEncoder().encode(`${JSON.stringify(stored, null, 2)}\n`),
    );
  }

  /**
   * Record the mode of a folder and store the result.
   *
   * A folder back at its default is dropped rather than written as such, so the
   * file stays a list of exceptions and a system renamed later does not carry a
   * stale entry.
   */
  static async setWizard(
    node: StorageNode,
    path: string,
    wizard: boolean,
    systems: Set<string>,
  ): Promise<WizardSettings> {
    const settings = await this.read(node);
    const folders = { ...settings.folders };

    if (wizard === systems.has(path)) delete folders[path];
    else folders[path] = wizard;

    const updated = { folders };
    await this.write(node, updated);
    return updated;
  }
}
