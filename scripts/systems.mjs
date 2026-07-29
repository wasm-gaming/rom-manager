/**
 * Single source of truth for the supported systems and the dataset layout.
 *
 * Every system owns a folder under `static/datasets/<system>/`:
 *   source.dat    Raw DAT downloaded from libretro-database
 *   covers.json   Boxart filenames scraped from thumbnails.libretro.com
 *   dataset.json  Final dataset consumed by the application
 *
 * `dat` is the path inside libretro-database/metadat and `thumbnails` is the
 * folder name used by thumbnails.libretro.com, which does not always match the
 * short name we expose to the application.
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PROJECT_ROOT = path.join(__dirname, '..');
export const DATASETS_DIR = path.join(PROJECT_ROOT, 'static', 'datasets');

export const DAT_FILE = 'source.dat';
export const COVERS_FILE = 'covers.json';
export const DATASET_FILE = 'dataset.json';
export const INDEX_FILE = 'index.json';

export const SYSTEMS = [
  // Nintendo
  {
    name: 'Nintendo - SNES',
    dat: 'no-intro/Nintendo - Super Nintendo Entertainment System.dat',
    thumbnails: 'Nintendo - Super Nintendo Entertainment System',
  },
  {
    name: 'Nintendo - Game Boy',
    dat: 'no-intro/Nintendo - Game Boy.dat',
    thumbnails: 'Nintendo - Game Boy',
  },
  {
    name: 'Nintendo - Game Boy Color',
    dat: 'no-intro/Nintendo - Game Boy Color.dat',
    thumbnails: 'Nintendo - Game Boy Color',
  },
  {
    name: 'Nintendo - Game Boy Advance',
    dat: 'no-intro/Nintendo - Game Boy Advance.dat',
    thumbnails: 'Nintendo - Game Boy Advance',
  },
  {
    name: 'Nintendo - GameCube',
    dat: 'redump/Nintendo - GameCube.dat',
    thumbnails: 'Nintendo - GameCube',
  },
  {
    name: 'Nintendo - Wii',
    dat: 'redump/Nintendo - Wii.dat',
    thumbnails: 'Nintendo - Wii',
  },

  // Sega
  {
    name: 'Sega - Genesis',
    dat: 'no-intro/Sega - Mega Drive - Genesis.dat',
    thumbnails: 'Sega - Mega Drive - Genesis',
  },
  {
    name: 'Sega - Game Gear',
    dat: 'no-intro/Sega - Game Gear.dat',
    thumbnails: 'Sega - Game Gear',
  },
  {
    name: 'Sega - Saturn',
    dat: 'redump/Sega - Saturn.dat',
    thumbnails: 'Sega - Saturn',
  },
  {
    name: 'Sega - Dreamcast',
    dat: 'redump/Sega - Dreamcast.dat',
    thumbnails: 'Sega - Dreamcast',
  },

  // Sony
  {
    name: 'Sony - PlayStation',
    dat: 'redump/Sony - PlayStation.dat',
    thumbnails: 'Sony - PlayStation',
  },
  {
    name: 'Sony - PlayStation 2',
    dat: 'redump/Sony - PlayStation 2.dat',
    thumbnails: 'Sony - PlayStation 2',
  },
  {
    name: 'Sony - PSP',
    dat: 'no-intro/Sony - PlayStation Portable.dat',
    thumbnails: 'Sony - PlayStation Portable',
  },

  // Atari
  { name: 'Atari - 2600', dat: 'no-intro/Atari - 2600.dat', thumbnails: 'Atari - 2600' },
  { name: 'Atari - 5200', dat: 'no-intro/Atari - 5200.dat', thumbnails: 'Atari - 5200' },
  { name: 'Atari - 7800', dat: 'no-intro/Atari - 7800.dat', thumbnails: 'Atari - 7800' },
  { name: 'Atari - Lynx', dat: 'no-intro/Atari - Lynx.dat', thumbnails: 'Atari - Lynx' },

  // Commodore
  { name: 'Commodore - 64', dat: 'no-intro/Commodore - 64.dat', thumbnails: 'Commodore - 64' },
  {
    name: 'Commodore - Amiga',
    dat: 'no-intro/Commodore - Amiga.dat',
    thumbnails: 'Commodore - Amiga',
  },
];

/**
 * Resolve the folder that holds every artifact of a system.
 */
export function systemDir(datasetsDir, systemName) {
  return path.join(datasetsDir, systemName);
}

/**
 * Restrict a run to the systems requested through `--systems=a,b`.
 */
export function selectSystems(argv) {
  const arg = argv.find((value) => value.startsWith('--systems='));
  if (!arg) return SYSTEMS;

  const requested = arg
    .slice('--systems='.length)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const selected = SYSTEMS.filter((system) => requested.includes(system.name));
  const unknown = requested.filter((name) => !SYSTEMS.some((system) => system.name === name));

  if (unknown.length > 0) {
    throw new Error(`Unknown systems: ${unknown.join(', ')}`);
  }

  return selected;
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}
