import { JSX } from 'preact';
import { CloseIcon, LockIcon, PlusIcon } from './icons';
import { t } from '../services/I18nService';

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
}

export function Tabs({
  origins,
  activeOriginId,
  onSelectOrigin,
  onClose,
  onAddOrigin,
}: TabsProps): JSX.Element {
  return (
    <div class="tabs-container">
      <div class="tabs">
        {origins.map((origin) => (
          <div
            key={origin.id}
            class={`tab ${activeOriginId === origin.id ? 'active' : ''} ${origin.locked ? 'locked' : ''}`}
            onClick={() => onSelectOrigin?.(origin.id)}
            title={origin.locked ? t('tabs.reconnect') : undefined}
          >
            {origin.locked && (
              <span class="tab-lock">
                <LockIcon />
              </span>
            )}
            <span class="tab-name">{origin.name}</span>
            <button
              class="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onClose?.(origin.id);
              }}
              title={t('tabs.close')}
            >
              <CloseIcon />
            </button>
          </div>
        ))}
      </div>
      <button class="tab-add" onClick={onAddOrigin} title={t('tabs.add')}>
        <PlusIcon />
      </button>
    </div>
  );
}
