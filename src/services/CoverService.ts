/**
 * Boxarts on disk.
 *
 * A cover is worth keeping: the library has to work with the network off, and a
 * boxart is the one piece of metadata nothing local can reconstruct. So the
 * first time a game is looked at, its cover is copied into
 * `.meta/<system>/<Game>[.<region>].case.png` and read from there afterwards.
 *
 * The name is the same one an image added by hand takes, so the two are the same
 * thing to everything downstream: what is on disk is what a region has, whether
 * it was downloaded or dropped in. Which cover and under what name is decided by
 * `core/rom-covers` and `core/rom-media`; this only does the parts that touch
 * the network and the disk.
 */

import {
  coverFileNameOf,
  storableCoversOf,
  storedCoverNamesOf,
  type Cover,
  type GameCovers,
  type PublishedCover,
  type StoredCovers,
} from '../core/rom-covers';
import {
  COVER_KIND,
  mediaFileNameOf,
  parseMediaName,
  type MediaKind,
} from '../core/rom-media';
import type { Region } from '../core/rom-regions';
import { META_DIR } from './RomLibraryService';
import type { StorageEntry, StorageNode } from './StorageService';

/** Refuse anything absurd for a boxart, so a bad URL cannot fill the card. */
const MAX_COVER_BYTES = 8 * 1024 * 1024;

function coverPathOf(system: string, fileName: string): string {
  return system ? `${META_DIR}/${system}/${fileName}` : `${META_DIR}/${fileName}`;
}

export class CoverService {
  /**
   * What `.meta/<system>` holds, read once per system and folder.
   *
   * Every game shown asks for its own images, and answering that with one
   * listing instead of a probe per name and format is the difference between one
   * read and twenty. Keyed by the node itself, because two open folders can hold
   * the same system.
   */
  private static listings = new WeakMap<StorageNode, Map<string, Promise<StorageEntry[]>>>();

  private static async entriesOf(node: StorageNode, system: string): Promise<StorageEntry[]> {
    const bySystem = this.listings.get(node) ?? new Map<string, Promise<StorageEntry[]>>();
    this.listings.set(node, bySystem);

    const cached = bySystem.get(system);
    if (cached) return cached;

    // A system nobody has looked at yet simply has no folder, which is not worth
    // an error — it means no stored images.
    const entries = node
      .list(system ? `${META_DIR}/${system}` : META_DIR)
      .catch(() => [] as StorageEntry[]);

    bySystem.set(system, entries);
    return entries;
  }

  /** Forget the listing of a system whose images have just changed. */
  private static forget(node: StorageNode, system: string): void {
    this.listings.get(node)?.delete(system);
  }

  /**
   * The boxarts of a game that are already on disk, by region.
   *
   * They are part of what there is to choose from and not merely a cache of it:
   * an image added by hand makes its region an option even for a game the
   * catalogue publishes nothing for.
   */
  static async storedCovers(
    node: StorageNode,
    system: string,
    gameId: string,
  ): Promise<StoredCovers> {
    const stored: StoredCovers = { byRegion: {} };

    for (const entry of await this.entriesOf(node, system)) {
      const media = parseMediaName(entry.name);
      if (!media || media.kind !== COVER_KIND || media.gameId !== gameId) continue;

      if (media.region) stored.byRegion[media.region] = entry.name;
      else stored.game = entry.name;
    }

    return stored;
  }

  /**
   * The stored copy of a game's boxart as a URL usable in an `<img src>`, or
   * `undefined` when nothing has been stored yet.
   *
   * The returned URL is an object URL and has to be revoked by the caller once
   * the image is gone.
   */
  static async stored(
    node: StorageNode,
    system: string,
    gameId: string,
    cover?: Cover,
  ): Promise<string | undefined> {
    for (const name of storedCoverNamesOf(gameId, cover)) {
      try {
        const bytes = await node.readFile(coverPathOf(system, name));
        return URL.createObjectURL(new Blob([bytes as BlobPart]));
      } catch {
        // Not stored under that name; try the next one.
      }
    }

    return undefined;
  }

