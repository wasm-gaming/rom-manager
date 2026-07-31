/**
 * Grouping of DAT entries into games and variants.
 *
 * A DAT is a flat list of releases: `Sonic (USA)`, `Sonic (Europe)`,
 * `Sonic (Japan) (Rev 1)` are three separate entries of the same game. This
 * module turns that flat list into one entry per game, each holding the
 * variants the catalogue knows about, which is what both the library view and
 * the canonical file layout are built on.
 *
 * Pure TypeScript: no DOM, no Node. The whole module is deterministic so the
 * same DAT always produces the same folder and file names.
 *
 * Grouping is done by base title. The alternative, following the `cloneOf`
 * field of parent-clone DATs, is not available: no DAT published by
 * libretro-database carries it.
 */

import { regionsOf, videoStandardsOf, type Region, type VideoStandard } from './rom-regions';

/** A single entry of a DAT, as stored in the generated datasets. */
export interface DatGame {
  name: string;
  fileName?: string;
  size?: number;
  crc: string;
  md5?: string;
  sha1?: string;
  region?: string;
  videoStandard?: string;
  cover?: string;
}

/** The pieces a No-Intro/Redump name is made of. */
export interface ParsedName {
  /** Title with every tag removed, still in its original DAT spelling. */
  title: string;
  /** `(USA, Europe)` becomes `['USA', 'Europe']`. */
  regions: string[];
  /** `(En,Fr,De)` becomes `['En', 'Fr', 'De']`. */
  languages: string[];
  /** `(Rev A)` becomes `revA`, `(v1.1)` becomes `v11`. */
  revision?: string;
  /** `(Beta 2)` becomes `beta2`. */
  flags: string[];
  /** Tags this module could not interpret, such as `Virtual Console`. */
  extras: string[];
  /** `(Disc 2)` becomes `2`. Discs are parts of one release, not variants. */
  disc?: number;
  /** Every tag as it appeared, in order. */
  tags: string[];
}

/** One release of a game, made of one file or of several discs. */
export interface GameVariant {
  /** Identifier used in file and folder names. Unique inside its group. */
  key: string;
  /** Region names as the DAT spells them, which is what the key is built from. */
  datRegions: string[];
  /** Regions this release ships to. A world release ships to all three. */
  regions: Region[];
  /** Video standards it runs at, both when it spans a 50 Hz and a 60 Hz market. */
  videoStandards: VideoStandard[];
  languages: string[];
  revision?: string;
  flags: string[];
  /** Sorted by disc number. Holds more than one entry only for multi-disc releases. */
  files: DatGame[];
}

/** A game and every variant of it the DAT lists. */
export interface GameGroup {
  /** Sanitized base title. Used as the file or folder name on disk. */
  id: string;
  /** Base title in its original DAT spelling, for display. */
  title: string;
  variants: GameVariant[];
}

/**
 * Regions No-Intro and Redump use.
 *
 * Needed because the `region` field of the DAT is unreliable — it is missing
 * for a third of the NES entries and never carries `World` — so the region has
 * to be read from the name, and that means telling a region tag apart from the
 * ~2000 other tags in circulation (`Virtual Console`, `Limited Run Games`,
 * `Sega Channel`...).
 */
const REGIONS = new Set([
  'Argentina', 'Asia', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Bulgaria',
  'Canada', 'Chile', 'China', 'Croatia', 'Czech', 'Denmark', 'Estonia',
  'Europe', 'Finland', 'France', 'Germany', 'Greece', 'Hong Kong', 'Hungary',
  'India', 'Ireland', 'Israel', 'Italy', 'Japan', 'Korea', 'Latin America',
  'Latvia', 'Lithuania', 'Mexico', 'Netherlands', 'New Zealand', 'Norway',
  'Peru', 'Poland', 'Portugal', 'Romania', 'Russia', 'Scandinavia',
  'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'Spain',
  'Sweden', 'Switzerland', 'Taiwan', 'Thailand', 'Turkey', 'UK', 'Ukraine',
  'United Kingdom', 'Unknown', 'USA', 'World',
]);

/** Tags that mark a release as something other than a plain retail one. */
const FLAGS = new Set([
  'Beta', 'Proto', 'Prototype', 'Demo', 'Sample', 'Unl', 'Aftermarket',
  'Pirate', 'Alt', 'Debug', 'Kiosk', 'Program', 'Test Program',
]);

/** Base names Windows refuses regardless of extension. */
const RESERVED_NAMES = new Set([
  'CON', 'PRN', 'AUX', 'NUL',
  'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
  'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9',
]);

/** Longest file or folder name produced, leaving room for extensions. */
const MAX_NAME_LENGTH = 120;

/** Longest an unrecognized tag may grow inside a variant key. */
const SLUG_LENGTH = 24;

