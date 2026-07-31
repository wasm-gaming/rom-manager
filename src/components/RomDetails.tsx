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
import { ArrowLeftIcon, PencilIcon, SaveIcon, StatusIcon } from './icons';
import { calculateCRC32 } from '../services/ChecksumService';
import type { WizardFile, WizardGame, WizardVariant } from '../core/wizard-tree';
import type { Region } from '../core/rom-regions';
import type { MatchStatus } from '../core/rom-matching';

interface RomDetailsProps {
  /** ROM files selected in the tree, in tree order. */
  paths: string[];
  /** The game picked in the tree, which is shown instead of its files. */
  game?: WizardGame;
  /**
   * Boxart of that game, already resolved to something an `<img>` accepts, and
   * the region it is the box of. It is also what a file of the game opened on
   * its own shows, chosen there among the regions of *its* release.
   */
  gameCover?: CoverShown;
  records: Map<string, RomRecord | null>;
  stats: Map<string, StorageStat | null>;
  /** Resolved `<img src>` for the covers of initialised ROMs. */
  covers: Map<string, string>;
  editing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (path: string, record: RomRecord) => Promise<void>;
  onSaveMany: (changes: Partial<RomRecord>) => Promise<void>;
  /** Opens one file of the game being shown, since the tree no longer lists them. */
  onSelectFile?: (path: string) => void;
  /** Goes back to the game a file was opened from. */
  onBack?: { label: string; go: () => void };
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

/** The boxart on screen, and which box it is. */
interface CoverShown {
  url: string;
  /** Absent when the image stands for the whole game rather than for a region. */
  region?: Region;
}

/**
 * The boxart and what it is the box of.
 *
 * Worth saying with six possible preference orders: the image alone does not
 * tell you which region's box you are looking at, and for a release that ships
 * to several the answer is the only visible effect of the preference.
 */
function CoverFigure({ cover, alt }: { cover?: CoverShown; alt: string }): JSX.Element {
  if (!cover) return <div class="rom-info-cover placeholder">No cover</div>;

  return (
    <figure class="rom-info-cover-figure">
      <img class="rom-info-cover" src={cover.url} alt={`${alt} boxart`} />
      <figcaption class="rom-info-cover-region">
        {cover.region ? `${cover.region} box` : 'Box of the game'}
      </figcaption>
    </figure>
  );
}

/** A ROM the user has never edited: a plain file, described as one. */
function RomFileView({
  path,
  stat,
  cover,
  loadContent,
  onEdit,
}: {
  path: string;
  stat: StorageStat | null | undefined;
  cover?: CoverShown;
  loadContent: (path: string) => Promise<ArrayBuffer>;
  onEdit: () => void;
}): JSX.Element {
  const size = stat?.size ?? 0;

  return (
    <div class="rom-file-view">
      {/* The boxart of the game this file is a release of, chosen among the
          regions *this* release ships to. A file with no game behind it — flat
          mode, an unrecognised dump — simply has none, and gets no hero. */}
      {cover ? (
        <div class="rom-info-hero">
          <CoverFigure cover={cover} alt={fileNameOf(path)} />
          <div class="rom-info-heading">
            <h3>{fileNameOf(path)}</h3>
            <p class="metadata-subtitle">Not in the library yet</p>
            <button class="btn-primary icon-label" onClick={onEdit}>
              <PencilIcon /> Add metadata
            </button>
          </div>
        </div>
      ) : (
        <div class="rom-file-header">
          <div>
            <h3>{fileNameOf(path)}</h3>
            <p class="metadata-subtitle">Not in the library yet</p>
          </div>
          <button class="btn-primary icon-label" onClick={onEdit}>
            <PencilIcon /> Add metadata
          </button>
        </div>
      )}

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
  cover?: CoverShown;
  onEdit: () => void;
}): JSX.Element {
  return (
    <div class="rom-info">
      <div class="rom-info-hero">
        <CoverFigure cover={cover} alt={record.title || path} />

        <div class="rom-info-heading">
          <h2>{record.title || gameNameOf(path)}</h2>
          <p class="rom-info-system">{systemOf(path)}</p>

          <div class="rom-info-tags">
            {record.region && <span class="tag">{record.region}</span>}
            {record.videoStandard && <span class="tag">{record.videoStandard}</span>}
            {record.releaseDate && <span class="tag">{record.releaseDate}</span>}
          </div>

          <button class="btn-primary icon-label" onClick={onEdit}>
            <PencilIcon /> Edit
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

const STATUS_LABELS: Record<MatchStatus, string> = {
  complete: 'Complete',
  partial: 'Incomplete',
  missing: 'Not in this folder',
};

function hasFiles(variant: WizardVariant): boolean {
  return variant.files.some((file) => file.path);
}

/**
 * One release: what it is called, where it ships and at what standard, how much
 * of it is here, and its files.
 *
 * The regions and the standards are the release's own and not the game's: a
 * world release runs both PAL and NTSC, and which regions a release covers is
 * what decides whose box is on screen.
 */
function VariantRow({
  variant,
  stats,
  onSelectFile,
}: {
  variant: WizardVariant;
  stats: Map<string, StorageStat | null>;
  onSelectFile?: (path: string) => void;
}): JSX.Element {
  const files = (file: WizardFile, index: number) =>
    file.path ? (
      <li key={file.path} class="variant-file">
        <button class="btn-inline" onClick={() => onSelectFile?.(file.path!)}>
          {file.label}
        </button>
        <span class="variant-file-size">{formatSize(stats.get(file.path)?.size ?? 0)}</span>
      </li>
    ) : (
      // A file that is not here has no size and no path to be recognised by, so
      // what it leaves is the checksum: it is how you tell whether a dump found
      // elsewhere is this one.
      <li key={`missing:${index}`} class="variant-file missing">
        <span>{file.label}</span>
        <code class="variant-file-crc" title="CRC32">
          {file.crc}
        </code>
        <span class="variant-file-size">missing</span>
      </li>
    );

  return (
    <li class={`variant status-${variant.status}`}>
      <div class="variant-heading">
        <span class="variant-mark" title={STATUS_LABELS[variant.status]}>
          <StatusIcon status={variant.status} />
        </span>
        <span class="variant-key">{variant.key}</span>
        <span class="variant-support">
          {variant.regions.map((region) => (
            <span key={region} class="tag region" title={`Ships to ${region}`}>
              {region}
            </span>
          ))}
          {variant.videoStandards.map((standard) => (
            <span key={standard} class="tag video" title={`Runs at ${standard}`}>
              {standard}
            </span>
          ))}
        </span>
        <span class="variant-count">
          {variant.files.length > 1 ? `${variant.files.length} files` : ''}
        </span>
      </div>
      <ul class="variant-files">{variant.files.map(files)}</ul>
    </li>
  );
}

/**
 * A game as one thing: its boxart, and which of its releases the folder holds.
 *
 * The tree shows a game as a single row, so this is the only place the releases
 * can be read — and the only way into the files themselves, which is why the
 * present ones are buttons.
 */
function GameView({
  game,
  cover,
  stats,
  onSelectFile,
}: {
  game: WizardGame;
  cover?: CoverShown;
  stats: Map<string, StorageStat | null>;
  onSelectFile?: (path: string) => void;
}): JSX.Element {
  const present = game.variants.filter(hasFiles);
  const missing = game.variants.filter((variant) => !hasFiles(variant));

  return (
    <div class="rom-info game-info">
      <div class="rom-info-hero">
        <CoverFigure cover={cover} alt={game.title} />

        <div class="rom-info-heading">
          <h2>{game.title}</h2>
          <p class="rom-info-system">{systemOf(game.paths[0]) || '—'}</p>

          {/* One badge per release that is here: which ones you have reads
              better than how many, and the missing ones have their own list. */}
          <div class="rom-info-tags">
            <span class={`tag status-${game.status}`}>{STATUS_LABELS[game.status]}</span>
            {present.map((variant) => (
              <span key={variant.key} class="tag">
                {variant.key}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* No facts table: the name on disk, how many releases there are, how many
          files are here and how much they weigh are all already read below, one
          release at a time and with more to say. */}
      <h4 class="variants-title">Versions</h4>
      <ul class="variants">
        {present.map((variant) => (
          <VariantRow
            key={variant.key}
            variant={variant}
            stats={stats}
            onSelectFile={onSelectFile}
          />
        ))}
      </ul>

      {/* The catalogue can list fifteen releases of a game against the one on
          disk, so the absent ones stay folded until they are asked for. */}
      {missing.length > 0 && (
        <details class="variants-missing">
          <summary>{missing.length} more the catalogue knows of</summary>
          <ul class="variants">
            {missing.map((variant) => (
              <VariantRow
                key={variant.key}
                variant={variant}
                stats={stats}
                onSelectFile={onSelectFile}
              />
            ))}
          </ul>
        </details>
      )}
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
          class="btn-primary icon-label"
          onClick={handleSave}
          disabled={saving || (!region && !videoStandard)}
        >
          {saving ? (
            'Saving...'
          ) : (
            <>
              <SaveIcon /> Apply to {count} games
            </>
          )}
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
          class="btn-primary icon-label"
          onClick={onEdit}
          disabled={pending > 0}
          title={
            pending > 0
              ? 'Every selected ROM has to be in the library before editing in batch'
              : 'Edit the fields shared by every selected game'
          }
        >
          <PencilIcon /> Edit {paths.length}
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
  game,
  gameCover,
  records,
  stats,
  covers,
  editing,
  onEdit,
  onCancelEdit,
  onSave,
  onSaveMany,
  onSelectFile,
  onBack,
  loadContent,
}: RomDetailsProps): JSX.Element {
  const back = onBack && (
    <button class="btn-back icon-label" onClick={onBack.go} title="Back to the game">
      <ArrowLeftIcon /> {onBack.label}
    </button>
  );

  if (game) {
    // Keyed by game so the folded releases of the last one do not stay unfolded.
    return (
      <GameView
        key={game.key}
        game={game}
        cover={gameCover}
        stats={stats}
        onSelectFile={onSelectFile}
      />
    );
  }

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

  // The boxart of the game this file is a release of, already chosen among the
  // regions that release ships to. A file the record has a cover of its own for
  // keeps it: it was picked by hand, for this file.
  const own = covers.get(path);
  const cover: CoverShown | undefined = own ? { url: own } : gameCover;

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
    return (
      <>
        {back}
        <RomFileView
          path={path}
          stat={stat}
          cover={cover}
          loadContent={loadContent}
          onEdit={onEdit}
        />
      </>
    );
  }

  return (
    <>
      {back}
      <RomInfoView path={path} record={record} stat={stat} cover={cover} onEdit={onEdit} />
    </>
  );
}
