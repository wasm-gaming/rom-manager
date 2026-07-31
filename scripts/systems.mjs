/**
 * Single source of truth for the supported systems and the dataset layout.
 *
 * Every system owns a folder under `static/datasets/<system>/`:
 *   source.dat    Raw DAT downloaded from libretro-database
 *   covers.json   Boxart filenames scraped from thumbnails.libretro.com
 *   sets.dat      Members of each romset, for a system that has them
 *   romsets.xml   What the core needs to load a romset, likewise
 *   dataset.json  Final dataset consumed by the application
 *
 * `name` is the folder name MiSTer uses under `/games`, taken verbatim from
 * MiSTer-devel/Distribution_MiSTer. The casing is inconsistent upstream
 * (`Atari2600` but `ATARI5200`, `NEOGEO` but `NeoGeo-CD`) and is reproduced
 * as-is on purpose: it has to match what sits on the user's SD card.
 *
 * `dat` is the path inside libretro-database, from its root and not from
 * `metadat/`: most catalogues live there, but not all of them — `dat/` holds
 * the ones that describe a whole romset as a single file. `thumbnails` is the
 * folder name used by thumbnails.libretro.com. Neither matches the MiSTer name.
 *
 * `media` drives the on-disk layout: `cartridge` systems keep one file per
 * variant at the system root, `disc` systems get a folder per game with a
 * subfolder per variant.
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
/** Members of every romset of a system whose games ship as a set of files. */
export const SETS_FILE = 'sets.dat';
/** What the core needs to load a romset, which no checksum can say. */
export const ROMSETS_FILE = 'romsets.xml';

/** Folder of the thumbnail repositories that holds the box art. */
export const BOXART_FOLDER = 'Named_Boxarts';

const THUMBNAILS_OWNER = 'libretro-thumbnails';

/**
 * Repository name backing a system's thumbnails.
 *
 * The convention is the libretro system name with every space turned into an
 * underscore: `Atari - 5200` becomes `Atari_-_5200`.
 */
export function repositoryOf(thumbnailsName) {
  return thumbnailsName.replace(/ /g, '_');
}

/**
 * URL of a published boxart, served straight from the thumbnail repository.
 *
 * `thumbnails.libretro.com` hosts the same images but answers without any
 * `Access-Control-Allow-Origin` header, so a browser can display those URLs and
 * never read their bytes. Storing a copy in `.meta/` means fetching the image,
 * so the raw host — which does send the header — is the only one that works.
 *
 * `HEAD` stands in for the branch name because the repositories disagree on it
 * (`master` on most, `main` on some) and it always resolves to the default one.
 */
export function boxartUrl(repository, name) {
  const path = [repository, 'HEAD', BOXART_FOLDER, `${name}.png`]
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `https://raw.githubusercontent.com/${THUMBNAILS_OWNER}/${path}`;
}

