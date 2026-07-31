# Grouping: game ↔ variants

Based on the pattern validated from `igir` (without reusing its code, which
depends on native binaries incompatible with the browser):

- **Identify by hash, not by file name** — the local name is not trustworthy; the
  hash checked against the DAT is.
- **"Candidate"**: every DAT entry is a candidate variant that a local file may
  or may not match (the theoretical catalog vs. what you actually have on disk).
- **Grouping by base title**, extracting the region/language/revision/flag tags
  from the DAT name. The group key is the result of `normalizeGameName`, which is
  therefore the axis of the whole system: it groups, it names the folder and it
  resolves the cover.

  The original design planned to group by `cloneOf` (No-Intro/Redump
  "parent-clone" DATs), which would be more reliable than parsing the title.
  **It is not viable**: it has been verified that no DAT in `libretro-database`
  includes `cloneof` or `romof`, and No-Intro's parent-clone DATs can only be
  obtained manually from DAT-o-MATIC, which would break the automated download.
  No-Intro's naming is regular enough (`Title (Region) (Rev 1)`) for the base
  title to be reliable within a single system.

The core is pure TypeScript with no Node dependencies: the `DatGame`,
`GameVariant` and `GameGroup` types and the `parseGameName` / `groupDatGames`
functions live in `src/core/rom-grouping.ts`; `matchGroupsWithLocalFiles` lives
in `src/core/rom-matching.ts`. Streaming hashing lives in
`ChecksumService.streamCRC32()`, because it needs file access.

## Variant identity

The variant key is derived **from the dataset, never from the local file name**.
It is the file suffix on cartridge systems and the subfolder name on disc
systems. Segments in a fixed order joined by `-`:

```
<region>[-<revision>][-<flag>][-<language>][-<extra>][-<crc8>]
```

- **region**: the literal No-Intro string (`USA`, `Europe`, `Japan`, `World`);
  multi-region joins with `+` (`USA+Europe`).
- **revision**: `(Rev 1)` → `rev1`, `(Rev A)` → `revA`, `(v1.1)` → `v11`.
- **flag**: `beta`, `beta2`, `proto`, `demo`, `sample`, `unl`, `aftermarket`.
- **language**: only when it is the only thing telling two variants apart
  (`Europe-Es`).
- **extra**: a tag the parser does not interpret, reduced to lowercase without
  separators (`(Virtual Console)` → `virtualconsole`). The real vocabulary is
  open-ended — around 2000 distinct tags across the 23 datasets — so enumerating
  it is not viable; it is added only when it is what tells two variants apart.
- **crc8**: 8 hex digits of the main ROM's CRC32, added **only** if two variants
  of the same group still collide after all of the above. It is added to every
  colliding variant, not just the second one, so that the result does not depend
  on iteration order.

Each optional segment is added only within the group where the shorter key is
ambiguous, so the common case stays readable (`USA`, `Japan-rev1`). Across the
51,216 games of the 23 datasets this produces 41,540 variants with none of them
needing the `crc8` suffix.

## Regions and video standard

The DAT names dozens of regions (`Europe`, `USA`, `Japan`, but also `Brazil`,
`Scandinavia`, `Hong Kong`) and the application reasons in **three**: EU, US and
JP. The translation lives in a single place, `src/core/rom-regions.ts`, because
the browser and the dataset build both use it.

`World` is not a fourth region: a world release goes to all three at once, and
that is exactly what makes a preference order useful. Across the 55,158 entries
of the 23 DATs, **8,700 are `World`** and only 26 cannot be placed in any region;
those are left without one, because guessing would be worse than not saying.

The **video standard** is the release's own and not the country's broadcast
standard, because what matters about a ROM is whether it is a 50 Hz or a 60 Hz
build: `Hong Kong` is NTSC — a PAL country whose consoles were NTSC-J —, `Brazil`
is NTSC — PAL-M is 60 Hz — and `Argentina` is PAL — PAL-N is 50 — despite being
in the American market.

Each variant therefore declares the regions it goes to and the standards it runs
at. A multi-region release keeps **both** when it crosses a 50 Hz market and a
60 Hz one: `(USA, Europe)` is one entry in the DAT but two builds in practice,
and stating only one would be false.

## Files belonging to the same release

A DAT lists **one entry per file**, not per release. The same release appears
repeated when it is split across several files: the discs of a Redump game
(`(Disc 1)`, `(Disc 2)`…) and also cartridges split across several chips, which
repeat the full name with no tag to tell them apart.

Entries of the same release are identified by their **full name without the disc
tag** and are merged into a single variant with several files. Deriving that from
the raw name, and not from the already-parsed fields, is what avoids merging two
distinct releases that differ only in an unrecognized tag.

This has a known limit: the DAT name **is not always unique**. There are protos
and homebrew where two releases share the `<game>`'s name and differ only in the
`<rom>`'s date (`RealSports Basketball (USA) (Proto)` with files `(1982-11-05)`
and `(1983-10-31)`). Those releases are merged into one variant that ends up with
two files sharing an extension. Across the 23 datasets that is **93 cases out of
~51,000 entries**. It is not corrected in the grouping: it is detected when
organizing, where it shows up as two files claiming the same name, and there
neither of the two is touched. See
[Canonical organization](folder-structure.md#canonical-organization).

## Name normalization

A single pure function `normalizeGameName(datName)`, shared by the ROM path, the
`.meta` path and cover matching:

1. Strip every trailing tag group `(...)` and `[...]`.
2. Keep the No-Intro form as-is (`Legend of Zelda, The`); articles are not
   reordered.
3. Normalize to Unicode **NFC** (avoids macOS's NFD vs. Windows's NFC mismatch
   when comparing paths).
4. Replace with `_` exactly the set libretro sanitizes (the same one
   `toThumbnailName` applies in `scripts/dat-to-json.mjs`): ``& * / : ` < > ? \ | "``.
5. Trim trailing dots and spaces; collapse repeated spaces.
6. Windows reserved names (`CON`, `AUX`, `COM1`…) → `_` prefix.
7. Truncate to 120 characters per component at a word boundary; if it was
   truncated, append `-<crc8>`.

Step 4 deliberately uses the same sanitizing libretro applies when publishing
thumbnails, but **the game's folder name does not match the thumbnail's**:
libretro names covers with the full DAT name (`Final Fantasy VII (Europe) (Disc
1).png`), tags included. The cover therefore belongs to **a release**, not to a
game, and `scripts/dat-to-json.mjs` already resolves it entry by entry; since the
release is what carries a region, that is where one cover per region comes from
(see [Cover art](covers.md)). Sharing the sanitizing is still useful because it
guarantees that no cover name introduces characters the filesystem will not
accept.
