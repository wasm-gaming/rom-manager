import { JSX } from 'preact';
import type { OrganizePlan } from '../core/rom-organize';
import type { UndoRecord } from '../services/OrganizeService';

/** How many rows of each list are worth rendering; a plan can hold thousands. */
const PREVIEW_LIMIT = 200;

interface OrganizePanelProps {
  system: string;
  plan: OrganizePlan;
  /** Set once the plan has run, which turns the panel into a report. */
  applied?: UndoRecord;
  busy?: string;
  onConfirm: () => void;
  onUndo: () => void;
  onClose: () => void;
}

function shorten<T>(items: T[]): T[] {
  return items.slice(0, PREVIEW_LIMIT);
}

/**
 * The preview standing between the user and the only operation that moves
 * their ROMs.
 *
 * Nothing here happens on opening: the panel shows what would change and waits.
 * Conflicts are listed as prominently as moves, because a file the manager
 * refuses to touch is the thing the user most needs to know about.
 */
export function OrganizePanel({
  system,
  plan,
  applied,
  busy,
  onConfirm,
  onUndo,
  onClose,
}: OrganizePanelProps): JSX.Element {
  const hidden = plan.moves.length - PREVIEW_LIMIT;

  return (
    <div class="organize-backdrop" onClick={busy ? undefined : onClose}>
      <div class="organize-panel" onClick={(event) => event.stopPropagation()}>
        <header class="organize-header">
          <h2>{applied ? `${system} organizado` : `Organizar ${system}`}</h2>
          <button class="organize-close" onClick={onClose} disabled={Boolean(busy)}>
            ✕
          </button>
        </header>

        <div class="organize-summary">
          <span>
            <strong>{plan.moves.length}</strong> por mover
          </span>
          <span>
            <strong>{plan.settled}</strong> ya en su sitio
          </span>
          {plan.markers.length > 0 && (
            <span>
              <strong>{plan.markers.length}</strong> juegos marcados
            </span>
          )}
          {plan.conflicts.length > 0 && (
            <span class="organize-warn">
              <strong>{plan.conflicts.length}</strong> sin tocar
            </span>
          )}
        </div>

        {busy && <div class="organize-busy">{busy}</div>}

        <div class="organize-body">
          {plan.conflicts.length > 0 && (
            <section>
              <h3>No se tocan</h3>
              <ul class="organize-list">
                {shorten(plan.conflicts).map((conflict) => (
                  <li key={conflict.from} class="organize-conflict">
                    <code>{conflict.from}</code>
                    <small>
                      {conflict.reason === 'duplicate-target'
                        ? 'otro fichero reclama el mismo nombre'
                        : conflict.reason === 'target-taken'
                          ? 'el nombre de destino ya está ocupado'
                          : 'varios ficheros se reclaman el sitio entre sí'}
                    </small>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {plan.moves.length > 0 && (
            <section>
              <h3>{applied ? 'Movidos' : 'Se moverán'}</h3>
              <ul class="organize-list">
                {shorten(plan.moves).map((move) => (
                  <li key={move.from}>
                    <code>{move.from}</code>
                    <span class="organize-arrow">→</span>
                    <code>{move.to}</code>
                  </li>
                ))}
              </ul>
              {hidden > 0 && <p class="organize-more">y {hidden} más</p>}
            </section>
          )}

          {plan.moves.length === 0 && plan.conflicts.length === 0 && (
            <p class="organize-empty">Todo está donde el catálogo dice que debe estar.</p>
          )}
        </div>

        <footer class="organize-actions">
          {applied ? (
            <>
              <button onClick={onUndo} disabled={Boolean(busy)}>
                Deshacer
              </button>
              <button class="primary" onClick={onClose} disabled={Boolean(busy)}>
                Hecho
              </button>
            </>
          ) : (
            <>
              <button onClick={onClose} disabled={Boolean(busy)}>
                Cancelar
              </button>
              <button
                class="primary danger"
                onClick={onConfirm}
                disabled={Boolean(busy) || plan.moves.length + plan.markers.length === 0}
              >
                Mover {plan.moves.length} ficheros
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}
