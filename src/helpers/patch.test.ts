import { describe, expect, it } from 'vitest';
import { applyPatch, crc32, crcHex, formatOf, isPatchName, modNameOf, parsePatch, PatchError } from './patch';
import { bytes, makeUps, seal, vlq } from './patch.test-helper';

const rom = Uint8Array.from({ length: 64 }, (_, i) => i);

const codeOf = (run: () => unknown): string | undefined => {
  try {
    run();
  } catch (err) {
    return err instanceof PatchError ? err.code : 'other';
  }
  return undefined;
};

describe('patch', () => {
  it('crc32 matches the standard check value', () => {
    expect(crc32(bytes('123456789'))).toBe(0xcbf43926);
    expect(crcHex(0xcbf43926)).toBe('CBF43926');
    expect(crcHex(0x1)).toBe('00000001');
  });

  it('tells formats apart by their magic', () => {
    expect(formatOf(bytes('PATCH', 'EOF'))).toBe('ips');
    expect(formatOf(bytes('BPS1', new Array(12).fill(0)))).toBe('bps');
    expect(formatOf(bytes('UPS1', new Array(12).fill(0)))).toBe('ups');
    expect(formatOf(bytes('hello world!!!!!'))).toBeNull();
    expect(codeOf(() => parsePatch(bytes('nope')))).toBe('not-a-patch');
  });

  it('names: extensions and display names', () => {
    expect(isPatchName('Hack.BPS')).toBe(true);
    expect(isPatchName('game.bin')).toBe(false);
    expect(modNameOf('mods/Sonic 2 Delta.ips')).toBe('Sonic 2 Delta');
    expect(modNameOf('readme')).toBe('readme');
  });

  it('IPS: records, RLE, growth and truncation', () => {
    const ips = bytes('PATCH', [0, 0, 2], [0, 2], [0xaa, 0xbb], [0, 0, 10], [0, 0], [0, 3], [0xcc], [0, 0, 70], [0, 1], [0xdd], 'EOF');
    const out = applyPatch(rom, ips);
    expect(out.length).toBe(71);
    expect([...out.subarray(0, 5)]).toEqual([0, 1, 0xaa, 0xbb, 4]);
    expect([...out.subarray(10, 14)]).toEqual([0xcc, 0xcc, 0xcc, 13]);
    expect(out[70]).toBe(0xdd);
    expect(rom[2]).toBe(2); // the stored ROM is never touched
    const truncated = bytes('PATCH', [0, 0, 0], [0, 1], [9], 'EOF', [0, 0, 32]);
    expect(applyPatch(rom, truncated).length).toBe(32);
    expect(parsePatch(truncated)).toMatchObject({ format: 'ips', sourceCrc: null, valid: true });
  });

  it('IPS: a patch without EOF is refused', () => {
    expect(codeOf(() => applyPatch(rom, bytes('PATCH', [0, 0, 0], [0, 1], [9])))).toBe('truncated');
  });

  it('BPS: all four actions, CRCs verified', () => {
    const target = new Uint8Array(70);
    target.set(rom.subarray(0, 8), 0);
    target.set([0xf0, 0xf1, 0xf2], 8);
    target.set(rom.subarray(40, 50), 11);
    target.set(target.subarray(8, 11), 21);
    target.set(rom.subarray(24, 64), 24);
    target.set(Array(6).fill(0xee), 64);
    const action = (cmd: number, len: number) => vlq(((len - 1) << 2) | cmd);
    const rel = (d: number) => vlq((Math.abs(d) << 1) | (d < 0 ? 1 : 0));
    const body = [
      ...bytes('BPS1'), ...vlq(rom.length), ...vlq(target.length), ...vlq(0),
      ...action(0, 8),
      ...action(1, 3), 0xf0, 0xf1, 0xf2,
      ...action(2, 10), ...rel(40),
      ...action(3, 3), ...rel(8),
      ...action(0, 40),
      ...action(1, 6), ...Array(6).fill(0xee),
    ];
    const bps = seal(body, rom, target);
    const info = parsePatch(bps);
    expect(info).toMatchObject({ format: 'bps', sourceCrc: crc32(rom), targetCrc: crc32(target), sourceSize: 64, targetSize: 70, valid: true });
    expect(applyPatch(rom, bps)).toEqual(target);

    const other = rom.slice();
    other[0] = 99;
    expect(codeOf(() => applyPatch(other, bps))).toBe('wrong-source');
    const damaged = bps.slice();
    damaged[8] ^= 1;
    expect(parsePatch(damaged).valid).toBe(false);
    expect(codeOf(() => applyPatch(rom, damaged))).toBe('damaged');
  });

  it('UPS: XOR runs, growth, CRCs verified', () => {
    const target = new Uint8Array(68);
    target.set(rom);
    target[5] = 0x55;
    target[6] = 0x66;
    target[66] = 0x77;
    const ups = makeUps(rom, target);
    expect(parsePatch(ups)).toMatchObject({ format: 'ups', sourceCrc: crc32(rom), valid: true });
    expect(applyPatch(rom, ups)).toEqual(target);
  });

  it('a result that is not the promised one is refused', () => {
    const target = rom.slice();
    target[1] = 0x99;
    const ups = makeUps(rom, target);
    // Same patch body, but the target CRC sealed for a different result.
    const wrong = seal([...ups.subarray(0, ups.length - 12)], rom, rom);
    expect(codeOf(() => applyPatch(rom, wrong))).toBe('wrong-result');
  });
});
