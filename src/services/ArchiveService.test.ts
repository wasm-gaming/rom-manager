import { describe, expect, it } from 'vitest';
import { buildZip, crc32Of, zipFile } from '../core/zip-builder.test-helper';
import { findCentralDirectory, readCentralDirectory, type ZipEntry } from '../core/zip-directory';
import { extract, isArchive, readArchive } from './ArchiveService';

function entriesOf(bytes: Uint8Array): ZipEntry[] {
  const directory = findCentralDirectory(bytes)!;
  return readCentralDirectory(
    bytes.subarray(directory.offset, directory.offset + directory.size),
    directory.count,
  );
}

function text(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

describe('isArchive', () => {
  it('knows an archive from what it starts with, not from its name', async () => {
    expect(await isArchive(zipFile('sonic.md', [{ name: 'sonic.md', content: 'rom' }]))).toBe(true);
  });

  it('does not take a ROM for one', async () => {
    expect(await isArchive(new File(['SEGA MEGA DRIVE'], 'sonic.zip'))).toBe(false);
  });

  it('does not take an empty file for one', async () => {
    expect(await isArchive(new File([], 'empty.zip'))).toBe(false);
  });
});

describe('readArchive', () => {
  it('reads what an archive holds', async () => {
    const contents = await readArchive(
      zipFile('sonic.zip', [{ name: 'Sonic (USA).md', content: 'rom bytes', deflate: true }]),
    );

    expect(contents).toEqual({
      entries: [expect.objectContaining({ name: 'Sonic (USA).md', crc32: crc32Of('rom bytes') })],
    });
  });

  it('reads an archive holding several games', async () => {
    const contents = await readArchive(
      zipFile('pack.zip', [
        { name: 'Sonic (USA).md', content: 'one' },
        { name: 'Streets of Rage (USA).md', content: 'two', deflate: true },
      ]),
    );

    expect('entries' in contents && contents.entries.map((entry) => entry.name)).toEqual([
      'Sonic (USA).md',
      'Streets of Rage (USA).md',
    ]);
  });

  it('refuses one whose index cannot be read', async () => {
    const bytes = buildZip([{ name: 'a.md', content: 'rom' }]);

    expect(await readArchive(new File([bytes.subarray(0, bytes.length - 4) as BlobPart], 'cut.zip')))
      .toEqual({ refused: 'damaged' });
  });

  it('refuses a Zip64 archive rather than reading it wrong', async () => {
    const bytes = buildZip([{ name: 'a.md', content: 'rom' }]);
    new DataView(bytes.buffer).setUint32(bytes.length - 22 + 16, 0xffffffff, true);

    expect(await readArchive(new File([bytes as BlobPart], 'big.zip'))).toEqual({
      refused: 'zip64',
    });
  });
});

describe('extract', () => {
  it('expands a deflated entry', async () => {
    const sources = [{ name: 'sonic.md', content: 'rom bytes'.repeat(50), deflate: true }];
    const bytes = buildZip(sources);
    const file = new File([bytes as BlobPart], 'sonic.zip');

    expect(text(await extract(file, entriesOf(bytes)[0]))).toBe('rom bytes'.repeat(50));
  });

  it('copies out a stored entry', async () => {
    const bytes = buildZip([{ name: 'sonic.md', content: 'rom bytes' }]);
    const file = new File([bytes as BlobPart], 'sonic.zip');

    expect(text(await extract(file, entriesOf(bytes)[0]))).toBe('rom bytes');
  });

  it('finds the entry it is asked for and not the first one', async () => {
    const bytes = buildZip([
      { name: 'first.md', content: 'the first one' },
      { name: 'second.md', content: 'the second one', deflate: true },
    ]);
    const file = new File([bytes as BlobPart], 'pack.zip');

    expect(text(await extract(file, entriesOf(bytes)[1]))).toBe('the second one');
  });

  it('refuses to hand over contents the index did not describe', async () => {
    const bytes = buildZip([{ name: 'sonic.md', content: 'rom bytes' }]);
    const file = new File([bytes as BlobPart], 'sonic.zip');
    const entry = entriesOf(bytes)[0];

    await expect(extract(file, { ...entry, crc32: 'DEADBEEF' })).rejects.toThrow(
      'no es el que el archivo declaraba',
    );
  });
});
