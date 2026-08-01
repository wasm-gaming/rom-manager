/**
 * The look of the app: what the user asked for, and what that paints as.
 *
 * Three modes rather than two, because *auto* is a real answer and not the
 * absence of one: a desktop that turns dark at dusk should take the app with
 * it. The system is only ever consulted for that mode, so an explicit choice
 * keeps holding when the two disagree.
 *
 * Pure TypeScript: where the choice is stored and how it reaches the stylesheet
 * belong to the service, and keeping the decision out of them makes it testable
 * without a document.
 */

/** What the user picks. */
export type ThemeMode = 'auto' | 'light' | 'dark';

/** What the stylesheet paints with, which `auto` never is. */
export type Theme = 'light' | 'dark';

/** The modes, in the order the preferences panel offers them. */
export const THEME_MODES: readonly ThemeMode[] = ['auto', 'light', 'dark'];

export const DEFAULT_THEME_MODE: ThemeMode = 'auto';

/**
 * A stored or chosen mode, or the default when it is neither.
 *
 * The choice survives in browser storage, which anything can have written to,
 * so an unknown value has to resolve to something paintable rather than leave
 * the app with no colours.
 */
export function parseThemeMode(value: unknown): ThemeMode {
  return THEME_MODES.find((mode) => mode === value) ?? DEFAULT_THEME_MODE;
}

/** The theme a mode paints as, given what the system currently asks for. */
export function resolveTheme(mode: ThemeMode, prefersDark: boolean): Theme {
  if (mode === 'auto') return prefersDark ? 'dark' : 'light';
  return mode;
}
