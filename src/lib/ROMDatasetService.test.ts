import { describe, expect, it, vi } from 'vitest';
import { ROMDatasetService } from './ROMDatasetService';

describe('ROMDatasetService set matching', () => {
  it('identifies an arcade set by member CRC32s', async () => {
    // Mock getMetaRecord to return a dataset with sets
    vi.spyOn(ROMDatasetService as any, 'getMetaRecord').mockImplementation(async (system: unknown) => {
      if (system === 'NEOGEO') {
        return {
          media: 'cartridge',
          record: {
            sets: {
              garou: {
                title: 'Garou - Mark of the Wolves (NGM-2530)',
                cover: 'https://example.com/garou.png',
                members: ['98BC93DC', 'EA3171A4', '382F704B', 'E395BFDD'],
              },
              mslug: {
                title: 'Metal Slug',
                members: ['11111111', '22222222'],
              },
            },
          },
        };
      }
      return {};
    });

    const match = await ROMDatasetService.lookupSetByMemberCrcs(
      ['NEOGEO'],
      ['ea3171a4', '382f704b', 'e395bfdd', '98bc93dc'],
    );

    expect(match).toBeDefined();
    expect(match?.system).toBe('NEOGEO');
    expect(match?.setKey).toBe('garou');
    expect(match?.title).toBe('Garou - Mark of the Wolves (NGM-2530)');
    expect(match?.cover).toBe('https://example.com/garou.png');

    vi.restoreAllMocks();
  });

  it('returns undefined when member CRCs do not match any set', async () => {
    vi.spyOn(ROMDatasetService as any, 'getMetaRecord').mockImplementation(async () => ({
      media: 'cartridge',
      record: { sets: {} },
    }));

    const match = await ROMDatasetService.lookupSetByMemberCrcs(['NEOGEO'], ['FFFFFFFF']);
    expect(match).toBeUndefined();

    vi.restoreAllMocks();
  });
});
