# File explorer

Two sources combined into a single real walk of the filesystem:

- **Flat mode**: the listing straight from the File System Access API, as-is —
  including collections, `.meta`, and any unrecognized file.
- **Wizard mode**: the same walk, but per folder:
  - `.meta` is always hidden.
  - For each file, if the dataset recognizes it (hash match), it is grouped with
    its sibling variants inside its `GameGroup`.
  - What it does not recognize is shown loose, exactly as in flat mode.
  - Subfolders can still be browsed and file/folder info still shown.

## One game is a single row

**A game is a single row, and it does not expand.** Having fifteen Sonic 2 files
read as one game is exactly what grouping is for, and a row that opens and shows
the fifteen files again undoes that. So the row carries its releases as data, not
as children, and where they are read is the details panel: all the ones the
catalog knows about, absent ones included, with the files of each and the missing
one marked as such.

In the tree, a game is distinguished only by the color of its text: the counts
and the detail live in the panel, which is where there is room to read them.
There, the present releases are one badge each — what you have reads better than
how many — and the absent ones are collapsed, because the catalog may list
fifteen against the single one on disk. Each version also carries the regions it
goes to and the standards it runs at, which is what tells you whether a ROM works
on your TV and which box it comes from.

The row acts on **all** of the game's files: selecting it selects them, and
dragging or deleting moves or deletes them together. Since the tree no longer
lists a game's files, the details panel is also the only route to one: the
present ones are buttons that open it, with a way back to the game.

## What a row's icon says

A folder is a folder and a game row is a game. Every other row is a file, and
its mark comes from the MIME type its name claims — the table is `file-types.ts`,
and the list of extensions that name a system is the same one the intake uses to
decide which catalogs are worth downloading, so the two cannot drift apart.

| Mark | What it means |
|---|---|
| Folder | A directory |
| Gamepad | The name carries a ROM extension |
| Gamepad with a parcel | A game row: one game, however many files it holds |
| Disc | A disc image: `cue`, `iso`, `chd`, `gdi`… |
| Parcel | An archive: `zip`, `7z`, `rar` |
| Picture | Boxart, a screenshot, anything `image/*` |
| Memory card | A saved game: `srm`, `sav`, `state`, `mcr` |
| Written page | A readme, a `.dat`, a `.json` |
| Blank page | A file nothing is known about |

The gamepad claims only what a listing can know: **this name looks like a ROM**.
Whether the catalog actually recognizes the file is said elsewhere, twice — by
the status disc of a game row and by the badge dot of a file with a library
record — and neither of those is the icon. A file nobody can name gets the blank
page rather than a guess, which is why `.DS_Store` stopped wearing a gamepad.

Files an operating system leaves behind — anything starting with a dot — are
shown **faded**, icon and name. They are not hidden: a browser that leaves out
what is on the disk is lying about the disk. They are simply not allowed to be
as loud as a game.

## Region preference order

In the header, three buttons with the regions **in the order they are preferred**:
`| EU | US | JP |`. Clicking one puts it first and leaves the other two as they
were — clicking JP in `EU US JP` gives `JP EU US`, not `JP US EU` — because what
the click says is "this one first", and reordering what nobody touched would be
answering something else. The preferences panel additionally offers all six
permutations, to pick one in a single step. EU/US/JP by default.

Changing it does not re-group or rehash anything: the game row carries the covers
of all its regions as data, not the one to show, and what is in `.meta` is already
listed, so the panel simply picks another. Below the cover it says which region it
is from, because with six possible orders the image alone does not make it clear.

## Drag and drop

**The details panel accepts dragged files**, and what it does with them depends on
what is selected, not on the file:

- **a game**: images go into its metadata, asking for type and region (see
  [Hand-added images](covers.md#hand-added-images)); anything else is copied into
  the folder where its ROMs are.
- **a folder**: everything is added as-is, images included.
- **anything else** — a loose ROM, several files, nothing —: there is nowhere to
  put it, and it says there are no actions available instead of guessing.

Nothing is written before it is confirmed: dropping a file is easy to do by
accident and hard to undo. An internal drag from the tree itself does not count as
a drop here; moving a ROM onto the panel means nothing.

## Per-folder wizard activation

A single `.meta/wizard.json` file stores (among other possible things) the list of
folders activated as wizard. System folders are wizard by default; any other
folder (collections included) can be explicitly activated there if you want to
browse it grouped. The file stores **only the exceptions**: a folder returned to
its default value is deleted from it, so no stale entries from renamed systems
remain.

The same file stores the **region preference order** (`regionOrder`), which
belongs to the library and not to the browser: the preference is about the
collection somebody has on a card, and it travels with it. Since the file is
hand-editable, an order that is not a permutation of the three regions falls back
to the default value instead of leaving the browser with no way to choose.

## Which games appear in wizard mode

The explorer shows the disk, not the catalog: a game is listed only if it has **at
least one file present**. Showing the dataset's 26,548 games would bury the twenty
the user has. Inside a game, on the other hand, **all** of its variants are
listed, absent ones included — seeing which siblings exist is the reason to group.
The same goes for the files of a partial variant: the missing disc is listed so
that it can be seen to be missing. For an absent file its **CRC32** is shown where
a present one shows its size: it is not on disk, so the name — which the dataset
gives it — does not identify it, and the checksum does.

## Absorbed folders

A folder whose files have all ended up inside a game disappears from the listing:
its content is already on screen one level up and better organized. That is what
turns a disc game — one folder per variant, several files each — into a single
row, while a collection, which the scanner never entered, stays intact and
browsable. Both rules fall out of the same thing: a recognized file *claims* its
folder.

## Known limitation

**The system is inferred from the first path segment**, which is the structure
MiSTer imposes on the SD card. Consequence: grouping requires opening the root
that contains the system folders; if `MegaDrive/` is opened directly, there is no
way to know which system it is and the explorer stays in flat mode.
