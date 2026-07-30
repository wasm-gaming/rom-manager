import { StorageNode } from './StorageService';

/**
 * Sidecar folder holding everything the app derives about a library: metadata,
 * covers and the scan cache. It mirrors the library layout
 * (`.meta/<System>/<Game>.json`) so the ROM folders themselves stay free of
 * anything that is not a ROM.
 */
export const META_DIR = '.meta';

/**
 * What the sidecar was called before. Still read from, so a library written by
 * an earlier version keeps its metadata; never written to.
 */
export const LEGACY_META_DIR = '.roms';

/** Past this size the CRC32 is only computed when explicitly requested. */
export const CRC32_SIZE_LIMIT = 50 * 1024 * 1024;

const RECORD_VERSION = 1;

/**
 * What a `.meta/<System>/<Game>.json` file holds. Written the first time the
 * user edits a game, never before.
 */
export interface RomRecord {
  version: number;
  title?: string;
  description?: string;
  releaseDate?: string;
  publisher?: string;
  region?: string;
  videoStandard?: string;
  /** Cover file name next to the record, or an `https://` URL. */
  cover?: string;
  crc32?: string;
  /** ISO date of the moment the game entered the library. */
  addedAt: string;
  updatedAt: string;
}

/** Runtime facts about the ROM file itself, which are never persisted. */
export interface RomFileInfo {
  path: string;
  name: string;
  system: string;
  extension: string;
  size: number;
  modifiedAt?: Date;
}

/** The system a ROM belongs to: the folder it sits in at the library root. */
export function systemOf(romPath: string): string {
  const separator = romPath.indexOf('/');
  return separator === -1 ? '' : romPath.slice(0, separator);
}

export function fileNameOf(romPath: string): string {
  return romPath.slice(romPath.lastIndexOf('/') + 1);
}

export function extensionOf(romPath: string): string {
  const name = fileNameOf(romPath);
  const dot = name.lastIndexOf('.');
  return dot <= 0 ? '' : name.slice(dot + 1).toLowerCase();
}

/** The game name, which is the file name without its ROM extension. */
export function gameNameOf(romPath: string): string {
  const name = fileNameOf(romPath);
  const dot = name.lastIndexOf('.');
  return dot <= 0 ? name : name.slice(0, dot);
}

/** `.meta/<System>` — where the record and the cover of a game live. */
export function recordDirOf(romPath: string, base: string = META_DIR): string {
  const system = systemOf(romPath);
  return system ? `${base}/${system}` : base;
}

export function recordPathOf(romPath: string, base: string = META_DIR): string {
  return `${recordDirOf(romPath, base)}/${gameNameOf(romPath)}.json`;
}

export function coverPathOf(romPath: string, coverFile: string, base: string = META_DIR): string {
  return `${recordDirOf(romPath, base)}/${coverFile}`;
}

function isRemoteCover(cover: string): boolean {
  return cover.startsWith('https://');
}

/**
 * Records live on disk and are therefore untrusted input: a cover ends up in an
 * `<img src>`, so anything that is not a plain neighbouring file name or an
 * `https://` URL is dropped rather than rendered.
 */
