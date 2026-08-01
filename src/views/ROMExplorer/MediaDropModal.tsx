import { JSX } from 'preact';
import { CloseIcon } from '@/components/icons';
import { useEffect, useRef, useState } from 'preact/hooks';
import {
  GLOBAL_SCOPE,
  isImageName,
  MEDIA_KINDS,
  MEDIA_SCOPES,
  type MediaKind,
  type MediaScope,
} from '@/core/rom-media';
import { t } from '@/services/I18nService';
import {
  itemsOf,
  offerOf,
  splitDrop,
  type IntakeItem,
  type IntakeOffer,
} from '@/services/RomIntakeService';

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

function lands(path: string, target: string): boolean {
  const folder = folderOf(path);
  return target === '' || folder === target || folder.startsWith(`${target}/`);
}

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

  const split = splitDrop(rest, taking, intake ?? []);

  const confirm = () =>
    onConfirm({
      images: images.map((file) => ({ file, ...choiceOf(file) })),
      files: split.copied,
      intake: split.intake,
    });

  const destination = (target.kind === 'game' ? target.folder : target.path) || t('drop.root');

  const copiedTo = (file: File) => (folder ? `${folder}/${file.name}` : file.name);

  const whereOf = (file: File, offer: IntakeOffer): string => {
    if (!taking.has(file)) return copiedTo(file);

    const along = offer.pending.length - 1;
    return along > 0 ? t('drop.andMore', { path: offer.path, count: along }) : offer.path;
  };

  const hint =
    offers.size > 0
      ? t('drop.hint.intake', { folder: destination })
      : t('drop.hint.plain', { folder: destination });

  return (
    <dialog
      ref={dialog}
      class="modal-dialog drop-dialog"
      aria-label={t('drop.label')}
      onClose={onCancel}
      onClick={(event) => {
        if (event.target === dialog.current && !busy) dialog.current?.close();
      }}
    >
      <header class="modal-header">
        <h3>
          {target.kind === 'game'
            ? t('drop.toGame', { title: target.title })
            : t('drop.toFolder', { folder: target.path || t('drop.root') })}
        </h3>
        <button class="modal-close" onClick={() => dialog.current?.close()} disabled={Boolean(busy)}>
          <CloseIcon />
        </button>
      </header>

      <div class="modal-content">
        {error && <div class="lookup-error">{error}</div>}

        {images.length > 0 && (
          <section class="prefs-group">
            <h4>{images.length > 1 ? t('drop.images.many') : t('drop.images.one')}</h4>
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
                        {t(`media.kind.${kind}`)}
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
                        {scope === GLOBAL_SCOPE ? t('media.scope.global') : scope}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
            <p class="prefs-hint">{t('drop.images.hint')}</p>
          </section>
        )}

        {rest.length > 0 && (
          <section class="prefs-group">
            <h4>{rest.length > 1 ? t('drop.files.many') : t('drop.files.one')}</h4>
            <ul class="drop-files">
              {rest.map((file, at) => {
                const offer = offers.get(file);

                if (!offer) {
                  const [along] = itemsOf(file, split.along);
                  if (!along) return <li key={`${at}:${file.name}`}>{file.name}</li>;

                  return (
                    <li key={`${at}:${file.name}`} class="drop-file">
                      <span class="drop-file-name" title={file.name}>
                        {file.name}
                      </span>
                      <span class="drop-file-note">{t('drop.alongGame')}</span>
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
                    {offer.pending.length > 0 ? (
                      <select
                        class="prefs-select"
                        value={taking.has(file) ? 'game' : 'copy'}
                        disabled={Boolean(busy)}
                        onChange={(event) =>
                          take(file, (event.target as HTMLSelectElement).value === 'game')
                        }
                      >
                        <option value="copy">{t('drop.asIs')}</option>
                        <option value="game">{t('drop.asGame', { title: offer.match.title })}</option>
                      </select>
                    ) : (
                      <span class="drop-file-note">
                        {t('drop.already', {
                          title: offer.match.title,
                          folder: folderOf(offer.path) || t('drop.root'),
                        })}
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
          {t('drop.cancel')}
        </button>
        <button class="btn-apply" onClick={confirm} disabled={Boolean(busy)}>
          {busy ??
            (files.length > 1 ? t('drop.confirmMany', { count: files.length }) : t('drop.confirm'))}
        </button>
      </div>
    </dialog>
  );
}
