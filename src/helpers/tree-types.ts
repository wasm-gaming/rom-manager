export type MatchStatusType = 'complete' | 'partial' | 'missing' | string;

export interface StorageEntryData {
  name: string;
  path: string;
  kind: 'file' | 'directory';
}

export interface StorageNodeData {
  list: (path: string) => Promise<StorageEntryData[]>;
  read?: (path: string) => Promise<ArrayBuffer>;
  readFile?: (path: string) => Promise<Uint8Array>;
  write?: (path: string, content: ArrayBuffer | Blob) => Promise<void>;
  writeFile?: (path: string, content: Uint8Array) => Promise<void>;
  delete?: (path: string) => Promise<void>;
  remove?: (path: string) => Promise<void>;
  move?: (from: string, to: string) => Promise<void>;
  createDirectory?: (path: string) => Promise<void>;
}

export interface WizardGameData {
  kind?: string;
  key?: string;
  id: string;
  title: string;
  status: MatchStatusType;
  paths: string[];
  [key: string]: unknown;
}

export type WizardNodeData =
  | { kind: 'entry'; entry: StorageEntryData }
  | WizardGameData;

export interface VisibleRow {
  key: string;
  depth: number;
  label: string;
  kind: 'directory' | 'file' | 'group' | 'pending';
  path?: string;
  paths: string[];
  entry?: StorageEntryData;
  status?: MatchStatusType;
  game?: any;
  expandable: boolean;
}

export interface FileTreeProps<G = any, N = any> {
  node: StorageNodeData;
  selectedFiles?: string[];
  onSelectionChange?: (paths: string[]) => void;
  onGameChange?: (game?: G) => void;
  onFolderChange?: (path?: string) => void;
  onVisibleChange?: (paths: string[]) => void;
  isInitialized?: (path: string) => boolean;
  onRemoved?: (paths: string[]) => void;
  canGroup?: (path: string) => boolean;
  isGrouped?: (path: string) => boolean;
  groupedRows?: Map<string, N[]>;
  onGroupingNeeded?: (path: string) => void;
  onToggleGrouping?: (path: string) => void;
  onOrganize?: (path: string) => void;
  notice?: string;
  refreshToken?: number;
  labels?: {
    collapseAll?: string;
    expandAll?: string;
    reading?: string;
    organize?: string;
    delete?: string;
    statusComplete?: string;
    statusPartial?: string;
    statusMissing?: string;
  };
}
