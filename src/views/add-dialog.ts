/**
 * `openAddDialog()`: the add dialog of `roms-sdk.js`, for a host page.
 *
 * Mounted in a shadow root on an element of its own at the end of `document.body`, so the
 * host's CSS cannot reach it, nor its CSS the host. Resolves with what was added, or undefined
 * when the player closed it without adding anything.
 */
import type { AddResult } from '../lib/AddService';
import AddDialog from './AddDialog.html';

export interface AddDialogOptions {
  /** Where ROMs no DAT knows go, and IPS mods (as `addFiles` takes it). */
  system?: string | ((fileName: string) => string | undefined);
  /** The game IPS mods are assigned to. */
  gameId?: string;
  /** The dialog's language; the browser's when absent (English when it speaks neither). */
  locale?: 'en' | 'es';
  /** The dialog's theme; light when absent. */
  theme?: 'dark' | 'light';
}

let open: Promise<AddResult | undefined> | undefined;

export function openAddDialog(options: AddDialogOptions = {}): Promise<AddResult | undefined> {
  // One at a time: a second call while it is open gets the same answer.
  if (open) return open;

  open = new Promise<AddResult | undefined>((resolve) => {
    const host = document.createElement('div');
    host.setAttribute('data-rom-manager', 'add-dialog');
    host.setAttribute('data-theme', options.theme === 'dark' ? 'dark' : 'light');
    document.body.append(host);

    const finish = (_event: CustomEvent, result: AddResult | undefined) => {
      instance.off('done', finish);
      instance.destroy();
      host.remove();
      open = undefined;
      resolve(result);
    };
    const instance = AddDialog.mountShadow(host, { system: options.system, gameId: options.gameId, locale: options.locale });
    instance.on('done', finish);
  });
  return open;
}
