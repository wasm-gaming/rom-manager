/**
 * Checksum Service
 * 
 * Calculate checksums (CRC32, MD5, SHA1) for ROM files
 * Lazy evaluation: CRC32 first (fast), then MD5 and SHA1 only if needed
 */

import { md5 } from 'hash-wasm';

/**
 * Calculate CRC32 checksum (fast, suitable for indexing)
 */
export async function calculateCRC32(data: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(data);
  let crc = 0xffffffff;

  for (let i = 0; i < bytes.length; i++) {
    crc = crc ^ bytes[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }

  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, '0').toUpperCase();
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
  const crc32 = await calculateCRC32(data);
  yield { type: 'crc32', value: crc32 };

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
  const [crc32, md5Hash, sha1] = await Promise.all([
    calculateCRC32(data),
    calculateMD5(data),
    calculateSHA1(data),
  ]);
  return { crc32, md5: md5Hash, sha1 };
}