function sanitizeCover(cover: unknown): string | undefined {
  if (typeof cover !== 'string' || cover.length === 0) return undefined;
  if (isRemoteCover(cover)) return cover;
  if (cover.includes('/') || cover.includes('\\') || cover.includes('..')) return undefined;
  return cover;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function parseRecord(raw: unknown): RomRecord | null {
  if (typeof raw !== 'object' || raw === null) return null;

  const source = raw as Record<string, unknown>;
  const now = new Date().toISOString();

  return {
    version: typeof source.version === 'number' ? source.version : RECORD_VERSION,
    title: optionalString(source.title),
    description: optionalString(source.description),
    releaseDate: optionalString(source.releaseDate),
    publisher: optionalString(source.publisher),
    region: optionalString(source.region),
    videoStandard: optionalString(source.videoStandard),
    cover: sanitizeCover(source.cover),
    crc32: optionalString(source.crc32),
    addedAt: optionalString(source.addedAt) || now,
    updatedAt: optionalString(source.updatedAt) || now,
  };
}

export function emptyRecord(): RomRecord {
  const now = new Date().toISOString();
  return { version: RECORD_VERSION, addedAt: now, updatedAt: now };
}

/**
 * Reads and writes the ROM library that shadows an opened folder.
 *
 * Everything is written to `META_DIR`. Reads fall back to `LEGACY_META_DIR`,
 * so a library written before the rename keeps its metadata; a record read
 * from there moves across the next time it is saved.
 */
export class RomLibrary {
  constructor(private readonly node: StorageNode) {}

  /** The record of a game, or `null` when it has never been edited. */
  async read(romPath: string): Promise<RomRecord | null> {
    for (const base of [META_DIR, LEGACY_META_DIR]) {
      let bytes: Uint8Array;

      try {
        bytes = await this.node.readFile(recordPathOf(romPath, base));
      } catch {
        continue;
      }

      try {
        return parseRecord(JSON.parse(new TextDecoder().decode(bytes)));
      } catch {
        // A damaged record is not a reason to fall back to an older one.
        return null;
      }
    }

    return null;
  }

  async readMany(romPaths: string[]): Promise<Map<string, RomRecord | null>> {
    const records = await Promise.all(
      romPaths.map(async (path) => [path, await this.read(path)] as const),
    );
    return new Map(records);
  }

  async write(romPath: string, record: RomRecord): Promise<void> {
    const stored: RomRecord = { ...record, version: RECORD_VERSION, updatedAt: new Date().toISOString() };
    const bytes = new TextEncoder().encode(`${JSON.stringify(stored, null, 2)}\n`);
    await this.node.writeFile(recordPathOf(romPath), bytes);
  }

  async remove(romPath: string): Promise<void> {
    // Also in the old folder: leaving it there would resurrect the record on
    // the next read.
    for (const base of [META_DIR, LEGACY_META_DIR]) {
      try {
        await this.node.remove(recordPathOf(romPath, base));
      } catch {
        // Nothing to delete in that folder.
      }
    }
  }

  /**
   * Game names of a system that already have a record. One listing answers for
   * a whole folder, which is what keeps the tree from reading a sidecar per row.
   */
  async initializedGames(system: string): Promise<Set<string>> {
    const names = new Set<string>();

    for (const base of [META_DIR, LEGACY_META_DIR]) {
      const directory = system ? `${base}/${system}` : base;

      try {
        for (const entry of await this.node.list(directory)) {
          if (entry.kind === 'file' && entry.name.endsWith('.json')) {
            names.add(entry.name.slice(0, -'.json'.length));
          }
        }
      } catch {
        // A system nobody has edited yet simply has no folder.
      }
    }

    return names;
  }

  /**
   * Downloads a boxart next to the record and returns the stored file name.
   * Thumbnail hosts do not always allow cross-origin reads, so a failure here
   * is expected and the caller is free to keep referencing the remote URL.
   */
  async saveCover(romPath: string, sourceUrl: string): Promise<string> {
    if (!isRemoteCover(sourceUrl)) throw new Error('Only https covers can be downloaded');

    const response = await fetch(sourceUrl);
    if (!response.ok) throw new Error(`Cover download failed (${response.status})`);

    const blob = await response.blob();
    const extension = coverExtension(sourceUrl, blob.type);
    // Same name the catalogue's boxarts take, so in a library organised the
    // canonical way a cover picked by hand simply replaces the published one.
    // Records keep whatever name they were written with, so older files still
    // resolve.
    const coverFile = `${gameNameOf(romPath)}.case.${extension}`;

    await this.node.writeFile(coverPathOf(romPath, coverFile), new Uint8Array(await blob.arrayBuffer()));
    return coverFile;
  }

  /**
   * A URL usable in an `<img src>`. Local covers are read into an object URL,
   * which the caller has to revoke once the image is gone.
   */
  async coverUrl(romPath: string, cover: string | undefined): Promise<string | undefined> {
    const safe = sanitizeCover(cover);
    if (!safe) return undefined;
    if (isRemoteCover(safe)) return safe;

    for (const base of [META_DIR, LEGACY_META_DIR]) {
      try {
        const bytes = await this.node.readFile(coverPathOf(romPath, safe, base));
        return URL.createObjectURL(new Blob([bytes as BlobPart]));
      } catch {
        // Try the folder the previous version wrote to.
      }
    }

    return undefined;
  }
}

function coverExtension(sourceUrl: string, mimeType: string): string {
  const fromMime: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };

  if (fromMime[mimeType]) return fromMime[mimeType];

  const fromUrl = sourceUrl.split('?')[0].split('.').pop()?.toLowerCase() || '';
  return /^(png|jpg|jpeg|webp|gif)$/.test(fromUrl) ? fromUrl : 'png';
}
