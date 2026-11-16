/** Small encoders that follow the IPS / BPS / UPS specs, so no third-party patch is committed. */
import { crc32 } from './patch';

export const bytes = (...parts: Array<string | number[] | Uint8Array>): Uint8Array =>
  new Uint8Array(parts.flatMap((p) => (typeof p === 'string' ? [...p].map((c) => c.charCodeAt(0)) : [...p])));

export const u32 = (n: number): number[] => [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff];

export const vlq = (input: number): number[] => {
  let value = input;
  const out: number[] = [];
  for (;;) {
    const x = value & 0x7f;
    value = Math.floor(value / 128);
    if (value === 0) {
      out.push(0x80 | x);
      break;
    }
    out.push(x);
    value--;
  }
  return out;
};

/** Appends the source, target and patch CRC32s a BPS / UPS ends with. */
export const seal = (body: number[], source: Uint8Array, target: Uint8Array): Uint8Array => {
  const withCrcs = [...body, ...u32(crc32(source)), ...u32(crc32(target))];
  return new Uint8Array([...withCrcs, ...u32(crc32(new Uint8Array(withCrcs)))]);
};

/** A UPS that turns `source` into `target` (same length or longer). */
export function makeUps(source: Uint8Array, target: Uint8Array): Uint8Array {
  const body = [...bytes('UPS1'), ...vlq(source.length), ...vlq(target.length)];
  const xor = (i: number) => ((source[i] ?? 0) ^ target[i]) & 0xff;
  let pos = 0;
  for (let i = 0; i < target.length; i++) {
    if (!xor(i)) continue;
    body.push(...vlq(i - pos));
    let j = i;
    while (j < target.length && xor(j)) body.push(xor(j++));
    body.push(0); // ends the run, and stands for position j (unchanged)
    pos = j + 1;
    i = j;
  }
  return seal(body, source, target);
}
