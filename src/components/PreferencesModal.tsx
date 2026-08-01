import { JSX } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { CloseIcon } from './icons';
import { THEME_MODES, type ThemeMode } from '../core/theme';
import { LOCALE_LABELS, LOCALE_PREFERENCES, type LocalePreference } from '../core/i18n';
import { t } from '../services/I18nService';
import {
  REGION_ORDERS,
  parseRegionOrder,
  regionOrderKey,
  type Region,
} from '../core/rom-regions';

interface PreferencesModalProps {
  open: boolean;
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  locale: LocalePreference;
  onLocaleChange: (preference: LocalePreference) => void;
  regionOrder: readonly Region[];
  /** Absent while no library is open: the order is stored in the folder's `.meta`. */
  onRegionOrderChange?: (order: readonly Region[]) => void;
  onClose: () => void;
}

/**
 * The settings that belong to nowhere in particular.
 *
 * Three of them so far, and they are deliberately not of the same kind: the
 * theme and the language are the browser's, the region order is the open
 * library's, which the panel says out loud rather than leaving the user to find
 * out by switching tabs.
 *
 * A real `<dialog>`, opened with `showModal`, so the top layer, the backdrop,
 * the focus trap and Escape are the browser's business and not ours. It stays
 * mounted and merely closed, because a panel torn out of the tree cannot be
 * seen fading out.
 */
export function PreferencesModal({
  open,
  themeMode,
  onThemeModeChange,
  locale,
  onLocaleChange,
  regionOrder,
  onRegionOrderChange,
  onClose,
}: PreferencesModalProps): JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      class="modal-dialog"
      aria-label={t('prefs.title')}
      // Escape and the backdrop close the dialog on their own, so the state
      // behind it is caught up with here rather than at every closing button.
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current?.close();
      }}
    >
      <header class="modal-header">
        <h3>{t('prefs.title')}</h3>
        <button
          class="modal-close"
          onClick={() => dialog.current?.close()}
          title={t('prefs.close')}
        >
          <CloseIcon />
        </button>
      </header>

      <div class="modal-content">
        <section class="prefs-group">
          <h4>{t('prefs.theme.title')}</h4>
          <div class="prefs-segmented" role="group" aria-label={t('prefs.theme.title')}>
            {THEME_MODES.map((mode) => (
              <button
                key={mode}
                class={`prefs-segment ${mode === themeMode ? 'on' : ''}`}
                aria-pressed={mode === themeMode}
                onClick={() => onThemeModeChange(mode)}
              >
                {t(`prefs.theme.${mode}`)}
              </button>
            ))}
          </div>
          <p class="prefs-hint">{t('prefs.theme.hint')}</p>
        </section>

        <section class="prefs-group">
          <h4>{t('prefs.locale.title')}</h4>
          {/* Each language named in itself, so someone who opened the app in one
              they cannot read still recognises the one they can. */}
          <div class="prefs-segmented" role="group" aria-label={t('prefs.locale.title')}>
            {LOCALE_PREFERENCES.map((preference) => (
              <button
                key={preference}
                class={`prefs-segment ${preference === locale ? 'on' : ''}`}
                aria-pressed={preference === locale}
                onClick={() => onLocaleChange(preference)}
              >
                {preference === 'auto' ? t('prefs.locale.auto') : LOCALE_LABELS[preference]}
              </button>
            ))}
          </div>
          <p class="prefs-hint">{t('prefs.locale.hint')}</p>
        </section>

        <section class="prefs-group">
          <h4>{t('prefs.regions.title')}</h4>
          {/* A game has a boxart per region, so which one shows is a choice —
              and for a world release, whose single file ships everywhere, it is
              the only thing that decides. */}
          <select
            class="prefs-select"
            value={regionOrderKey(regionOrder)}
            disabled={!onRegionOrderChange}
            onChange={(event) =>
              onRegionOrderChange?.(parseRegionOrder((event.target as HTMLSelectElement).value))
            }
          >
            {REGION_ORDERS.map((order) => (
              <option key={regionOrderKey(order)} value={regionOrderKey(order)}>
                {regionOrderKey(order)}
              </option>
            ))}
          </select>
          <p class="prefs-hint">
            {onRegionOrderChange ? t('prefs.regions.hint') : t('prefs.regions.locked')}
          </p>
        </section>
      </div>
    </dialog>
  );
}
