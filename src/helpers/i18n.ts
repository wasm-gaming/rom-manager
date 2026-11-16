/**
 * The language the interface speaks: what the user asked for, what the browser
 * asks for on their behalf, and how a key becomes a sentence.
 *
 * Three preferences rather than two, for the same reason the theme has three:
 * *auto* is a real answer. A browser set to Spanish should open in Spanish, and
 * keep doing so when it is set to something else — while an explicit choice
 * keeps holding when the two disagree.
 *
 * Pure TypeScript: where the choice is stored, which catalogue is loaded and how
 * the document is told about it belong to the service. Keeping the decisions out
 * of it makes them testable without a browser.
 */

/** The languages the app is written in. English is the one that is complete. */
export const LOCALES = ['en', 'es'] as const;

export type Locale = (typeof LOCALES)[number];

/** What the user picks, *auto* meaning «whatever the browser is set to». */
export type LocalePreference = Locale | 'auto';

export const LOCALE_PREFERENCES: readonly LocalePreference[] = ['auto', ...LOCALES];

/**
 * The fallback, and the reference catalogue: a key missing from a translation is
 * looked up here before it is given up on.
 */
export const DEFAULT_LOCALE: Locale = 'en';

export const DEFAULT_LOCALE_PREFERENCE: LocalePreference = 'auto';

/** How each language names itself, which is how a language picker names it. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
};

/** A catalogue: areas nested to any depth, with sentences at the leaves. */
export interface Messages {
  [key: string]: string | Messages;
}

/** The values a sentence can be given to put inside itself. */
export type MessageParams = Record<string, string | number>;

export function isLocale(value: unknown): value is Locale {
  return LOCALES.some((locale) => locale === value);
}

/**
 * A stored or chosen preference, or *auto* when it is neither.
 *
 * The choice survives in browser storage, which anything can have written to, so
 * an unknown value has to resolve to something speakable rather than leave the
 * app wordless.
 */
export function parseLocalePreference(value: unknown): LocalePreference {
  return LOCALE_PREFERENCES.find((preference) => preference === value) ?? DEFAULT_LOCALE_PREFERENCE;
}

/**
 * The language a list of accepted ones asks for.
 *
 * Matched on the primary subtag, so `es-419` and `es-ES` are both Spanish: the
 * app has no regional variants to tell apart, and refusing a Mexican browser the
 * Spanish it asked for would be pedantry. The list is in the user's own order of
 * preference, so the first tag the app can speak wins.
 */
export function negotiateLocale(languages: readonly string[] | undefined): Locale {
  for (const tag of languages ?? []) {
    const primary = tag.toLowerCase().split('-')[0];
    const match = LOCALES.find((locale) => locale === primary);
    if (match) return match;
  }

  return DEFAULT_LOCALE;
}

/** The language a preference resolves to, given what the browser accepts. */
export function resolveLocale(
  preference: LocalePreference,
  languages: readonly string[] | undefined,
): Locale {
  return preference === 'auto' ? negotiateLocale(languages) : preference;
}

/** The sentence at a dotted key, or nothing when the catalogue has no such leaf. */
function lookup(messages: Messages, key: string): string | undefined {
  let current: string | Messages | undefined = messages;

  for (const step of key.split('.')) {
    if (typeof current !== 'object' || current === null) return undefined;
    current = current[step];
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Puts the values into the sentence. Placeholders are named — `{file}`, and not
 * a position — so a translation is free to reorder them, which is half the point
 * of translating rather than concatenating.
 *
 * A placeholder nobody supplied is left as it is: a sentence with `{file}` still
 * in it says which value went missing, where a blank would only look like a
 * typo.
 */
function interpolate(sentence: string, params?: MessageParams): string {
  if (!params) return sentence;

  return sentence.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    name in params ? String(params[name]) : placeholder,
  );
}

/**
 * The sentence a key stands for, in the catalogue given, falling back to the
 * reference one and finally to the key itself.
 *
 * Showing the key is deliberate. A hole in a catalogue is a bug, and `welcome.
 * pitch` on screen is a bug that reports itself; an empty string is one that
 * hides until someone happens to look at that panel in that language.
 */
export function translate(
  messages: Messages,
  fallback: Messages,
  key: string,
  params?: MessageParams,
): string {
  const sentence = lookup(messages, key) ?? lookup(fallback, key);

  return sentence === undefined ? key : interpolate(sentence, params);
}

/** Every dotted key of a catalogue, which is what comparing two of them needs. */
export function messageKeys(messages: Messages, prefix = ''): string[] {
  return Object.entries(messages).flatMap(([step, value]) => {
    const key = prefix ? `${prefix}.${step}` : step;

    return typeof value === 'string' ? [key] : messageKeys(value, key);
  });
}
