/**
 * Reading what a ZIP says it holds, without expanding any of it.
 *
 * A ZIP keeps an index at its end — the central directory — with, per entry, its
 * name, its size once expanded and the **CRC32 of those expanded bytes**. That
 * last one is the same checksum the DAT catalogues are keyed by, so a game
 * inside an archive can be identified by reading a few kilobytes off the tail of
 * the file: a 700 MB set is recognised faster than a loose ROM, which has to be
 * hashed whole.
 *
 * The archive is untrusted input — it came off the internet, and the index is
 * only what it *claims* — so nothing here is taken on faith beyond what it costs
 * to read: sizes are read but never used to allocate, and the CRC is checked
 * against the bytes when they are finally expanded.
 *
 * Pure TypeScript over bytes: slicing the file and inflating it are the
 * browser's job, and live in `ArchiveService`.
 */

/** Compression methods this can read. Anything else is somebody else's format. */
export const ZIP_STORED = 0;
export const ZIP_DEFLATED = 8;

/** Why an archive, or one entry of it, is not something this can take in. */
export type ZipRefusal =
  /** Needs the 64-bit format, which this does not read. */
  | 'zip64'
  /** The contents are encrypted. */
  | 'encrypted'
  /** Compressed with something other than stored or deflate. */
  | 'method'
  /** No readable index: truncated, spanned across volumes, or not a ZIP. */
  | 'damaged';

/** One file inside an archive, as its index describes it. */
export interface ZipEntry {
  /** Name as the archive spells it, the folders it sits in included. */
  name: string;
  /** CRC32 of the expanded contents, the same the catalogues carry. */
  crc32: string;
  /** Size once expanded, as claimed. */
  size: number;
  compressedSize: number;
  method: number;
  /** Where its local header sits, which is where its bytes are found from. */
  offset: number;
  /** True for the entries that are a folder and hold nothing. */
  directory: boolean;
  encrypted: boolean;
  /** True when the entry needs the 64-bit format to be described at all. */
  zip64: boolean;
}

/** Where the index sits, and how much of it there is. */
export interface CentralDirectory {
  offset: number;
  size: number;
  count: number;
  /** True when the archive is Zip64, which is read far enough to be refused. */
  zip64: boolean;
}

const END_SIGNATURE = 0x06054b50;
const ZIP64_LOCATOR_SIGNATURE = 0x07064b50;
const ENTRY_SIGNATURE = 0x02014b50;
const LOCAL_SIGNATURE = 0x04034b50;

const END_SIZE = 22;
const ENTRY_SIZE = 46;
export const LOCAL_HEADER_SIZE = 30;

/** A field of every 32-bit size in the classic format, meaning "see Zip64". */
const ZIP64_MARK = 0xffffffff;
const ZIP64_COUNT_MARK = 0xffff;

/** Set on an entry whose contents are encrypted. */
const ENCRYPTED_FLAG = 0x1;

/**
 * The comment at the end of an archive is up to 64 KB long and the index sits
 * before it, so this much of the tail is what it takes to be sure of finding it.
 */
export const ZIP_TAIL_LIMIT = END_SIZE + 0xffff;

/** True when a file begins the way an archive does. */
export function isZipHeader(head: Uint8Array): boolean {
  if (head.length < 4) return false;

  const signature = view(head).getUint32(0, true);

  // The second is an archive holding nothing, which is a ZIP all the same.
  return signature === LOCAL_SIGNATURE || signature === END_SIGNATURE;
}

