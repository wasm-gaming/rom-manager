import { VFSNode, FSAAdapter } from '@cloudauthn/vfs-sync';

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

  async listFiles(): Promise<string[]> {
    if (!this.node) throw new Error('Storage not initialized');
    const entries = await this.node.adapter.list('');
    return entries
      .filter((entry) => entry.kind === 'file')
      .map((entry) => entry.path)
      .sort((left, right) => left.localeCompare(right));
  }

  async readFile(path: string): Promise<Uint8Array> {
    if (!this.node) throw new Error('Storage not initialized');
    return this.node.read(path);
  }

  async writeFile(path: string, content: Uint8Array): Promise<void> {
    if (!this.node) throw new Error('Storage not initialized');
    await this.node.write(path, content);
  }

  async deleteFile(path: string): Promise<void> {
    if (!this.node) throw new Error('Storage not initialized');
    await this.node.delete(path);
  }

  async renameFile(oldPath: string, newPath: string): Promise<void> {
    if (!this.node) throw new Error('Storage not initialized');
    await this.node.rename(oldPath, newPath);
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
