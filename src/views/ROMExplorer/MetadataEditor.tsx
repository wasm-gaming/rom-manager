import { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { ROM_REGIONS, VIDEO_STANDARDS } from '@/services/ROMMetadataService';
import { RomRecord, gameNameOf, systemOf } from '@/services/RomLibraryService';
import { ROMDatasetService } from '@/services/ROMDatasetService';
import { calculateCRC32, calculateMD5, calculateSHA1 } from '@/services/ChecksumService';
import { CheckIcon, CloseIcon, HourglassIcon, SaveIcon, SearchIcon } from '@/components/icons';
import { t } from '@/services/I18nService';

interface MetadataEditorProps {
  romPath: string;
  record: RomRecord;
  /** Resolved cover of the saved record, if it already has one. */
  coverUrl?: string;
  /** Reads the ROM bytes. Only called when a checksum actually needs them. */
  loadContent: () => Promise<ArrayBuffer>;
  /** False when the ROM is too large to hash on demand. */
  canChecksum: boolean;
  onSave: (record: RomRecord) => Promise<void>;
  onCancel: () => void;
}

interface DatasetResult {
  name: string;
  description?: string;
  fileName?: string;
  region?: string;
  videoStandard?: string;
  cover?: string;
}

type LookupPhase = 'idle' | 'crc32' | 'md5' | 'sha1' | 'complete';

const LOOKUP_FIELDS = ['title', 'description', 'region', 'videoStandard', 'cover'] as const;

export function MetadataEditor({
  romPath,
  record,
  coverUrl,
  loadContent,
  canChecksum,
  onSave,
  onCancel,
}: MetadataEditorProps): JSX.Element {
  const [draft, setDraft] = useState<RomRecord>(record);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [lookupPhase, setLookupPhase] = useState<LookupPhase>('idle');
  const [lookupResult, setLookupResult] = useState<DatasetResult | null>(null);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const previewUrl = draft.cover?.startsWith('https://') ? draft.cover : coverUrl;

  const update = <K extends keyof RomRecord>(field: K, value: RomRecord[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const ensureChecksum = async (): Promise<string> => {
    if (draft.crc32) return draft.crc32;

    const crc32 = await calculateCRC32(await loadContent());
    update('crc32', crc32);
    return crc32;
  };

  const handleComputeChecksum = async () => {
    try {
      setBusy(true);
      setError(null);
      await ensureChecksum();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('editor.error.checksum'));
    } finally {
      setBusy(false);
    }
  };

  const showLookupResult = (result: DatasetResult) => {
    setLookupResult(result);

    const fields = new Set<string>();
    if (result.name) fields.add('title');
    if (result.description) fields.add('description');
    if (result.region) fields.add('region');
    if (result.videoStandard) fields.add('videoStandard');
    if (result.cover) fields.add('cover');

    setSelectedFields(fields);
    setLookupPhase('complete');
  };

  const handleLookup = async () => {
    try {
      setBusy(true);
      setError(null);
      setLookupResult(null);
      setSelectedFields(new Set());
      setLookupPhase('crc32');

      const content = await loadContent();
      const crc32 = draft.crc32 || (await calculateCRC32(content));
      if (!draft.crc32) update('crc32', crc32);

      const system = systemOf(romPath);
      try {
        await ROMDatasetService.ensureSystem(system);
      } catch {
        setError(`No dataset available for ${system}`);
        setLookupPhase('complete');
        return;
      }

      let result = await ROMDatasetService.lookupByCrc(crc32);
      if (result) {
        showLookupResult(result);
        return;
      }

      setLookupPhase('md5');
      result = await ROMDatasetService.lookupByMd5(await calculateMD5(content));
      if (result) {
        showLookupResult(result);
        return;
      }

      setLookupPhase('sha1');
      result = await ROMDatasetService.lookupBySha1(await calculateSHA1(content));
      if (result) {
        showLookupResult(result);
        return;
      }

      setError(t('editor.lookup.notFound'));
      setLookupPhase('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('editor.lookup.failed'));
      setLookupPhase('complete');
    } finally {
      setBusy(false);
    }
  };

  const toggleField = (field: string) => {
    setSelectedFields((current) => {
      const next = new Set(current);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });
  };

  const handleApplySelected = () => {
    if (!lookupResult) return;

    setDraft((current) => ({
      ...current,
      title: selectedFields.has('title') && lookupResult.name ? lookupResult.name : current.title,
      description:
        selectedFields.has('description') && lookupResult.description
          ? lookupResult.description
          : current.description,
      region:
        selectedFields.has('region') && lookupResult.region ? lookupResult.region : current.region,
      videoStandard:
        selectedFields.has('videoStandard') && lookupResult.videoStandard
          ? lookupResult.videoStandard
          : current.videoStandard,
      cover: selectedFields.has('cover') && lookupResult.cover ? lookupResult.cover : current.cover,
    }));

    setLookupResult(null);
    setSelectedFields(new Set());
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await onSave(draft);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('editor.error.save'));
      setSaving(false);
    }
  };

  const lookupLabel = (): JSX.Element => {
    if (busy && lookupPhase === 'crc32')
      return (
        <>
          <SearchIcon /> {t('editor.lookup.crc32')}
        </>
      );
    if (busy && lookupPhase === 'md5')
      return (
        <>
          <HourglassIcon /> {t('editor.lookup.md5')}
        </>
      );
    if (busy && lookupPhase === 'sha1')
      return (
        <>
          <HourglassIcon /> {t('editor.lookup.sha1')}
        </>
      );
    return (
      <>
        <SearchIcon /> {t('editor.lookup.idle')}
      </>
    );
  };

  return (
    <div class="metadata-editor">
      <div class="metadata-header">
        <div>
          <h3>{draft.title || gameNameOf(romPath)}</h3>
          <p class="metadata-subtitle">{romPath}</p>
        </div>
        <button
          onClick={handleLookup}
          disabled={busy || saving || !canChecksum}
          class="btn-lookup icon-label"
          title={canChecksum ? t('editor.lookup.hint') : t('editor.lookup.tooLarge')}
        >
          {lookupLabel()}
        </button>
      </div>

      {error && <div class="lookup-error">{error}</div>}

      {lookupResult && (
        <div class="lookup-modal-overlay" onClick={() => setLookupResult(null)}>
          <div class="lookup-modal" onClick={(event) => event.stopPropagation()}>
            <div class="modal-header">
              <h3>{t('editor.lookup.title')}</h3>
              <button class="modal-close" onClick={() => setLookupResult(null)}>
                <CloseIcon />
              </button>
            </div>

            <div class="modal-content">
              <p class="match-name">
                <strong>{t('editor.lookup.match')}</strong> {lookupResult.name}
              </p>

              <div class="update-fields">
                <h4>{t('editor.lookup.select')}</h4>

                {LOOKUP_FIELDS.map((field) => {
                  const incoming =
                    field === 'title' ? lookupResult.name : (lookupResult[field] as string | undefined);
                  if (!incoming) return null;

                  const current = (draft[field] as string | undefined) || t('editor.lookup.empty');

                  return (
                    <div class="field-option" key={field}>
                      <label class="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedFields.has(field)}
                          onChange={() => toggleField(field)}
                        />
                        <span class="checkbox-text">
                          <strong>{t(`editor.fields.${field}`)}</strong>
                          {field === 'cover' ? (
                            <img
                              class="cover-preview"
                              src={incoming}
                              alt={t('details.cover.alt', { title: lookupResult.name })}
                              loading="lazy"
                            />
                          ) : (
                            <span class="field-preview">
                              <span class="current">
                                {t('editor.lookup.current')} <span class="value">{current}</span>
                              </span>
                              <span class="new">
                                {t('editor.lookup.incoming')} <span class="value">{incoming}</span>
                              </span>
                            </span>
                          )}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div class="modal-actions">
              <button
                onClick={handleApplySelected}
                class="btn-apply icon-label"
                disabled={selectedFields.size === 0}
              >
                <CheckIcon /> {t('editor.lookup.apply')}
              </button>
              <button onClick={() => setLookupResult(null)} class="btn-cancel icon-label">
                <CloseIcon /> {t('editor.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {previewUrl && (
        <div class="form-group">
          <label>{t('editor.fields.cover')}</label>
          <img
            class="cover-image"
            src={previewUrl}
            alt={t('details.cover.alt', { title: draft.title || gameNameOf(romPath) })}
            loading="lazy"
          />
          <button class="btn-inline" onClick={() => update('cover', undefined)}>
            {t('editor.removeCover')}
          </button>
        </div>
      )}

      <div class="form-group">
        <label>{t('editor.fields.title')}</label>
        <input
          type="text"
          value={draft.title || ''}
          onInput={(event) => update('title', (event.target as HTMLInputElement).value)}
        />
      </div>

      <div class="form-group">
        <label>{t('editor.fields.description')}</label>
        <textarea
          rows={4}
          value={draft.description || ''}
          onInput={(event) => update('description', (event.target as HTMLTextAreaElement).value)}
        />
      </div>

      <div class="form-group">
        <label>{t('editor.fields.releaseDate')}</label>
        <input
          type="date"
          value={draft.releaseDate || ''}
          onInput={(event) => update('releaseDate', (event.target as HTMLInputElement).value)}
        />
      </div>

      <div class="form-group">
        <label>{t('editor.fields.publisher')}</label>
        <input
          type="text"
          value={draft.publisher || ''}
          onInput={(event) => update('publisher', (event.target as HTMLInputElement).value)}
        />
      </div>

      <div class="form-group">
        <label>{t('editor.fields.region')}</label>
        <select
          value={draft.region || ''}
          onChange={(event) => update('region', (event.target as HTMLSelectElement).value)}
        >
          <option value="">{t('editor.select')}</option>
          {draft.region && !ROM_REGIONS.includes(draft.region) && (
            <option value={draft.region}>{draft.region}</option>
          )}
          {ROM_REGIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div class="form-group">
        <label>{t('editor.fields.videoStandard')}</label>
        <select
          value={draft.videoStandard || ''}
          onChange={(event) => update('videoStandard', (event.target as HTMLSelectElement).value)}
        >
          <option value="">{t('editor.select')}</option>
          {draft.videoStandard && !VIDEO_STANDARDS.includes(draft.videoStandard) && (
            <option value={draft.videoStandard}>{draft.videoStandard}</option>
          )}
          {VIDEO_STANDARDS.map((standard) => (
            <option key={standard} value={standard}>
              {standard}
            </option>
          ))}
        </select>
      </div>

      <div class="form-group">
        <label>{t('editor.fields.crc32')}</label>
        <div class="field-with-action">
          <input
            type="text"
            value={draft.crc32 || ''}
            placeholder={canChecksum ? t('editor.notCalculated') : t('editor.tooLarge')}
            disabled
            class="checksum-field"
          />
          {canChecksum && !draft.crc32 && (
            <button class="btn-inline" onClick={handleComputeChecksum} disabled={busy}>
              {t('editor.calculate')}
            </button>
          )}
        </div>
      </div>

      <div class="editor-actions">
        <button class="btn-primary icon-label" onClick={handleSave} disabled={saving}>
          {saving ? (
            t('editor.saving')
          ) : (
            <>
              <SaveIcon /> {t('editor.save')}
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
