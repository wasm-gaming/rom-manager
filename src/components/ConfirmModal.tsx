import { JSX } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { CloseIcon } from '@/components/icons';
import { t } from '@/services/I18nService';

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  danger = true,
  busy = false,
  onConfirm,
  onClose,
}: ConfirmModalProps): JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    if (open && !element.open) {
      element.showModal();
    } else if (!open && element.open) {
      element.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialog}
      class="modal-dialog confirm-dialog"
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialog.current && !busy) {
          dialog.current?.close();
        }
      }}
    >
      <header class="modal-header">
        <h3>{title}</h3>
        <button
          type="button"
          class="modal-close"
          onClick={() => dialog.current?.close()}
          disabled={busy}
          title={t('prefs.close')}
        >
          <CloseIcon />
        </button>
      </header>

      <div class="modal-content">
        <p class="modal-message">{message}</p>
      </div>

      <div class="modal-actions">
        <button
          type="button"
          class="btn-cancel"
          onClick={() => dialog.current?.close()}
          disabled={busy}
        >
          {cancelLabel || t('drop.cancel')}
        </button>
        <button
          type="button"
          class={danger ? 'btn-danger' : 'btn-apply'}
          onClick={onConfirm}
          disabled={busy}
        >
          {confirmLabel || t('modal.delete')}
        </button>
      </div>
    </dialog>
  );
}