export const SYSTEMS = [
  // Nintendo
  {
    name: 'NES',
    media: 'cartridge',
    dat: 'metadat/no-intro/Nintendo - Nintendo Entertainment System.dat',
    thumbnails: 'Nintendo - Nintendo Entertainment System',
  },
  {
    name: 'SNES',
    media: 'cartridge',
    dat: 'metadat/no-intro/Nintendo - Super Nintendo Entertainment System.dat',
    thumbnails: 'Nintendo - Super Nintendo Entertainment System',
  },
  {
    name: 'GAMEBOY',
    media: 'cartridge',
    dat: 'metadat/no-intro/Nintendo - Game Boy.dat',
    thumbnails: 'Nintendo - Game Boy',
  },
  {
    name: 'GBC',
    media: 'cartridge',
    dat: 'metadat/no-intro/Nintendo - Game Boy Color.dat',
    thumbnails: 'Nintendo - Game Boy Color',
  },
  {
    name: 'GBA',
    media: 'cartridge',
    dat: 'metadat/no-intro/Nintendo - Game Boy Advance.dat',
    thumbnails: 'Nintendo - Game Boy Advance',
  },
  {
    name: 'N64',
    media: 'cartridge',
    dat: 'metadat/no-intro/Nintendo - Nintendo 64.dat',
    thumbnails: 'Nintendo - Nintendo 64',
  },
  {
    name: 'PokemonMini',
    media: 'cartridge',
    dat: 'metadat/no-intro/Nintendo - Pokemon Mini.dat',
    thumbnails: 'Nintendo - Pokemon Mini',
  },

  // Sega
  {
    name: 'SMS',
    media: 'cartridge',
    dat: 'metadat/no-intro/Sega - Master System - Mark III.dat',
    thumbnails: 'Sega - Master System - Mark III',
  },
  {
    name: 'GameGear',
    media: 'cartridge',
    dat: 'metadat/no-intro/Sega - Game Gear.dat',
    thumbnails: 'Sega - Game Gear',
  },
  {
    name: 'MegaDrive',
    media: 'cartridge',
    dat: 'metadat/no-intro/Sega - Mega Drive - Genesis.dat',
    thumbnails: 'Sega - Mega Drive - Genesis',
  },
  {
    name: 'MegaCD',
    media: 'disc',
    dat: 'metadat/redump/Sega - Mega-CD - Sega CD.dat',
    thumbnails: 'Sega - Mega-CD - Sega CD',
  },
  {
    name: 'S32X',
    media: 'cartridge',
    dat: 'metadat/no-intro/Sega - 32X.dat',
    thumbnails: 'Sega - 32X',
  },
  {
    name: 'Saturn',
    media: 'disc',
    dat: 'metadat/redump/Sega - Saturn.dat',
    thumbnails: 'Sega - Saturn',
  },

  // Sony
  {
    name: 'PSX',
    media: 'disc',
    dat: 'metadat/redump/Sony - PlayStation.dat',
    thumbnails: 'Sony - PlayStation',
  },

  // NEC
  {
    name: 'TGFX16',
    media: 'cartridge',
    dat: 'metadat/no-intro/NEC - PC Engine - TurboGrafx 16.dat',
    thumbnails: 'NEC - PC Engine - TurboGrafx 16',
  },
  {
    name: 'TGFX16-CD',
    media: 'disc',
    dat: 'metadat/redump/NEC - PC Engine CD - TurboGrafx-CD.dat',
    thumbnails: 'NEC - PC Engine CD - TurboGrafx-CD',
  },

  // SNK
  //
  // Neo Geo is the one system whose games arrive in two shapes, so it is the
  // one with more than one source. `dat` catalogues the `.neo` files, one file
  // and one CRC32 like every other system here; `sets` catalogues the romsets,
  // where a game is a folder or a zip of chip dumps and what identifies it is
  // the checksums of its members; and `romsets` carries what neither of them
  // can say — the hardware attributes MiSTer needs to load the thing.
  {
    name: 'NEOGEO',
    media: 'cartridge',
    dat: 'dat/SNK - Neo Geo.dat',
    thumbnails: 'SNK - Neo Geo',
    sets: {
      dat: 'metadat/fbneo-split/FinalBurn Neo (ClrMame Pro XML, Arcade only).dat',
      of: 'neogeo',
    },
    romsets:
      'https://raw.githubusercontent.com/MiSTer-devel/NeoGeo_MiSTer/master/releases/romsets.xml',
  },
  {
    name: 'NeoGeo-CD',
    media: 'disc',
    dat: 'metadat/redump/SNK - Neo Geo CD.dat',
    thumbnails: 'SNK - Neo Geo CD',
  },

  // Atari
  {
    name: 'Atari2600',
    media: 'cartridge',
    dat: 'metadat/no-intro/Atari - 2600.dat',
    thumbnails: 'Atari - 2600',
  },
  {
    name: 'ATARI5200',
    media: 'cartridge',
    dat: 'metadat/no-intro/Atari - 5200.dat',
    thumbnails: 'Atari - 5200',
  },
  {
    name: 'ATARI7800',
    media: 'cartridge',
    dat: 'metadat/no-intro/Atari - 7800.dat',
    thumbnails: 'Atari - 7800',
  },
  {
    name: 'AtariLynx',
    media: 'cartridge',
    dat: 'metadat/no-intro/Atari - Lynx.dat',
    thumbnails: 'Atari - Lynx',
  },

  // Bandai
  {
    name: 'WonderSwan',
    media: 'cartridge',
    dat: 'metadat/no-intro/Bandai - WonderSwan.dat',
    thumbnails: 'Bandai - WonderSwan',
  },
  {
    name: 'WonderSwanColor',
    media: 'cartridge',
    dat: 'metadat/no-intro/Bandai - WonderSwan Color.dat',
    thumbnails: 'Bandai - WonderSwan Color',
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