function view(bytes: Uint8Array): DataView {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

/**
 * Find the index at the end of an archive.
 *
 * `tail` has to be the last bytes of the file, ending at its very end: what
 * tells the record apart from the same four bytes appearing inside a compressed
 * entry is that the comment it declares runs exactly to the end of the file.
 * Read from the back, so an archive whose contents happen to hold a copy of the
 * record does not shadow the real one.
 *
 * Nothing for an archive with no readable index, which is what a truncated file
 * and a file that is not a ZIP both look like from here.
 */
export function findCentralDirectory(tail: Uint8Array): CentralDirectory | undefined {
  if (tail.length < END_SIZE) return undefined;

  const bytes = view(tail);

  for (let at = tail.length - END_SIZE; at >= 0; at -= 1) {
    if (bytes.getUint32(at, true) !== END_SIGNATURE) continue;
    if (bytes.getUint16(at + 20, true) !== tail.length - at - END_SIZE) continue;

    // Split archives are handed over one volume at a time, and the one dropped
    // holds only part of what the index describes.
    if (bytes.getUint16(at + 4, true) !== 0 || bytes.getUint16(at + 6, true) !== 0) {
      return undefined;
    }

    const count = bytes.getUint16(at + 10, true);
    const size = bytes.getUint32(at + 12, true);
    const offset = bytes.getUint32(at + 16, true);

    return {
      count,
      size,
      offset,
      zip64:
        count === ZIP64_COUNT_MARK ||
        size === ZIP64_MARK ||
        offset === ZIP64_MARK ||
        hasZip64Locator(bytes, at),
    };
  }

  return undefined;
}

/** The 64-bit format leaves a locator immediately before the classic record. */
function hasZip64Locator(bytes: DataView, end: number): boolean {
  const at = end - 20;
  return at >= 0 && bytes.getUint32(at, true) === ZIP64_LOCATOR_SIGNATURE;
}

/**
 * Read the index into the entries it describes.
 *
 * Stops at the first entry that does not begin the way one must: an index that
 * disagrees with itself is not worth guessing at, and what has been read up to
 * there is still usable.
 */
export function readCentralDirectory(bytes: Uint8Array, count: number): ZipEntry[] {
  const entries: ZipEntry[] = [];
  const directory = view(bytes);
  let at = 0;

  while (entries.length < count && at + ENTRY_SIZE <= bytes.length) {
    if (directory.getUint32(at, true) !== ENTRY_SIGNATURE) break;

    const flags = directory.getUint16(at + 8, true);
    const nameLength = directory.getUint16(at + 28, true);
    const extraLength = directory.getUint16(at + 30, true);
    const commentLength = directory.getUint16(at + 32, true);
    const compressedSize = directory.getUint32(at + 20, true);
    const size = directory.getUint32(at + 24, true);
    const offset = directory.getUint32(at + 42, true);

    const start = at + ENTRY_SIZE;
    if (start + nameLength > bytes.length) break;

    const name = nameOf(bytes.subarray(start, start + nameLength));

    entries.push({
      name,
      crc32: directory.getUint32(at + 16, true).toString(16).padStart(8, '0').toUpperCase(),
      size,
      compressedSize,
      method: directory.getUint16(at + 10, true),
      offset,
      // The archive says so by the name, which is the only way it says so.
      directory: name.endsWith('/'),
      encrypted: (flags & ENCRYPTED_FLAG) !== 0,
      zip64: size === ZIP64_MARK || compressedSize === ZIP64_MARK || offset === ZIP64_MARK,
    });

    at = start + nameLength + extraLength + commentLength;
  }

  return entries;
}

/**
 * The name of an entry.
 *
 * Decoded as UTF-8 whether or not the archive says it wrote it that way: the
 * alternative it claims is CP437, which agrees with UTF-8 across the ASCII the
 * catalogues spell their names in, and guessing wrong costs a couple of accents
 * in a file name rather than the game.
 */
function nameOf(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

/**
 * How far past its local header an entry's bytes begin.
 *
 * The name and the extra field are repeated there and are allowed to differ in
 * length from the ones in the index, so this is read from the header itself and
 * never assumed.
 */
export function dataOffsetOf(header: Uint8Array): number | undefined {
  if (header.length < LOCAL_HEADER_SIZE) return undefined;

  const bytes = view(header);
  if (bytes.getUint32(0, true) !== LOCAL_SIGNATURE) return undefined;

  return LOCAL_HEADER_SIZE + bytes.getUint16(26, true) + bytes.getUint16(28, true);
}

/** Why an entry cannot be taken out, when that is the case. */
export function refusalOf(entry: ZipEntry): ZipRefusal | undefined {
  if (entry.zip64) return 'zip64';
  if (entry.encrypted) return 'encrypted';
  if (entry.method !== ZIP_STORED && entry.method !== ZIP_DEFLATED) return 'method';

  return undefined;
}
