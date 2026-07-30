import { describe, expect, it } from 'vitest';
import {
  DatGame,
  groupDatGames,
  normalizeGameName,
  parseGameName,
  sanitizeName,
  variantKey,
} from './rom-grouping';

/** Minimal DAT entry: the grouping only ever needs the name and the checksum. */
function game(name: string, crc: string, extra: Partial<DatGame> = {}): DatGame {
  return { name, crc, ...extra };
}

describe('parseGameName', () => {
  it('reads a plain title with no tags', () => {
    expect(parseGameName('Columns')).toMatchObject({ title: 'Columns', regions: [], tags: [] });
  });

  it('separates title and region', () => {
    expect(parseGameName('Sonic the Hedgehog (USA, Europe)')).toMatchObject({
      title: 'Sonic the Hedgehog',
      regions: ['USA', 'Europe'],
    });
  });

  it('tells languages from regions by their separator', () => {
    // `USA, Europe` has a space after the comma and `En,Fr,De` does not: that is
    // the only thing distinguishing the two tag kinds.
    const parsed = parseGameName('Golden Axe (USA, Europe) (En,Fr,De)');

    expect(parsed.regions).toEqual(['USA', 'Europe']);
    expect(parsed.languages).toEqual(['En', 'Fr', 'De']);
  });

  it('flattens revisions into a file-name-safe form', () => {
    expect(parseGameName('Streets of Rage (USA) (Rev A)').revision).toBe('revA');
    expect(parseGameName('Streets of Rage (USA) (Rev 1)').revision).toBe('rev1');
    expect(parseGameName('3 Block Match (World) (v1.1)').revision).toBe('v11');
  });

  it('numbers the flags that come numbered', () => {
    expect(parseGameName('Comix Zone (USA) (Beta)').flags).toEqual(['beta']);
    expect(parseGameName('Comix Zone (USA) (Beta 2)').flags).toEqual(['beta2']);
    expect(parseGameName('Virtua Racing (Japan) (Proto 1)').flags).toEqual(['proto1']);
  });

  it('reads the disc number', () => {
    expect(parseGameName('Final Fantasy VII (Europe) (Disc 2)').disc).toBe(2);
    expect(parseGameName('Riven (USA) (Disc 3 of 5)').disc).toBe(3);
  });

  it('leaves unknown tags out of the parsed fields', () => {
    // There are around 2000 distinct tags across the datasets, so anything not
    // recognized has to survive in `tags` without polluting the identity.
    const parsed = parseGameName('Gunstar Heroes (Japan) (Virtual Console)');

    expect(parsed.regions).toEqual(['Japan']);
    expect(parsed.flags).toEqual([]);
    expect(parsed.tags).toContain('Virtual Console');
  });

  it('survives the unbalanced parenthesis in the SNES dataset', () => {
    // `(^^;` is an emoticon that never closes. It is the only such name in the
    // 51216 entries. Reading the tags backwards keeps it in the title, where it
    // belongs, instead of letting it swallow the region that follows.
    expect(parseGameName('Odekake Lester - Lelele no Le (^^; (Japan)')).toMatchObject({
      title: 'Odekake Lester - Lelele no Le (^^;',
      regions: ['Japan'],
    });
  });
});

describe('normalizeGameName', () => {
  it('drops every tag', () => {
    expect(normalizeGameName('Final Fantasy VII (Europe) (Disc 1)')).toBe('Final Fantasy VII');
  });

  it('keeps the No-Intro spelling, articles included', () => {
    expect(normalizeGameName('Legend of Zelda, The - A Link to the Past (USA)')).toBe(
      'Legend of Zelda, The - A Link to the Past',
    );
  });

  it('replaces exactly the characters libretro replaces', () => {
    expect(sanitizeName('Ys III: Wanderers from Ys')).toBe('Ys III_ Wanderers from Ys');
    expect(sanitizeName('R&B / Rock*Star?')).toBe('R_B _ Rock_Star_');
  });

  it('normalizes to NFC so macOS and Windows agree on the path', () => {
    // macOS hands out decomposed paths and Windows composed ones, so the same
    // title would otherwise resolve to two different folders.
    const decomposed = 'Poke\u0301mon Puzzle';
    const composed = 'Pok\u00e9mon Puzzle';

    expect(decomposed).not.toBe(composed);
    expect(normalizeGameName(decomposed)).toBe(normalizeGameName(composed));
  });

  it('escapes names Windows reserves', () => {
    expect(normalizeGameName('CON (USA)')).toBe('_CON');
    expect(normalizeGameName('Aux (Japan)')).toBe('_Aux');
  });

  it('truncates on a word boundary', () => {
    const long = `${'Word '.repeat(40).trim()} (USA)`;
    const normalized = normalizeGameName(long);

    expect(normalized.length).toBeLessThanOrEqual(120);
    expect(normalized.endsWith('Word')).toBe(true);
  });

  it('never leaves a trailing dot or space, which filesystems drop silently', () => {
    expect(normalizeGameName('Sonic 3D Blast. (USA)')).toBe('Sonic 3D Blast');
  });
});

describe('variantKey', () => {
  it('uses the region alone when that is enough', () => {
    expect(variantKey(parseGameName('Sonic (USA)'))).toBe('USA');
  });

  it('joins multiple regions with a plus', () => {
    expect(variantKey(parseGameName('Sonic (USA, Europe)'))).toBe('USA+Europe');
  });

  it('appends revision and flags', () => {
    expect(variantKey(parseGameName('Sonic (Japan) (Rev 1) (Beta 2)'))).toBe('Japan-rev1-beta2');
  });

  it('falls back to Unknown when the name carries no region', () => {
    expect(variantKey(parseGameName('Homebrew Demo'))).toBe('Unknown');
  });
});

