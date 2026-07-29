import { JSX } from 'preact';

export interface Origin {
  id: string;
  name: string;
  path: string;
  files: string[];
  selectedFile?: string;
  metadata?: Map<string, any>;
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
            class={`tab ${activeOriginId === origin.id ? 'active' : ''}`}
            onClick={() => onSelectOrigin?.(origin.id)}
          >
            <span class="tab-name">{origin.name}</span>
            <button
              class="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onClose?.(origin.id);
              }}
              title="Close"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button class="tab-add" onClick={onAddOrigin} title="Open folder">
        +
      </button>
    </div>
  );
}
