import { JSX } from 'preact';
import { VisibleRow } from './types';
import { systemOfPath } from './utils';
import {
  BundleIcon,
  FolderIcon,
  iconOfName,
  SystemFolderIcon,
} from '@/components/icons';

interface RowIconProps {
  row: VisibleRow;
  isGrouped?: (path: string) => boolean;
}

export function RowIcon({ row, isGrouped }: RowIconProps): JSX.Element {
  if (row.kind === 'pending') return <span class="tree-spinner" />;
  if (row.kind === 'directory') {
    const isWizard = Boolean(row.path && isGrouped?.(row.path));
    const systemId = isWizard ? systemOfPath(row.path || row.label) : undefined;
    if (systemId) {
      return <SystemFolderIcon systemId={systemId} />;
    }
    return <FolderIcon />;
  }

  const systemId = row.paths[0] ? systemOfPath(row.paths[0]) : row.path ? systemOfPath(row.path) : undefined;

  if (row.kind === 'group') return <BundleIcon systemId={systemId} />;

  const Icon = iconOfName(row.label);
  return <Icon systemId={systemId} />;
}
