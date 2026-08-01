import { JSX } from 'preact';
import { FolderPlusIcon, PlusIcon, TrashIcon } from '@/components/icons';

interface FileTreeHeaderProps {
  busy: boolean;
  hasSelection: boolean;
  onCreateFolder: () => void;
  onAddFiles: () => void;
  onDeleteSelected: () => void;
  title?: string;
  labels?: {
    newFolder?: string;
    addFiles?: string;
    delete?: string;
  };
}

export function FileTreeHeader({
  busy,
  hasSelection,
  onCreateFolder,
  onAddFiles,
  onDeleteSelected,
  title = 'Library',
  labels = {},
}: FileTreeHeaderProps): JSX.Element {
  return (
    <div class="file-tree-header">
      <h3>{title}</h3>
      <div class="file-tree-actions">
        <button
          onClick={onCreateFolder}
          disabled={busy}
          title={labels.newFolder ?? 'New folder'}
        >
          <FolderPlusIcon />
        </button>
        <button
          onClick={onAddFiles}
          disabled={busy}
          title={labels.addFiles ?? 'Add files'}
        >
          <PlusIcon />
        </button>
        <button
          onClick={onDeleteSelected}
          disabled={busy || !hasSelection}
          title={labels.delete ?? 'Delete'}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
