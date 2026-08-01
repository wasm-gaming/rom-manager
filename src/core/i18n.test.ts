import { describe, expect, it } from 'vitest';
import en from '../messages/en.yaml';
import es from '../messages/es.yaml';
import {
  messageKeys,
  negotiateLocale,
  parseLocalePreference,
  resolveLocale,
  translate,
  type Messages,
} from './i18n';

describe('negotiateLocale', () => {
  it('takes the first language the app speaks, in the browser order', () => {
    expect(negotiateLocale(['es-ES', 'en-GB'])).toBe('es');
    expect(negotiateLocale(['en-GB', 'es-ES'])).toBe('en');
  });

  it('matches on the primary subtag, so every Spanish is Spanish', () => {
    expect(negotiateLocale(['es-419'])).toBe('es');
    expect(negotiateLocale(['ES'])).toBe('es');
  });

  it('falls back to English for a language it does not speak, or for none', () => {
    expect(negotiateLocale(['fr-FR', 'de'])).toBe('en');
    expect(negotiateLocale([])).toBe('en');
    expect(negotiateLocale(undefined)).toBe('en');
  });
});

describe('parseLocalePreference', () => {
  it('keeps a preference it recognises', () => {
    expect(parseLocalePreference('es')).toBe('es');
    expect(parseLocalePreference('auto')).toBe('auto');
  });

  it('reads anything else as automatic, storage being writable by anyone', () => {
    expect(parseLocalePreference('klingon')).toBe('auto');
    expect(parseLocalePreference(null)).toBe('auto');
    expect(parseLocalePreference(7)).toBe('auto');
  });
});

describe('resolveLocale', () => {
  it('only consults the browser while the preference is automatic', () => {
    expect(resolveLocale('auto', ['es'])).toBe('es');
    expect(resolveLocale('en', ['es'])).toBe('en');
  });
});

describe('translate', () => {
  const catalogue: Messages = {
    welcome: { open: 'Abrir carpeta', hello: 'Hola, {name}' },
  };
  const fallback: Messages = {
    welcome: { open: 'Open folder', hello: 'Hello, {name}', hint: 'Nothing is uploaded' },
  };

  it('reads the sentence at a dotted key', () => {
    expect(translate(catalogue, fallback, 'welcome.open')).toBe('Abrir carpeta');
  });

  it('puts the named values into it', () => {
    expect(translate(catalogue, fallback, 'welcome.hello', { name: 'Ada' })).toBe('Hola, Ada');
  });

  it('leaves a placeholder nobody supplied alone, so the hole is visible', () => {
    expect(translate(catalogue, fallback, 'welcome.hello')).toBe('Hola, {name}');
  });

  it('falls back to the reference catalogue for a key it is missing', () => {
    expect(translate(catalogue, fallback, 'welcome.hint')).toBe('Nothing is uploaded');
  });

  it('returns the key itself when nothing has it', () => {
    expect(translate(catalogue, fallback, 'welcome.nowhere')).toBe('welcome.nowhere');
  });

  it('never returns a branch as if it were a sentence', () => {
    expect(translate(catalogue, fallback, 'welcome')).toBe('welcome');
  });
});

describe('the catalogues', () => {
  it('say the same things: Spanish holds every key English does', () => {
    const missing = messageKeys(en).filter((key) => !messageKeys(es).includes(key));

    expect(missing).toEqual([]);
  });

  it('and nothing English does not, so no key outlives its reference', () => {
    const extra = messageKeys(es).filter((key) => !messageKeys(en).includes(key));

    expect(extra).toEqual([]);
  });

  it('keep the same placeholders in both languages', () => {
    const placeholders = (messages: Messages, key: string) =>
      (translate(messages, messages, key).match(/\{\w+\}/g) ?? []).sort();

    for (const key of messageKeys(en)) {
      expect(placeholders(es, key), key).toEqual(placeholders(en, key));
    }
  });
});
