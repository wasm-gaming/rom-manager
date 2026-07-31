import { beforeEach, describe, expect, it } from 'vitest';
import { buildZip } from '../core/zip-builder.test-helper';
import { findCentralDirectory, readCentralDirectory, type ZipEntry } from '../core/zip-directory';
import { GAME_MARKER } from './LibraryScanService';
import {
  RomIntakeService,
  isPlaced,
  offerOf,
  splitDrop,
  type IntakeItem,
  type IntakeMatch,
} from './RomIntakeService';
import type { StorageNode } from './StorageService';

/** An in-memory stand-in for the opened folder. */
class FakeStorage {
  readonly files = new Map<string, string>();
  readonly directories = new Set<string>();

  async exists(path: string): Promise<boolean> {
    return this.files.has(path);
  }

  async writeFile(path: string, content: Uint8Array): Promise<void> {
    this.files.set(path, new TextDecoder().decode(content));
  }

  async createDirectory(path: string): Promise<void> {
    this.directories.add(path);
  }

  asNode(): StorageNode {
    return this as unknown as StorageNode;
  }
}

/** A file dropped as it is, which only answers for its name and its bytes. */
function loose(name: string, content = 'rom'): IntakeItem {
  const file = new File([content], name);
  return { name, size: file.size, source: { kind: 'file', file }, crc32: 'AAAA1111' };
}

/** A game inside an archive, laid out the way a zipper lays one out. */
function zipped(archive: string, name: string, content: string, deflate = true): IntakeItem {
  const bytes = buildZip([{ name, content, deflate }]);
  const file = new File([bytes as BlobPart], archive);
  const directory = findCentralDirectory(bytes)!;
  const [entry] = readCentralDirectory(
    bytes.subarray(directory.offset, directory.offset + directory.size),
    directory.count,
  );

  return {
    name,
    size: entry.size,
    source: { kind: 'entry', archive: file, entry },
    archive,
    crc32: entry.crc32,
  };
}

/** The file an item was read from, which is what links it back to the drop. */
function fileOf(item: IntakeItem): File {
  return item.source.kind === 'file' ? item.source.file : item.source.archive;
}

/** The entry behind a zipped item, for the tests that go on to damage it. */
function entryOf(item: IntakeItem): ZipEntry {
  if (item.source.kind !== 'entry') throw new Error('Not an archive entry');
  return item.source.entry;
}

function match(overrides: Partial<IntakeMatch> = {}): IntakeMatch {
  return {
    system: 'SNES',
    media: 'cartridge',
    gameId: 'Super Mario World',
    title: 'Super Mario World',
    variant: 'USA',
    ...overrides,
  };
}

const disc = match({
  system: 'PSX',
  media: 'disc',
  gameId: 'Final Fantasy VII',
  title: 'Final Fantasy VII',
  variant: 'Europe',
});

let storage: FakeStorage;

beforeEach(() => {
  storage = new FakeStorage();
});

describe('isPlaced', () => {
  it('is true for a file with somewhere to go', () => {
    expect(isPlaced({ ...loose('smw.sfc'), path: 'SNES/smw.sfc' })).toBe(true);
  });

  it('is false for a file nothing claimed', () => {
    expect(isPlaced(loose('notes.txt'))).toBe(false);
  });

  it('is false for a name already taken', () => {
    expect(isPlaced({ ...loose('smw.sfc'), path: 'SNES/smw.sfc', taken: true })).toBe(false);
  });

  it('is false for something the archive would not hand over', () => {
    expect(isPlaced({ ...loose('smw.sfc'), path: 'SNES/smw.sfc', refused: 'encrypted' })).toBe(
      false,
    );
  });
});

