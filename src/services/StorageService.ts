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

export interface StorageStat {
  kind: 'file' | 'directory';
  size: number;
  /** Epoch milliseconds. The File System Access API exposes no creation time. */
  mtime: number;
}

/**
 * Bookkeeping folders that back the app itself: the VFSNode journal and the
 * metadata sidecar. Neither belongs in the file browser. `.roms` is the name
 * the sidecar used before and is still hidden so an existing library does not
 * suddenly show it.
 */
const HIDDEN_DIRS = new Set(['.vfs', '.roms', '.meta']);

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
      .filter((entry) => !HIDDEN_DIRS.has(entry.name))
      .map(({ name, path, kind }) => ({ name, path, kind }))
      .sort((left, right) => {
        if (left.kind !== right.kind) return left.kind === 'directory' ? -1 : 1;
        return left.name.localeCompare(right.name);
      });
  }

  async stat(path: string): Promise<StorageStat | null> {
    return this.requireNode().stat(path);
  }

  async exists(path: string): Promise<boolean> {
    return (await this.stat(path)) !== null;
  }

  async readFile(path: string): Promise<Uint8Array> {
    return this.requireNode().read(path);
  }

  /**
   * Read a file as a stream, so a disc image can be hashed without ever being
   * held whole in memory.
   */
  async readStream(path: string): Promise<ReadableStream<Uint8Array>> {
    return this.requireNode().readStream(path);
  }

  /**
   * Every file below a folder, depth first.
   *
   * Yields as it walks rather than returning a list, because a library holds
   * thousands of files and the caller hashes them one at a time anyway.
   */
  async *walkFiles(path: string = ''): AsyncGenerator<StorageEntry> {
    for (const entry of await this.list(path)) {
      if (entry.kind === 'directory') yield* this.walkFiles(entry.path);
      else yield entry;
    }
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
    const node = this.requireNode();
    const info = await node.stat(oldPath);

    // The adapter renames through a file handle, so a folder has to be walked.
    if (info?.kind === 'directory') {
      await node.mkdir(newPath);

      for (const entry of await node.adapter.list(oldPath)) {
        await this.move(entry.path, `${newPath}/${entry.name}`);
      }

      await node.delete(oldPath);
      return;
    }

    await node.rename(oldPath, newPath);
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
