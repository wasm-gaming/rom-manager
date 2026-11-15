import { JSX } from 'preact';
import { CloseIcon, LibraryIcon, RefreshIcon } from '@/components/icons';

export interface Origin {
  id: string;
  name: string;
  path: string;
  selectedFile?: string;
  metadata?: Map<string, any>;
  locked?: boolean;
  kind?: 'library' | 'folder';
}

interface TabsProps {
  origins: Origin[];
  activeOriginId?: string;
  onSelectOrigin?: (originId: string) => void;
  onClose?: (originId: string) => void;
  onAddOrigin?: () => void;
  labels?: {
    reconnect?: string;
    close?: string;
  };
}

export function Tabs({
  origins,
  activeOriginId,
  onSelectOrigin,
  onClose,
  labels = {},
}: TabsProps): JSX.Element {
  const reconnectTitle = labels.reconnect ?? 'Reconnect folder';
  const closeTitle = labels.close ?? 'Close tab';

  return (
    <div class="tabs">
      {origins.map((origin) => (
        <div
          key={origin.id}
          class={`tab ${activeOriginId === origin.id ? 'active' : ''} ${origin.locked ? 'locked' : ''}`}
          onClick={() => onSelectOrigin?.(origin.id)}
          title={origin.locked ? reconnectTitle : undefined}
        >
          {origin.locked && (
            <span class="tab-lock">
              <RefreshIcon />
            </span>
          )}
          {origin.kind === 'library' && (
            <span class="tab-lock">
              <LibraryIcon />
            </span>
          )}
          <span class="tab-name">{origin.name}</span>
          {/* The library is the app's own storage: there is nothing to close. */}
          {origin.kind !== 'library' && (
            <button
              class="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onClose?.(origin.id);
              }}
              title={closeTitle}
            >
              <CloseIcon />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