describe('offerOf', () => {
  it('offers the release an archive turned out to hold', () => {
    const item = { ...zipped('smw.zip', 'smw.sfc', 'rom'), path: 'SNES/smw.sfc', match: match() };
    const offer = offerOf(fileOf(item), [item]);

    expect(offer?.match.title).toBe('Super Mario World');
    expect(offer?.path).toBe('SNES/smw.sfc');
    expect(offer?.pending).toEqual([item]);
  });

  it('offers nothing for a file no catalogue claimed', () => {
    const item = loose('notes.txt');

    expect(offerOf(fileOf(item), [item])).toBeUndefined();
  });

  it('takes in what came along with the release, and not what came with another', () => {
    const track = {
      ...zipped('ff7.zip', 'ff7.bin', 'disc'),
      path: 'PSX/ff7/Europe/ff7.bin',
      match: disc,
    };
    const cue = zipped('ff7.zip', 'ff7.cue', 'sheet');
    // Read out of the very archive the track was, which is what puts the two in
    // the same offer: a companion belongs to the file it was dropped inside.
    const sheet: IntakeItem = {
      ...cue,
      source: { kind: 'entry', archive: fileOf(track), entry: entryOf(cue) },
      path: 'PSX/ff7/Europe/ff7.cue',
    };
    const other = { ...loose('smw.sfc'), path: 'SNES/smw.sfc', match: match() };
    const offer = offerOf(fileOf(track), [track, sheet, other]);

    expect(offer?.pending).toEqual([track, sheet]);
  });

  it('holds the release but nothing to write when it is already on disk', () => {
    const item = {
      ...zipped('smw.zip', 'smw.sfc', 'rom'),
      path: 'SNES/smw.sfc',
      match: match(),
      taken: true,
    };
    const offer = offerOf(fileOf(item), [item]);

    expect(offer?.path).toBe('SNES/smw.sfc');
    expect(offer?.pending).toEqual([]);
  });

  it('tells apart two files dropped under the same name', () => {
    const mine = { ...zipped('smw.zip', 'smw.sfc', 'one'), path: 'SNES/smw.sfc', match: match() };
    const other = { ...zipped('smw.zip', 'smw.sfc', 'another'), path: 'SNES/smw.sfc', match: match() };

    expect(offerOf(fileOf(mine), [mine, other])?.pending).toEqual([mine]);
  });
});

describe('splitDrop', () => {
  it('copies what was not chosen and takes in what was', () => {
    const game = { ...zipped('smw.zip', 'smw.sfc', 'rom'), path: 'SNES/smw.sfc', match: match() };
    const notes = loose('notes.txt');
    const files = [fileOf(game), fileOf(notes)];

    const split = splitDrop(files, new Set([fileOf(game)]), [game, notes]);

    expect(split.copied).toEqual([fileOf(notes)]);
    expect(split.intake).toEqual([game]);
  });

  it('sweeps a loose companion along with the game it was dropped with', () => {
    const track = { ...loose('ff7.bin'), path: 'PSX/ff7/Europe/ff7.bin', match: disc };
    const sheet = { ...loose('ff7.cue'), path: 'PSX/ff7/Europe/ff7.cue' };
    const files = [fileOf(track), fileOf(sheet)];

    const split = splitDrop(files, new Set([fileOf(track)]), [track, sheet]);

    expect(split.copied).toEqual([]);
    expect(split.intake).toEqual([track, sheet]);
    expect(split.along).toEqual([sheet]);
  });

  it('leaves the companion to be copied when the game is copied', () => {
    const track = { ...loose('ff7.bin'), path: 'PSX/ff7/Europe/ff7.bin', match: disc };
    const sheet = { ...loose('ff7.cue'), path: 'PSX/ff7/Europe/ff7.cue' };
    const files = [fileOf(track), fileOf(sheet)];

    const split = splitDrop(files, new Set(), [track, sheet]);

    expect(split.copied).toEqual(files);
    expect(split.intake).toEqual([]);
  });

  it('never takes an entry out of an archive that is being kept whole', () => {
    const game = { ...zipped('ff7.zip', 'ff7.bin', 'disc'), path: 'PSX/ff7/Europe/ff7.bin', match: disc };
    const cue = zipped('ff7.zip', 'ff7.cue', 'sheet');
    const sheet: IntakeItem = {
      ...cue,
      source: { kind: 'entry', archive: fileOf(game), entry: entryOf(cue) },
      path: 'PSX/ff7/Europe/ff7.cue',
    };
    const other = { ...loose('smw.sfc'), path: 'SNES/smw.sfc', match: match() };

    const split = splitDrop([fileOf(game), fileOf(other)], new Set([fileOf(other)]), [
      game,
      sheet,
      other,
    ]);

    expect(split.copied).toEqual([fileOf(game)]);
    expect(split.intake).toEqual([other]);
  });

  it('leaves out what is already on disk, so nothing is written twice', () => {
    const game = {
      ...zipped('smw.zip', 'smw.sfc', 'rom'),
      path: 'SNES/smw.sfc',
      match: match(),
      taken: true,
    };

    const split = splitDrop([fileOf(game)], new Set([fileOf(game)]), [game]);

    expect(split.intake).toEqual([]);
    expect(split.copied).toEqual([]);
  });
});

