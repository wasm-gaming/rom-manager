/**
 * The catalogue of a system: every release that exists, and which of them the
 * user actually has.
 *
 * This is where the two halves meet — the dataset, which says what a system
 * contains, and the scan, which says what is on disk.
 */

import { groupDatGames, type DatGame, type GameGroup } from '../core/rom-grouping';
import { matchGroupsWithLocalFiles, type MatchResult } from '../core/rom-matching';
import { scanSystem, type ScanProgress } from './LibraryScanService';
import { ROMDatasetService, type ROMMetadata } from './ROMDatasetService';
import type { StorageNode } from './StorageService';

/** Entries without a checksum cannot be matched against anything. */
function toDatGames(roms: ROMMetadata[]): DatGame[] {
  return roms
    .filter((rom): rom is ROMMetadata & { crc: string } => typeof rom.crc === 'string')
    .map((rom) => ({
      name: rom.name,
      fileName: rom.fileName,
      size: rom.size,
      crc: rom.crc,
      md5: rom.md5,
      sha1: rom.sha1,
      region: rom.region,
      videoStandard: rom.videoStandard,
      cover: rom.cover,
    }));
}

export class GameCatalogService {
  /**
   * Grouped catalogues, kept for the session. Grouping a system means reading
   * its whole dataset out of IndexedDB and parsing every name, which is wasted
   * work on the second visit to the same system.
   */
  private static catalogues = new Map<string, Promise<GameGroup[]>>();

  /**
   * Every game a system has, present or not.
   */
  static async catalogueOf(system: string): Promise<GameGroup[]> {
    const cached = this.catalogues.get(system);
    if (cached) return cached;

    const catalogue = ROMDatasetService.listSystemRoms(system).then((roms) =>
      groupDatGames(toDatGames(roms)),
    );

    // A failed load must not be cached, so the next call can retry.
    this.catalogues.set(system, catalogue);
    catalogue.catch(() => this.catalogues.delete(system));

    return catalogue;
  }

  /**
   * The catalogue of a system with each release marked as present, partial or
   * missing, plus the local files that belong to no known release.
   */
  static async load(
    node: StorageNode,
    system: string,
    onProgress?: (progress: ScanProgress) => void,
  ): Promise<MatchResult> {
    const [catalogue, files] = await Promise.all([
      this.catalogueOf(system),
      scanSystem(node, system, onProgress),
    ]);

    return matchGroupsWithLocalFiles(catalogue, files);
  }
}
