import { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { ROM_REGIONS, VIDEO_STANDARDS, romMetadataService } from '../services/ROMMetadataService';
import { StorageStat } from '../services/StorageService';
import {
  CRC32_SIZE_LIMIT,
  RomRecord,
  emptyRecord,
  extensionOf,
  fileNameOf,
  gameNameOf,
  systemOf,
} from '../services/RomLibraryService';
import { MetadataEditor } from './MetadataEditor';
import { calculateCRC32 } from '../services/ChecksumService';

interface RomDetailsProps {
  /** ROM files selected in the tree, in tree order. */
  paths: string[];
  records: Map<string, RomRecord | null>;
  stats: Map<string, StorageStat | null>;
  /** Resolved `<img src>` for the covers of initialised ROMs. */
  covers: Map<string, string>;
  editing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (path: string, record: RomRecord) => Promise<void>;
  onSaveMany: (changes: Partial<RomRecord>) => Promise<void>;
  loadContent: (path: string) => Promise<ArrayBuffer>;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;

  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }

  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`;
}

function formatDate(value: number | string | undefined): string {
  if (value === undefined) return '—';

  const date = typeof value === 'number' ? new Date(value) : new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
}

/**
 * CRC32 of a ROM that has no record yet. Hashing means reading the whole file,
 * so it stays behind a button and is refused outright for the large ones.
 */
function ChecksumRow({
  path,
  size,
  loadContent,
}: {
  path: string;
  size: number;
  loadContent: (path: string) => Promise<ArrayBuffer>;
}): JSX.Element {
  const [value, setValue] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();

  if (size > CRC32_SIZE_LIMIT) {
    return (
      <div class="fact">
        <span class="fact-label">CRC32</span>
        <span class="fact-value muted">Skipped — over {formatSize(CRC32_SIZE_LIMIT)}</span>
      </div>
    );
  }

  const compute = async () => {
    try {
      setBusy(true);
      setError(undefined);
      setValue(await calculateCRC32(await loadContent(path)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checksum failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div class="fact">
      <span class="fact-label">CRC32</span>
      <span class="fact-value">
        {value ? (
          <code>{value}</code>
        ) : (
          <button class="btn-inline" onClick={compute} disabled={busy}>
            {busy ? 'Calculating...' : 'Calculate'}
          </button>
        )}
        {error && <span class="fact-error">{error}</span>}
      </span>
    </div>
  );
}

/** A ROM the user has never edited: a plain file, described as one. */
function RomFileView({
  path,
  stat,
  loadContent,
  onEdit,
}: {
  path: string;
  stat: StorageStat | null | undefined;
  loadContent: (path: string) => Promise<ArrayBuffer>;
  onEdit: () => void;
}): JSX.Element {
  const size = stat?.size ?? 0;

  return (
    <div class="rom-file-view">
      <div class="rom-file-header">
        <div>
          <h3>{fileNameOf(path)}</h3>
          <p class="metadata-subtitle">Not in the library yet</p>
        </div>
        <button class="btn-primary" onClick={onEdit}>
          ✎ Add metadata
        </button>
      </div>

      <div class="facts">
        <div class="fact">
          <span class="fact-label">System</span>
          <span class="fact-value">{systemOf(path) || '—'}</span>
        </div>
        <div class="fact">
          <span class="fact-label">Format</span>
          <span class="fact-value">
            {romMetadataService.getROMFormat(path)} ({extensionOf(path) || 'no extension'})
          </span>
        </div>
        <div class="fact">
          <span class="fact-label">Size</span>
          <span class="fact-value">{formatSize(size)}</span>
        </div>
        <div class="fact">
          <span class="fact-label">Modified</span>
          <span class="fact-value">{formatDate(stat?.mtime)}</span>
        </div>
        <div class="fact">
          <span class="fact-label">Added to library</span>
          <span class="fact-value muted">Not initialised</span>
        </div>
        <ChecksumRow path={path} size={size} loadContent={loadContent} />
      </div>
    </div>
  );
}

/** A ROM with a record: shown as a game, not as a file. */
function RomInfoView({
  path,
  record,
  stat,
  cover,
  onEdit,
}: {
  path: string;
  record: RomRecord;
  stat: StorageStat | null | undefined;
  cover?: string;
  onEdit: () => void;
}): JSX.Element {
  return (
    <div class="rom-info">
      <div class="rom-info-hero">
        {cover ? (
          <img class="rom-info-cover" src={cover} alt={`${record.title || path} boxart`} />
        ) : (
          <div class="rom-info-cover placeholder">No cover</div>
        )}

        <div class="rom-info-heading">
          <h2>{record.title || gameNameOf(path)}</h2>
          <p class="rom-info-system">{systemOf(path)}</p>

          <div class="rom-info-tags">
            {record.region && <span class="tag">{record.region}</span>}
            {record.videoStandard && <span class="tag">{record.videoStandard}</span>}
            {record.releaseDate && <span class="tag">{record.releaseDate}</span>}
          </div>

          <button class="btn-primary" onClick={onEdit}>
            ✎ Edit
          </button>
        </div>
      </div>

      {record.description && <p class="rom-info-description">{record.description}</p>}

      <div class="facts">
        <div class="fact">
          <span class="fact-label">File</span>
          <span class="fact-value">{fileNameOf(path)}</span>
        </div>
        {record.publisher && (
          <div class="fact">
            <span class="fact-label">Publisher</span>
            <span class="fact-value">{record.publisher}</span>
          </div>
        )}
        <div class="fact">
          <span class="fact-label">Size</span>
          <span class="fact-value">{formatSize(stat?.size ?? 0)}</span>
        </div>
        <div class="fact">
          <span class="fact-label">CRC32</span>
          <span class="fact-value">{record.crc32 ? <code>{record.crc32}</code> : '—'}</span>
        </div>
        <div class="fact">
          <span class="fact-label">Added to library</span>
          <span class="fact-value">{formatDate(record.addedAt)}</span>
        </div>
        <div class="fact">
          <span class="fact-label">Updated</span>
          <span class="fact-value">{formatDate(record.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Shared value of a field across the selection, or `undefined` when the games
 * disagree — which is what the editor shows as "(mixed)".
 */
function sharedValue(records: RomRecord[], field: keyof RomRecord): string | undefined {
  const first = records[0]?.[field];
  if (typeof first !== 'string') return undefined;
  return records.every((record) => record[field] === first) ? first : undefined;
}

/**
 * Batch editing only offers the fields that mean the same thing for every
 * selected game — a title or a cover does not, a region and a video standard do.
 */
function RomBatchEditor({
  records,
  count,
  onSave,
  onCancel,
}: {
  records: RomRecord[];
  count: number;
  onSave: (changes: Partial<RomRecord>) => Promise<void>;
  onCancel: () => void;
}): JSX.Element {
  const [region, setRegion] = useState('');
  const [videoStandard, setVideoStandard] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const currentRegion = sharedValue(records, 'region');
  const currentVideo = sharedValue(records, 'videoStandard');

  const handleSave = async () => {
    const changes: Partial<RomRecord> = {};
    if (region) changes.region = region;
    if (videoStandard) changes.videoStandard = videoStandard;

    try {
      setSaving(true);
      setError(undefined);
      await onSave(changes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the records');
      setSaving(false);
    }
  };

  return (
    <div class="metadata-editor">
      <div class="metadata-header">
        <div>
          <h3>Edit {count} games</h3>
          <p class="metadata-subtitle">Only the fields shared by every game can be changed</p>
        </div>
      </div>

      {error && <div class="lookup-error">{error}</div>}

      <div class="form-group">
        <label>Region</label>
        <select value={region} onChange={(event) => setRegion((event.target as HTMLSelectElement).value)}>
          <option value="">Keep current ({currentRegion || 'mixed'})</option>
          {ROM_REGIONS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div class="form-group">
        <label>Video Standard</label>
        <select
          value={videoStandard}
          onChange={(event) => setVideoStandard((event.target as HTMLSelectElement).value)}
        >
          <option value="">Keep current ({currentVideo || 'mixed'})</option>
          {VIDEO_STANDARDS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div class="editor-actions">
        <button
          class="btn-primary"
          onClick={handleSave}
          disabled={saving || (!region && !videoStandard)}
        >
          {saving ? 'Saving...' : `💾 Apply to ${count} games`}
        </button>
        <button class="btn-cancel" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/** Read-only summary of a multiple selection, and the gate to batch editing. */
function RomSelectionView({
  paths,
  records,
  onEdit,
}: {
  paths: string[];
  records: Map<string, RomRecord | null>;
  onEdit: () => void;
}): JSX.Element {
  const initialised = paths.filter((path) => records.get(path));
  const pending = paths.length - initialised.length;

  return (
    <div class="rom-selection">
      <div class="rom-file-header">
        <div>
          <h3>{paths.length} ROMs selected</h3>
          <p class="metadata-subtitle">
            {pending === 0
              ? 'All of them are in the library'
              : `${pending} of them are not in the library yet`}
          </p>
        </div>
        <button
          class="btn-primary"
          onClick={onEdit}
          disabled={pending > 0}
          title={
            pending > 0
              ? 'Every selected ROM has to be in the library before editing in batch'
              : 'Edit the fields shared by every selected game'
          }
        >
          ✎ Edit {paths.length}
        </button>
      </div>

      <ul class="rom-selection-list">
        {paths.map((path) => {
          const record = records.get(path);
          return (
            <li key={path} class={record ? 'initialised' : 'pending'}>
              <span class="rom-selection-name">{record?.title || fileNameOf(path)}</span>
              <span class="rom-selection-system">{systemOf(path)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function RomDetails({
  paths,
  records,
  stats,
  covers,
  editing,
  onEdit,
  onCancelEdit,
  onSave,
  onSaveMany,
  loadContent,
}: RomDetailsProps): JSX.Element {
  if (paths.length === 0) {
    return <div class="empty-state">Select a ROM to view its details</div>;
  }

  if (paths.length > 1) {
    const selected = paths.map((path) => records.get(path)).filter((record): record is RomRecord =>
      Boolean(record),
    );

    if (editing && selected.length === paths.length) {
      return (
        <RomBatchEditor
          records={selected}
          count={paths.length}
          onSave={onSaveMany}
          onCancel={onCancelEdit}
        />
      );
    }

    return <RomSelectionView paths={paths} records={records} onEdit={onEdit} />;
  }

  const [path] = paths;
  const record = records.get(path) ?? null;
  const stat = stats.get(path);
  const size = stat?.size ?? 0;

  if (editing) {
    return (
      <MetadataEditor
        key={path}
        romPath={path}
        record={record ?? { ...emptyRecord(), title: gameNameOf(path) }}
        coverUrl={covers.get(path)}
        canChecksum={size <= CRC32_SIZE_LIMIT}
        loadContent={() => loadContent(path)}
        onSave={(updated) => onSave(path, updated)}
        onCancel={onCancelEdit}
      />
    );
  }

  if (!record) {
    return <RomFileView path={path} stat={stat} loadContent={loadContent} onEdit={onEdit} />;
  }

  return (
    <RomInfoView
      path={path}
      record={record}
      stat={stat}
      cover={covers.get(path)}
      onEdit={onEdit}
    />
  );
}
