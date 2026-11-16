import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME_MODE, parseThemeMode, resolveTheme, THEME_MODES } from './theme';

describe('parseThemeMode', () => {
  it('keeps a mode the app knows', () => {
    for (const mode of THEME_MODES) expect(parseThemeMode(mode)).toBe(mode);
  });

  it('falls back to the default for anything else', () => {
    // Browser storage is not ours alone, so a stored 'sepia' cannot leave the
    // app without colours.
    expect(parseThemeMode('sepia')).toBe(DEFAULT_THEME_MODE);
    expect(parseThemeMode(null)).toBe(DEFAULT_THEME_MODE);
    expect(parseThemeMode(undefined)).toBe(DEFAULT_THEME_MODE);
    expect(parseThemeMode(1)).toBe(DEFAULT_THEME_MODE);
  });
});

describe('resolveTheme', () => {
  it('follows the system in auto', () => {
    expect(resolveTheme('auto', true)).toBe('dark');
    expect(resolveTheme('auto', false)).toBe('light');
  });

  it('ignores the system when the user has chosen', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });
});
