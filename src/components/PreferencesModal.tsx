import { JSX } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { CloseIcon } from './icons';
import { THEME_MODES, THEME_MODE_LABELS, type ThemeMode } from '../core/theme';
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
  regionOrder: readonly Region[];
  /** Absent while no library is open: the order is stored in the folder's `.meta`. */
  onRegionOrderChange?: (order: readonly Region[]) => void;
  onClose: () => void;
}

/**
 * The settings that belong to nowhere in particular.
 *
 * Two of them so far, and they are deliberately not of the same kind: the theme
 * is the browser's and the region order is the open library's, which the panel
 * says out loud rather than leaving the user to find out by switching tabs.
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
      aria-label="Preferencias"
      // Escape and the backdrop close the dialog on their own, so the state
      // behind it is caught up with here rather than at every closing button.
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current?.close();
      }}
    >
      <header class="modal-header">
        <h3>Preferencias</h3>
        <button class="modal-close" onClick={() => dialog.current?.close()} title="Cerrar">
          <CloseIcon />
        </button>
      </header>

      <div class="modal-content">
        <section class="prefs-group">
          <h4>Tema</h4>
          <div class="prefs-segmented" role="group" aria-label="Tema">
            {THEME_MODES.map((mode) => (
              <button
                key={mode}
                class={`prefs-segment ${mode === themeMode ? 'on' : ''}`}
                aria-pressed={mode === themeMode}
                onClick={() => onThemeModeChange(mode)}
              >
                {THEME_MODE_LABELS[mode]}
              </button>
            ))}
          </div>
          <p class="prefs-hint">Automático sigue al sistema.</p>
        </section>

        <section class="prefs-group">
          <h4>Prioridad de región</h4>
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
            {onRegionOrderChange
              ? 'Orden en que se prefieren las carátulas. Se guarda en la biblioteca abierta.'
              : 'Abre una carpeta para elegirlo: se guarda en la biblioteca.'}
          </p>
        </section>
      </div>
    </dialog>
  );
}
