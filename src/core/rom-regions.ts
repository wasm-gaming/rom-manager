/**
 * The three regions the app reasons in, and the video standards they run.
 *
 * A DAT names regions one way and the app another. No-Intro and Redump write
 * every market a release shipped to — `Europe`, `USA`, `Japan`, but also
 * `Brazil`, `Scandinavia`, `Hong Kong` — while a boxart, a badge and a
 * preference only ever need to say EU, US or JP. This module is the one place
 * that translation lives.
 *
 * `World` is not a fourth region: a world release ships to all three at once,
 * which is exactly what makes a preference order worth having.
 *
 * Pure TypeScript, and shared with the dataset build: the region a published
 * boxart belongs to has to be read the same way there and here.
 */

/** Region of a release, and of the boxart that belongs to it. */
export type Region = 'EU' | 'US' | 'JP';

export type VideoStandard = 'PAL' | 'NTSC';

/**
 * Key the dataset files a boxart under when its published name says no region.
 *
 * A quarter of the published names carry no region tag, and the boxart of a
 * game none of whose releases were matched is worth keeping even when nobody
 * can say which region it is the box of.
 */
export const ANY_REGION = '*';

export function isRegion(value: string): value is Region {
  return value === 'EU' || value === 'US' || value === 'JP';
}

/** Order regions are listed in, so a badge row never reshuffles. */
export const REGIONS: readonly Region[] = ['EU', 'US', 'JP'];

/** Order standards are listed in. */
const STANDARD_ORDER: readonly VideoStandard[] = ['PAL', 'NTSC'];

/**
 * Region and video standard of every region name a DAT uses.
 *
 * The standard is the one the release itself runs at rather than the one its
 * country broadcasts, because what matters for a ROM is whether it is a 50 Hz
 * or a 60 Hz build. That is why `Hong Kong` is NTSC — a PAL country whose
 * consoles shipped NTSC-J — and why `Argentina`, whose PAL-N is 50 Hz, is PAL
 * while sitting in the American market.
 *
 * `World` is deliberately absent: it maps to every region and is handled apart.
 * `Unknown` is absent too — a release nobody could place says nothing about its
 * region, and guessing one would be worse than showing none.
 */
const DAT_REGIONS = new Map<string, { region: Region; video: VideoStandard }>([
  // Europe, and the countries that took the European release
  ['Europe', { region: 'EU', video: 'PAL' }],
  ['Austria', { region: 'EU', video: 'PAL' }],
  ['Belgium', { region: 'EU', video: 'PAL' }],
  ['Bulgaria', { region: 'EU', video: 'PAL' }],
  ['Croatia', { region: 'EU', video: 'PAL' }],
  ['Czech', { region: 'EU', video: 'PAL' }],
  ['Denmark', { region: 'EU', video: 'PAL' }],
  ['Estonia', { region: 'EU', video: 'PAL' }],
  ['Finland', { region: 'EU', video: 'PAL' }],
  ['France', { region: 'EU', video: 'PAL' }],
  ['Germany', { region: 'EU', video: 'PAL' }],
  ['Greece', { region: 'EU', video: 'PAL' }],
  ['Hungary', { region: 'EU', video: 'PAL' }],
  ['Ireland', { region: 'EU', video: 'PAL' }],
  ['Italy', { region: 'EU', video: 'PAL' }],
  ['Latvia', { region: 'EU', video: 'PAL' }],
  ['Lithuania', { region: 'EU', video: 'PAL' }],
  ['Netherlands', { region: 'EU', video: 'PAL' }],
  ['Norway', { region: 'EU', video: 'PAL' }],
  ['Poland', { region: 'EU', video: 'PAL' }],
  ['Portugal', { region: 'EU', video: 'PAL' }],
  ['Romania', { region: 'EU', video: 'PAL' }],
  ['Russia', { region: 'EU', video: 'PAL' }],
  ['Scandinavia', { region: 'EU', video: 'PAL' }],
  ['Serbia', { region: 'EU', video: 'PAL' }],
  ['Slovakia', { region: 'EU', video: 'PAL' }],
  ['Slovenia', { region: 'EU', video: 'PAL' }],
  ['Spain', { region: 'EU', video: 'PAL' }],
  ['Sweden', { region: 'EU', video: 'PAL' }],
  ['Switzerland', { region: 'EU', video: 'PAL' }],
  ['Turkey', { region: 'EU', video: 'PAL' }],
  ['UK', { region: 'EU', video: 'PAL' }],
  ['Ukraine', { region: 'EU', video: 'PAL' }],
  ['United Kingdom', { region: 'EU', video: 'PAL' }],
  // PAL territories served by the European release rather than by one of their own
  ['Australia', { region: 'EU', video: 'PAL' }],
  ['New Zealand', { region: 'EU', video: 'PAL' }],
  ['India', { region: 'EU', video: 'PAL' }],
  ['Israel', { region: 'EU', video: 'PAL' }],
  ['South Africa', { region: 'EU', video: 'PAL' }],

  // The Americas
  ['USA', { region: 'US', video: 'NTSC' }],
  ['Canada', { region: 'US', video: 'NTSC' }],
  ['Mexico', { region: 'US', video: 'NTSC' }],
  ['Chile', { region: 'US', video: 'NTSC' }],
  ['Peru', { region: 'US', video: 'NTSC' }],
  ['Latin America', { region: 'US', video: 'NTSC' }],
  // PAL-M is 60 Hz, so a Brazilian build runs like an NTSC one.
  ['Brazil', { region: 'US', video: 'NTSC' }],
  // PAL-N is 50 Hz, so an Argentinian build does not.
  ['Argentina', { region: 'US', video: 'PAL' }],

  // Japan and the territories that took the Japanese release
  ['Japan', { region: 'JP', video: 'NTSC' }],
  ['Asia', { region: 'JP', video: 'NTSC' }],
  ['China', { region: 'JP', video: 'NTSC' }],
  ['Hong Kong', { region: 'JP', video: 'NTSC' }],
  ['Korea', { region: 'JP', video: 'NTSC' }],
  ['Singapore', { region: 'JP', video: 'NTSC' }],
  ['Taiwan', { region: 'JP', video: 'NTSC' }],
  ['Thailand', { region: 'JP', video: 'NTSC' }],
]);

