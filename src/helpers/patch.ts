/**
 * ROM-hacking patches, read and applied in memory — pure functions, no I/O.
 *
 * - IPS: records of (offset, bytes) with RLE; no checksums ("PATCH" … "EOF" [+ truncate]).
 * - BPS: byuu's delta format: source / target sizes, four copy actions, and the CRC32 of
 *   the source, the target and the patch itself.
 * - UPS: XOR of source and target, with the same three CRC32s.
 *
 * A mod never touches the stored ROM: the player gets `applyPatch(rom, patch)`.
 * Ported from play.germade's `patch.js`, so both read a patch the same way.
 */

export type PatchFormat = 'ips' | 'bps' | 'ups';

export const PATCH_EXTENSIONS: readonly string[] = ['.ips', '.bps', '.ups'];

/** Why a patch was refused. The UI turns the code into words; the message is for developers. */
export type PatchErrorCode =
  | 'not-a-patch'
  | 'truncated'
  | 'damaged'
  | 'wrong-source'
  | 'wrong-result'
  | 'out-of-bounds';

export class PatchError extends Error {
  constructor(
    readonly code: PatchErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'PatchError';
  }
}

/** What a patch says about itself. Sizes and CRCs are null for IPS, which carries none. */
export interface PatchInfo {
  format: PatchFormat;
  sourceSize: number | null;
  targetSize: number | null;
  sourceCrc: number | null;
  targetCrc: number | null;
  /** The patch's own CRC checks out (always true for IPS). */
  valid: boolean;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes: Uint8Array, start = 0, end = bytes.length): number {
  let crc = 0xffffffff;
  for (let i = start; i < end; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/** A CRC32 as the library writes it everywhere: 8 upper-case hex digits. */
export const crcHex = (crc: number): string => (crc >>> 0).toString(16).toUpperCase().padStart(8, '0');

const ascii = (bytes: Uint8Array, start: number, length: number) =>
  String.fromCharCode(...bytes.subarray(start, start + length));

const u32le = (b: Uint8Array, i: number) => (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24)) >>> 0;

/** True for a name with a patch extension. */
export function isPatchName(name: string): boolean {
  const lower = name.toLowerCase();
  return PATCH_EXTENSIONS.some((extension) => lower.endsWith(extension));
}

/** Which format a file is, from its magic; null when it is not a patch. */
export function formatOf(bytes: Uint8Array): PatchFormat | null {
  if (bytes.length >= 8 && ascii(bytes, 0, 5) === 'PATCH') return 'ips';
  if (bytes.length >= 16 && ascii(bytes, 0, 4) === 'BPS1') return 'bps';
  if (bytes.length >= 16 && ascii(bytes, 0, 4) === 'UPS1') return 'ups';
  return null;
}

/** byuu's variable-length numbers (BPS / UPS). */
class Reader {
  constructor(
    private readonly bytes: Uint8Array,
    public pos: number,
  ) {}

  byte(): number {
    if (this.pos >= this.bytes.length) throw new PatchError('truncated', 'The patch ends too early');
    return this.bytes[this.pos++];
  }

  number(): number {
    let data = 0;
    let shift = 1;
    for (;;) {
      const x = this.byte();
      data += (x & 0x7f) * shift;
      if (x & 0x80) break;
      shift *= 128;
      data += shift;
    }
    return data;
  }
}

/** What a patch says about itself, without applying it. */
export function parsePatch(bytes: Uint8Array): PatchInfo {
  const format = formatOf(bytes);
  if (!format) throw new PatchError('not-a-patch', 'Not an IPS, BPS or UPS patch');
  if (format === 'ips') {
    return { format, sourceSize: null, targetSize: null, sourceCrc: null, targetCrc: null, valid: true };
  }
  const reader = new Reader(bytes, 4);
  const sourceSize = reader.number();
  const targetSize = reader.number();
  const end = bytes.length - 12;
  return {
    format,
    sourceSize,
    targetSize,
    sourceCrc: u32le(bytes, end),
    targetCrc: u32le(bytes, end + 4),
    valid: crc32(bytes, 0, bytes.length - 4) === u32le(bytes, end + 8),
  };
}

function applyIps(rom: Uint8Array, patch: Uint8Array): Uint8Array {
  let out = new Uint8Array(rom);
  let size = rom.length;
  const grow = (needed: number) => {
    if (needed <= out.length) return;
    const bigger = new Uint8Array(Math.max(needed, out.length * 2));
    bigger.set(out);
    out = bigger;
  };
  let i = 5;
  for (;;) {
    if (i + 3 > patch.length) throw new PatchError('truncated', 'IPS without its EOF mark');
    if (ascii(patch, i, 3) === 'EOF') {
      i += 3;
      break;
    }
    if (i + 5 > patch.length) throw new PatchError('truncated', 'IPS record cut short');
    const offset = (patch[i] << 16) | (patch[i + 1] << 8) | patch[i + 2];
    const length = (patch[i + 3] << 8) | patch[i + 4];
    i += 5;
    if (length) {
      if (i + length > patch.length) throw new PatchError('truncated', 'IPS record cut short');
      grow(offset + length);
      out.set(patch.subarray(i, i + length), offset);
      i += length;
      size = Math.max(size, offset + length);
    } else {
      if (i + 3 > patch.length) throw new PatchError('truncated', 'IPS record cut short');
      const run = (patch[i] << 8) | patch[i + 1];
      const value = patch[i + 2];
      i += 3;
      grow(offset + run);
      out.fill(value, offset, offset + run);
      size = Math.max(size, offset + run);
    }
  }
  // Lunar IPS' truncate extension: three more bytes give the final size.
  if (i + 3 === patch.length) size = (patch[i] << 16) | (patch[i + 1] << 8) | patch[i + 2];
  if (size > out.length) grow(size);
  return out.slice(0, size);
}

function applyBps(rom: Uint8Array, patch: Uint8Array, info: PatchInfo): Uint8Array {
  const reader = new Reader(patch, 4);
  reader.number();
  reader.number();
  const metadata = reader.number();
  reader.pos += metadata;
  const out = new Uint8Array(info.targetSize ?? 0);
  const end = patch.length - 12;
  let outPos = 0;
  let sourceRel = 0;
  let targetRel = 0;
  const bounds = () => new PatchError('out-of-bounds', 'BPS reads or writes outside the ROM');
  while (reader.pos < end) {
    const data = reader.number();
    const command = data % 4;
    const length = Math.floor(data / 4) + 1;
    if (outPos + length > out.length) throw bounds();
    if (command === 0) {
      if (outPos + length > rom.length) throw bounds();
      out.set(rom.subarray(outPos, outPos + length), outPos);
      outPos += length;
    } else if (command === 1) {
      for (let k = 0; k < length; k++) out[outPos++] = reader.byte();
    } else {
      const d = reader.number();
      const delta = (d & 1 ? -1 : 1) * Math.floor(d / 2);
      if (command === 2) {
        sourceRel += delta;
        if (sourceRel < 0 || sourceRel + length > rom.length) throw bounds();
        for (let k = 0; k < length; k++) out[outPos++] = rom[sourceRel++];
      } else {
        targetRel += delta;
        if (targetRel < 0) throw bounds();
        for (let k = 0; k < length; k++) out[outPos++] = out[targetRel++];
      }
    }
  }
  return out;
}

function applyUps(rom: Uint8Array, patch: Uint8Array, info: PatchInfo): Uint8Array {
  const reader = new Reader(patch, 4);
  reader.number();
  reader.number();
  const out = new Uint8Array(info.targetSize ?? 0);
  out.set(rom.subarray(0, Math.min(rom.length, out.length)));
  const end = patch.length - 12;
  let pos = 0;
  while (reader.pos < end) {
    pos += reader.number();
    for (;;) {
      const x = reader.byte();
      if (x === 0) {
        pos++;
        break;
      }
      if (pos < out.length) out[pos] ^= x;
      pos++;
    }
  }
  return out;
}

/**
 * The patched ROM. BPS / UPS are checked end to end — the patch's own CRC, that the ROM
 * is the one it was made for, and the result — and throw a {@link PatchError} saying
 * which failed. IPS has nothing to check.
 */
export function applyPatch(rom: Uint8Array, patch: Uint8Array): Uint8Array {
  const info = parsePatch(patch);
  if (info.format === 'ips') return applyIps(rom, patch);
  if (!info.valid) throw new PatchError('damaged', 'The patch is damaged (its own CRC does not match)');
  if (crc32(rom) !== info.sourceCrc) {
    throw new PatchError('wrong-source', `The patch is for another ROM (expects CRC32 ${crcHex(info.sourceCrc!)})`);
  }
  const out = info.format === 'bps' ? applyBps(rom, patch, info) : applyUps(rom, patch, info);
  if (crc32(out) !== info.targetCrc) throw new PatchError('wrong-result', 'The result is not the ROM the patch promises');
  return out;
}

/** The name a mod is shown with: its file name without the extension. */
export function modNameOf(fileName: string): string {
  const base = fileName.slice(fileName.lastIndexOf('/') + 1);
  return isPatchName(base) ? base.slice(0, base.lastIndexOf('.')) : base;
}
