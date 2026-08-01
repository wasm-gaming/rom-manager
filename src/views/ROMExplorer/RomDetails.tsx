import { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { ROM_REGIONS, VIDEO_STANDARDS, romMetadataService } from '@/services/ROMMetadataService';
import { StorageStat } from '@/services/StorageService';
import {
  CRC32_SIZE_LIMIT,
  RomRecord,
  emptyRecord,
  extensionOf,
  fileNameOf,
  gameNameOf,
  systemOf,
} from '@/services/RomLibraryService';
import { MetadataEditor } from '@/views/ROMExplorer/MetadataEditor';
import { ArrowLeftIcon, CheckIcon, CrossIcon, DoubleCheckIcon, OrganizeIcon, PencilIcon, SaveIcon, StatusIcon, TrashIcon } from '@/components/icons';
import { ConfirmModal } from '@/components/ConfirmModal';
import { calculateCRC32 } from '@/services/ChecksumService';
import type { WizardFile, WizardGame, WizardVariant } from '@/core/wizard-tree';
import type { Region } from '@/core/rom-regions';
import type { MatchStatus } from '@/core/rom-matching';
import { systemAspectRatio } from '@/core/rom-covers';
import { SystemDetails } from '@/views/ROMExplorer/SystemDetails';
import { t } from '@/services/I18nService';
import { validateNeoGeoVariant } from '@/core/neogeo-validator';

interface RomDetailsProps {
  /** ROM files selected in the tree, in tree order. */
  paths: string[];
  /** The game picked in the tree, which is shown instead of its files. */
  game?: WizardGame;
  /** The folder picked in the tree. */
  folder?: string;
  /** Whether that folder is browsed grouped by game, which is what makes it a system. */
  wizardFolder?: boolean;
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
  onSave: (
    path: string,
    record: RomRecord,
    coverFile?: File,
    coverRemoved?: boolean,
  ) => Promise<void>;
  onSaveMany: (changes: Partial<RomRecord>) => Promise<void>;
  /** Opens one file of the game being shown, since the tree no longer lists them. */
  onSelectFile?: (path: string) => void;
  /** Offered on folders and files that can be renamed and sorted to match the catalogue. */
  onOrganize?: (path: string) => void;
  /** Callback to delete ROM files from disk. */
  onRemove?: (paths: string[]) => void;
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
        <span class="fact-value muted">
          {t('details.checksum.skipped', { limit: formatSize(CRC32_SIZE_LIMIT) })}
        </span>
      </div>
    );
  }

  const compute = async () => {
    try {
      setBusy(true);
      setError(undefined);
      setValue(await calculateCRC32(await loadContent(path)));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('details.checksum.failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div class="fact">
      <span class="fact-label">{t('details.facts.crc32')}</span>
      <span class="fact-value">
        {value ? (
          <code>{value}</code>
        ) : (
          <button class="btn-inline" onClick={compute} disabled={busy}>
            {busy ? t('details.checksum.calculating') : t('details.checksum.calculate')}
          </button>
        )}
        {error && <span class="fact-error">{error}</span>}
      </span>
    </div>
  );
}

interface CoverShown {
  url: string;
  publishedUrl?: string;
  region?: Region;
}

function CoverFigure({
  cover,
  alt,
  system,
}: {
  cover?: CoverShown;
  alt: string;
  system?: string;
}): JSX.Element {
  const defaultRatio = systemAspectRatio(system);
  const [naturalRatio, setNaturalRatio] = useState<string | undefined>();
  const [prevSystem, setPrevSystem] = useState<string | undefined>();
  const url = cover?.url;

  if (system !== prevSystem) {
    setPrevSystem(system);
    setNaturalRatio(undefined);
  }

  const currentRatio = naturalRatio || defaultRatio;
  const isLandscape = (() => {
    const parts = currentRatio.split('/').map((s) => parseFloat(s.trim()));
    return parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[0] > parts[1];
  })();
  const regionLabel = cover?.region
    ? t('details.cover.region', { region: cover.region })
    : cover
      ? t('details.cover.game')
      : '\u00A0';

  return (
    <figure class="rom-info-cover-figure">
      <div
        class={`rom-info-cover-wrapper ${isLandscape ? 'landscape' : ''}`}
        style={{ aspectRatio: currentRatio }}
      >
        {cover ? (
          <img
            key={url}
            class="rom-info-cover"
            src={url}
            alt={t('details.cover.alt', { title: alt })}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth && img.naturalHeight) {
                setNaturalRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
              }
            }}
          />
        ) : (
          <div class="rom-info-cover placeholder">{t('details.cover.none')}</div>
        )}
      </div>
      <figcaption class="rom-info-cover-region">{regionLabel}</figcaption>
    </figure>
  );
}

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
      {cover ? (
        <div class="rom-info-hero">
          <CoverFigure cover={cover} alt={fileNameOf(path)} system={systemOf(path)} />
          <div class="rom-info-heading">
            <h3>{fileNameOf(path)}</h3>
            <p class="metadata-subtitle">{t('details.file.pending')}</p>
            <button class="btn-primary icon-label" onClick={onEdit}>
              <PencilIcon /> {t('details.file.add')}
            </button>
          </div>
        </div>
      ) : (
        <div class="rom-file-header">
          <div>
            <h3>{fileNameOf(path)}</h3>
            <p class="metadata-subtitle">{t('details.file.pending')}</p>
          </div>
          <button class="btn-primary icon-label" onClick={onEdit}>
            <PencilIcon /> {t('details.file.add')}
          </button>
        </div>
      )}

      <div class="facts">
        <div class="fact">
          <span class="fact-label">{t('details.facts.system')}</span>
          <span class="fact-value">{systemOf(path) || '—'}</span>
        </div>
        <div class="fact">
          <span class="fact-label">{t('details.facts.format')}</span>
          <span class="fact-value">
            {romMetadataService.getROMFormat(path)} (
            {extensionOf(path) || t('details.facts.noExtension')})
          </span>
        </div>
        <div class="fact">
          <span class="fact-label">{t('details.facts.size')}</span>
          <span class="fact-value">{formatSize(size)}</span>
        </div>
        <div class="fact">
          <span class="fact-label">{t('details.facts.modified')}</span>
          <span class="fact-value">{formatDate(stat?.mtime)}</span>
        </div>
        <div class="fact">
          <span class="fact-label">{t('details.facts.added')}</span>
          <span class="fact-value muted">{t('details.facts.notInitialized')}</span>
        </div>
        <ChecksumRow path={path} size={size} loadContent={loadContent} />
      </div>
    </div>
  );
}

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
        <CoverFigure cover={cover} alt={record.title || path} system={systemOf(path)} />

        <div class="rom-info-heading">
          <h2>{record.title || gameNameOf(path)}</h2>
          <p class="rom-info-system">{systemOf(path)}</p>

          <div class="rom-info-tags">
            {record.region && <span class="tag">{record.region}</span>}
            {record.videoStandard && <span class="tag">{record.videoStandard}</span>}
            {record.releaseDate && <span class="tag">{record.releaseDate}</span>}
          </div>

          <button class="btn-primary icon-label" onClick={onEdit}>
            <PencilIcon /> {t('details.edit')}
          </button>
        </div>
      </div>

      {record.description && <p class="rom-info-description">{record.description}</p>}

      <div class="facts">
        <div class="fact">
          <span class="fact-label">{t('details.facts.file')}</span>
          <span class="fact-value">{fileNameOf(path)}</span>
        </div>
        {record.publisher && (
          <div class="fact">
            <span class="fact-label">{t('details.facts.publisher')}</span>
            <span class="fact-value">{record.publisher}</span>
          </div>
        )}
        <div class="fact">
          <span class="fact-label">{t('details.facts.size')}</span>
          <span class="fact-value">{formatSize(stat?.size ?? 0)}</span>
        </div>
        <div class="fact">
          <span class="fact-label">{t('details.facts.crc32')}</span>
          <span class="fact-value">{record.crc32 ? <code>{record.crc32}</code> : '—'}</span>
        </div>
        <div class="fact">
          <span class="fact-label">{t('details.facts.added')}</span>
          <span class="fact-value">{formatDate(record.addedAt)}</span>
        </div>
        <div class="fact">
          <span class="fact-label">{t('details.facts.updated')}</span>
          <span class="fact-value">{formatDate(record.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}

const STATUS_KEYS: Record<MatchStatus, string> = {
  complete: 'details.status.complete',
  partial: 'details.status.partial',
  missing: 'details.status.missing',
};

function hasFiles(variant: WizardVariant): boolean {
  return variant.files.some((file) => file.path);
}

function VariantRow({
  variant,
  stats,
  cover,
  onSelectFile,
  onOrganize,
  onRemove,
}: {
  variant: WizardVariant;
  stats: Map<string, StorageStat | null>;
  cover?: CoverShown;
  onSelectFile?: (path: string) => void;
  onOrganize?: (path: string) => void;
  onRemove?: (paths: string[]) => void;
}): JSX.Element {
  const [deleteTarget, setDeleteTarget] = useState<{
    title: string;
    message: string;
    paths: string[];
  } | null>(null);

  const activeUrl = cover?.publishedUrl || cover?.url;
  const isCoverActive =
    variant.status !== 'missing' &&
    (Boolean(activeUrl && variant.cover === activeUrl) ||
      Boolean(cover?.region && !variant.cover && variant.regions.includes(cover.region)));

  const files = (file: WizardFile, index: number) => {
    if (!file.path) {
      return (
        <li key={`missing:${index}`} class="variant-file missing">
          <span>{file.label}</span>
          <code class="variant-file-crc" title="CRC32">
            {file.crc}
          </code>
          <span class="variant-file-size">{t('details.variants.missingFile')}</span>
        </li>
      );
    }

    const isNeoGeo = systemOf(file.path) === 'NEOGEO' || file.path.toLowerCase().endsWith('.neo');
    const validation = isNeoGeo
      ? validateNeoGeoVariant({
          fileName: fileNameOf(file.path),
          fileSize: stats.get(file.path)?.size,
          datMatch: Boolean(file.crc),
        })
      : null;

    return (
      <li key={file.path} class="variant-file">
        <button class="btn-inline" onClick={() => onSelectFile?.(file.path!)}>
          {file.label}
        </button>
        {validation && (
          <span
            class={`variant-validation-icon status-${validation.status}`}
            title={`${validation.statusLabel} (${validation.details})`}
          >
            {validation.status === 'verified' && <DoubleCheckIcon />}
            {validation.status === 'structurally_valid' && <CheckIcon />}
            {validation.status === 'incomplete' && <CrossIcon />}
          </span>
        )}
        {file.isConsolidated === false && onOrganize && (
          <button
            class="tree-organize"
            onClick={(event) => {
              event.stopPropagation();
              onOrganize(file.path!);
            }}
            title={t('details.variants.consolidate')}
          >
            <OrganizeIcon />
          </button>
        )}
        {onRemove && (
          <button
            class="tree-remove"
            onClick={(event) => {
              event.stopPropagation();
              setDeleteTarget({
                title: t('details.variants.deleteFileTitle'),
                message: t('details.variants.deleteFileMessage', { name: file.label }),
                paths: [file.path!],
              });
            }}
            title={t('details.variants.deleteFile')}
          >
            <TrashIcon />
          </button>
        )}
        <code class="variant-file-crc" title="CRC32">
          {file.crc}
        </code>
        <span class="variant-file-size">{formatSize(stats.get(file.path)?.size ?? 0)}</span>
      </li>
    );
  };

  const displayKey = variant.key === 'Unknown' ? 'World / Arcade' : variant.key;
  const presentPaths = variant.files.map((file) => file.path!).filter(Boolean);

  return (
    <li class={`variant status-${variant.status}${isCoverActive ? ' active-cover' : ''}`}>
      <div class="variant-heading">
        <span class="variant-mark" title={t(STATUS_KEYS[variant.status])}>
          <StatusIcon status={variant.status} />
        </span>
        <span class="variant-key">{displayKey}</span>
        <span class="variant-support">
          {variant.regions.map((region) => (
            <span key={region} class="tag region" title={t('details.variants.shipsTo', { region })}>
              {region}
            </span>
          ))}
          {variant.videoStandards.map((standard) => (
            <span key={standard} class="tag video" title={t('details.variants.runsAt', { standard })}>
              {standard}
            </span>
          ))}
        </span>
        <span class="variant-count">
          {variant.files.length > 1
            ? t('details.variants.files', { count: variant.files.length })
            : ''}
        </span>
        {presentPaths.length > 0 && onRemove && (
          <button
            class="tree-remove"
            onClick={(event) => {
              event.stopPropagation();
              setDeleteTarget({
                title: t('details.variants.deleteTitle'),
                message: t('details.variants.deleteMessage', {
                  variant: displayKey,
                  count: presentPaths.length,
                }),
                paths: presentPaths,
              });
            }}
            title={t('details.variants.deleteVariant')}
          >
            <TrashIcon />
          </button>
        )}
      </div>
      <ul class="variant-files">{variant.files.map(files)}</ul>

      {deleteTarget && (
        <ConfirmModal
          open={Boolean(deleteTarget)}
          title={deleteTarget.title}
          message={deleteTarget.message}
          danger={true}
          onConfirm={() => {
            const paths = deleteTarget.paths;
            setDeleteTarget(null);
            onRemove?.(paths);
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </li>
  );
}

function GameView({
  game,
  cover,
  stats,
  onSelectFile,
  onOrganize,
  onRemove,
}: {
  game: WizardGame;
  cover?: CoverShown;
  stats: Map<string, StorageStat | null>;
  onSelectFile?: (path: string) => void;
  onOrganize?: (path: string) => void;
  onRemove?: (paths: string[]) => void;
}): JSX.Element {
  const present = game.variants.filter(hasFiles);
  const missing = game.variants.filter((variant) => !hasFiles(variant));

  return (
    <div class="rom-info game-info">
      <div class="rom-info-hero">
        <CoverFigure cover={cover} alt={game.title} system={systemOf(game.paths[0])} />

        <div class="rom-info-heading">
          <h2>{game.title}</h2>
          <p class="rom-info-system">{systemOf(game.paths[0]) || '—'}</p>

          <div class="rom-info-tags">
            <span class={`tag status-${game.status}`}>{t(STATUS_KEYS[game.status])}</span>
            {present.map((variant) => (
              <span key={variant.key} class="tag">
                {variant.key}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div class="variants-heading">
        <h3>{t('details.variants.title')}</h3>
        {present.length > 0 && onOrganize && (
          <button
            class="tree-organize"
            onClick={() => onOrganize(present[0].files.find((f) => f.path)?.path || game.paths[0])}
            title={t('details.variants.consolidateAll')}
          >
            <OrganizeIcon />
          </button>
        )}
      </div>

      <ul class="variants">
        {present.map((variant) => (
          <VariantRow
            key={variant.key}
            variant={variant}
            stats={stats}
            cover={cover}
            onSelectFile={onSelectFile}
            onOrganize={onOrganize}
            onRemove={onRemove}
          />
        ))}
      </ul>

      {missing.length > 0 && (
        <details class="variants-missing">
          <summary>{t('details.variants.more', { count: missing.length })}</summary>
          <ul class="variants">
            {missing.map((variant) => (
              <VariantRow
                key={variant.key}
                variant={variant}
                stats={stats}
                cover={cover}
                onSelectFile={onSelectFile}
                onOrganize={onOrganize}
                onRemove={onRemove}
              />
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function sharedValue(records: RomRecord[], field: keyof RomRecord): string | undefined {
  const first = records[0]?.[field];
  if (typeof first !== 'string') return undefined;
  return records.every((record) => record[field] === first) ? first : undefined;
}

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
      setError(err instanceof Error ? err.message : t('details.batch.error'));
      setSaving(false);
    }
  };

  return (
    <div class="metadata-editor">
      <div class="metadata-header">
        <div>
          <h3>{t('details.batch.title', { count })}</h3>
          <p class="metadata-subtitle">{t('details.batch.subtitle')}</p>
        </div>
      </div>

      {error && <div class="lookup-error">{error}</div>}

      <div class="form-group">
        <label>{t('editor.fields.region')}</label>
        <select value={region} onChange={(event) => setRegion((event.target as HTMLSelectElement).value)}>
          <option value="">
            {t('details.batch.keep', { value: currentRegion || t('details.batch.mixed') })}
          </option>
          {ROM_REGIONS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div class="form-group">
        <label>{t('editor.fields.videoStandard')}</label>
        <select
          value={videoStandard}
          onChange={(event) => setVideoStandard((event.target as HTMLSelectElement).value)}
        >
          <option value="">
            {t('details.batch.keep', { value: currentVideo || t('details.batch.mixed') })}
          </option>
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
            t('details.batch.saving')
          ) : (
            <>
              <SaveIcon /> {t('details.batch.apply', { count })}
            </>
          )}
        </button>
        <button class="btn-cancel" onClick={onCancel} disabled={saving}>
          {t('editor.cancel')}
        </button>
      </div>
    </div>
  );
}

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
          <h3>{t('details.selection.title', { count: paths.length })}</h3>
          <p class="metadata-subtitle">
            {pending === 0
              ? t('details.selection.ready')
              : t('details.selection.pending', { count: pending })}
          </p>
        </div>
        <button
          class="btn-primary icon-label"
          onClick={onEdit}
          disabled={pending > 0}
          title={pending > 0 ? t('details.selection.gate') : t('details.selection.hint')}
        >
          <PencilIcon /> {t('details.selection.edit', { count: paths.length })}
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
  folder,
  wizardFolder = false,
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
  onOrganize,
  onRemove,
  onBack,
  loadContent,
}: RomDetailsProps): JSX.Element {
  const back = onBack && (
    <button class="btn-back icon-label" onClick={onBack.go} title={t('details.back')}>
      <ArrowLeftIcon /> {onBack.label}
    </button>
  );

  if (game) {
    return (
      <GameView
        key={game.key}
        game={game}
        cover={gameCover}
        stats={stats}
        onSelectFile={onSelectFile}
        onOrganize={onOrganize}
        onRemove={onRemove}
      />
    );
  }

  if (folder && (paths.length === 0 || (paths.length === 1 && paths[0] === folder))) {
    return <SystemDetails folder={folder} wizard={wizardFolder} />;
  }

  if (paths.length === 0) {
    return <div class="empty-state">{t('details.empty')}</div>;
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
        onSave={(updated, coverFile, coverRemoved) =>
          onSave(path, updated, coverFile, coverRemoved)
        }
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