  /**
   * Keeps an image the user supplied, under the name its kind and region give
   * it. Returns the file name it went in as.
   *
   * That name is the whole mechanism: a boxart dropped in for EU is read back as
   * the EU boxart, and takes precedence over the published one because a stored
   * copy always does.
   */
  static async save(
    node: StorageNode,
    system: string,
    gameId: string,
    media: { kind: MediaKind; region?: Region; extension?: string },
    bytes: Uint8Array,
  ): Promise<string> {
    const name = mediaFileNameOf(gameId, media);

    await node.createDirectory(`${META_DIR}/${system}`);
    await node.writeFile(coverPathOf(system, name), bytes);
    this.forget(node, system);

    return name;
  }

  /** The bytes of a published image, or nothing when they cannot be had. */
  private static async download(url: string): Promise<Uint8Array | undefined> {
    try {
      const response = await fetch(url);
      if (!response.ok) return undefined;

      const blob = await response.blob();
      if (blob.size === 0 || blob.size > MAX_COVER_BYTES) return undefined;

      return new Uint8Array(await blob.arrayBuffer());
    } catch {
      return undefined;
    }
  }

  /**
   * Download a boxart and keep it next to the game's metadata.
   *
   * Returns false instead of throwing when the image cannot be had: a host that
   * sends no `Access-Control-Allow-Origin` blocks the read, and that is a
   * reason to keep showing the remote image, not to fail the browsing.
   */
  static async cache(
    node: StorageNode,
    system: string,
    gameId: string,
    cover: Cover,
    overwrite = false,
  ): Promise<boolean> {
    if (!cover.url) return Boolean(cover.file);

    return (await this.write(node, system, [coverFileNameOf(gameId, cover)], cover.url, overwrite)) > 0;
  }

  /**
   * One download for every name that shares an image.
   *
   * Two regions of a world release are two files of the same bytes — separate
   * files on purpose, so that one going missing only sends its own region back to
   * the network — but there is no reason to fetch those bytes twice.
   */
  private static async write(
    node: StorageNode,
    system: string,
    names: string[],
    url: string,
    overwrite = false,
  ): Promise<number> {
    const missing: string[] = [];
    for (const name of names) {
      if (overwrite || !(await node.exists(coverPathOf(system, name)))) missing.push(name);
    }

    if (missing.length === 0) return names.length;

    const bytes = await this.download(url);
    if (!bytes) return names.length - missing.length;

    await node.createDirectory(`${META_DIR}/${system}`);
    for (const name of missing) await node.writeFile(coverPathOf(system, name), bytes);
    this.forget(node, system);

    return names.length;
  }

  /**
   * Keep every boxart of a game, so its regions all resolve with the network
   * off.
   *
   * This is what a game in the library gets, as opposed to one merely looked at:
   * changing the region preference later must not need a provider that may be
   * gone. Each image is fetched on its own, so one blocked download does not
   * stop the others.
   */
  static async cacheAll(
    node: StorageNode,
    system: string,
    gameId: string,
    covers: GameCovers,
  ): Promise<number> {
    const byUrl = new Map<string, PublishedCover[]>();

    for (const cover of storableCoversOf(covers)) {
      const shared = byUrl.get(cover.url) ?? [];
      shared.push(cover);
      byUrl.set(cover.url, shared);
    }

    const stored = await Promise.all(
      Array.from(byUrl, ([url, shared]) =>
        this.write(
          node,
          system,
          shared.map((cover) => coverFileNameOf(gameId, cover)),
          url,
          true,
        ),
      ),
    );

    return stored.reduce((total, count) => total + count, 0);
  }

  /**
   * A boxart to show, preferring the stored copy and falling back to the remote
   * one while a copy is being made.
   *
   * Browsing is what populates `.meta`: no separate download step, and no
   * thousands of images fetched for games the user never opens.
   */
  static async resolve(
    node: StorageNode,
    system: string,
    gameId: string,
    cover?: Cover,
  ): Promise<{ url: string; stored: boolean } | undefined> {
    if (!cover) return undefined;

    const local = await this.stored(node, system, gameId, cover);
    if (local) return { url: local, stored: true };
    if (!cover.url) return undefined;

    void this.cache(node, system, gameId, cover);
    return { url: cover.url, stored: false };
  }
}
