import { JSX } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import {
  GLOBAL_SCOPE,
  isImageName,
  MEDIA_KIND_LABELS,
  MEDIA_KINDS,
  MEDIA_SCOPE_LABELS,
  MEDIA_SCOPES,
  type MediaKind,
  type MediaScope,
} from '../core/rom-media';

/** An image about to be kept, and what it is a picture of. */
export interface DroppedImage {
  file: File;
  kind: MediaKind;
  scope: MediaScope;
}

/**
 * Where a dropped file can go.
 *
 * A game takes images into its metadata and files into the folder its ROMs live
 * in; a folder takes anything, as it is. Those are the two, and a selection that
 * is neither never gets this far.
 */
export type DropTarget =
  | { kind: 'game'; title: string; folder: string }
  | { kind: 'folder'; path: string };

interface MediaDropModalProps {
  files: File[];
  target: DropTarget;
  /** What is being written, while it is being written. */
  busy?: string;
  error?: string;
  onConfirm: (images: DroppedImage[], files: File[]) => void;
  onCancel: () => void;
}

/**
 * What a drop on the details pane is about to do, before it does it.
 *
 * Dropping a file is easy to do by accident and hard to undo, so nothing is
 * written until this says what would be — and for an image it is also where the
 * two things only the user knows are asked: what the picture is of, and which
 * region's box it is. Those two are what the file name is made of, so they cannot
 * be guessed from the bytes.
 *
 * A real `<dialog>` opened with `showModal`, so the top layer, the backdrop, the
 * focus trap and Escape are the browser's business.
 */
export function MediaDropModal({
  files,
  target,
  busy,
  error,
  onConfirm,
  onCancel,
}: MediaDropModalProps): JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null);

  /** Images only get asked about on a game: a folder takes them as they are. */
  const images = target.kind === 'game' ? files.filter((file) => isImageName(file.name)) : [];
  const rest = files.filter((file) => !images.includes(file));

  const [choices, setChoices] = useState<Record<string, { kind: MediaKind; scope: MediaScope }>>(
    () => Object.fromEntries(images.map((file) => [file.name, { kind: 'case' as MediaKind, scope: GLOBAL_SCOPE as MediaScope }])),
  );

  useEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal();
  }, []);

  const choiceOf = (file: File) => choices[file.name] ?? { kind: 'case' as MediaKind, scope: GLOBAL_SCOPE as MediaScope };

  const update = (file: File, change: Partial<{ kind: MediaKind; scope: MediaScope }>) =>
    setChoices((current) => ({ ...current, [file.name]: { ...choiceOf(file), ...change } }));

  const confirm = () =>
    onConfirm(
      images.map((file) => ({ file, ...choiceOf(file) })),
      rest,
    );

  const destination =
    target.kind === 'game'
      ? `${target.folder || 'la raíz'}`
      : `${target.path || 'la raíz'}`;

  return (
    <dialog
      ref={dialog}
      class="modal-dialog drop-dialog"
      aria-label="Añadir ficheros"
      onClose={onCancel}
      onClick={(event) => {
        if (event.target === dialog.current && !busy) dialog.current?.close();
      }}
    >
      <header class="modal-header">
        <h3>
          {target.kind === 'game' ? `Añadir a ${target.title}` : `Añadir a ${target.path || 'la raíz'}`}
        </h3>
        <button class="modal-close" onClick={() => dialog.current?.close()} disabled={Boolean(busy)}>
          ✕
        </button>
      </header>

      <div class="modal-content">
        {error && <div class="lookup-error">{error}</div>}

        {images.length > 0 && (
          <section class="prefs-group">
            <h4>{images.length > 1 ? 'Imágenes' : 'Imagen'}</h4>
            {/* Kind and region are what the file name is made of, so the image
                dropped for EU is read back as the box of EU. */}
            <ul class="drop-images">
              {images.map((file) => (
                <li key={file.name} class="drop-image">
                  <span class="drop-image-name" title={file.name}>
                    {file.name}
                  </span>
                  <select
                    class="prefs-select"
                    value={choiceOf(file).kind}
                    disabled={Boolean(busy)}
                    onChange={(event) =>
                      update(file, { kind: (event.target as HTMLSelectElement).value as MediaKind })
                    }
                  >
                    {MEDIA_KINDS.map((kind) => (
                      <option key={kind} value={kind}>
                        {MEDIA_KIND_LABELS[kind]}
                      </option>
                    ))}
                  </select>
                  <select
                    class="prefs-select"
                    value={choiceOf(file).scope}
                    disabled={Boolean(busy)}
                    onChange={(event) =>
                      update(file, {
                        scope: (event.target as HTMLSelectElement).value as MediaScope,
                      })
                    }
                  >
                    {MEDIA_SCOPES.map((scope) => (
                      <option key={scope} value={scope}>
                        {MEDIA_SCOPE_LABELS[scope]}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
            <p class="prefs-hint">
              Se guardan en la metadata del juego y sustituyen a la carátula publicada de esa
              región.
            </p>
          </section>
        )}

        {rest.length > 0 && (
          <section class="prefs-group">
            <h4>{rest.length > 1 ? 'Ficheros' : 'Fichero'}</h4>
            <ul class="drop-files">
              {rest.map((file) => (
                <li key={file.name}>{file.name}</li>
              ))}
            </ul>
            <p class="prefs-hint">Se copian tal cual a {destination}.</p>
          </section>
        )}
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" onClick={() => dialog.current?.close()} disabled={Boolean(busy)}>
          Cancelar
        </button>
        <button class="btn-apply" onClick={confirm} disabled={Boolean(busy)}>
          {busy ?? `Añadir ${files.length > 1 ? files.length : ''}`.trim()}
        </button>
      </div>
    </dialog>
  );
}
