import { beforeEach, describe, expect, it } from 'vitest';
import type { StorageNode } from './StorageService';
import {
  emptySettings,
  isWizardFolder,
  WIZARD_CONFIG_PATH,
  WizardConfigService,
} from './WizardConfigService';

class FakeStorage {
  readonly files = new Map<string, string>();

  put(path: string, content: unknown): void {
    this.files.set(path, typeof content === 'string' ? content : JSON.stringify(content));
  }

  async readFile(path: string): Promise<Uint8Array> {
    const content = this.files.get(path);
    if (content === undefined) throw new Error(`No such file: ${path}`);
    return new TextEncoder().encode(content);
  }

  async writeFile(path: string, content: Uint8Array): Promise<void> {
    this.files.set(path, new TextDecoder().decode(content));
  }

  async createDirectory(): Promise<void> {}

  asNode(): StorageNode {
    return this as unknown as StorageNode;
  }
}

const SYSTEMS = new Set(['MegaDrive', 'PSX']);

let storage: FakeStorage;

function stored(): { version: number; folders: Record<string, boolean> } {
  return JSON.parse(storage.files.get(WIZARD_CONFIG_PATH)!);
}

beforeEach(() => {
  storage = new FakeStorage();
});

describe('isWizardFolder', () => {
  it('groups a system folder by default', () => {
    expect(isWizardFolder('MegaDrive', emptySettings(), SYSTEMS)).toBe(true);
  });

  it('lists any other folder plainly by default', () => {
    // A collection is curated by hand: grouping it by game would misrepresent it.
    expect(isWizardFolder('MegaDrive/Favoritos', emptySettings(), SYSTEMS)).toBe(false);
  });

  it('honours a folder turned on explicitly', () => {
    const settings = { folders: { 'MegaDrive/Favoritos': true } };

    expect(isWizardFolder('MegaDrive/Favoritos', settings, SYSTEMS)).toBe(true);
  });

  it('honours a system turned off explicitly', () => {
    const settings = { folders: { MegaDrive: false } };

    expect(isWizardFolder('MegaDrive', settings, SYSTEMS)).toBe(false);
  });
});

describe('WizardConfigService', () => {
  it('falls back to the defaults when there is no file yet', async () => {
    expect(await WizardConfigService.read(storage.asNode())).toEqual(emptySettings());
  });

  it('reads back what it wrote', async () => {
    await WizardConfigService.write(storage.asNode(), { folders: { 'PSX/Demos': true } });

    expect(await WizardConfigService.read(storage.asNode())).toEqual({
      folders: { 'PSX/Demos': true },
    });
  });

  it('falls back to the defaults when the file is not valid JSON', async () => {
    // The file sits where the user can edit it, so it is untrusted input.
    storage.put(WIZARD_CONFIG_PATH, 'not json');

    expect(await WizardConfigService.read(storage.asNode())).toEqual(emptySettings());
  });

  it('ignores a file left by another version', async () => {
    storage.put(WIZARD_CONFIG_PATH, { version: 99, folders: { MegaDrive: false } });

    expect(await WizardConfigService.read(storage.asNode())).toEqual(emptySettings());
  });

  it('drops the damaged entries and keeps the sound ones', async () => {
    storage.put(WIZARD_CONFIG_PATH, {
      version: 1,
      folders: { MegaDrive: false, PSX: 'yes', '../escape': true, '/absolute': true },
    });

    expect(await WizardConfigService.read(storage.asNode())).toEqual({
      folders: { MegaDrive: false },
    });
  });

  it('stores a folder whose mode differs from its default', async () => {
    await WizardConfigService.setWizard(storage.asNode(), 'MegaDrive/Favoritos', true, SYSTEMS);

    expect(stored().folders).toEqual({ 'MegaDrive/Favoritos': true });
  });

  it('drops a folder put back at its default instead of storing it', async () => {
    // The file is a list of exceptions, so nothing stale is left behind.
    await WizardConfigService.setWizard(storage.asNode(), 'MegaDrive', false, SYSTEMS);
    await WizardConfigService.setWizard(storage.asNode(), 'MegaDrive', true, SYSTEMS);

    expect(stored().folders).toEqual({});
  });

  it('keeps the other folders when one changes', async () => {
    await WizardConfigService.setWizard(storage.asNode(), 'PSX', false, SYSTEMS);
    const settings = await WizardConfigService.setWizard(
      storage.asNode(),
      'MegaDrive/Favoritos',
      true,
      SYSTEMS,
    );

    expect(settings.folders).toEqual({ PSX: false, 'MegaDrive/Favoritos': true });
  });
});
