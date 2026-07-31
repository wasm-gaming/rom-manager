# Collections

Examples: Darksoft's NeoGeo collection, a personal curated list.

Collections are **curated groupings**, not variants of a game — the same game can
belong to several collections at once.

**They are out of the manager's scope**: they are flat folders
(`<system>/<collection>/`) that the user fills manually. The ROM manager **only
manipulates (scans / organizes / matches) the base folder of each system**, never
the contents of a collection folder.

The reason: a MiSTer's SD/USB card is usually FAT32/exFAT (no symlinks, no hard
links), so a collection that is "browsable from native MiSTer" can only exist as
a physical copy of the files — it makes no sense for the manager to try to keep
it automatically in sync.

## Scanning rule

When scanning `<system>/` to detect new or orphaned ROMs, the manager must
**explicitly exclude collection subfolders**. The rule depends on the system's
medium:

- **Cartridge**: the files at the root of `<system>/` are managed; any subfolder
  is a collection and is not touched.
- **Disc**: game folders and collection folders live side by side at the root, so
  the discriminant is the presence of `game.json`.

A collection the scanner never entered stays intact and browsable in the
explorer, which is the counterpart of the absorbed-folders rule described in
[File explorer](explorer.md#absorbed-folders).
