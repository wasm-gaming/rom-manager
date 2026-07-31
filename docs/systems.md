# Target systems

Closed list — the MiSTer FPGA "mainstream" block.

The system identifier is the folder name MiSTer uses under `/games`, taken
literally from `MiSTer-devel/Distribution_MiSTer`. The casing is inconsistent in
MiSTer itself (`Atari2600` but `ATARI5200`, `NEOGEO` but `NeoGeo-CD`) and is
reproduced as-is on purpose: it has to match what is on the user's SD card.

| System (MiSTer) | Medium | DAT (libretro-database) |
|---|---|---|
| `NES` | cartridge | `metadat/no-intro/Nintendo - Nintendo Entertainment System.dat` |
| `SNES` | cartridge | `metadat/no-intro/Nintendo - Super Nintendo Entertainment System.dat` |
| `GAMEBOY` | cartridge | `metadat/no-intro/Nintendo - Game Boy.dat` |
| `GBC` | cartridge | `metadat/no-intro/Nintendo - Game Boy Color.dat` |
| `GBA` | cartridge | `metadat/no-intro/Nintendo - Game Boy Advance.dat` |
| `N64` | cartridge | `metadat/no-intro/Nintendo - Nintendo 64.dat` |
| `PokemonMini` | cartridge | `metadat/no-intro/Nintendo - Pokemon Mini.dat` |
| `SMS` | cartridge | `metadat/no-intro/Sega - Master System - Mark III.dat` |
| `GameGear` | cartridge | `metadat/no-intro/Sega - Game Gear.dat` |
| `MegaDrive` | cartridge | `metadat/no-intro/Sega - Mega Drive - Genesis.dat` |
| `MegaCD` | disc | `metadat/redump/Sega - Mega-CD - Sega CD.dat` |
| `S32X` | cartridge | `metadat/no-intro/Sega - 32X.dat` |
| `Saturn` | disc | `metadat/redump/Sega - Saturn.dat` |
| `PSX` | disc | `metadat/redump/Sony - PlayStation.dat` |
| `TGFX16` | cartridge | `metadat/no-intro/NEC - PC Engine - TurboGrafx 16.dat` |
| `TGFX16-CD` | disc | `metadat/redump/NEC - PC Engine CD - TurboGrafx-CD.dat` |
| `NEOGEO` | cartridge | `dat/SNK - Neo Geo.dat` + [romsets](#neo-geo-ships-in-two-shapes) |
| `NeoGeo-CD` | disc | `metadat/redump/SNK - Neo Geo CD.dat` |
| `Atari2600` | cartridge | `metadat/no-intro/Atari - 2600.dat` |
| `ATARI5200` | cartridge | `metadat/no-intro/Atari - 5200.dat` |
| `ATARI7800` | cartridge | `metadat/no-intro/Atari - 7800.dat` |
| `AtariLynx` | cartridge | `metadat/no-intro/Atari - Lynx.dat` |
| `WonderSwan` | cartridge | `metadat/no-intro/Bandai - WonderSwan.dat` |
| `WonderSwanColor` | cartridge | `metadat/no-intro/Bandai - WonderSwan Color.dat` |

The medium (`media: 'cartridge' | 'disc'`) is a fixed property of the system and
decides the on-disk layout, the scanning rule and how collections are told apart.
See [Folder structure](folder-structure.md) and [Collections](collections.md).

## Neo Geo ships in two shapes

Every other system here is a file with a checksum. A Neo Geo game is either
that — a `.neo`, which `dat/SNK - Neo Geo.dat` catalogues one CRC32 at a time —
or a **romset**: a folder or a zip of chip dumps, where no single checksum
describes the game and what identifies it is the checksums of its members.

So `NEOGEO` is the one system with more than one source, and they are joined by
the romset name (`mslug`, `garou`, `garouh`), which is the primary key of both
and what MiSTer's `romsets.xml` is keyed by:

| Source | What it gives |
|---|---|
| `dat/SNK - Neo Geo.dat` | 278 `.neo` files, one CRC32 each |
| `metadat/fbneo-split/FinalBurn Neo (ClrMame Pro XML, Arcade only).dat`, filtered to `romof="neogeo"` | 203 romsets and the checksums of their members |
| [`NeoGeo_MiSTer/releases/romsets.xml`](https://github.com/MiSTer-devel/NeoGeo_MiSTer) | what the core needs to *load* a romset, which no checksum can say: encryption chips, RAM size, wait states |

A romset is identified by reading only the ZIP index — the CRC32 of each member
is in there, so nothing is decompressed. Every one of the 203 holds at least one
member checksum that belongs to no other set, so one match names the set and the
rest say how complete it is. Measured against 767 real romsets: **749
identified, and 419 of those had a file name that was not the name of the set**.

`members` in the dataset are distinct checksums and not files: four romsets ship
the same chip twice, and an archive lists both copies under the one checksum.

### What is out

- **Darksoft packs.** Their files are merged — `crom0` is the `c` chips joined,
  `vroma0` the `v` ones — so they hold none of the original chips and no
  catalogue publishes their checksums. They can only be recognized by folder
  name, which is what this project does not do. MiSTer loads them from the
  `romsets.xml` it ships with, so they work; the manager just leaves them alone.
- **Homebrew and recent releases**, 25 of the 283 romsets MiSTer lists —
  `GladMort` (2025), `Abyssal Infants` (2021), `Frog Feast`, the PCB and console
  conversions, the fan editions of KOF. No catalogue lists them yet.

## Systems left out

MiSTer's niche systems are out for now: ColecoVision, Intellivision, Vectrex,
Odyssey2, Channel F, VC4000, Arcadia 2001, Astrocade, Gamate, SuperVision, Casio
PV-1000, CreatiVision, MyVision, Super Vision 8000, Adventure Vision, BBC Bridge
Companion, AY-3-8500.

The list is **closed**: the post-retro systems the repository used to include in
`scripts/systems.mjs` have been removed too (GameCube, Wii, PlayStation 2, PSP,
Dreamcast, Commodore 64, Amiga).
