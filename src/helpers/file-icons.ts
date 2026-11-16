/**
 * Which icon a file's name earns it, which is the most a listing can say: the
 * type itself, then its family, then the blank page. The drawings are in
 * `components/Icon.html`; this is the part a script needs.
 */

const DISC_EXTS = new Set(['iso', 'cue', 'chd', 'gdi', 'nrg', 'mdf', 'ccd', 'pbp']);
const SAVE_EXTS = new Set(['sav', 'srm', 'state', 'st0', 'st1', 'st2', 'st3', 'st4', 'st5', 'mcr', 'mc']);
const ARCHIVE_EXTS = new Set(['zip', '7z', 'rar', 'gz', 'tar']);
const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg']);
const DOC_EXTS = new Set(['txt', 'json', 'xml', 'md', 'nfo', 'pdf', 'doc', 'dat']);

export type FileIconName = 'disc' | 'memory-card' | 'archive' | 'image' | 'document' | 'file';

export function iconNameOf(name: string): FileIconName {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (DISC_EXTS.has(ext)) return 'disc';
  if (SAVE_EXTS.has(ext)) return 'memory-card';
  if (ARCHIVE_EXTS.has(ext)) return 'archive';
  if (IMAGE_EXTS.has(ext)) return 'image';
  if (DOC_EXTS.has(ext)) return 'document';
  return 'file';
}
