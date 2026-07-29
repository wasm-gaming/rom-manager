import { VFSNode, FSAAdapter } from '@cloudauthn/vfs-sync';

/**
 * A single file or folder inside an opened origin.
 */
export interface StorageEntry {
  name: string;
  /** Path relative to the origin root, POSIX separators, no leading slash. */
  path: string;
  kind: 'file' | 'directory';
}

/** Bookkeeping folder created by VFSNode, which must stay out of the browser. */
const VFS_METADATA_DIR = '.vfs';

/**
 * StorageNode wraps a single VFSNode instance for a folder
 */
export class StorageNode {
  private node: VFSNode | null = null;
  private adapter: FSAAdapter | null = null;
  private path: string = '';

  async initialize(): Promise<boolean> {
    try {
      this.adapter = await FSAAdapter.pick();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return false;
      }

      throw error;
    }

    this.node = await VFSNode.open(this.adapter);
    // Try to get the path from the handle if available
    this.path = (this.adapter as any).handle?.name || 'Folder';
    return true;
  }

  getPath(): string {
    return this.path;
  }

  getNode(): VFSNode | null {
    return this.node;
  }

  private requireNode(): VFSNode {
    if (!this.node) throw new Error('Storage not initialized');
    return this.node;
  }

  /**
   * Shallow listing of a directory, `''` being the origin root. Folders come
   * first so the result reads like a file browser.
   */
  async list(path: string = ''): Promise<StorageEntry[]> {
    const entries = await this.requireNode().adapter.list(path);

    return entries
      .filter((entry) => entry.name !== VFS_METADATA_DIR)
      .map(({ name, path, kind }) => ({ name, path, kind }))
      .sort((left, right) => {
        if (left.kind !== right.kind) return left.kind === 'directory' ? -1 : 1;
        return left.name.localeCompare(right.name);
      });
  }

  async readFile(path: string): Promise<Uint8Array> {
    return this.requireNode().read(path);
  }

  async writeFile(path: string, content: Uint8Array): Promise<void> {
    await this.requireNode().write(path, content);
  }

  async createDirectory(path: string): Promise<void> {
    await this.requireNode().mkdir(path);
  }

  /** Removes a file or a folder with everything below it. */
  async remove(path: string): Promise<void> {
    await this.requireNode().delete(path);
  }

  /** Moves or renames a file or a folder. */
  async move(oldPath: string, newPath: string): Promise<void> {
    await this.requireNode().rename(oldPath, newPath);
  }
}

/**
 * Storage service - factory for creating multiple StorageNode instances
 */
export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  createNodeInstance(): StorageNode {
    return new StorageNode();
  }
}

export const storageService = StorageService.getInstance();
