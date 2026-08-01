import { describe, expect, it } from 'vitest';
import { getAllSystemsInfo, getSystemInfo } from './system-info';

describe('getSystemInfo', () => {
  it('resolves system info for canonical system names', () => {
    const nes = getSystemInfo('NES');
    expect(nes).toBeDefined();
    expect(nes?.fullName).toBe('Nintendo Entertainment System');
    expect(nes?.media).toBe('cartridge');
    expect(nes?.commonExtensions).toContain('nes');

    const snes = getSystemInfo('SNES');
    expect(snes?.fullName).toBe('Super Nintendo Entertainment System');
    expect(snes?.commonExtensions).toContain('sfc');

    const megadrive = getSystemInfo('MegaDrive');
    expect(megadrive?.fullName).toBe('Sega Mega Drive / Genesis');
    expect(megadrive?.commonExtensions).toContain('md');

    const psx = getSystemInfo('PSX');
    expect(psx?.fullName).toBe('Sony PlayStation');
    expect(psx?.media).toBe('disc');
    expect(psx?.commonExtensions).toContain('cue');
    expect(psx?.commonExtensions).toContain('chd');
  });

  it('resolves system info case-insensitively', () => {
    expect(getSystemInfo('snes')?.id).toBe('SNES');
    expect(getSystemInfo('psx')?.id).toBe('PSX');
    expect(getSystemInfo('megadrive')?.id).toBe('MegaDrive');
  });

  it('resolves system info from subfolder paths', () => {
    expect(getSystemInfo('SNES/Super Mario World')?.id).toBe('SNES');
    expect(getSystemInfo('PSX/Final Fantasy VII/Disc 1')?.id).toBe('PSX');
  });

  it('returns undefined for unknown system names or empty inputs', () => {
    expect(getSystemInfo(undefined)).toBeUndefined();
    expect(getSystemInfo('')).toBeUndefined();
    expect(getSystemInfo('UnknownConsole')).toBeUndefined();
  });
});

describe('getAllSystemsInfo', () => {
  it('returns all 24 registered systems', () => {
    const all = getAllSystemsInfo();
    expect(all.length).toBe(24);
    expect(all.map((s) => s.id)).toContain('NES');
    expect(all.map((s) => s.id)).toContain('NEOGEO');
    expect(all.map((s) => s.id)).toContain('WonderSwan');
  });
});
