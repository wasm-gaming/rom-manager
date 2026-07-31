# Target systems

Closed list — the MiSTer FPGA "mainstream" block.

The system identifier is the folder name MiSTer uses under `/games`, taken
literally from `MiSTer-devel/Distribution_MiSTer`. The casing is inconsistent in
MiSTer itself (`Atari2600` but `ATARI5200`, `NEOGEO` but `NeoGeo-CD`) and is
reproduced as-is on purpose: it has to match what is on the user's SD card.

| System (MiSTer) | Medium | DAT (libretro-database/metadat) |
|---|---|---|
| `NES` | cartridge | `no-intro/Nintendo - Nintendo Entertainment System.dat` |
| `SNES` | cartridge | `no-intro/Nintendo - Super Nintendo Entertainment System.dat` |
| `GAMEBOY` | cartridge | `no-intro/Nintendo - Game Boy.dat` |
| `GBC` | cartridge | `no-intro/Nintendo - Game Boy Color.dat` |
| `GBA` | cartridge | `no-intro/Nintendo - Game Boy Advance.dat` |
| `N64` | cartridge | `no-intro/Nintendo - Nintendo 64.dat` |
| `PokemonMini` | cartridge | `no-intro/Nintendo - Pokemon Mini.dat` |
| `SMS` | cartridge | `no-intro/Sega - Master System - Mark III.dat` |
| `GameGear` | cartridge | `no-intro/Sega - Game Gear.dat` |
| `MegaDrive` | cartridge | `no-intro/Sega - Mega Drive - Genesis.dat` |
| `MegaCD` | disc | `redump/Sega - Mega-CD - Sega CD.dat` |
| `S32X` | cartridge | `no-intro/Sega - 32X.dat` |
| `Saturn` | disc | `redump/Sega - Saturn.dat` |
| `PSX` | disc | `redump/Sony - PlayStation.dat` |
| `TGFX16` | cartridge | `no-intro/NEC - PC Engine - TurboGrafx 16.dat` |
| `TGFX16-CD` | disc | `redump/NEC - PC Engine CD - TurboGrafx-CD.dat` |
| `NeoGeo-CD` | disc | `redump/SNK - Neo Geo CD.dat` |
| `Atari2600` | cartridge | `no-intro/Atari - 2600.dat` |
| `ATARI5200` | cartridge | `no-intro/Atari - 5200.dat` |
| `ATARI7800` | cartridge | `no-intro/Atari - 7800.dat` |
| `AtariLynx` | cartridge | `no-intro/Atari - Lynx.dat` |
| `WonderSwan` | cartridge | `no-intro/Bandai - WonderSwan.dat` |
| `WonderSwanColor` | cartridge | `no-intro/Bandai - WonderSwan Color.dat` |

The medium (`media: 'cartridge' | 'disc'`) is a fixed property of the system and
decides the on-disk layout, the scanning rule and how collections are told apart.
See [Folder structure](folder-structure.md) and [Collections](collections.md).

## Neo Geo AES/MVS (`NEOGEO`) is out

Not for lack of hashes, which is the reason this document gave until 2026-07-31
and is wrong. There is indeed no No-Intro or Redump DAT, but `libretro-database`
ships `dat/SNK - Neo Geo.dat`: 278 sets, one `.neo` file each with its CRC32.
`libretro-thumbnails/SNK_-_Neo_Geo` publishes the boxarts under exactly those
names. The `.neo` half of the system is matchable by hash like any other.

What does not fit is everything else the core reads. `NeoGeo_MiSTer` accepts
`.neo` files, Darksoft sets and decrypted MAME sets, the last two as a folder or
a zip of chip dumps declared in `games/NEOGEO/romsets.xml` — a catalog with
title, publisher and year and **no checksums**. Identifying one of those means
matching a *set* of inner files against an arcade DAT (`metadat/fbneo-split/`,
1.8 MB and 10.6 MB), which is a second identification path and not a new row in
the table above.

Two more mismatches with the current model:

- The DAT names sets (`(set 1)`, `(NGM-043)(NGH-043)`), not releases. The
  variant key is built from region, revision, language and flags, and none of
  them exist here: every variant would fall back to its `crc8` and every cover
  to `*`.
- A Darksoft pack sitting in `games/NEOGEO` is exactly what
  [Collections](collections.md) says the manager must not touch.

Postponed as a separate feature. Its first step is the `.neo` half, and the
obstacle there is only that `dat/SNK - Neo Geo.dat` lives in `dat/` and not in
`metadat/`, the single base `scripts/download-dats.mjs` knows how to download
from.

## Systems left out

MiSTer's niche systems are out for now: ColecoVision, Intellivision, Vectrex,
Odyssey2, Channel F, VC4000, Arcadia 2001, Astrocade, Gamate, SuperVision, Casio
PV-1000, CreatiVision, MyVision, Super Vision 8000, Adventure Vision, BBC Bridge
Companion, AY-3-8500.

The list is **closed**: the post-retro systems the repository used to include in
`scripts/systems.mjs` have been removed too (GameCube, Wii, PlayStation 2, PSP,
Dreamcast, Commodore 64, Amiga).
