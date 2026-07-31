import { JSX } from 'preact';
import { CloseIcon } from './icons';
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
import {
  itemsOf,
  offerOf,
  splitDrop,
  type IntakeItem,
  type IntakeOffer,
} from '../services/RomIntakeService';

/** An image about to be kept, and what it is a picture of. */
export interface DroppedImage {
  file: File;
  kind: MediaKind;
  scope: MediaScope;
}

/** What the drop turned out to be, once the user has said so. */
export interface DropDecision {
  /** Images for the metadata of the game on screen. */
  images: DroppedImage[];
  /** Files copied into the target folder exactly as they arrived. */
  files: File[];
  /** Games taken into the folder the catalogue gives them. */
  intake: IntakeItem[];
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
  /** What the catalogue made of the drop, absent when it was not asked. */
  intake?: IntakeItem[];
  /** What is being written, while it is being written. */
  busy?: string;
  error?: string;
  onConfirm: (decision: DropDecision) => void;
  onCancel: () => void;
}

/** `SNES/Sonic/USA` -> `SNES/Sonic`; a bare name gives the root. */
function folderOf(path: string): string {
  const separator = path.lastIndexOf('/');
  return separator === -1 ? '' : path.slice(0, separator);
}

/**
 * True when a release would land where the drop was aimed, which is what
 * decides whether taking it in is the answer offered first.
 *
 * Dropping a SNES game on `SNES` is a case where both answers write to the same
 * folder and the catalogue's is plainly the better one — unzipped, checked, and
 * grouped with what is already there. Dropping it on `MEGADRIVE` is a case where
 * taking it in would go against where the drop pointed, and a contradiction is
 * not something to preselect.
 */
function lands(path: string, target: string): boolean {
  const folder = folderOf(path);
  return target === '' || folder === target || folder.startsWith(`${target}/`);
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
 * A file the catalogue recognised brings the other question: the folder it was
 * dropped on takes it as it arrived, and the release it turned out to be has a
 * folder of its own. Both are real answers — one keeps the archive, the other
 * opens it and checks what comes out — so it is asked rather than decided.
 *
 * A real `<dialog>` opened with `showModal`, so the top layer, the backdrop, the
 * focus trap and Escape are the browser's business.
 */
export function MediaDropModal({
  files,
  target,
  intake,
  busy,
  error,
  onConfirm,
  onCancel,
}: MediaDropModalProps): JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null);

  /** Images only get asked about on a game: a folder takes them as they are. */
  const images = target.kind === 'game' ? files.filter((file) => isImageName(file.name)) : [];
  const rest = files.filter((file) => !images.includes(file));

  const folder = target.kind === 'game' ? target.folder : target.path;

  /** What each dropped file turned out to be, for the ones a catalogue claimed. */
  const offers = new Map<File, IntakeOffer>(
    rest.flatMap((file) => {
      const offer = intake && offerOf(file, intake);
      return offer ? [[file, offer] as [File, IntakeOffer]] : [];
    }),
  );

  const [choices, setChoices] = useState<Record<string, { kind: MediaKind; scope: MediaScope }>>(
    () => Object.fromEntries(images.map((file) => [file.name, { kind: 'case' as MediaKind, scope: GLOBAL_SCOPE as MediaScope }])),
  );

  /** The files to take in as the games they are, instead of copying them. */
  const [taking, setTaking] = useState<Set<File>>(
    () =>
      new Set(
        [...offers]
          .filter(([, offer]) => offer.pending.length > 0 && lands(offer.path, folder))
          .map(([file]) => file),
      ),
  );

  useEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal();
  }, []);

  const choiceOf = (file: File) => choices[file.name] ?? { kind: 'case' as MediaKind, scope: GLOBAL_SCOPE as MediaScope };

  const update = (file: File, change: Partial<{ kind: MediaKind; scope: MediaScope }>) =>
    setChoices((current) => ({ ...current, [file.name]: { ...choiceOf(file), ...change } }));

  const take = (file: File, asGame: boolean) =>
    setTaking((current) => {
      const next = new Set(current);
      if (asGame) next.add(file);
      else next.delete(file);
      return next;
    });

  /** What the drop writes as it stands, which is both what is shown and what is done. */
  const split = splitDrop(rest, taking, intake ?? []);

  const confirm = () =>
    onConfirm({
      images: images.map((file) => ({ file, ...choiceOf(file) })),
      files: split.copied,
      intake: split.intake,
    });

  const destination =
    target.kind === 'game'
      ? `${target.folder || 'la raíz'}`
      : `${target.path || 'la raíz'}`;

  const copiedTo = (file: File) => (folder ? `${folder}/${file.name}` : file.name);

  /** Where a file's bytes end up, which is the answer the row is about. */
  const whereOf = (file: File, offer: IntakeOffer): string => {
    if (!taking.has(file)) return copiedTo(file);

    const along = offer.pending.length - 1;
    return along > 0 ? `${offer.path} · y ${along} más` : offer.path;
  };

  const hint =
    offers.size > 0
      ? `Tal cual se copia a ${destination}. Como juego va donde el catálogo lo pone, creando la ` +
        'carpeta si no existe, y lo que salga de un archivo se descomprime y se comprueba que sea ' +
        'lo que el archivo decía.'
      : `Se copian tal cual a ${destination}.`;

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
          <CloseIcon />
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
              {rest.map((file, at) => {
                const offer = offers.get(file);

                if (!offer) {
                  // A file no catalogue claimed says nothing beyond its name,
                  // unless it is following a game in: that changes where it goes.
                  const [along] = itemsOf(file, split.along);
                  if (!along) return <li key={`${at}:${file.name}`}>{file.name}</li>;

                  return (
                    <li key={`${at}:${file.name}`} class="drop-file">
                      <span class="drop-file-name" title={file.name}>
                        {file.name}
                      </span>
                      <span class="drop-file-note">Va con el juego</span>
                      <span class="drop-file-where" title={along.path}>
                        {along.path}
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={`${at}:${file.name}`} class="drop-file">
                    <span class="drop-file-name" title={file.name}>
                      {file.name}
                    </span>
                    {/* Nothing pending means the release is on disk already, so
                        the only thing left to do with the file is copy it. */}
                    {offer.pending.length > 0 ? (
                      <select
                        class="prefs-select"
                        value={taking.has(file) ? 'game' : 'copy'}
                        disabled={Boolean(busy)}
                        onChange={(event) =>
                          take(file, (event.target as HTMLSelectElement).value === 'game')
                        }
                      >
                        <option value="copy">Tal cual</option>
                        <option value="game">Como {offer.match.title}</option>
                      </select>
                    ) : (
                      <span class="drop-file-note">
                        {offer.match.title} ya está en {folderOf(offer.path) || 'la raíz'}
                      </span>
                    )}
                    <span class="drop-file-where" title={whereOf(file, offer)}>
                      {whereOf(file, offer)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p class="prefs-hint">{hint}</p>
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
