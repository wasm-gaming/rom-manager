/**
 * The app's shared state, as one jq79 store the components read.
 *
 * While the UI moves off Preact, the services still keep their state in
 * `@preact/signals`; this store follows them (an `effect` per signal), so a jq79
 * template that reads `ui.locale` re-renders when the language changes, the same
 * way a Preact component did by reading the signal. Writes still go through the
 * services (`setLocalePreference`, `storeService.*`), which update the signal,
 * which updates this store. When Preact is gone the services hold a `$reactive`
 * of their own and this file becomes a re-export.
 *
 * Maps and Sets are copied into arrays: the store tracks plain objects and arrays.
 */
import { effect } from '@preact/signals';
import { $reactive } from 'jq79';
import { localePreferenceSignal, localeSignal, t as translate } from '@/services/I18nService';
import { themeModeSignal } from '@/services/ThemeService';
import {
  activeOriginIdSignal,
  errorSignal,
  knownSystemsSignal,
  loadingSignal,
  originsSignal,
  wizardSettingsSignal,
  type Origin,
} from '@/services/StoreService';
import type { MessageParams } from '@/core/i18n';
import type { Locale, LocalePreference } from '@/core/i18n';
import type { ThemeMode } from '@/core/theme';
import type { WizardSettings } from '@/services/WizardConfigService';

export interface UiState {
  locale: Locale;
  localePreference: LocalePreference;
  themeMode: ThemeMode;
  origins: Origin[];
  activeOriginId: string | undefined;
  loading: boolean;
  error: string | undefined;
  knownSystems: string[];
  wizardSettings: WizardSettings;
}

export const ui = $reactive<UiState>({
  locale: localeSignal.peek(),
  localePreference: localePreferenceSignal.peek(),
  themeMode: themeModeSignal.peek(),
  origins: Array.from(originsSignal.peek().values()),
  activeOriginId: activeOriginIdSignal.peek(),
  loading: loadingSignal.peek(),
  error: errorSignal.peek(),
  knownSystems: Array.from(knownSystemsSignal.peek()),
  wizardSettings: wizardSettingsSignal.peek(),
});

effect(() => {
  ui.locale = localeSignal.value;
});
effect(() => {
  ui.localePreference = localePreferenceSignal.value;
});
effect(() => {
  ui.themeMode = themeModeSignal.value;
});
effect(() => {
  ui.origins = Array.from(originsSignal.value.values());
});
effect(() => {
  ui.activeOriginId = activeOriginIdSignal.value;
});
effect(() => {
  ui.loading = loadingSignal.value;
});
effect(() => {
  ui.error = errorSignal.value;
});
effect(() => {
  ui.knownSystems = Array.from(knownSystemsSignal.value);
});
effect(() => {
  ui.wizardSettings = wizardSettingsSignal.value;
});

/**
 * The sentence a key stands for, in the language on screen. It reads
 * `ui.locale` first, so a template or `$:` that calls it re-runs when the
 * language changes.
 */
export function t(key: string, params?: MessageParams): string {
  void ui.locale;
  return translate(key, params);
}
