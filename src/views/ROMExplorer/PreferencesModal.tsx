import { JSX } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { CloseIcon } from '@/components/icons';
import { THEME_MODES, type ThemeMode } from '@/core/theme';
import { LOCALE_LABELS, LOCALE_PREFERENCES, type LocalePreference } from '@/core/i18n';
import { t } from '@/services/I18nService';
import {
  LibraryStorageService,
  formatBytes,
  type LibraryStorageStatus,
} from '@/services/LibraryStorageService';
import {
  REGION_ORDERS,
  parseRegionOrder,
  regionOrderKey,
  type Region,
} from '@/core/rom-regions';

interface PreferencesModalProps {
  open: boolean;
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  locale: LocalePreference;
  onLocaleChange: (preference: LocalePreference) => void;
  regionOrder: readonly Region[];
  /** Absent while no library is open: the order is stored in the folder's `.meta`. */
  onRegionOrderChange?: (order: readonly Region[]) => void;
  /** Whether there is a library (OPFS) to report on. */
  library?: boolean;
  onClose: () => void;
}

export function PreferencesModal({
  open,
  themeMode,
  onThemeModeChange,
  locale,
  onLocaleChange,
  regionOrder,
  onRegionOrderChange,
  library = false,
  onClose,
}: PreferencesModalProps): JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null);
  const [storage, setStorage] = useState<LibraryStorageStatus | undefined>();

  // Read each time the panel opens: an import since the last look changes it.
  useEffect(() => {
    if (!open || !library) return;
    LibraryStorageService.status().then(setStorage).catch(() => setStorage(undefined));
  }, [open, library]);

  const askPersistence = async () => {
    await LibraryStorageService.persist();
    setStorage(await LibraryStorageService.status());
  };

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

        {library && (
          <section class="prefs-group">
            <h4>{t('prefs.storage.title')}</h4>
            {storage?.usage != null && storage.quota != null ? (
              <>
                <div class="prefs-storage-meter" aria-hidden="true">
                  <span style={{ width: `${Math.min(100, (storage.usage / storage.quota) * 100)}%` }} />
                </div>
                <p class="prefs-hint">
                  {t('prefs.storage.usage', {
                    used: formatBytes(storage.usage),
                    quota: formatBytes(storage.quota),
                  })}
                </p>
              </>
            ) : (
              <p class="prefs-hint">{t('prefs.storage.unknown')}</p>
            )}
            {storage?.persistent ? (
              <p class="prefs-hint">{t('prefs.storage.persistent')}</p>
            ) : (
              <>
                <p class="prefs-hint">{t('prefs.storage.bestEffort')}</p>
                <button class="prefs-segment" onClick={() => void askPersistence()}>
                  {t('prefs.storage.ask')}
                </button>
              </>
            )}
          </section>
        )}
      </div>
    </dialog>
  );
}
