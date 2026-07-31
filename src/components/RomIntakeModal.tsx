import { JSX } from 'preact';
import { CloseIcon } from './icons';
import { useEffect, useRef } from 'preact/hooks';
import type { ZipRefusal } from '../core/zip-directory';
import { isPlaced, type IntakeItem } from '../services/RomIntakeService';

interface RomIntakeModalProps {
  items: IntakeItem[];
  /** What is being copied, while it is being copied. */
  busy?: string;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Why something that was dropped is not on the table, in so many words. */
const REFUSALS: Record<ZipRefusal, string> = {
  zip64: 'el archivo usa Zip64, que esta versión no sabe leer',
  encrypted: 'está cifrado',
  method: 'usa una compresión que esta versión no sabe leer',
  damaged: 'no se ha podido leer su índice',
};

/**
 * What a game dropped on the app turned out to be, before it is taken in.
 *
 * Everything here was worked out from the bytes — the system, the game, the
 * folder it would go in — and none of it is anything the user asked for, so it
 * is all said out loud and waits: adding a file to a library is easy to do by
 * accident and, once several systems' folders exist, tedious to undo by hand.
 *
 * A real `<dialog>` opened with `showModal`, so the top layer, the backdrop, the
 * focus trap and Escape are the browser's business.
 */
export function RomIntakeModal({
  items,
  busy,
  error,
  onConfirm,
  onCancel,
}: RomIntakeModalProps): JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal();
  }, []);

  const games = items.filter((item) => item.match && !item.refused);
  /** Files that go along with a game without being one: a `.cue`, a manual. */
  const companions = items.filter((item) => !item.match && item.path && !item.refused);
  const strays = items.filter((item) => !item.path && !item.refused);
  const refused = items.filter((item) => item.refused);
  const adding = items.filter(isPlaced).length;

  const systems = new Set(games.map((item) => item.match!.system));

  return (
    <dialog
      ref={dialog}
      class="modal-dialog drop-dialog"
      aria-label="Añadir juegos a la biblioteca"
      onClose={onCancel}
      onClick={(event) => {
        if (event.target === dialog.current && !busy) dialog.current?.close();
      }}
    >
      <header class="modal-header">
        <h3>{systems.size === 1 ? `Añadir a ${[...systems][0]}` : 'Añadir a la biblioteca'}</h3>
        <button class="modal-close" onClick={() => dialog.current?.close()} disabled={Boolean(busy)}>
          <CloseIcon />
        </button>
      </header>

      <div class="modal-content">
        {error && <div class="lookup-error">{error}</div>}

        {games.length > 0 && (
          <section class="prefs-group">
            <h4>{games.length > 1 ? `Juegos (${games.length})` : 'Juego'}</h4>
            <ul class="intake-list">
              {games.map((item, at) => (
                <li key={`${at}:${item.name}`} class={`intake-item ${item.taken ? 'taken' : ''}`}>
                  <span class="intake-title">{item.match!.title}</span>
                  <span class="intake-where">
                    {item.match!.system} · {item.match!.variant}
                    {item.archive && <span class="intake-archive">de {item.archive}</span>}
                  </span>
                  <span class="intake-path" title={item.path}>
                    {item.taken ? `Ya está en ${item.path}` : item.path}
                  </span>
                </li>
              ))}
            </ul>
            <p class="prefs-hint">
              La carpeta se crea si no existe. Lo que sale de un archivo se descomprime, y se
              comprueba que sea lo que el archivo decía.
            </p>
          </section>
        )}

        {companions.length > 0 && (
          <section class="prefs-group">
            <h4>{companions.length > 1 ? 'Ficheros que van con él' : 'Fichero que va con él'}</h4>
            <ul class="drop-files">
              {companions.map((item, at) => (
                <li key={`${at}:${item.name}`} class={item.taken ? 'taken' : ''}>
                  {item.taken ? `${item.name} (ya está ahí)` : item.name}
                </li>
              ))}
            </ul>
            <p class="prefs-hint">No están en el catálogo, así que se copian junto al juego.</p>
          </section>
        )}

        {strays.length > 0 && (
          <section class="prefs-group">
            <h4>Sin reconocer</h4>
            <ul class="drop-files">
              {strays.map((item, at) => (
                <li key={`${at}:${item.name}`}>
                  {item.name}
                  {item.archive && <small class="intake-archive">de {item.archive}</small>}
                </li>
              ))}
            </ul>
            <p class="prefs-hint">
              Ningún catálogo los reclama, así que no se copian: elige una carpeta en el árbol para
              meterlos tal cual.
            </p>
          </section>
        )}

        {refused.length > 0 && (
          <section class="prefs-group">
            <h4>No se pueden abrir</h4>
            <ul class="drop-files">
              {refused.map((item, at) => (
                <li key={`${at}:${item.name}`}>
                  {item.name} — {REFUSALS[item.refused!]}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" onClick={() => dialog.current?.close()} disabled={Boolean(busy)}>
          Cancelar
        </button>
        <button class="btn-apply" onClick={onConfirm} disabled={Boolean(busy) || adding === 0}>
          {busy ?? `Añadir ${adding > 1 ? adding : ''}`.trim()}
        </button>
      </div>
    </dialog>
  );
}
