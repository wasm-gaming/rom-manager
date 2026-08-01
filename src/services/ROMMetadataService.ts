/**
 * ROM metadata service - singleton for parsing and managing ROM metadata
 */

/**
 * Regions published by the No-Intro/Redump DAT files, which is the vocabulary
 * the dataset lookup writes into the region field. The television standard is
 * tracked separately in `videoStandard`.
 */
export const ROM_REGIONS: readonly string[] = [
  'Asia',
  'Australia',
  'Austria',
  'Belgium',
  'Brazil',
  'Canada',
  'China',
  'Croatia',
  'Denmark',
  'Europe',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hong Kong',
  'India',
  'Ireland',
  'Israel',
  'Italy',
  'Japan',
  'Korea',
  'Mexico',
  'Netherlands',
  'Norway',
  'Peru',
  'Poland',
  'Portugal',
  'Russia',
  'South Africa',
  'Spain',
  'Sweden',
  'Switzerland',
  'Taiwan',
  'Turkey',
  'United Kingdom',
  'USA',
];

/**
 * Television standards a release can target. A cartridge is sometimes built
 * for more than one, which the datasets express as a combined value rather
 * than as a guess at a single one.
 */
export const VIDEO_STANDARDS: readonly string[] = ['NTSC', 'PAL', 'PAL, NTSC', 'SECAM'];

export interface ROMMetadata {
  id?: string;
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
  cover?: string;
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
