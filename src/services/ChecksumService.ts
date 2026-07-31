/**
 * Checksum Service
 * 
 * Calculate checksums (CRC32, MD5, SHA1) for ROM files
 * Lazy evaluation: CRC32 first (fast), then MD5 and SHA1 only if needed
 */

import { createCRC32, crc32, md5 } from 'hash-wasm';

/**
 * Calculate CRC32 checksum (fast, suitable for indexing)
 *
 * The default polynomial is the one the DAT catalogues use, so the result can
 * be compared against them directly.
 *
 * Bytes already in hand are taken as they are: what comes out of an archive is
 * a `Uint8Array` the size of the game, and copying it to be hashed would double
 * what a disc image costs in memory.
 */
export async function calculateCRC32(data: ArrayBuffer | Uint8Array): Promise<string> {
  return (await crc32(data instanceof Uint8Array ? data : new Uint8Array(data))).toUpperCase();
}

/**
 * CRC32 of a file read as a stream.
 *
 * A disc image runs into the hundreds of megabytes, so it is hashed as it
 * arrives rather than held whole in memory. `onProgress` reports the bytes
 * consumed so far, because on a file that size the wait is noticeable.
 */
export async function streamCRC32(
  stream: ReadableStream<Uint8Array>,
  onProgress?: (bytes: number) => void,
): Promise<string> {
  const hasher = await createCRC32();
  hasher.init();

  const reader = stream.getReader();
  let read = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      hasher.update(value);
      read += value.length;
      onProgress?.(read);
    }
  } finally {
    reader.releaseLock();
  }

  return hasher.digest('hex').toUpperCase();
}

/**
 * Calculate SHA1 checksum (slower, confirmation lookup)
 */
export async function calculateSHA1(data: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/**
 * Calculate MD5 checksum (fallback lookup for DAT datasets)
 */
export async function calculateMD5(data: ArrayBuffer): Promise<string> {
  return (await md5(new Uint8Array(data))).toUpperCase();
}

/**
 * Lazy checksum calculation - CRC32 first, then MD5 and SHA1 on demand
 */
export async function* lazyChecksums(
  data: ArrayBuffer
): AsyncGenerator<{ type: 'crc32' | 'md5' | 'sha1'; value: string }> {
  // Step 1: CRC32 (fast)
  const crc = await calculateCRC32(data);
  yield { type: 'crc32', value: crc };

  // Step 2: MD5 (only if caller requests via .next())
  const md5Hash = await calculateMD5(data);
  yield { type: 'md5', value: md5Hash };

  // Step 3: SHA1 (only if caller requests via .next())
  const sha1 = await calculateSHA1(data);
  yield { type: 'sha1', value: sha1 };
}

/**
 * Calculate all supported checksums in parallel (for batch operations)
 */
export async function calculateChecksums(
  data: ArrayBuffer
): Promise<{ crc32: string; md5: string; sha1: string }> {
  const [crc, md5Hash, sha1] = await Promise.all([
    calculateCRC32(data),
    calculateMD5(data),
    calculateSHA1(data),
  ]);
  return { crc32: crc, md5: md5Hash, sha1 };
}
