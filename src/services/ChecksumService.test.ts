import { describe, expect, it } from 'vitest';
import { calculateCRC32, streamCRC32 } from './ChecksumService';

const encoder = new TextEncoder();

function streamOf(data: Uint8Array, chunkSize: number): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (let at = 0; at < data.length; at += chunkSize) {
        controller.enqueue(data.slice(at, at + chunkSize));
      }
      controller.close();
    },
  });
}

describe('calculateCRC32', () => {
  it('matches the standard check value', () => {
    // `CBF43926` for "123456789" is the published check value of CRC-32/ISO,
    // which is the variant the DAT catalogues are built on.
    return expect(calculateCRC32(encoder.encode('123456789').buffer)).resolves.toBe('CBF43926');
  });

  it('pads a checksum with leading zeroes to eight digits', async () => {
    // Datasets store eight hex digits, and a checksum printed short would
    // silently fail to match.
    const bytes = new Uint8Array([0x00]);

    expect(await calculateCRC32(bytes.buffer)).toHaveLength(8);
  });
});

describe('streamCRC32', () => {
  it('gives the same result as hashing the whole buffer at once', async () => {
    const data = encoder.encode('The quick brown fox jumps over the lazy dog');

    expect(await streamCRC32(streamOf(data, 7))).toBe(await calculateCRC32(data.buffer));
  });

  it('does not depend on how the stream is chunked', async () => {
    const data = new Uint8Array(5000).map((_, index) => index % 251);

    expect(await streamCRC32(streamOf(data, 1))).toBe(await streamCRC32(streamOf(data, 4096)));
  });

  it('reports how much it has read', async () => {
    const data = new Uint8Array(300);
    const progress: number[] = [];

    await streamCRC32(streamOf(data, 100), (bytes) => progress.push(bytes));

    expect(progress).toEqual([100, 200, 300]);
  });

  it('hashes an empty file without complaining', async () => {
    expect(await streamCRC32(streamOf(new Uint8Array(0), 1))).toBe('00000000');
  });
});
