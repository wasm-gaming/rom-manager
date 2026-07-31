/**
 * Building real archives for the tests to read.
 *
 * Not shipped and not imported by the app: the ZIP format is what is under
 * test, so the tests are fed bytes laid out the way a zipper lays them out —
 * deflate included — rather than a fixture that would only prove the parser
 * agrees with itself.
 */

import { deflateRawSync } from 'node:zlib';
import { ZIP_DEFLATED, ZIP_STORED } from './zip-directory';

/** What goes into a built archive, before it is laid out as bytes. */
export interface ZipSource {
  name: string;
  content: string;
  deflate?: boolean;
  /** Written into the flags of both headers, to script an encrypted entry. */
  flags?: number;
  method?: number;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);

  for (let at = 0; at < 256; at += 1) {
    let value = at;
    for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    table[at] = value >>> 0;
  }

  return table;
})();

/** The checksum the format calls for, worked out apart from the app's own. */
export function crc32(bytes: Uint8Array): number {
  let value = 0xffffffff;
  for (const byte of bytes) value = CRC_TABLE[(value ^ byte) & 0xff] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

export function crc32Of(content: string): string {
  return crc32(new TextEncoder().encode(content)).toString(16).padStart(8, '0').toUpperCase();
}

export function concat(parts: Uint8Array[]): Uint8Array {
  const bytes = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let at = 0;

  for (const part of parts) {
    bytes.set(part, at);
    at += part.length;
  }

  return bytes;
}

/** An archive, laid out by hand: local headers, contents, index, end record. */
export function buildZip(sources: ZipSource[], options: { comment?: string } = {}): Uint8Array {
  const parts: Uint8Array[] = [];
  const directory: Uint8Array[] = [];
  let offset = 0;

  for (const source of sources) {
    const name = new TextEncoder().encode(source.name);
    const raw = new TextEncoder().encode(source.content);
    const stored = source.deflate ? new Uint8Array(deflateRawSync(raw)) : raw;
    const method = source.method ?? (source.deflate ? ZIP_DEFLATED : ZIP_STORED);

    const local = new Uint8Array(30 + name.length);
    const header = new DataView(local.buffer);
    header.setUint32(0, 0x04034b50, true);
    header.setUint16(4, 20, true);
    header.setUint16(6, source.flags ?? 0, true);
    header.setUint16(8, method, true);
    header.setUint32(14, crc32(raw), true);
    header.setUint32(18, stored.length, true);
    header.setUint32(22, raw.length, true);
    header.setUint16(26, name.length, true);
    local.set(name, 30);

    const entry = new Uint8Array(46 + name.length);
    const central = new DataView(entry.buffer);
    central.setUint32(0, 0x02014b50, true);
    central.setUint16(8, source.flags ?? 0, true);
    central.setUint16(10, method, true);
    central.setUint32(16, crc32(raw), true);
    central.setUint32(20, stored.length, true);
    central.setUint32(24, raw.length, true);
    central.setUint16(28, name.length, true);
    central.setUint32(42, offset, true);
    entry.set(name, 46);

    parts.push(local, stored);
    directory.push(entry);
    offset += local.length + stored.length;
  }

  const comment = new TextEncoder().encode(options.comment ?? '');
  const directorySize = directory.reduce((total, entry) => total + entry.length, 0);

  const end = new Uint8Array(22 + comment.length);
  const tail = new DataView(end.buffer);
  tail.setUint32(0, 0x06054b50, true);
  tail.setUint16(8, sources.length, true);
  tail.setUint16(10, sources.length, true);
  tail.setUint32(12, directorySize, true);
  tail.setUint32(16, offset, true);
  tail.setUint16(20, comment.length, true);
  end.set(comment, 22);

  return concat([...parts, ...directory, end]);
}

/** A built archive as the browser would hand it over. */
export function zipFile(name: string, sources: ZipSource[]): File {
  return new File([buildZip(sources) as BlobPart], name);
}
