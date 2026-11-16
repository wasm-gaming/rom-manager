/**
 * Writes `.meta/<System>/index.json`, the library index other apps read (see
 * `helpers/library-index.ts` for the contract), and reads the mods registry it is
 * built from (`.meta/<System>/mods.json`).
 *
 * The index is rewritten whenever a system's games are worked out (the grouped view
 * has the match in hand anyway) and after every change to the library. A change to
 * the mods alone only rewrites the index's mods: nothing has to be hashed for that.
 */

import {
  attachMods,
  buildLibraryIndex,
  parseLibraryIndex,
  type LibraryIndex,
  type ModRecord,
} from '../helpers/library-index';
import type { MatchResult } from '../helpers/rom-matching';
import { GameCatalogService } from './GameCatalogService';
import { META_DIR } from './RomLibraryService';
import type { StorageNode } from './StorageService';

const MODS_VERSION = 1;

export const indexPathOf = (system: string): string => `${META_DIR}/${system}/index.json`;
export const modsRegistryPathOf = (system: string): string => `${META_DIR}/${system}/mods.json`;

const encode = (value: unknown): Uint8Array => new TextEncoder().encode(`${JSON.stringify(value, null, 2)}\n`);

async function readJson(node: StorageNode, path: string): Promise<unknown> {
  try {
    return JSON.parse(new TextDecoder().decode(await node.readFile(path)));
  } catch {
    return undefined;
  }
}

async function ensureSystemDir(node: StorageNode, system: string): Promise<void> {
  for (const path of [META_DIR, `${META_DIR}/${system}`]) {
    try {
      await node.createDirectory(path);
    } catch {
      // Already there.
    }
  }
}

const HEX8 = /^[0-9A-F]{8}$/;

/** The registry sits in a folder the user can edit: anything that does not look right is dropped. */
function parseMod(raw: unknown): ModRecord | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const mod = raw as Record<string, unknown>;
  if (typeof mod.sha1 !== 'string' || !/^[0-9a-f]{40}$/.test(mod.sha1)) return undefined;
  if (mod.format !== 'ips' && mod.format !== 'bps' && mod.format !== 'ups') return undefined;
  if (typeof mod.file !== 'string' || mod.file !== `${mod.sha1}.${mod.format}`) return undefined;
  const crc = (value: unknown) => (typeof value === 'string' && HEX8.test(value) ? value : undefined);
  const size = (value: unknown) => (typeof value === 'number' && value >= 0 ? value : undefined);
  return {
    sha1: mod.sha1,
    name: typeof mod.name === 'string' && mod.name ? mod.name : mod.sha1.slice(0, 8),
    format: mod.format,
    file: mod.file,
    ...(crc(mod.sourceCrc) ? { sourceCrc: crc(mod.sourceCrc) } : {}),
    ...(crc(mod.targetCrc) ? { targetCrc: crc(mod.targetCrc) } : {}),
    ...(size(mod.sourceSize) !== undefined ? { sourceSize: size(mod.sourceSize) } : {}),
    ...(size(mod.targetSize) !== undefined ? { targetSize: size(mod.targetSize) } : {}),
    ...(typeof mod.gameId === 'string' && mod.gameId ? { gameId: mod.gameId } : {}),
    addedAt: typeof mod.addedAt === 'string' ? mod.addedAt : new Date(0).toISOString(),
  };
}

/** The mods of a system, as `.meta/<System>/mods.json` keeps them. */
export async function readMods(node: StorageNode, system: string): Promise<ModRecord[]> {
  const raw = (await readJson(node, modsRegistryPathOf(system))) as { mods?: unknown } | undefined;
  if (!raw || !Array.isArray(raw.mods)) return [];
  return raw.mods.flatMap((mod) => parseMod(mod) ?? []);
}

export async function writeMods(node: StorageNode, system: string, mods: readonly ModRecord[]): Promise<void> {
  await ensureSystemDir(node, system);
  await node.writeFile(modsRegistryPathOf(system), encode({ version: MODS_VERSION, mods }));
}

export class LibraryIndexService {
  static async read(node: StorageNode, system: string): Promise<LibraryIndex | undefined> {
    return parseLibraryIndex(await readJson(node, indexPathOf(system)));
  }

  /** Every system's index there is, for finding which game a CRC belongs to. */
  static async readAll(node: StorageNode): Promise<LibraryIndex[]> {
    let systems: string[] = [];
    try {
      systems = (await node.list(META_DIR)).filter((entry) => entry.kind === 'directory').map((entry) => entry.name);
    } catch {
      return [];
    }
    const indexes = await Promise.all(systems.map((system) => this.read(node, system)));
    return indexes.filter((index): index is LibraryIndex => Boolean(index));
  }

  /** Writes a system's index from a match already worked out. */
  static async write(node: StorageNode, system: string, match: MatchResult): Promise<LibraryIndex> {
    const index = buildLibraryIndex(system, match, await readMods(node, system));
    await ensureSystemDir(node, system);
    await node.writeFile(indexPathOf(system), encode(index));
    return index;
  }

  /** Works the system out again (cached hashes make it cheap) and writes its index. */
  static async refresh(node: StorageNode, system: string): Promise<LibraryIndex | undefined> {
    try {
      return await this.write(node, system, await GameCatalogService.load(node, system));
    } catch {
      // No dataset for that folder: it is not a system, and has no index.
      return undefined;
    }
  }

  /** Several systems, one after the other; failures are skipped. */
  static async refreshMany(node: StorageNode, systems: Iterable<string>): Promise<void> {
    for (const system of new Set(systems)) {
      if (system) await this.refresh(node, system);
    }
  }

  /**
   * Rewrites only the mods of a system's index, after a change to its mods. Without an
   * index yet, the whole system is worked out.
   */
  static async updateMods(node: StorageNode, system: string): Promise<void> {
    const index = await this.read(node, system);
    if (!index) {
      await this.refresh(node, system);
      return;
    }
    attachMods(index, await readMods(node, system));
    index.generatedAt = new Date().toISOString();
    await node.writeFile(indexPathOf(system), encode(index));
  }
}
