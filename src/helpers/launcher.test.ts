import { describe, expect, it } from 'vitest';
import { launcherRouteOf, playUrl } from './launcher';

describe('launcher links', () => {
  it('maps systems to the launcher routes', () => {
    expect(launcherRouteOf('MegaDrive')).toBe('megadrive');
    expect(launcherRouteOf('GAMEBOY')).toBe('gba');
    expect(launcherRouteOf('GBC')).toBe('gba');
    expect(launcherRouteOf('NEOGEO')).toBe('neogeo');
    expect(launcherRouteOf('PSX')).toBeUndefined();
  });

  it('builds the play link, with the mod when there is one', () => {
    expect(playUrl({ system: 'GAMEBOY', gameId: 'tetris', crc: '46DF91AD' })).toBe(
      '/gba/?system=GAMEBOY&game=tetris&version=46df91ad',
    );
    expect(playUrl({ system: 'SNES', gameId: 'super-metroid', crc: 'D63ED5F8', patch: 'E1DE477B5900A3862B97' })).toBe(
      '/snes/?system=SNES&game=super-metroid&version=d63ed5f8&patch=e1de477b',
    );
    expect(playUrl({ system: 'PSX', gameId: 'x', crc: '00000000' })).toBeUndefined();
  });
});
