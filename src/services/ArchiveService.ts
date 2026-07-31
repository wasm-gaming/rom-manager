/**
 * Getting games out of the archives they are handed over in.
 *
 * ROMs travel zipped, so a drop is as likely to be an archive as a ROM. Reading
 * what one holds costs a few kilobytes off its tail — the index carries the
 * CRC32 of every entry expanded, which is exactly what identifies a game — and
 * expanding an entry only happens once the user has said to add it.
 *
 * The index is a claim, not a fact: an entry is expanded through the browser's
 * own inflate and its checksum recomputed from the bytes that come out, so an
 * archive that lied about what it held is caught before anything is written.
 */

import {
  dataOffsetOf,
  findCentralDirectory,
  isZipHeader,
  LOCAL_HEADER_SIZE,
  readCentralDirectory,
  ZIP_DEFLATED,
  ZIP_TAIL_LIMIT,
  type ZipEntry,
  type ZipRefusal,
} from '../core/zip-directory';
import { calculateCRC32 } from './ChecksumService';

/** What an archive turned out to hold, or why it could not be read at all. */
export type ArchiveContents = { entries: ZipEntry[] } | { refused: ZipRefusal };

/** True when the file is an archive, by what it starts with and not by its name. */
export async function isArchive(file: File): Promise<boolean> {
  if (file.size < 4) return false;

  return isZipHeader(new Uint8Array(await file.slice(0, 4).arrayBuffer()));
}

/**
 * What an archive holds, read from its index.
 *
 * Two reads: the tail, which is where the index says where it is, and the index
 * itself. Neither is bounded by how big the archive is, so this costs the same
 * on a 700 MB set as on a cartridge.
 */
export async function readArchive(file: File): Promise<ArchiveContents> {
  const tail = new Uint8Array(
    await file.slice(Math.max(0, file.size - ZIP_TAIL_LIMIT)).arrayBuffer(),
  );

  const directory = findCentralDirectory(tail);
  if (!directory) return { refused: 'damaged' };
  if (directory.zip64) return { refused: 'zip64' };

  const bytes = new Uint8Array(
    await file.slice(directory.offset, directory.offset + directory.size).arrayBuffer(),
  );

  const entries = readCentralDirectory(bytes, directory.count);

  // An index that describes nothing readable is as good as no index: saying the
  // archive is damaged is truer than offering an empty archive.
  if (entries.length === 0 && directory.count > 0) return { refused: 'damaged' };

  return { entries };
}

/**
 * Expand one entry, checking it is what the archive said it was.
 *
 * The CRC is recomputed rather than trusted, which costs nothing here: the
 * bytes are in hand either way, and it is the same checksum that identified the
 * game, so a mismatch means what is being written is not the game that was
 * confirmed.
 */
export async function extract(file: File, entry: ZipEntry): Promise<Uint8Array> {
  const header = new Uint8Array(
    await file.slice(entry.offset, entry.offset + LOCAL_HEADER_SIZE).arrayBuffer(),
  );

  const start = dataOffsetOf(header);
  if (start === undefined) throw new Error(`El archivo no tiene los datos de ${entry.name}`);

  const raw = file.slice(entry.offset + start, entry.offset + start + entry.compressedSize);

  const bytes =
    entry.method === ZIP_DEFLATED
      ? await collect(raw.stream().pipeThrough(new DecompressionStream('deflate-raw')))
      : new Uint8Array(await raw.arrayBuffer());

  if ((await calculateCRC32(bytes)) !== entry.crc32.toUpperCase()) {
    throw new Error(`El contenido de ${entry.name} no es el que el archivo declaraba`);
  }

  return bytes;
}

/**
 * Drain a stream into one buffer.
 *
 * Grown from what actually arrives rather than from the size the archive
 * claims, so a file that says it expands to four gigabytes cannot make this
 * ask for four gigabytes before reading a byte of it.
 */
async function collect(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();
  let length = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      length += value.length;
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(length);
  let at = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, at);
    at += chunk.length;
  }

  return bytes;
}
