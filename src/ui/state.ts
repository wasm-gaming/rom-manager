/**
 * The app's shared state, as the components read it: one object over the
 * services' own jq79 stores (`appState`, `i18nState`, `themeState`).
 *
 * A class instance passes through a component's store untouched, so each getter
 * reads the service's store at the moment a template or a `$:` asks — and that
 * read is what makes it follow the change. Writes go through the services
 * (`storeService.*`, `setLocalePreference`, `setThemeMode`).
 */
import { appState, type Origin } from '@/services/StoreService';
import { i18nState, t } from '@/services/I18nService';
import { themeState } from '@/services/ThemeService';
import type { Locale, LocalePreference } from '@/core/i18n';
import type { ThemeMode } from '@/core/theme';
import type { WizardSettings } from '@/services/WizardConfigService';

class UiState {
  get locale(): Locale {
    return i18nState.locale;
  }
  get localePreference(): LocalePreference {
    return i18nState.preference;
  }
  get themeMode(): ThemeMode {
    return themeState.mode;
  }
  get origins(): Origin[] {
    return appState.origins;
  }
  get activeOriginId(): string | undefined {
    return appState.activeOriginId;
  }
  get loading(): boolean {
    return appState.loading;
  }
  get error(): string | undefined {
    return appState.error;
  }
  get knownSystems(): string[] {
    return appState.knownSystems;
  }
  get wizardSettings(): WizardSettings {
    return appState.wizardSettings;
  }
}

export const ui = new UiState();

/** The sentence a key stands for, in the language on screen (it follows the language). */
export { t };
