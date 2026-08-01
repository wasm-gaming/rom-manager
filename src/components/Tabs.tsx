import { JSX } from 'preact';
import { CloseIcon, RefreshIcon } from '@/components/icons';

export interface Origin {
  id: string;
  name: string;
  path: string;
  selectedFile?: string;
  metadata?: Map<string, any>;
  locked?: boolean;
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
          <span class="tab-name">{origin.name}</span>
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
        </div>
      ))}
    </div>
  );
}

