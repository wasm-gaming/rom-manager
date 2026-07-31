import { describe, expect, it } from 'vitest';
import { buildZip, crc32Of } from './zip-builder.test-helper';
import {
  dataOffsetOf,
  findCentralDirectory,
  isZipHeader,
  readCentralDirectory,
  refusalOf,
  ZIP_DEFLATED,
  ZIP_STORED,
  type ZipEntry,
} from './zip-directory';

/** The entries of a built archive, the way the app reads them off a real one. */
function entriesOf(zip: Uint8Array): ZipEntry[] {
  const directory = findCentralDirectory(zip);
  if (!directory) throw new Error('No central directory');

  return readCentralDirectory(
    zip.subarray(directory.offset, directory.offset + directory.size),
    directory.count,
  );
}

describe('isZipHeader', () => {
  it('knows an archive by what it starts with', () => {
    expect(isZipHeader(buildZip([{ name: 'sonic.md', content: 'rom' }]))).toBe(true);
  });

  it('knows an archive holding nothing', () => {
    expect(isZipHeader(buildZip([]))).toBe(true);
  });

  it('does not take a ROM for one', () => {
    expect(isZipHeader(new Uint8Array([0x53, 0x45, 0x47, 0x41]))).toBe(false);
  });

  it('does not read past the end of a file too short to say', () => {
    expect(isZipHeader(new Uint8Array([0x50, 0x4b]))).toBe(false);
  });
});

describe('findCentralDirectory', () => {
  it('finds the index of an archive', () => {
    const zip = buildZip([{ name: 'sonic.md', content: 'rom' }]);
    const directory = findCentralDirectory(zip);

    expect(directory?.count).toBe(1);
    expect(directory?.zip64).toBe(false);
    expect(zip.subarray(directory!.offset, directory!.offset + 4)).toEqual(
      new Uint8Array([0x50, 0x4b, 0x01, 0x02]),
    );
  });

  it('finds it past a comment', () => {
    expect(findCentralDirectory(buildZip([{ name: 'a.md', content: 'x' }], { comment: 'hola' }))
      ?.count).toBe(1);
  });

  it('is not fooled by the record appearing inside the contents', () => {
    // The bytes of an end record, stored uncompressed, ahead of the real one.
    const decoy = String.fromCharCode(0x50, 0x4b, 0x05, 0x06, ...new Array(18).fill(0));
    expect(findCentralDirectory(buildZip([{ name: 'a.md', content: decoy }]))?.count).toBe(1);
  });

  it('finds nothing in a file that is not an archive', () => {
    expect(findCentralDirectory(new TextEncoder().encode('not a zip at all'))).toBeUndefined();
  });

  it('finds nothing in an archive cut short', () => {
    const zip = buildZip([{ name: 'sonic.md', content: 'rom' }]);
    expect(findCentralDirectory(zip.subarray(0, zip.length - 5))).toBeUndefined();
  });

  it('reads an archive as Zip64 when the count says to look elsewhere', () => {
    const zip = buildZip([{ name: 'sonic.md', content: 'rom' }]);
    new DataView(zip.buffer).setUint16(zip.length - 22 + 10, 0xffff, true);

    expect(findCentralDirectory(zip)?.zip64).toBe(true);
  });
});

describe('readCentralDirectory', () => {
  it('reads the name, the size and the checksum of the contents', () => {
    const [entry] = entriesOf(buildZip([{ name: 'Sonic (USA).md', content: 'rom bytes' }]));

    expect(entry.name).toBe('Sonic (USA).md');
    expect(entry.size).toBe(9);
    expect(entry.method).toBe(ZIP_STORED);
    expect(entry.crc32).toBe(crc32Of('rom bytes'));
  });

  it('reads the checksum of what a deflated entry expands to, not of its bytes', () => {
    const [stored] = entriesOf(buildZip([{ name: 'a.md', content: 'rom bytes'.repeat(20) }]));
    const [deflated] = entriesOf(
      buildZip([{ name: 'a.md', content: 'rom bytes'.repeat(20), deflate: true }]),
    );

    expect(deflated.method).toBe(ZIP_DEFLATED);
    expect(deflated.compressedSize).toBeLessThan(deflated.size);
    expect(deflated.crc32).toBe(stored.crc32);
  });

  it('reads every entry of an archive holding several', () => {
    const entries = entriesOf(
      buildZip([
        { name: 'disc.cue', content: 'FILE "disc.bin" BINARY' },
        { name: 'disc.bin', content: 'track', deflate: true },
      ]),
    );

    expect(entries.map((entry) => entry.name)).toEqual(['disc.cue', 'disc.bin']);
  });

  it('marks the entries that are a folder', () => {
    const [entry] = entriesOf(buildZip([{ name: 'roms/', content: '' }]));

    expect(entry.directory).toBe(true);
  });

  it('marks an encrypted entry as one', () => {
    const [entry] = entriesOf(buildZip([{ name: 'a.md', content: 'rom', flags: 0x1 }]));

    expect(entry.encrypted).toBe(true);
  });

  it('stops at an index that disagrees with itself', () => {
    const zip = buildZip([
      { name: 'a.md', content: 'rom' },
      { name: 'b.md', content: 'rom' },
    ]);
    const directory = findCentralDirectory(zip)!;
    // Break the signature of the second entry, leaving the count claiming two.
    zip[directory.offset + 46 + 4] = 0;

    expect(entriesOf(zip)).toHaveLength(1);
  });
});

describe('dataOffsetOf', () => {
  it('reads where the contents begin from the local header', () => {
    const zip = buildZip([{ name: 'Sonic (USA).md', content: 'rom' }]);

    expect(dataOffsetOf(zip)).toBe(30 + 'Sonic (USA).md'.length);
  });

  it('reads nothing where there is no local header', () => {
    expect(dataOffsetOf(new Uint8Array(30))).toBeUndefined();
  });
});

describe('refusalOf', () => {
  const entry = (over: Partial<ZipEntry>): ZipEntry => ({
    name: 'a.md',
    crc32: 'AAAA1111',
    size: 8,
    compressedSize: 8,
    method: ZIP_STORED,
    offset: 0,
    directory: false,
    encrypted: false,
    zip64: false,
    ...over,
  });

  it('takes a stored entry', () => {
    expect(refusalOf(entry({}))).toBeUndefined();
  });

  it('takes a deflated entry', () => {
    expect(refusalOf(entry({ method: ZIP_DEFLATED }))).toBeUndefined();
  });

  it('refuses one compressed with something else', () => {
    expect(refusalOf(entry({ method: 14 }))).toBe('method');
  });

  it('refuses an encrypted one', () => {
    expect(refusalOf(entry({ encrypted: true }))).toBe('encrypted');
  });

  it('refuses one that needs the 64-bit format', () => {
    expect(refusalOf(entry({ zip64: true }))).toBe('zip64');
  });
});
