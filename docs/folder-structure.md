# Folder structure and canonical organization

The structure depends on the **system's medium**, a fixed property declared in
the systems table (`media: 'cartridge' | 'disc'`). See
[Target systems](systems.md).

Cartridge systems — one file per variant, flat:

```
<system>/<Game>.<variant>.<ext>
<system>/<collection>/...                          # flat folders, see below
```

Disc systems (PSX, Saturn, Mega-CD, PC Engine CD, Neo Geo CD) — one folder per
game and a subfolder per variant, because a release may consist of several files
(discs, `bin`+`cue`):

```
<system>/<Game>/game.json                          # managed-game marker
<system>/<Game>/<variant>/<files of the release>
```

In both cases, metadata lives outside the ROM folders:

```
.meta/<system>/<Game>.json                         # editable metadata
.meta/<system>/<Game>.<region>.case.png            # cover for one region
.meta/<system>/<Game>.case.png                     # cover for the game
.meta/<system>/<Game>[.<region>].<type>.<ext>      # any other image
.meta/<system>/scan.json                           # hash cache
.meta/wizard.json
```

Example:

```
Nintendo - SNES/Super Mario World.USA.sfc
Nintendo - SNES/Super Mario World.Japan-rev1.sfc

Sony - PlayStation/Final Fantasy VII/game.json
Sony - PlayStation/Final Fantasy VII/USA/Final Fantasy VII (USA) (Disc 1).bin
Sony - PlayStation/Final Fantasy VII/USA/Final Fantasy VII (USA) (Disc 1).cue
```

The variant segment (`USA`, `Japan-rev1`) is derived from the dataset and never
from the local file name; see
[Variant identity](grouping.md#variant-identity).

## `scan.json`

`scan.json` stores, per relative path, `size` + `mtime` + `crc32`. It is a **scan
cache**: without it, gigabytes would have to be rehashed every time the folder is
opened. One file per system instead of one per game, so that startup is a single
read. It can be deleted with no loss of information: it is rebuilt by rehashing.

Matching requires **both CRC32 and size** to match, not just the CRC. A CRC32 is
32 bits and a system has tens of thousands of entries, so a collision is likely
rather than theoretical; the scan already knows the size, so checking it is free.
It has been verified that the 51,216 entries of the 23 datasets all carry `size`
and that no CRC repeats with two different sizes.

## `game.json`

`game.json` exists **only on disc systems** and is deliberately minimal
(`gameId`, `title`, `system`). Its job is not to store data but to mark the
folder as a managed game, to tell it apart from a collection.

## Canonical organization

Moving files into the structure above is the only operation that touches the
user's ROMs, so it is split in two: a **plan**, which changes nothing, and its
**application**, which does not happen without the plan having been shown.

The plan only reaches files the dataset recognizes by CRC32 and size. What it
does not recognize stays where it is, and that is what stops the manager from
rearranging a collection it does not understand. The destination is **always**
derived from the dataset: the canonical name, the variant key and also the
extension, so a `.gen` whose entry says `.md` ends up named `.md`.

The plan is deliberately cowardly. Every case whose outcome would depend on the
order the operations run in, or that would overwrite something, is reported as a
conflict instead of resolved by guessing:

- **two files claim the same name** — the case of DATs with repeated names
  described in [Files belonging to the same
  release](grouping.md#files-belonging-to-the-same-release);
- **the destination is already occupied** by a file that is not going to move;
- **a cycle**, files claiming each other's spot.

The moves that are emitted are **ordered**, so that none clobbers a file that
still has to move. A destination occupied by something that is going to move
first is not a conflict, it is a matter of order.

Applying a plan also:

- writes the log to `.meta/undo/<id>.json` **before** the first move, not after
  the last one, because an execution that is cut off halfway is exactly the case
  where undo matters;
- drags the metadata (`.meta/<system>/<Game>.json`) along behind its ROM, which
  would otherwise be orphaned when the path indexing it changes;
- deletes `scan.json`, whose paths have just stopped being true;
- writes the missing `game.json` files, without touching existing ones.

Undo walks the log backwards and **checks every step before taking it**, so that
an interrupted execution, or a folder the user has already touched by hand,
reverts what it still can instead of failing as a whole.

On real data, organizing all 23 complete systems is ~51,000 moves, 236 conflicts
(0.46%, all from duplicate names in the DAT) and no character exFAT rejects. The
longest path generated is 256 characters, comfortable on Linux but close to
Windows's `MAX_PATH`: an accepted limitation, since the destination is a MiSTer's
SD card.
