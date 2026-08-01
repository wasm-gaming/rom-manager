import { JSX } from 'preact';
import { VisibleRow } from './types';
import { RowIcon } from './RowIcon';
import { isHiddenName } from './utils';
import {
  ChevronIcon,
  DotIcon,
  GroupIcon,
  OrganizeIcon,
  StatusIcon,
} from '@/components/icons';

interface FileTreeNodeProps {
  row: VisibleRow;
  selection: Set<string>;
  selectedGame?: string;
  selectedFiles?: string[];
  dropTarget?: string;
  expanded: Set<string>;
  isGrouped?: (path: string) => boolean;
  isInitialized?: (path: string) => boolean;
  canGroup?: (path: string) => boolean;
  onToggleDirectory: (path: string) => void;
  onRowClick: (event: MouseEvent, row: VisibleRow) => void;
  onDragStart: (event: DragEvent, row: VisibleRow) => void;
  onDragOver?: (event: DragEvent, path: string) => void;
  onDrop?: (event: DragEvent, path: string) => void;
  onToggleGrouping?: (path: string) => void;
  onOrganize?: (path: string) => void;
  statusLabels?: Record<string, string>;
}

export function FileTreeNode({
  row,
  selection,
  selectedGame,
  selectedFiles,
  dropTarget,
  expanded,
  isGrouped,
  isInitialized,
  canGroup,
  onToggleDirectory,
  onRowClick,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleGrouping,
  onOrganize,
  statusLabels = {},
}: FileTreeNodeProps): JSX.Element {
  const isSelected = row.path ? selection.has(row.path) : selectedGame === row.key;
  const isActive = Boolean(row.path && selectedFiles?.includes(row.path));
  const isDropTarget = row.path !== undefined && dropTarget === row.path;

  const itemClasses = [
    'tree-item',
    row.kind,
    isHiddenName(row.label) ? 'muted' : '',
    row.status ? `status-${row.status}` : '',
    isSelected ? 'selected' : '',
    isActive ? 'active' : '',
    isDropTarget ? 'drop-target' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li
      key={row.key}
      class={itemClasses}
      style={{ paddingLeft: `${0.5 + row.depth * 0.6}rem` }}
      draggable={row.paths.length > 0}
      onClick={(event) => onRowClick(event, row)}
      onDragStart={(event) => onDragStart(event, row)}
      onDragOver={
        row.kind === 'directory' && onDragOver ? (event) => onDragOver(event, row.path!) : undefined
      }
      onDrop={row.kind === 'directory' && onDrop ? (event) => onDrop(event, row.path!) : undefined}
    >
      <div
        class="tree-item-left"
        onClick={() => {
          if (row.expandable && row.path) {
            onToggleDirectory(row.path);
          }
        }}
      >
        {row.expandable ? (
          <span class="tree-caret" title={expanded.has(row.key) ? 'Collapse' : 'Expand'}>
            <ChevronIcon open={expanded.has(row.key)} />
          </span>
        ) : (
          <span class="tree-caret" />
        )}

        <span class="tree-icon">
          <RowIcon row={row} isGrouped={isGrouped} />
        </span>
        <span class="tree-name">{row.label}</span>
      </div>

      <div class="tree-item-actions">
        {row.status && row.status !== 'complete' && (
          <span class="tree-status" title={statusLabels[row.status] ?? row.status}>
            <StatusIcon status={row.status as 'complete' | 'partial' | 'missing'} />
          </span>
        )}

        {row.kind !== 'directory' && row.paths.some((path) => isInitialized?.(path)) && (
          <span class="tree-badge" title="Has library record">
            <DotIcon />
          </span>
        )}

        {row.kind === 'directory' && canGroup?.(row.path!) && (
          <button
            class={`tree-group-toggle ${isGrouped?.(row.path!) ? 'on' : ''}`}
            onClick={(event) => {
              event.stopPropagation();
              onToggleGrouping?.(row.path!);
            }}
            title={isGrouped?.(row.path!) ? 'Browsing grouped by game' : 'Browse grouped by game'}
          >
            <GroupIcon />
          </button>
        )}

        {row.kind === 'directory' && onOrganize && canGroup?.(row.path!) && (
          <button
            class="tree-organize"
            onClick={(event) => {
              event.stopPropagation();
              onOrganize(row.path!);
            }}
            title="Consolidate folder"
          >
            <OrganizeIcon />
          </button>
        )}
      </div>
    </li>
  );
}
