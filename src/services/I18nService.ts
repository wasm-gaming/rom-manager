/**
 * The language the interface speaks, kept on the document and remembered
 * between visits.
 *
 * Which language someone reads is a fact about whoever is sitting at the
 * browser and not about the collection they opened, so — like the theme — it
 * lives in local storage and not in the library's `.meta`: the same card plugged
 * into someone else's machine should come up in *their* language.
 *
 * The catalogues are bundled rather than fetched. There are two of them, they
 * weigh a few kilobytes, and a manager that reads a local folder has no business
 * needing the network to name its own buttons.
 *
 * `t()` reads a signal, so a component that calls it re-renders when the
 * language changes. That is the whole mechanism: no provider, no context, and
 * nothing to thread through a tree that is already deep.
 */

import { computed, signal } from '@preact/signals';
import en from '../messages/en.yaml';
import es from '../messages/es.yaml';
import {
  DEFAULT_LOCALE,
  DEFAULT_LOCALE_PREFERENCE,
  parseLocalePreference,
  resolveLocale,
  translate,
  type Locale,
  type LocalePreference,
  type MessageParams,
  type Messages,
} from '../core/i18n';

const STORAGE_KEY = 'rom-manager.locale';

/** The catalogues, by the language each one is written in. */
const CATALOGUES: Record<Locale, Messages> = { en, es };

export const localePreferenceSignal = signal<LocalePreference>(DEFAULT_LOCALE_PREFERENCE);

/** What the preference currently resolves to, which is what is on screen. */
export const localeSignal = signal<Locale>(DEFAULT_LOCALE);

/** The catalogue in use, recomputed only when the language actually changes. */
const catalogue = computed<Messages>(() => CATALOGUES[localeSignal.value] ?? CATALOGUES[DEFAULT_LOCALE]);

/** The languages the browser accepts, in the user's own order of preference. */
function accepted(): readonly string[] | undefined {
  if (typeof navigator === 'undefined') return undefined;

  return navigator.languages?.length ? navigator.languages : [navigator.language];
}

/**
 * Storage is allowed to fail — a private window or an embedder's sandbox can
 * refuse it — and a language is never worth an error message: the browser's own
 * is a perfectly good answer.
 */
function readStored(): LocalePreference {
  try {
    return parseLocalePreference(localStorage.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_LOCALE_PREFERENCE;
  }
}

function writeStored(preference: LocalePreference): void {
  try {
    localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // Nothing to do: the choice still holds for this session.
  }
}

/**
 * Tells the document what it is written in, which is what a screen reader picks
 * its voice by and what the browser offers to translate from.
 */
function apply(locale: Locale): void {
  if (typeof document !== 'undefined') document.documentElement.lang = locale;
}

function resolve(preference: LocalePreference): void {
  const locale = resolveLocale(preference, accepted());

  localeSignal.value = locale;
  apply(locale);
}

export function setLocalePreference(preference: LocalePreference): void {
  localePreferenceSignal.value = preference;
  writeStored(preference);
  resolve(preference);
}

/**
 * The sentence a key stands for, in the language on screen.
 *
 * English is consulted for anything the current catalogue is missing, so a
 * half-finished translation reads as English in places rather than as holes.
 */
export function t(key: string, params?: MessageParams): string {
  return translate(catalogue.value, CATALOGUES[DEFAULT_LOCALE], key, params);
}

/**
 * Resolves the remembered preference and keeps following the browser while it is
 * *auto*.
 *
 * Returns the way to stop watching, so the component that mounts the app can
 * hand it straight back as its cleanup — the same shape `initTheme` returns.
 */
export function initLocale(): () => void {
  const preference = readStored();

  localePreferenceSignal.value = preference;
  resolve(preference);

  if (typeof window === 'undefined') return () => undefined;

  const onLanguageChange = () => {
    const current = localePreferenceSignal.peek();
    if (current === 'auto') resolve(current);
  };

  window.addEventListener('languagechange', onLanguageChange);

  return () => window.removeEventListener('languagechange', onLanguageChange);
}
