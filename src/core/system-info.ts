/**
 * System Information and Catalog Metadata
 *
 * Defines domain information, technical specifications, common file extensions,
 * and visual brand details for all retro gaming platforms supported by the ROM Manager.
 */

export interface SystemInfo {
  /** Canonical folder name key (e.g., 'NES', 'SNES', 'MegaDrive', 'PSX') */
  id: string;
  /** Short display name */
  name: string;
  /** Full official hardware name */
  fullName: string;
  /** Hardware manufacturer */
  manufacturer: string;
  /** Initial launch year */
  releaseYear: number;
  /** Media format category */
  media: 'cartridge' | 'disc';
  /** Overview description of the console platform */
  description: string;
  /** Common file extensions associated with this system */
  commonExtensions: string[];
  /** Primary accent color theme for badges */
  accentColor: string;
}

const SYSTEMS_INFO: Record<string, SystemInfo> = {
  NES: {
    id: 'NES',
    name: 'NES / Famicom',
    fullName: 'Nintendo Entertainment System',
    manufacturer: 'Nintendo',
    releaseYear: 1983,
    media: 'cartridge',
    description:
      'The 8-bit third-generation home console that revitalized the video game industry with legendary titles like Super Mario Bros., The Legend of Zelda, and Metroid.',
    commonExtensions: ['nes', 'fds', 'unf', 'unif'],
    accentColor: '#e60012',
  },
  SNES: {
    id: 'SNES',
    name: 'Super Nintendo',
    fullName: 'Super Nintendo Entertainment System',
    manufacturer: 'Nintendo',
    releaseYear: 1990,
    media: 'cartridge',
    description:
      'Nintendo’s iconic 16-bit console celebrated for Mode 7 graphics, custom sound chips, and classic franchises like Super Mario World, Chrono Trigger, and Super Metroid.',
    commonExtensions: ['sfc', 'smc', 'fig', 'swc'],
    accentColor: '#8b5cf6',
  },
  GAMEBOY: {
    id: 'GAMEBOY',
    name: 'Game Boy',
    fullName: 'Nintendo Game Boy',
    manufacturer: 'Nintendo',
    releaseYear: 1989,
    media: 'cartridge',
    description:
      'The groundbreaking monochrome handheld system that dominated portable gaming with exceptional battery life and games like Tetris and Pokémon Red/Blue.',
    commonExtensions: ['gb'],
    accentColor: '#8bac0f',
  },
  GBC: {
    id: 'GBC',
    name: 'Game Boy Color',
    fullName: 'Nintendo Game Boy Color',
    manufacturer: 'Nintendo',
    releaseYear: 1998,
    media: 'cartridge',
    description:
      'The color evolution of the Game Boy featuring a color LCD screen, backwards compatibility, and titles like Pokémon Gold/Silver and Legend of Zelda: Oracle of Ages.',
    commonExtensions: ['gbc'],
    accentColor: '#9333ea',
  },
  GBA: {
    id: 'GBA',
    name: 'Game Boy Advance',
    fullName: 'Nintendo Game Boy Advance',
    manufacturer: 'Nintendo',
    releaseYear: 2001,
    media: 'cartridge',
    description:
      'A powerful 32-bit handheld console delivering 2D arcade-quality graphics, home to games like Pokémon Ruby/Sapphire, Castlevania: Aria of Sorrow, and Golden Sun.',
    commonExtensions: ['gba'],
    accentColor: '#3b82f6',
  },
  N64: {
    id: 'N64',
    name: 'Nintendo 64',
    fullName: 'Nintendo 64',
    manufacturer: 'Nintendo',
    releaseYear: 1996,
    media: 'cartridge',
    description:
      'Pioneered 3D gaming and analogue control with games like Super Mario 64, The Legend of Zelda: Ocarina of Time, GoldenEye 007, and Super Smash Bros.',
    commonExtensions: ['z64', 'n64', 'v64'],
    accentColor: '#10b981',
  },
  PokemonMini: {
    id: 'PokemonMini',
    name: 'Pokémon Mini',
    fullName: 'Nintendo Pokémon Mini',
    manufacturer: 'Nintendo',
    releaseYear: 2001,
    media: 'cartridge',
    description:
      'The smallest cartridge-based handheld console ever produced by Nintendo, dedicated entirely to Pokémon themed mini-games.',
    commonExtensions: ['min'],
    accentColor: '#f59e0b',
  },
  SMS: {
    id: 'SMS',
    name: 'Master System',
    fullName: 'Sega Master System',
    manufacturer: 'Sega',
    releaseYear: 1985,
    media: 'cartridge',
    description:
      'Sega’s 8-bit console that rivaled the NES with superior graphics hardware, popular for Alex Kidd, Phantasy Star, and Sonic the Hedgehog.',
    commonExtensions: ['sms'],
    accentColor: '#0284c7',
  },
  GameGear: {
    id: 'GameGear',
    name: 'Game Gear',
    fullName: 'Sega Game Gear',
    manufacturer: 'Sega',
    releaseYear: 1990,
    media: 'cartridge',
    description:
      'Sega’s full-color backlit handheld console based on Master System architecture, featuring portable versions of Sonic, Shinobi, and Columns.',
    commonExtensions: ['gg'],
    accentColor: '#2563eb',
  },
  MegaDrive: {
    id: 'MegaDrive',
    name: 'Mega Drive / Genesis',
    fullName: 'Sega Mega Drive / Genesis',
    manufacturer: 'Sega',
    releaseYear: 1988,
    media: 'cartridge',
    description:
      'Sega’s legendary 16-bit console defined by "Blast Processing", arcade ports, and classic games like Sonic the Hedgehog, Streets of Rage, and Gunstar Heroes.',
    commonExtensions: ['md', 'gen', 'smd', 'bin'],
    accentColor: '#1e293b',
  },
  MegaCD: {
    id: 'MegaCD',
    name: 'Mega-CD / Sega CD',
    fullName: 'Sega Mega-CD / Sega CD',
    manufacturer: 'Sega',
    releaseYear: 1991,
    media: 'disc',
    description:
      'CD-ROM add-on for the Mega Drive introducing CD audio, full-motion video, and enhanced scaling graphics with games like Sonic CD and Snatcher.',
    commonExtensions: ['cue', 'bin', 'iso', 'chd'],
    accentColor: '#475569',
  },
  S32X: {
    id: 'S32X',
    name: '32X',
    fullName: 'Sega 32X',
    manufacturer: 'Sega',
    releaseYear: 1994,
    media: 'cartridge',
    description:
      '32-bit hardware expansion unit for the Mega Drive featuring twin RISC processors for 3D games like Virtua Fighter, Star Wars Arcade, and Knuckles’ Chaotix.',
    commonExtensions: ['32x', 'bin'],
    accentColor: '#ef4444',
  },
  Saturn: {
    id: 'Saturn',
    name: 'Sega Saturn',
    fullName: 'Sega Saturn',
    manufacturer: 'Sega',
    releaseYear: 1994,
    media: 'disc',
    description:
      'Sega’s 32-bit dual-CPU console celebrated for unbeatable 2D arcade ports, innovative 3D titles, and classics like Panzer Dragoon, Nights into Dreams, and Virtua Fighter 2.',
    commonExtensions: ['cue', 'bin', 'iso', 'chd'],
    accentColor: '#6366f1',
  },
  PSX: {
    id: 'PSX',
    name: 'PlayStation',
    fullName: 'Sony PlayStation',
    manufacturer: 'Sony',
    releaseYear: 1994,
    media: 'disc',
    description:
      'The landmark 32-bit console that revolutionized gaming with CD-ROM media, 3D graphics, and blockbusters like Final Fantasy VII, Metal Gear Solid, and Resident Evil.',
    commonExtensions: ['cue', 'bin', 'iso', 'chd', 'pbp', 'm3u'],
    accentColor: '#00439c',
  },
  TGFX16: {
    id: 'TGFX16',
    name: 'TurboGrafx-16 / PC Engine',
    fullName: 'NEC TurboGrafx-16 / PC Engine',
    manufacturer: 'NEC',
    releaseYear: 1987,
    media: 'cartridge',
    description:
      'NEC and Hudson Soft’s sleek 16-bit graphics system using ultra-compact HuCard media, famous for shoot-’em-ups and games like Bonk’s Adventure and Splatterhouse.',
    commonExtensions: ['pce', 'sgx'],
    accentColor: '#d97706',
  },
  'TGFX16-CD': {
    id: 'TGFX16-CD',
    name: 'TurboGrafx-CD / PC Engine CD',
    fullName: 'NEC TurboGrafx-CD / PC Engine CD-ROM²',
    manufacturer: 'NEC',
    releaseYear: 1988,
    media: 'disc',
    description:
      'The world’s first CD-ROM console add-on, legendary for redbook audio soundtracks, animated cutscenes, and masterpieces like Castlevania: Rondo of Blood.',
    commonExtensions: ['cue', 'bin', 'iso', 'chd', 'toc'],
    accentColor: '#b45309',
  },
  NEOGEO: {
    id: 'NEOGEO',
    name: 'Neo Geo AES / MVS',
    fullName: 'SNK Neo Geo Advanced Entertainment System',
    manufacturer: 'SNK',
    releaseYear: 1990,
    media: 'cartridge',
    description:
      'The ultimate arcade hardware in the home, featuring massive gigabit cartridges and iconic fighting and action games like Metal Slug, King of Fighters, and Samurai Shodown.',
    commonExtensions: ['neo', 'zip', '7z'],
    accentColor: '#dc2626',
  },
  'NeoGeo-CD': {
    id: 'NeoGeo-CD',
    name: 'Neo Geo CD',
    fullName: 'SNK Neo Geo CD',
    manufacturer: 'SNK',
    releaseYear: 1994,
    media: 'disc',
    description:
      'CD-based home version of the Neo Geo arcade hardware offering arcade-perfect gameplay with orchestrated soundtracks.',
    commonExtensions: ['cue', 'bin', 'iso', 'chd'],
    accentColor: '#991b1b',
  },
  Atari2600: {
    id: 'Atari2600',
    name: 'Atari 2600',
    fullName: 'Atari 2600 Video Computer System',
    manufacturer: 'Atari',
    releaseYear: 1977,
    media: 'cartridge',
    description:
      'The pioneer of microprocessor-based home consoles with interchangeable cartridges, home to classics like Pitfall!, Space Invaders, and Asteroids.',
    commonExtensions: ['a26', 'bin'],
    accentColor: '#ea580c',
  },
  ATARI5200: {
    id: 'ATARI5200',
    name: 'Atari 5200',
    fullName: 'Atari 5200 SuperSystem',
    manufacturer: 'Atari',
    releaseYear: 1982,
    media: 'cartridge',
    description:
      'Atari’s second-generation console based on Atari 8-bit computer architecture, featuring arcade ports like Centipede, Pac-Man, and Defender.',
    commonExtensions: ['a52', 'bin'],
    accentColor: '#c2410c',
  },
  ATARI7800: {
    id: 'ATARI7800',
    name: 'Atari 7800',
    fullName: 'Atari 7800 ProSystem',
    manufacturer: 'Atari',
    releaseYear: 1986,
    media: 'cartridge',
    description:
      'Designed with near-perfect arcade capability and full backwards compatibility with Atari 2600 cartridges.',
    commonExtensions: ['a78', 'bin'],
    accentColor: '#9a3412',
  },
  AtariLynx: {
    id: 'AtariLynx',
    name: 'Atari Lynx',
    fullName: 'Atari Lynx',
    manufacturer: 'Atari',
    releaseYear: 1989,
    media: 'cartridge',
    description:
      'The world’s first handheld console with a color LCD screen, featuring hardware sprite scaling and ambidextrous flip control.',
    commonExtensions: ['lnx', 'lyx'],
    accentColor: '#fb923c',
  },
  WonderSwan: {
    id: 'WonderSwan',
    name: 'WonderSwan',
    fullName: 'Bandai WonderSwan',
    manufacturer: 'Bandai',
    releaseYear: 1999,
    media: 'cartridge',
    description:
      'Gunpei Yokoi’s compact handheld console featuring portrait or landscape orientation, long battery life, and Japanese RPG classics.',
    commonExtensions: ['ws'],
    accentColor: '#06b6d4',
  },
  WonderSwanColor: {
    id: 'WonderSwanColor',
    name: 'WonderSwan Color',
    fullName: 'Bandai WonderSwan Color',
    manufacturer: 'Bandai',
    releaseYear: 2000,
    media: 'cartridge',
    description:
      'Color upgrade to the WonderSwan featuring a FSTN color screen and exclusive titles like Final Fantasy remakes and Klonoa.',
    commonExtensions: ['wsc', 'ws'],
    accentColor: '#0891b2',
  },
};

/**
 * Resolves a system folder path or system key to its detailed SystemInfo record.
 *
 * @example
 * getSystemInfo('SNES') -> SNES SystemInfo
 * getSystemInfo('PSX/Final Fantasy VII') -> PSX SystemInfo
 */
export function getSystemInfo(pathOrName?: string): SystemInfo | undefined {
  if (!pathOrName) return undefined;

  const segment = pathOrName.indexOf('/') === -1 ? pathOrName : pathOrName.split('/')[0];
  const normalized = Object.keys(SYSTEMS_INFO).find(
    (key) => key.toLowerCase() === segment.toLowerCase(),
  );

  return normalized ? SYSTEMS_INFO[normalized] : undefined;
}

/**
 * Returns all registered system information definitions.
 */
export function getAllSystemsInfo(): SystemInfo[] {
  return Object.values(SYSTEMS_INFO);
}
