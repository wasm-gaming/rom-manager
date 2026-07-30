/**
 * Keeps the chosen look on the document and remembers it between visits.
 *
 * The mode is a preference of whoever is sitting at the browser, not of the
 * collection they opened, so it lives in local storage and not in the library's
 * `.meta` — the same card plugged into someone else's dark desktop should come
 * up dark.
 *
 * Only the resolved theme ever reaches the stylesheet, as `data-theme` on the
 * root element. That way the CSS has one dark block instead of one for the
 * explicit choice and another for `prefers-color-scheme`, and *auto* stays
 * honest: the system query is watched, so a desktop switching at dusk switches
 * the app with it.
 */

import { signal } from '@preact/signals';
import {
  DEFAULT_THEME_MODE,
  parseThemeMode,
  resolveTheme,
  type ThemeMode,
} from '../core/theme';

const STORAGE_KEY = 'rom-manager.theme';

const DARK_QUERY = '(prefers-color-scheme: dark)';

export const themeModeSignal = signal<ThemeMode>(DEFAULT_THEME_MODE);

/**
 * Storage is allowed to fail — a private window or an embedder's sandbox can
 * refuse it — and a theme is never worth an error message: the default paints
 * perfectly well.
 */
function readStored(): ThemeMode {
  try {
    return parseThemeMode(localStorage.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_THEME_MODE;
  }
}

function writeStored(mode: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Nothing to do: the choice still holds for this session.
  }
}

function darkQuery(): MediaQueryList | undefined {
  return typeof matchMedia === 'function' ? matchMedia(DARK_QUERY) : undefined;
}

function apply(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;

  document.documentElement.dataset.theme = resolveTheme(mode, darkQuery()?.matches ?? false);
}

export function setThemeMode(mode: ThemeMode): void {
  themeModeSignal.value = mode;
  writeStored(mode);
  apply(mode);
}

/**
 * Paints the remembered mode and keeps following the system while it is *auto*.
 *
 * Returns the way to stop watching, so a component that mounts the app can hand
 * it straight back as its cleanup.
 */
export function initTheme(): () => void {
  const mode = readStored();
  themeModeSignal.value = mode;
  apply(mode);

  const query = darkQuery();
  if (!query) return () => undefined;

  const onSystemChange = () => apply(themeModeSignal.peek());
  query.addEventListener('change', onSystemChange);

  return () => query.removeEventListener('change', onSystemChange);
}
