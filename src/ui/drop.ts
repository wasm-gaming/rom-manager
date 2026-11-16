/**
 * What a drop of files is, and what the user decided it becomes — shared by the
 * drop dialog (`views/MediaDropModal.html`) and the explorer that writes it.
 */
import type { MediaKind, MediaScope } from '@/core/rom-media';
import type { IntakeItem } from '@/services/RomIntakeService';

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

/** Where a dropped file can go. */
export type DropTarget =
  | { kind: 'game'; title: string; folder: string }
  | { kind: 'folder'; path: string };

/** `SNES/Sonic/USA` -> `SNES/Sonic`; a bare name gives the root. */
export function folderOf(path: string): string {
  const separator = path.lastIndexOf('/');
  return separator === -1 ? '' : path.slice(0, separator);
}
