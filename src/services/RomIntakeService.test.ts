import { beforeEach, describe, expect, it } from 'vitest';
import { GAME_MARKER } from './LibraryScanService';
import { RomIntakeService, isPlaced, type IntakeItem, type IntakeMatch } from './RomIntakeService';
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

/** A dropped file, which only ever has to answer for its name and its bytes. */
function file(name: string, content = 'rom'): File {
  return new File([content], name);
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

function item(overrides: Partial<IntakeItem> & { file: File }): IntakeItem {
  return { crc32: 'AAAA1111', ...overrides };
}

let storage: FakeStorage;

beforeEach(() => {
  storage = new FakeStorage();
});

describe('isPlaced', () => {
  it('is true for a file with somewhere to go', () => {
    expect(isPlaced(item({ file: file('smw.sfc'), path: 'SNES/smw.sfc' }))).toBe(true);
  });

  it('is false for a file nothing claimed', () => {
    expect(isPlaced(item({ file: file('notes.txt') }))).toBe(false);
  });

  it('is false for a name already taken', () => {
    expect(isPlaced(item({ file: file('smw.sfc'), path: 'SNES/smw.sfc', taken: true }))).toBe(false);
  });
});

describe('apply', () => {
  it('copies a cartridge into its system folder, creating it', async () => {
    const written = await RomIntakeService.apply(storage.asNode(), [
      item({ file: file('smw.sfc', 'bytes'), path: 'SNES/smw.sfc', match: match() }),
    ]);

    expect(written).toEqual(['SNES/smw.sfc']);
    expect(storage.files.get('SNES/smw.sfc')).toBe('bytes');
    expect(storage.directories.has('SNES')).toBe(true);
  });

  it('keeps the name the file arrived with', async () => {
    await RomIntakeService.apply(storage.asNode(), [
      item({ file: file('smw (u) [!].sfc'), path: 'SNES/smw (u) [!].sfc', match: match() }),
    ]);

    expect([...storage.files.keys()]).toEqual(['SNES/smw (u) [!].sfc']);
  });

  it('leaves a name that is already taken alone', async () => {
    storage.files.set('SNES/smw.sfc', 'the one already there');

    const written = await RomIntakeService.apply(storage.asNode(), [
      item({ file: file('smw.sfc', 'the new one'), path: 'SNES/smw.sfc', taken: true, match: match() }),
    ]);

    expect(written).toEqual([]);
    expect(storage.files.get('SNES/smw.sfc')).toBe('the one already there');
  });

  it('writes nothing for a file no catalogue claimed', async () => {
    const written = await RomIntakeService.apply(storage.asNode(), [item({ file: file('notes.txt') })]);

    expect(written).toEqual([]);
    expect(storage.files.size).toBe(0);
  });

  it('marks a disc game as one, so the scan does not walk past it', async () => {
    await RomIntakeService.apply(storage.asNode(), [
      item({
        file: file('ff7.bin'),
        path: 'PSX/Final Fantasy VII/Europe/ff7.bin',
        match: match({ system: 'PSX', media: 'disc', gameId: 'Final Fantasy VII', title: 'Final Fantasy VII', variant: 'Europe' }),
      }),
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
      item({
        file: file('ff7.bin'),
        path: 'PSX/Final Fantasy VII/Europe/ff7.bin',
        match: match({ system: 'PSX', media: 'disc', gameId: 'Final Fantasy VII', variant: 'Europe' }),
      }),
    ]);

    expect(storage.files.get(`PSX/Final Fantasy VII/${GAME_MARKER}`)).toBe('written by hand');
  });

  it('copies the files that came along with the game', async () => {
    await RomIntakeService.apply(storage.asNode(), [
      item({
        file: file('ff7.bin'),
        path: 'PSX/Final Fantasy VII/Europe/ff7.bin',
        match: match({ system: 'PSX', media: 'disc', gameId: 'Final Fantasy VII', variant: 'Europe' }),
      }),
      item({ file: file('ff7.cue', 'FILE "ff7.bin" BINARY'), path: 'PSX/Final Fantasy VII/Europe/ff7.cue' }),
    ]);

    expect(storage.files.get('PSX/Final Fantasy VII/Europe/ff7.cue')).toBe('FILE "ff7.bin" BINARY');
  });

  it('reports every file it copies', async () => {
    const seen: string[] = [];

    await RomIntakeService.apply(
      storage.asNode(),
      [
        item({ file: file('smw.sfc'), path: 'SNES/smw.sfc', match: match() }),
        item({ file: file('zelda.sfc'), path: 'SNES/zelda.sfc', match: match() }),
      ],
      ({ file: name, done, total }) => seen.push(`${name}: ${done} of ${total}`),
    );

    expect(seen).toEqual(['smw.sfc: 0 of 2', 'zelda.sfc: 1 of 2']);
  });
});
