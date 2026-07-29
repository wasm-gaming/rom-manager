/**
 * ROM metadata service - singleton for parsing and managing ROM metadata
 */

export interface ROMMetadata {
  filename: string;
  path: string;
  format: string;
  fileSize: number;
  title?: string;
  description?: string;
  releaseDate?: string;
  publisher?: string;
  region?: string;
  videoStandard?: string;
  rating?: number;
  customTags?: string[];
  lastModified?: Date;
}

export class ROMMetadataService {
  private static instance: ROMMetadataService;
  private metadataCache: Map<string, ROMMetadata> = new Map();

  private constructor() {}

  static getInstance(): ROMMetadataService {
    if (!ROMMetadataService.instance) {
      ROMMetadataService.instance = new ROMMetadataService();
    }
    return ROMMetadataService.instance;
  }

  getROMFormat(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const formatMap: Record<string, string> = {
      'nes': 'NES',
      'smc': 'SNES',
      'sfc': 'SNES',
      'gen': 'Genesis',
      'md': 'Genesis',
      'bin': 'Genesis',
      'gb': 'Game Boy',
      'gba': 'Game Boy Advance',
      'z64': 'Nintendo 64',
      'n64': 'Nintendo 64',
      'gbc': 'Game Boy Color',
    };
    return formatMap[ext] || ext.toUpperCase();
  }

  parseMetadata(filename: string, fileSize: number): ROMMetadata {
    return {
      filename,
      path: '',
      format: this.getROMFormat(filename),
      fileSize,
      lastModified: new Date(),
    };
  }

  getMetadata(path: string): ROMMetadata | undefined {
    return this.metadataCache.get(path);
  }

  setMetadata(path: string, metadata: ROMMetadata): void {
    this.metadataCache.set(path, metadata);
  }

  updateMetadata(
    path: string,
    updates: Partial<ROMMetadata>,
  ): ROMMetadata {
    const current = this.metadataCache.get(path) || {
      filename: path,
      path,
      format: '',
      fileSize: 0,
    };

    const updated = { ...current, ...updates };
    this.metadataCache.set(path, updated);
    return updated;
  }

  clearCache(): void {
    this.metadataCache.clear();
  }
}

export const romMetadataService = ROMMetadataService.getInstance();
