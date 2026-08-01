import { JSX } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { CloseIcon } from '@/components/icons';
import { t } from '@/services/I18nService';

export interface PromptModalProps {
  open: boolean;
  title: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  submitLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onSubmit: (value: string) => void;
  onClose: () => void;
}

export function PromptModal({
  open,
  title,
  message,
  defaultValue = '',
  placeholder = '',
  submitLabel,
  cancelLabel,
  busy = false,
  onSubmit,
  onClose,
}: PromptModalProps): JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
    }
  }, [open, defaultValue]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    if (open && !element.open) {
      element.showModal();
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    } else if (!open && element.open) {
      element.close();
    }
  }, [open]);

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (!value.trim() || busy) return;
    onSubmit(value.trim());
  };

  return (
    <dialog
      ref={dialog}
      class="modal-dialog prompt-dialog"
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

      <form onSubmit={handleSubmit} class="modal-form">
        <div class="modal-content">
          {message && <p class="modal-message">{message}</p>}
          <input
            ref={inputRef}
            type="text"
            class="prompt-input"
            value={value}
            placeholder={placeholder}
            onInput={(e) => setValue((e.target as HTMLInputElement).value)}
            disabled={busy}
          />
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
            type="submit"
            class="btn-apply"
            disabled={!value.trim() || busy}
          >
            {submitLabel || t('modal.confirm')}
          </button>
        </div>
      </form>
    </dialog>
  );
}
