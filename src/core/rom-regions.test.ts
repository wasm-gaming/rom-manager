import { describe, expect, it } from 'vitest';
import {
  DEFAULT_REGION_ORDER,
  REGION_ORDERS,
  parseRegionOrder,
  regionOrderKey,
  regionsOf,
  videoStandardsOf,
} from './rom-regions';

describe('regionsOf', () => {
  it('reads the three regions from the names the DAT uses', () => {
    expect(regionsOf(['Europe'])).toEqual(['EU']);
    expect(regionsOf(['USA'])).toEqual(['US']);
    expect(regionsOf(['Japan'])).toEqual(['JP']);
  });

  it('places a country in the market that got its release', () => {
    expect(regionsOf(['Australia'])).toEqual(['EU']);
    expect(regionsOf(['Brazil'])).toEqual(['US']);
    expect(regionsOf(['Korea'])).toEqual(['JP']);
  });

  it('gives a world release all three regions', () => {
    // Which is what makes the preference order matter for it: one file, and
    // three boxes it could be shown as.
    expect(regionsOf(['World'])).toEqual(['EU', 'US', 'JP']);
  });

  it('keeps every region of a multi-region release', () => {
    expect(regionsOf(['USA', 'Europe'])).toEqual(['EU', 'US']);
  });

  it('always lists regions in the same order', () => {
    expect(regionsOf(['Japan', 'USA', 'Europe'])).toEqual(regionsOf(['Europe', 'Japan', 'USA']));
  });

  it('places nothing it cannot place', () => {
    // A guessed region would be worse than none: it decides which box shows.
    expect(regionsOf(['Unknown'])).toEqual([]);
    expect(regionsOf([])).toEqual([]);
    expect(regionsOf(['Neptune'])).toEqual([]);
  });
});

describe('videoStandardsOf', () => {
  it('reads the standard the release runs at', () => {
    expect(videoStandardsOf(['Europe'])).toEqual(['PAL']);
    expect(videoStandardsOf(['USA'])).toEqual(['NTSC']);
    expect(videoStandardsOf(['Japan'])).toEqual(['NTSC']);
  });

  it('follows the console release and not the broadcast standard', () => {
    // Hong Kong broadcast PAL and its consoles were NTSC-J; Brazil's PAL-M is
    // 60 Hz while Argentina's PAL-N is 50.
    expect(videoStandardsOf(['Hong Kong'])).toEqual(['NTSC']);
    expect(videoStandardsOf(['Brazil'])).toEqual(['NTSC']);
    expect(videoStandardsOf(['Argentina'])).toEqual(['PAL']);
  });

  it('gives both standards to a release that spans a 50 Hz and a 60 Hz market', () => {
    expect(videoStandardsOf(['USA', 'Europe'])).toEqual(['PAL', 'NTSC']);
    expect(videoStandardsOf(['World'])).toEqual(['PAL', 'NTSC']);
  });

  it('says nothing for a release it cannot place', () => {
    expect(videoStandardsOf(['Unknown'])).toEqual([]);
  });
});

describe('region orders', () => {
  it('offers every permutation of the three, EU/US/JP first', () => {
    expect(REGION_ORDERS).toHaveLength(6);
    expect(new Set(REGION_ORDERS.map(regionOrderKey)).size).toBe(6);
    expect(regionOrderKey(DEFAULT_REGION_ORDER)).toBe('EU/US/JP');
  });

  it('reads back an order it wrote', () => {
    for (const order of REGION_ORDERS) {
      expect(parseRegionOrder(regionOrderKey(order))).toEqual(order);
      expect(parseRegionOrder(order)).toEqual(order);
    }
  });

  it('falls back to the default for anything that is not an order', () => {
    // The settings live in a file the user can edit by hand.
    expect(parseRegionOrder('EU/US')).toEqual(DEFAULT_REGION_ORDER);
    expect(parseRegionOrder(['EU', 'EU', 'JP'])).toEqual(DEFAULT_REGION_ORDER);
    expect(parseRegionOrder('europe first')).toEqual(DEFAULT_REGION_ORDER);
    expect(parseRegionOrder(undefined)).toEqual(DEFAULT_REGION_ORDER);
  });
});