/**
 * Characters libretro replaces with `_` in its thumbnail file names.
 *
 * Reused verbatim so a name sanitized here matches the published boxart, and
 * so the result is safe on FAT32/exFAT, which is what MiSTer runs on.
 */
const UNSAFE_CHARACTERS = /[&*/:`<>?\\|"]/g;

const ROMAN_NUMERAL_PATTERN =
  /\b(XXX|XXIX|XXVIII|XXVII|XXVI|XXV|XXIV|XXIII|XXII|XXI|XX|XIX|XVIII|XVII|XVI|XV|XIV|XIII|XII|XI|X|IX|VIII|VII|VI|V|IV|III|II)\b/g;

const ROMAN_TO_ARABIC: Record<string, string> = {
  XXX: '30',
  XXIX: '29',
  XXVIII: '28',
  XXVII: '27',
  XXVI: '26',
  XXV: '25',
  XXIV: '24',
  XXIII: '23',
  XXII: '22',
  XXI: '21',
  XX: '20',
  XIX: '19',
  XVIII: '18',
  XVII: '17',
  XVI: '16',
  XV: '15',
  XIV: '14',
  XIII: '13',
  XII: '12',
  XI: '11',
  X: '10',
  IX: '9',
  VIII: '8',
  VII: '7',
  VI: '6',
  V: '5',
  IV: '4',
  III: '3',
  II: '2',
};

/**
 * Convert standalone Roman numerals (II through XXX) to Arabic numerals.
 */
export function normalizeRomanNumerals(text: string): string {
  return text.replace(ROMAN_NUMERAL_PATTERN, (match) => ROMAN_TO_ARABIC[match] ?? match);
}

/**
 * Apply the libretro sanitization to a name.
 *
 * Exported because boxart lookup has to sanitize the full DAT name the same
 * way this module sanitizes the base title.
 */
export function sanitizeName(name: string): string {
  return name.normalize('NFC').replace(UNSAFE_CHARACTERS, '_');
}

/**
 * Split a DAT name into the title and the tags that follow it.
 *
 * Tags are read from the end of the name backwards, because they are always a
 * suffix and each one is well formed. Reading forwards instead would break on
 * `Odekake Lester - Lelele no Le (^^; (Japan)`, where an emoticon opens a
 * parenthesis that never closes and would swallow the real tags.
 */
function splitTags(name: string): { title: string; tags: string[] } {
  const tags: string[] = [];
  let end = name.length;

  for (;;) {
    const head = name.slice(0, end).trimEnd();
    const close = head.length - 1;
    const opening = head[close] === ')' ? '(' : head[close] === ']' ? '[' : null;
    if (!opening) break;

    const open = head.lastIndexOf(opening, close);
    // A tag is a separate word: `Le (^^;` must not be read as one.
    if (open <= 0 || !/\s/.test(head[open - 1])) break;

    tags.unshift(head.slice(open + 1, close).trim());
    end = open;
  }

  return { title: name.slice(0, end).trim(), tags: tags.filter(Boolean) };
}

/** `(En,Fr,De)`: two-letter codes joined by commas, no spaces. */
function asLanguages(tag: string): string[] | null {
  return /^[A-Z][a-z](,[A-Z][a-z])*$/.test(tag) ? tag.split(',') : null;
}

/**
 * `(USA, Europe)`: region names joined by a comma and a space.
 *
 * The separator is what tells regions from languages: the DAT writes
 * `USA, Europe` with a space and `En,Fr` without one.
 */
function asRegions(tag: string): string[] | null {
  const parts = tag.split(', ');
  return parts.every((part) => REGIONS.has(part)) ? parts : null;
}

/** `(Rev A)` and `(v1.1)`, flattened into something usable in a file name. */
function asRevision(tag: string): string | null {
  const revision = tag.match(/^Rev\s+([0-9A-Za-z.]+)$/);
  if (revision) return `rev${revision[1].replace(/\./g, '')}`;

  const version = tag.match(/^v([0-9][0-9A-Za-z.]*)$/);
  if (version) return `v${version[1].replace(/\./g, '')}`;

  return null;
}

/** `(Beta)`, `(Beta 2)`, `(Proto 1)`. */
function asFlag(tag: string): string | null {
  const match = tag.match(/^([A-Za-z][A-Za-z ]*?)(?:\s+(\d+))?$/);
  if (!match || !FLAGS.has(match[1])) return null;

  return `${match[1].toLowerCase().replace(/ /g, '')}${match[2] ?? ''}`;
}

/** `(Disc 2)`, and the `(Disc 2 of 3)` spelling Redump also uses. */
function asDisc(tag: string): number | null {
  const match = tag.match(/^Disc\s+(\d+)(?:\s+of\s+\d+)?$/i);
  return match ? Number(match[1]) : null;
}

/**
 * Break a DAT name into title, regions, languages, revision, flags and disc.
 *
 * Tags that match none of those are left in `tags` only: the vocabulary in the
 * wild is far too large to enumerate, so unknown tags never take part in the
 * variant identity and are handled by the checksum suffix when they turn out
 * to distinguish two releases.
 */
export function parseGameName(name: string): ParsedName {
  const { title, tags } = splitTags(name);

  const parsed: ParsedName = {
    title,
    regions: [],
    languages: [],
    flags: [],
    extras: [],
    tags,
  };

  for (const tag of tags) {
    const regions = asRegions(tag);
    if (regions && parsed.regions.length === 0) {
      parsed.regions = regions;
      continue;
    }

    const languages = asLanguages(tag);
    if (languages && parsed.languages.length === 0) {
      parsed.languages = languages;
      continue;
    }

    const revision = asRevision(tag);
    if (revision && !parsed.revision) {
      parsed.revision = revision;
      continue;
    }

    const disc = asDisc(tag);
    if (disc !== null && parsed.disc === undefined) {
      parsed.disc = disc;
      continue;
    }

    const flag = asFlag(tag);
    if (flag) parsed.flags.push(flag);
    else parsed.extras.push(tag);
  }

  return parsed;
}

/**
 * Turn a DAT name into the name its file or folder takes on disk.
 *
 * The result keeps the No-Intro spelling, articles included
 * (`Legend of Zelda, The`), so it stays sortable and recognizable next to any
 * other tool that reads the same catalogues.
 */
export function normalizeGameName(name: string): string {
  const { title } = splitTags(name);

  let normalized = sanitizeName(title).replace(/\s+/g, ' ').trim();

  if (normalized.length > MAX_NAME_LENGTH) {
    const cut = normalized.slice(0, MAX_NAME_LENGTH);
    const boundary = cut.lastIndexOf(' ');
    normalized = (boundary > 0 ? cut.slice(0, boundary) : cut).trim();
  }

  // FAT32 and NTFS both drop trailing dots and spaces silently, which would
  // make the name written differ from the name looked up.
  normalized = normalized.replace(/[. ]+$/, '');

  if (RESERVED_NAMES.has(normalized.toUpperCase())) return `_${normalized}`;

  return normalized || '_';
}

/** First 8 hex digits of the CRC32, the tie-breaker for colliding variants. */
function checksumSuffix(game: DatGame): string {
  return game.crc.toUpperCase().slice(0, 8);
}

/**
 * Condense an unrecognized tag into something usable in a file name.
 *
 * `Retro-Bit Generations` becomes `retrobitgenerations`. Separators are
 * dropped rather than kept so the result cannot be mistaken for the `-` that
 * joins the parts of a key, and whole words are dropped rather than cut, so a
 * long tag ends at `squaresoftonplaystation` instead of mid-word.
 */
function slug(tag: string): string {
  const words = tag.toLowerCase().match(/[a-z0-9]+/g);
  if (!words) return '';

  let result = '';
  for (const word of words) {
    if (result.length + word.length > SLUG_LENGTH) break;
    result += word;
  }

  return result || words[0].slice(0, SLUG_LENGTH);
}

/**
 * Build the identifier of a variant.
 *
 * The extra parts are only asked for when the shorter form is not enough to
 * tell two releases of the same game apart, so the common case stays readable:
 * `USA`, `Japan-rev1`, `Europe-beta2`.
 */
export function variantKey(
  parsed: ParsedName,
  options: { languages?: boolean; extras?: boolean; checksum?: string } = {},
): string {
  const parts = [parsed.regions.length > 0 ? parsed.regions.join('+') : 'Unknown'];

  if (parsed.revision) parts.push(parsed.revision);
  parts.push(...parsed.flags);
  if (options.languages && parsed.languages.length > 0) parts.push(parsed.languages.join('+'));
  if (options.extras) parts.push(...parsed.extras.map(slug).filter(Boolean));
  if (options.checksum) parts.push(options.checksum);

  return parts.join('-');
}

/**
 * Regions carried by the DAT's own field, used when the name has no region tag.
 */
function datRegionsOf(parsed: ParsedName, game: DatGame): string[] {
  if (parsed.regions.length > 0) return parsed.regions;
  return game.region ? [game.region] : [];
}

/**
 * Identity of the release an entry belongs to.
 *
 * A DAT lists one entry per file, so a single release shows up several times:
 * once per disc for Redump sets, and once per chip or track whenever a game
 * ships as more than one file. All of those share the same name except for the
 * disc tag, which is therefore the only one dropped here.
 *
 * Deriving this from the raw name rather than from the parsed fields matters:
 * the tag vocabulary is open-ended, and two entries differing by a tag this
 * module does not recognize are different releases, not one release split in
 * two files.
 */
function releaseKey(parsed: ParsedName): string {
  return [parsed.title, ...parsed.tags.filter((tag) => asDisc(tag) === null)].join('\u0000');
}

interface Draft {
  parsed: ParsedName;
  regions: string[];
  files: DatGame[];
}

/** Bucket drafts by the key a given level of detail gives them. */
function byKey(
  drafts: Iterable<Draft>,
  options: { languages?: boolean; extras?: boolean },
): Map<string, Draft[]> {
  const buckets = new Map<string, Draft[]>();

  for (const draft of drafts) {
    const key = variantKey({ ...draft.parsed, regions: draft.regions }, options);
    const bucket = buckets.get(key);
    if (bucket) bucket.push(draft);
    else buckets.set(key, [draft]);
  }

  return buckets;
}

/**
 * Merge the entries of one game into variants, then name each variant.
 *
 * The files of a release are merged first, because `Final Fantasy VII (Europe)
 * (Disc 1..3)` is one variant made of three files, not three variants. Only
 * after that can two entries sharing a key be called a collision and be
 * disambiguated.
 */
function buildVariants(entries: Array<{ parsed: ParsedName; game: DatGame }>): GameVariant[] {
  const drafts = new Map<string, Draft>();

  for (const { parsed, game } of entries) {
    const key = releaseKey(parsed);
    const draft = drafts.get(key);

    if (draft) {
      draft.files.push(game);
    } else {
      drafts.set(key, { parsed, regions: datRegionsOf(parsed, game), files: [game] });
    }
  }

  for (const draft of drafts.values()) {
    draft.files.sort((a, b) => {
      const discs = (parseGameName(a.name).disc ?? 0) - (parseGameName(b.name).disc ?? 0);
      return discs !== 0 ? discs : (a.fileName ?? a.name).localeCompare(b.fileName ?? b.name);
    });
  }

  // Each disambiguating part is added only where the shorter key is ambiguous,
  // and always to every variant of the clash so the outcome does not depend on
  // the order the DAT happens to list them in.
  const variants: GameVariant[] = [];

  for (const clash of byKey(drafts.values(), {}).values()) {
    const languages = clash.length > 1;

    for (const longer of byKey(clash, { languages }).values()) {
      const extras = longer.length > 1;

      for (const longest of byKey(longer, { languages, extras }).values()) {
        const checksum = longest.length > 1;

        for (const draft of longest) {
          variants.push({
            key: variantKey({ ...draft.parsed, regions: draft.regions }, {
              languages,
              extras,
              checksum: checksum ? checksumSuffix(draft.files[0]) : undefined,
            }),
            datRegions: draft.regions,
            regions: regionsOf(draft.regions),
            videoStandards: videoStandardsOf(draft.regions),
            languages: draft.parsed.languages,
            revision: draft.parsed.revision,
            flags: draft.parsed.flags,
            files: draft.files,
          });
        }
      }
    }
  }

  return variants.sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Group a whole DAT into games.
 *
 * Games whose titles sanitize to the same name are kept apart by a checksum
 * suffix, so two different games can never end up sharing a folder.
 */
export function groupDatGames(games: DatGame[]): GameGroup[] {
  const byTitle = new Map<string, Array<{ parsed: ParsedName; game: DatGame }>>();

  for (const game of games) {
    const parsed = parseGameName(game.name);
    const rawId = normalizeGameName(game.name);
    const groupKey = normalizeRomanNumerals(rawId).toLowerCase();

    const entries = byTitle.get(groupKey);
    if (entries) entries.push({ parsed, game });
    else byTitle.set(groupKey, [{ parsed, game }]);
  }

  const groups: GameGroup[] = [];

  for (const [_, entries] of byTitle) {
    // Sanitization and truncation can map two distinct titles onto one name.
    const titles = new Map<string, typeof entries>();
    for (const entry of entries) {
      const key = normalizeRomanNumerals(entry.parsed.title).toLowerCase();
      const existing = titles.get(key);
      if (existing) existing.push(entry);
      else titles.set(key, [entry]);
    }

    const collides = titles.size > 1;

    for (const [_, titleEntries] of titles) {
      const sortedTitles = Array.from(new Set(titleEntries.map((e) => e.parsed.title))).sort();
      const title = sortedTitles.find((t) => /\d/.test(t)) ?? sortedTitles[0];
      const id = normalizeGameName(title);

      groups.push({
        id: collides ? `${id}-${checksumSuffix(titleEntries[0].game)}` : id,
        title,
        variants: buildVariants(titleEntries),
      });
    }
  }

  return groups.sort((a, b) => a.id.localeCompare(b.id));
}
