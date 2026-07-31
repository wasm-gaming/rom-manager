# Cover art

Covers come from `libretro-thumbnails`. They are published under the **full DAT
name**, tags included, so a cover belongs to a release and not to a game:
`Sonic (Japan)` and `Sonic (USA)` do not carry the same one. And since the
release is what carries a region, what a game stores is **one cover per region**:
EU, US and JP.

## Matching

Two layers, both resolved at build time (`scripts/dat-to-json.mjs`):

- **per release**: exact name matching, entry by entry. This is the `cover` field
  of each dataset entry.
- **per game and region**: joined by base title (`normalizeGameName`), in the
  dataset's `covers` map. It only carries what exact matching did not reach — a
  published cover for a revision this DAT does not list, or the European box of a
  game the DAT only lists as `(World)` — and only for the regions the DAT does
  send the game to. The `*` key is the last resort, for a title where no cover
  could be placed in any region: because its entries carry no region, or because
  the only published names are for regions the DAT does not send it to. Without
  it, games whose published name carries no region tag — a quarter of them —
  would lose the cover they have today.

## Which cover belongs to a region

A release speaks for a region when it goes *only* to it; one that goes to several
barely stands in for it. That distinction is what ranks the candidates, best to
worst:

1. the cover of a release for that region alone, retail before beta or prototype;
2. the cover the per-game map carries for that region — published under a name
   that does name it, even if it is for a release the DAT does not list;
3. the cover of a release that goes to that region among others, typically
   `(World)`.

Without that scale, a game like Mega Drive's Sonic 2 — whose fifteen releases are
all `(World)` — would show, with EU preference, the cover of the world release,
which in `libretro-thumbnails` is a scan of the Japanese box, while the European
box is published as `Sonic The Hedgehog 2 (Europe)` and nothing reached it. The
choice does not depend on iteration order.

Across the 23 systems: **19,895 of 26,548 games have a cover (74.9%)**, the same
coverage as before splitting it by regions. Of those, 14,858 have a cover for a
single region, 3,823 for two, 1,148 for all three and 66 only for the game; in
**3,999** games the regions do not carry the same image, which are the games where
the preference order changes what is seen. The per-game map is 1,216 titles and
1,302 URLs, around 221 KB spread across the 23 systems, and none of its entries
is unreachable.

## Which cover is shown

First, among the regions the files the user actually has go to, the first one in
the preference order: that is the box they own, and showing another region's
would be a small lie. If none of those has a cover, the full order is walked. And
if no region has one, the game's; and if not that either, the placeholder. For a
world release — a single file that goes to all three regions — the order is the
only thing that decides, and that is why it exists.

**When opening a single file** — a specific version, from the game panel — the
cover shown is the game's, but chosen among the regions of *that* release, not
among the whole game's: opening the Japanese dump of a game you also have in
Europe shows the Japanese box. A file that belongs to no game — flat mode, a dump
the dataset does not recognize — has no cover to show, and no gap is invented
for it.

**A world release has all three regions**, not one region-less cover: it goes to
all three, so all three have theirs and the order can choose. What is not
asserted is more than what is known: **when all of a game's regions resolve to
the same image**, the caption says it is the box *of the game* and not the one of
the region the order picked, because a single scan for all three is not the
European box just because the preference starts with EU. With a single region it
is stated: a game released only in Japan has a *Japanese* cover.

## Downloading and storing

**Images are read from the repository, not from `thumbnails.libretro.com`.** That
origin serves the same images but **without the `Access-Control-Allow-Origin`
header**, so the browser can display them but not read their bytes; saving a copy
in `.meta/` requires reading them. The URL is
`raw.githubusercontent.com/libretro-thumbnails/<Repo>/HEAD/Named_Boxarts/<name>.png`,
verified across the 23 repositories. `HEAD` replaces the branch name because the
repositories do not agree on it.

Saving the copy: `<Game>.<region>.case.png` when the cover belongs to a region,
`<Game>.case.png` when it is the game's. The extension comes from the URL and
never from the response, so the name of an already-saved cover is known without
downloading it. It is the same name a hand-added cover takes, so in an organized
library it replaces the published one.

Across the 23 systems that is 26,017 possible files — 24,714 downloads, because
two regions sharing an image download it once — all with distinct names within
their system, none with characters exFAT rejects, and the longest 130 characters.

**Browsing is what populates `.meta/`**: opening a game shows the local copy if
it exists and the remote one otherwise, and in that case a copy is downloaded in
the background. There is no bulk download step and thousands of images for games
nobody opens are never downloaded. A blocked download is not an error: the remote
image is still shown.

**A game that is in the library saves all of its regions**, not just the one
being viewed. That is what distinguishes an initialized game — one of its files
has a record in `.meta/` — from one that has merely been looked at, and it is
what makes changing the preference order later work with no network and without
depending on the provider still being there. It happens when the game is opened
and right after its metadata is saved, so browsing is still what populates
`.meta/` rather than a bulk download step. Each cover is downloaded separately,
so a blocked download does not prevent saving the rest. Two regions sharing an
image are saved once each: they are different files, and a missing one would send
that region back to the network.

## Hand-added images

An image can be added by dragging it onto the game's details panel, and on drop
the only thing that is not in the bytes is asked: **what it is** (cover art,
background, title screen, screenshot, logo) and **which region** (EU, US, JP, or
all regions). Those two answers are the file name,
`<Game>[.<region>].<type>.<ext>`, and the name is the whole mechanism: a cover
dropped for EU is later read as EU's cover.

Reading them is therefore the same as reading a downloaded copy, and that puts
them into the choice instead of leaving them only to serve it: **an image added
by hand makes its region an option**, even for a game the catalog publishes no
cover for. What a region has to offer is looked up in this order: the image saved
for it, the one saved for the whole game, and the published one. The two local
ones come first because somebody put them there on purpose, and the game's serves
any region — which is what makes a cover added "for all regions" show up on a
game the catalog already brings three for.

A `.meta/<system>` folder is listed once per system and open folder, which is
what makes it affordable to ask this for every game that is looked at.
