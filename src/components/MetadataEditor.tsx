import { JSX } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { ROMMetadata, ROM_REGIONS } from '../services/ROMMetadataService';
import { ROMDatasetService } from '../services/ROMDatasetService';
import { calculateCRC32, calculateMD5, calculateSHA1 } from '../services/ChecksumService';

interface MetadataEditorProps {
  metadata: ROMMetadata;
  onChange?: (metadata: ROMMetadata) => void;
  fileName?: string;
  fileContent?: ArrayBuffer;
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

export function MetadataEditor({
  metadata,
  onChange,
  fileName,
  fileContent,
}: MetadataEditorProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [lookupPhase, setLookupPhase] = useState<LookupPhase>('idle');
  const [lookupResult, setLookupResult] = useState<DatasetResult | null>(null);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [localCRC32, setLocalCRC32] = useState<string | undefined>(undefined);
  const [crc32Loading, setCRC32Loading] = useState(false);

  // Compute CRC32 lazily when fileContent changes
  useEffect(() => {
    if (!fileContent) {
      setLocalCRC32(undefined);
      return;
    }

    setCRC32Loading(true);
    calculateCRC32(fileContent)
      .then((crc32) => {
        setLocalCRC32(crc32);
        setCRC32Loading(false);
      })
      .catch((err) => {
        console.error('Failed to calculate CRC32:', err);
        setCRC32Loading(false);
      });
  }, [fileContent]);

  const handleChange = (field: keyof ROMMetadata, value: any) => {
    const updated = { ...metadata, [field]: value };
    onChange?.(updated);
  };

  /**
   * Show a match and pre-select every field the dataset can fill in.
   */
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
    if (!fileContent || !fileName) {
      setError('No file selected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setLookupResult(null);
      setSelectedFields(new Set());
      setLookupPhase('crc32');

      // Use pre-computed CRC32 or calculate if needed
      const crc32 = localCRC32 || (await calculateCRC32(fileContent));

      // Step 2: Try CRC32 lookup
      let result = await ROMDatasetService.lookupByCrc(crc32);

      if (result) {
        showLookupResult(result);
        return;
      }

      // Step 3: CRC32 miss → calculate MD5
      setLookupPhase('md5');
      const md5 = await calculateMD5(fileContent);

      // Step 4: Try MD5 lookup
      result = await ROMDatasetService.lookupByMd5(md5);

      if (result) {
        showLookupResult(result);
        return;
      }

      // Step 5: MD5 miss → calculate SHA1
      setLookupPhase('sha1');
      const sha1 = await calculateSHA1(fileContent);

      // Step 6: Try SHA1 lookup
      result = await ROMDatasetService.lookupBySha1(sha1);

      if (result) {
        showLookupResult(result);
      } else {
        setError('No match found in datasets');
        setLookupPhase('complete');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lookup failed');
      setLookupPhase('complete');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldToggle = (field: string) => {
    const newFields = new Set(selectedFields);
    if (newFields.has(field)) {
      newFields.delete(field);
    } else {
      newFields.add(field);
    }
    setSelectedFields(newFields);
  };

  const handleApplySelected = () => {
    if (!lookupResult) return;

    const updated = { ...metadata };

    if (selectedFields.has('title') && lookupResult.name) {
      updated.title = lookupResult.name;
    }

    if (selectedFields.has('description') && lookupResult.description) {
      updated.description = lookupResult.description;
    }

    if (selectedFields.has('region') && lookupResult.region) {
      updated.region = lookupResult.region;
    }

    if (selectedFields.has('videoStandard') && lookupResult.videoStandard) {
      updated.videoStandard = lookupResult.videoStandard;
    }

    if (selectedFields.has('cover') && lookupResult.cover) {
      updated.cover = lookupResult.cover;
    }

    onChange?.(updated);
    setLookupResult(null);
    setSelectedFields(new Set());
  };

  const getButtonLabel = () => {
    if (!isLoading) return '🔍 Lookup Dataset';
    if (lookupPhase === 'crc32') return '🔍 Checking CRC32...';
    if (lookupPhase === 'md5') return '⏳ Calculating MD5...';
    if (lookupPhase === 'sha1') return '⏳ Calculating SHA1...';
    return '🔍 Looking...';
  };

  return (
    <div class="metadata-editor">
      <div class="metadata-header">
        <h3>Metadata</h3>
        {fileContent && (
          <button
            onClick={handleLookup}
            disabled={isLoading}
            class="btn-lookup"
            title="Look up game info from dataset (CRC32 → MD5 → SHA1)"
          >
            {getButtonLabel()}
          </button>
        )}
      </div>

      {error && <div class="lookup-error">{error}</div>}

      {lookupResult && (
        <div class="lookup-modal-overlay" onClick={() => setLookupResult(null)}>
          <div class="lookup-modal" onClick={(e) => e.stopPropagation()}>
            <div class="modal-header">
              <h3>Dataset Match Found</h3>
              <button class="modal-close" onClick={() => setLookupResult(null)}>
                ✕
              </button>
            </div>

            <div class="modal-content">
              <p class="match-name">
                <strong>Match:</strong> {lookupResult.name}
              </p>

              {lookupResult.description && (
                <p class="match-description">
                  <strong>Description:</strong> {lookupResult.description}
                </p>
              )}

              <div class="update-fields">
                <h4>Select fields to update:</h4>

                <div class="field-option">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedFields.has('title')}
                      onChange={() => handleFieldToggle('title')}
                    />
                    <span class="checkbox-text">
                      <strong>Title:</strong>
                      <div class="field-preview">
                        <div class="current">
                          Current: <span class="value">{metadata.title || '(empty)'}</span>
                        </div>
                        <div class="new">
                          New: <span class="value">{lookupResult.name}</span>
                        </div>
                      </div>
                    </span>
                  </label>
                </div>

                {lookupResult.description && (
                  <div class="field-option">
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedFields.has('description')}
                        onChange={() => handleFieldToggle('description')}
                      />
                      <span class="checkbox-text">
                        <strong>Description:</strong>
                        <div class="field-preview">
                          <div class="current">
                            Current: <span class="value">{metadata.description || '(empty)'}</span>
                          </div>
                          <div class="new">
                            New: <span class="value">{lookupResult.description}</span>
                          </div>
                        </div>
                      </span>
                    </label>
                  </div>
                )}

                {lookupResult.region && (
                  <p>
                    <strong>Region:</strong> {lookupResult.region}
                  </p>
                )}

                {lookupResult.videoStandard && (
                  <p>
                    <strong>Video:</strong> {lookupResult.videoStandard}
                  </p>
                )}

                {lookupResult.region && (
                  <div class="field-option">
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedFields.has('region')}
                        onChange={() => handleFieldToggle('region')}
                      />
                      <span class="checkbox-text">
                        <strong>Region:</strong> {lookupResult.region}
                      </span>
                    </label>
                  </div>
                )}

                {lookupResult.videoStandard && (
                  <div class="field-option">
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedFields.has('videoStandard')}
                        onChange={() => handleFieldToggle('videoStandard')}
                      />
                      <span class="checkbox-text">
                        <strong>Video:</strong> {lookupResult.videoStandard}
                      </span>
                    </label>
                  </div>
                )}

                {lookupResult.cover && (
                  <div class="field-option">
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedFields.has('cover')}
                        onChange={() => handleFieldToggle('cover')}
                      />
                      <span class="checkbox-text">
                        <strong>Cover:</strong>
                        <img
                          class="cover-preview"
                          src={lookupResult.cover}
                          alt={`${lookupResult.name} boxart`}
                          loading="lazy"
                        />
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div class="modal-actions">
              <button
                onClick={handleApplySelected}
                class="btn-apply"
                disabled={selectedFields.size === 0}
              >
                ✓ Apply Selected
              </button>
              <button onClick={() => setLookupResult(null)} class="btn-cancel">
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {metadata.cover && (
        <div class="form-group">
          <label>Cover</label>
          <img
            class="cover-image"
            src={metadata.cover}
            alt={`${metadata.title || metadata.filename} boxart`}
            loading="lazy"
          />
        </div>
      )}

      <div class="form-group">
        <label>Title</label>
        <input
          type="text"
          value={metadata.title || ''}
          onInput={(e) => handleChange('title', (e.target as HTMLInputElement).value)}
        />
      </div>

      <div class="form-group">
        <label>Format</label>
        <input type="text" value={metadata.format} disabled />
      </div>

      <div class="form-group">
        <label>CRC32</label>
        <input 
          type="text" 
          value={localCRC32 || ''} 
          placeholder={crc32Loading ? '⏳ Calculating...' : '(computing)'}
          disabled 
          class={`checksum-field ${crc32Loading ? 'loading' : ''}`}
          title="File checksum (for ROM identification)"
        />
      </div>

      <div class="form-group">
        <label>Release Date</label>
        <input
          type="date"
          value={metadata.releaseDate || ''}
          onInput={(e) => handleChange('releaseDate', (e.target as HTMLInputElement).value)}
        />
      </div>

      <div class="form-group">
        <label>Publisher</label>
        <input
          type="text"
          value={metadata.publisher || ''}
          onInput={(e) => handleChange('publisher', (e.target as HTMLInputElement).value)}
        />
      </div>

      <div class="form-group">
        <label>Region</label>
        <select
          value={metadata.region || ''}
          onChange={(e) => handleChange('region', (e.target as HTMLSelectElement).value)}
        >
          <option value="">Select...</option>
          {/* Keep an unknown value selectable so a lookup result is never silently dropped. */}
          {metadata.region && !ROM_REGIONS.includes(metadata.region) && (
            <option value={metadata.region}>{metadata.region}</option>
          )}
          {ROM_REGIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div class="form-group">
        <label>Video Standard</label>
        <input
          type="text"
          value={metadata.videoStandard || ''}
          onInput={(e) => handleChange('videoStandard', (e.target as HTMLInputElement).value)}
        />
      </div>

      <div class="form-group">
        <label>Rating</label>
        <input
          type="number"
          min="0"
          max="10"
          step="0.5"
          value={metadata.rating || ''}
          onInput={(e) => handleChange('rating', parseFloat((e.target as HTMLInputElement).value))}
        />
      </div>
    </div>
  );
}
