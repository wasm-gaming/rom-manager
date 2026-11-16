/**
 * Where a game is played when rom-manager is hosted by play.germade (at `/roms/`): the
 * launcher's route for each system, and the link that opens a version, or a mod on it.
 * Pure functions; whether there is a launcher at all is `lib/host.ts`.
 */

/** rom-manager system → play.germade route. mGBA plays the three handhelds at `/gba/`. */
const ROUTES: Readonly<Record<string, string>> = {
  MegaDrive: 'megadrive',
  SNES: 'snes',
  GBA: 'gba',
  GAMEBOY: 'gba',
  GBC: 'gba',
  NEOGEO: 'neogeo',
};

/** The launcher's route for a system, or undefined when the launcher cannot play it. */
export function launcherRouteOf(system: string): string | undefined {
  return ROUTES[system];
}

export interface PlayTarget {
  system: string;
  gameId: string;
  /** CRC32 of the version to load. */
  crc: string;
  /** SHA-1 of the mod to apply; only its first 8 digits go in the link. */
  patch?: string;
}

/**
 * The launcher's link for a version (and a mod on it):
 * `/<route>/?system=…&game=…&version=<crc32>[&patch=<sha1:8>]`. Undefined when the system
 * has no route. `system` is there because one route can read several systems.
 */
export function playUrl({ system, gameId, crc, patch }: PlayTarget, base = '/'): string | undefined {
  const route = launcherRouteOf(system);
  if (!route) return undefined;
  const params = new URLSearchParams({ system, game: gameId, version: crc.toLowerCase() });
  if (patch) params.set('patch', patch.slice(0, 8).toLowerCase());
  return `${base}${route}/?${params}`;
}