describe('groupDatGames', () => {
  it('gathers the releases of one game under a single entry', () => {
    const groups = groupDatGames([
      game('Sonic the Hedgehog (USA, Europe)', '11111111'),
      game('Sonic the Hedgehog (Japan)', '22222222'),
      game('Sonic the Hedgehog (Japan) (Rev 1)', '33333333'),
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].id).toBe('Sonic the Hedgehog');
    expect(groups[0].variants.map((v) => v.key)).toEqual(['Japan', 'Japan-rev1', 'USA+Europe']);
  });

  it('keeps the discs of one release together as a single variant', () => {
    // Redump lists every disc as its own entry, but they are one release: they
    // belong in one folder and must not show up as three variants.
    const groups = groupDatGames([
      game('Final Fantasy VII (Europe) (Disc 1)', 'AAAAAAAA'),
      game('Final Fantasy VII (Europe) (Disc 3)', 'CCCCCCCC'),
      game('Final Fantasy VII (Europe) (Disc 2)', 'BBBBBBBB'),
      game('Final Fantasy VII (Japan) (Disc 1)', 'DDDDDDDD'),
    ]);

    expect(groups).toHaveLength(1);

    const [europe, japan] = groups[0].variants;
    expect(europe.key).toBe('Europe');
    expect(europe.files.map((f) => f.crc)).toEqual(['AAAAAAAA', 'BBBBBBBB', 'CCCCCCCC']);
    expect(japan.files).toHaveLength(1);
  });

  it('keeps the several files of one entry together as a single variant', () => {
    // A DAT lists one entry per file, so a cartridge split into two chips is
    // named twice. Around half of the NES set looks like this.
    const groups = groupDatGames([
      game('10-Yard Fight (Japan) (En)', '11111111', { fileName: '10-Yard Fight (Japan) (En).prg' }),
      game('10-Yard Fight (Japan) (En)', '22222222', { fileName: '10-Yard Fight (Japan) (En).chr' }),
    ]);

    expect(groups[0].variants).toHaveLength(1);
    expect(groups[0].variants[0].files).toHaveLength(2);
    expect(groups[0].variants[0].key).toBe('Japan');
  });

  it('adds the language only when it is what tells two releases apart', () => {
    const groups = groupDatGames([
      game('Asterix (Europe) (En,Fr)', '11111111'),
      game('Asterix (Europe) (De,Es)', '22222222'),
      game('Asterix (USA) (En)', '33333333'),
    ]);

    const keys = groups[0].variants.map((v) => v.key);

    expect(keys).toContain('Europe-En+Fr');
    expect(keys).toContain('Europe-De+Es');
    // The USA release is alone in its region, so it stays short.
    expect(keys).toContain('USA');
  });

  it('names the release after its own tag before resorting to the checksum', () => {
    // The tag vocabulary is open-ended, so an unknown tag cannot take part in
    // the key by default. It is still far more useful than a checksum once it
    // turns out to be the only difference.
    const groups = groupDatGames([
      game('Gunstar Heroes (Japan)', 'ABCD1234'),
      game('Gunstar Heroes (Japan) (Virtual Console)', 'EF567890'),
    ]);

    expect(groups[0].variants.map((v) => v.key)).toEqual(['Japan', 'Japan-virtualconsole']);
  });

  it('drops whole words from a long tag rather than cutting one in half', () => {
    const groups = groupDatGames([
      game('Final Fantasy VII (USA)', 'ABCD1234'),
      game('Final Fantasy VII (USA) (Square Soft on PlayStation Preview)', 'EF567890'),
    ]);

    expect(groups[0].variants[1].key).toBe('USA-squaresoftonplaystation');
  });

  it('falls back to the checksum when two tags condense to the same word', () => {
    // Both spellings appear in the NES set, and dropping the separators makes
    // them collide, so at that point only the checksum is left.
    const groups = groupDatGames([
      game('1000 Stars (World) (Byte-Off 2019)', 'ABCD1234'),
      game('1000 Stars (World) (Byte Off 2019)', 'EF567890'),
    ]);

    const keys = groups[0].variants.map((v) => v.key);

    // Both sides of the clash get the suffix, so the outcome does not depend on
    // the order the DAT lists them in.
    expect(keys).toEqual([
      'World-byteoff2019-ABCD1234',
      'World-byteoff2019-EF567890',
    ]);
  });

  it('separates games whose titles sanitize to the same name', () => {
    const groups = groupDatGames([
      game('Ys III: Wanderers (USA)', '11111111'),
      game('Ys III_ Wanderers (Japan)', '22222222'),
    ]);

    expect(groups).toHaveLength(2);
    expect(new Set(groups.map((g) => g.id)).size).toBe(2);
  });

  it('uses the region of the DAT field when the name carries none', () => {
    const groups = groupDatGames([game('Aladdin', '11111111', { region: 'Brazil' })]);

    expect(groups[0].variants[0].key).toBe('Brazil');
  });

  it('is stable regardless of input order', () => {
    const entries = [
      game('Sonic (USA)', '11111111'),
      game('Sonic (Japan)', '22222222'),
      game('Altered Beast (Europe)', '33333333'),
    ];

    const forward = groupDatGames(entries);
    const backward = groupDatGames([...entries].reverse());

    expect(JSON.stringify(forward)).toBe(JSON.stringify(backward));
  });
});
