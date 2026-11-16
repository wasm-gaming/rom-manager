import { describe, expect, it } from 'vitest';
import { panelOf, readPanelState, writePanelState } from './mobile-panels';

describe('the phone panels in the URL', () => {
  it('reads system and game', () => {
    expect(readPanelState('?system=GBA&game=Kirby')).toEqual({ system: 'GBA', game: 'Kirby' });
  });

  it('ignores a game without its system', () => {
    expect(readPanelState('?game=Kirby')).toEqual({ system: undefined, game: undefined });
  });

  it('shows the deepest panel it has a choice for', () => {
    expect(panelOf({})).toBe('systems');
    expect(panelOf({ system: 'SNES' })).toBe('games');
    expect(panelOf({ system: 'SNES', game: 'Super Mario World' })).toBe('game');
  });

  it('writes the state and keeps the other parameters', () => {
    expect(writePanelState('?lang=es&system=NES&game=x', { system: 'GBA' })).toBe('?lang=es&system=GBA');
    expect(writePanelState('', { system: 'GAMEBOY', game: "Link's Awakening" })).toBe(
      "?system=GAMEBOY&game=Link%27s+Awakening",
    );
    expect(writePanelState('?system=GBA', {})).toBe('');
  });

  it('round-trips names with spaces and punctuation', () => {
    const state = { system: 'GBA', game: 'Kirby - Nightmare in Dream Land (USA)' };
    expect(readPanelState(writePanelState('', state))).toEqual(state);
  });
});
