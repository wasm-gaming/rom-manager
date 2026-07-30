/**
 * Boxarts on disk.
 *
 * A cover is worth keeping: the library has to work with the network off, and a
 * boxart is the one piece of metadata nothing local can reconstruct. So the
 * first time a game is looked at, its cover is copied into
 * `.meta/<system>/<Game>[.<region>].case.png` and read from there afterwards.
 *
 * Which cover and under what name is decided by `core/rom-covers`; this only
 * does the parts that touch the network and the disk.
 */

import {
  coverFileNameOf,
  storableCoversOf,
  storedCoverNamesOf,
  type Cover,
  type GameCovers,
} from '../core/rom-covers';
import { META_DIR } from './RomLibraryService';
import type { StorageNode } from './StorageService';

/** Refuse anything absurd for a boxart, so a bad URL cannot fill the card. */
const MAX_COVER_BYTES = 8 * 1024 * 1024;

function coverPathOf(system: string, fileName: string): string {
  return system ? `${META_DIR}/${system}/${fileName}` : `${META_DIR}/${fileName}`;
}

export class CoverService {
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
  ): Promise<boolean> {
    const path = coverPathOf(system, coverFileNameOf(gameId, cover));

    if (await node.exists(path)) return true;

    try {
      const response = await fetch(cover.url);
      if (!response.ok) return false;

      const blob = await response.blob();
      if (blob.size === 0 || blob.size > MAX_COVER_BYTES) return false;

      await node.createDirectory(`${META_DIR}/${system}`);
      await node.writeFile(path, new Uint8Array(await blob.arrayBuffer()));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Keep every boxart of a game, so its regions all resolve with the network
   * off.
   *
   * This is what a game in the library gets, as opposed to one merely looked at:
   * changing the region preference later must not need a provider that may be
   * gone. Each cover is left to `cache`, so one blocked download does not stop
   * the others.
   */
  static async cacheAll(
    node: StorageNode,
    system: string,
    gameId: string,
    covers: GameCovers,
  ): Promise<number> {
    const stored = await Promise.all(
      storableCoversOf(covers).map((cover) => this.cache(node, system, gameId, cover)),
    );

    return stored.filter(Boolean).length;
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
    const local = await this.stored(node, system, gameId, cover);
    if (local) return { url: local, stored: true };
    if (!cover) return undefined;

    void this.cache(node, system, gameId, cover);
    return { url: cover.url, stored: false };
  }
}