describe('apply', () => {
  it('copies a cartridge into its system folder, creating it', async () => {
    const written = await RomIntakeService.apply(storage.asNode(), [
      { ...loose('smw.sfc', 'bytes'), path: 'SNES/smw.sfc', match: match() },
    ]);

    expect(written).toEqual(['SNES/smw.sfc']);
    expect(storage.files.get('SNES/smw.sfc')).toBe('bytes');
    expect(storage.directories.has('SNES')).toBe(true);
  });

  it('keeps the name the file arrived with', async () => {
    await RomIntakeService.apply(storage.asNode(), [
      { ...loose('smw (u) [!].sfc'), path: 'SNES/smw (u) [!].sfc', match: match() },
    ]);

    expect([...storage.files.keys()]).toEqual(['SNES/smw (u) [!].sfc']);
  });

  it('leaves a name that is already taken alone', async () => {
    storage.files.set('SNES/smw.sfc', 'the one already there');

    const written = await RomIntakeService.apply(storage.asNode(), [
      { ...loose('smw.sfc', 'the new one'), path: 'SNES/smw.sfc', taken: true, match: match() },
    ]);

    expect(written).toEqual([]);
    expect(storage.files.get('SNES/smw.sfc')).toBe('the one already there');
  });

  it('writes nothing for a file no catalogue claimed', async () => {
    const written = await RomIntakeService.apply(storage.asNode(), [loose('notes.txt')]);

    expect(written).toEqual([]);
    expect(storage.files.size).toBe(0);
  });

  it('marks a disc game as one, so the scan does not walk past it', async () => {
    await RomIntakeService.apply(storage.asNode(), [
      { ...loose('ff7.bin'), path: 'PSX/Final Fantasy VII/Europe/ff7.bin', match: disc },
    ]);

    expect(storage.directories.has('PSX/Final Fantasy VII/Europe')).toBe(true);
    expect(JSON.parse(storage.files.get(`PSX/Final Fantasy VII/${GAME_MARKER}`)!)).toEqual({
      gameId: 'Final Fantasy VII',
      title: 'Final Fantasy VII',
      system: 'PSX',
    });
  });

  it('leaves a marker that is already there as it is', async () => {
    storage.files.set(`PSX/Final Fantasy VII/${GAME_MARKER}`, 'written by hand');

    await RomIntakeService.apply(storage.asNode(), [
      { ...loose('ff7.bin'), path: 'PSX/Final Fantasy VII/Europe/ff7.bin', match: disc },
    ]);

    expect(storage.files.get(`PSX/Final Fantasy VII/${GAME_MARKER}`)).toBe('written by hand');
  });

  it('copies the files that came along with the game', async () => {
    await RomIntakeService.apply(storage.asNode(), [
      { ...loose('ff7.bin'), path: 'PSX/Final Fantasy VII/Europe/ff7.bin', match: disc },
      {
        ...loose('ff7.cue', 'FILE "ff7.bin" BINARY'),
        path: 'PSX/Final Fantasy VII/Europe/ff7.cue',
      },
    ]);

    expect(storage.files.get('PSX/Final Fantasy VII/Europe/ff7.cue')).toBe('FILE "ff7.bin" BINARY');
  });

  it('reports every file it copies', async () => {
    const seen: string[] = [];

    await RomIntakeService.apply(
      storage.asNode(),
      [
        { ...loose('smw.sfc'), path: 'SNES/smw.sfc', match: match() },
        { ...loose('zelda.sfc'), path: 'SNES/zelda.sfc', match: match() },
      ],
      ({ file: name, done, total }) => seen.push(`${name}: ${done} of ${total}`),
    );

    expect(seen).toEqual(['smw.sfc: 0 of 2', 'zelda.sfc: 1 of 2']);
  });

  it('writes what an archive held, expanded and not as it was stored', async () => {
    const item = zipped('smw.zip', 'smw.sfc', 'rom bytes'.repeat(40));

    await RomIntakeService.apply(storage.asNode(), [
      { ...item, path: 'SNES/smw.sfc', match: match() },
    ]);

    expect(storage.files.get('SNES/smw.sfc')).toBe('rom bytes'.repeat(40));
  });

  it('stops rather than write contents the archive did not describe', async () => {
    const item = zipped('smw.zip', 'smw.sfc', 'rom bytes');
    const entry = { ...entryOf(item), crc32: 'DEADBEEF' };

    await expect(
      RomIntakeService.apply(storage.asNode(), [
        {
          ...item,
          source: { kind: 'entry', archive: (item.source as { archive: File }).archive, entry },
          path: 'SNES/smw.sfc',
          match: match(),
        },
      ]),
    ).rejects.toThrow('no es el que el archivo declaraba');

    expect(storage.files.size).toBe(0);
  });
});