/** The DAT name for a release that shipped to every region at once. */
const WORLD = 'World';

/**
 * The regions a release covers, read from the region names of its DAT entry.
 *
 * A world release covers all three; anything the table does not place — an
 * `Unknown` region, or no region tag at all — covers none, and a release with
 * no region is what the preference order then has nothing to say about.
 */
export function regionsOf(datRegions: readonly string[]): Region[] {
  const found = new Set<Region>();

  for (const name of datRegions) {
    if (name === WORLD) {
      for (const region of REGIONS) found.add(region);
      continue;
    }

    const known = DAT_REGIONS.get(name);
    if (known) found.add(known.region);
  }

  return REGIONS.filter((region) => found.has(region));
}

/**
 * The video standards a release runs at.
 *
 * A world release runs both, and so does a multi-region one that spans a 50 Hz
 * and a 60 Hz market: `(USA, Europe)` is a single entry in the DAT but two
 * builds in practice, and saying only one of them would be wrong.
 */
export function videoStandardsOf(datRegions: readonly string[]): VideoStandard[] {
  const found = new Set<VideoStandard>();

  for (const name of datRegions) {
    if (name === WORLD) {
      for (const standard of STANDARD_ORDER) found.add(standard);
      continue;
    }

    const known = DAT_REGIONS.get(name);
    if (known) found.add(known.video);
  }

  return STANDARD_ORDER.filter((standard) => found.has(standard));
}

/**
 * The orders a user can ask boxarts to be preferred in.
 *
 * Every permutation of the three, with EU/US/JP first because it is the
 * default. They are listed rather than generated so the menu keeps this order.
 */
export const REGION_ORDERS: readonly (readonly Region[])[] = [
  ['EU', 'US', 'JP'],
  ['US', 'EU', 'JP'],
  ['EU', 'JP', 'US'],
  ['US', 'JP', 'EU'],
  ['JP', 'EU', 'US'],
  ['JP', 'US', 'EU'],
];

export const DEFAULT_REGION_ORDER = REGION_ORDERS[0];

/** `['EU', 'US', 'JP']` -> `EU/US/JP`, which is what the menu shows and stores. */
export function regionOrderKey(order: readonly Region[]): string {
  return order.join('/');
}

/**
 * A stored or chosen order, or the default when it is not a permutation of the
 * three regions.
 *
 * Settings live in a file the user can edit, so an order with a region missing,
 * repeated or misspelled has to resolve to something usable rather than leave
 * the browser with no way to pick a boxart.
 */
export function parseRegionOrder(value: unknown): readonly Region[] {
  const names = typeof value === 'string' ? value.split('/') : value;
  if (!Array.isArray(names)) return DEFAULT_REGION_ORDER;

  const order = REGION_ORDERS.find(
    (candidate) =>
      candidate.length === names.length && candidate.every((region, at) => region === names[at]),
  );

  return order ?? DEFAULT_REGION_ORDER;
}
