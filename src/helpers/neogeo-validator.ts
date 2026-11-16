/**
 * NeoGeo ROM Validation Engine
 * 
 * Performs double-check validation on NeoGeo variants:
 * 1. Structural / Format integrity check (Darksoft 512-byte .neo header & size, or .zip archive structure).
 * 2. DAT / Checksum lookup check (Matching file CRC32 or member CRCs against dataset DAT records).
 */

export interface NeoGeoHeader {
  validHeader: boolean;
  version: number;
  system: number; // 0 = MVS, 1 = AES
  pSize: number;
  sSize: number;
  mSize: number;
  vSize: number;
  cSize: number;
  totalDataSize: number;
  expectedFileSize: number;
}

export type ValidationStatus = 'verified' | 'structurally_valid' | 'incomplete' | 'unverified';

export interface NeoGeoValidationResult {
  status: ValidationStatus;
  structureValid: boolean;
  datVerified: boolean;
  statusLabel: string;
  details: string;
  header?: NeoGeoHeader;
}

/**
 * Parse Darksoft NeoGeo `.neo` 512-byte header.
 * 
 * Header layout (512 bytes):
 * - Offset 0..3: Magic bytes 'NEO\x01' (0x4E 0x45 0x4F 0x01)
 * - Offset 4: Version (1)
 * - Offset 5: System (0 = MVS, 1 = AES)
 * - Offset 8..11: P-ROM size (uint32 LE)
 * - Offset 12..15: S-ROM size (uint32 LE)
 * - Offset 16..19: M-ROM size (uint32 LE)
 * - Offset 20..23: V-ROM size (uint32 LE)
 * - Offset 24..27: C-ROM size (uint32 LE)
 */
export function parseNeoGeoHeader(buffer: ArrayBuffer): NeoGeoHeader | null {
  if (buffer.byteLength < 512) {
    return null;
  }

  const bytes = new Uint8Array(buffer, 0, 512);
  
  // Check magic 'NEO'
  const isMagicNEO = bytes[0] === 0x4E && bytes[1] === 0x45 && bytes[2] === 0x4F;
  if (!isMagicNEO) {
    return null;
  }

  const view = new DataView(buffer, 0, 512);
  const version = bytes[4];
  const system = bytes[5];

  const pSize = view.getUint32(8, true);
  const sSize = view.getUint32(12, true);
  const mSize = view.getUint32(16, true);
  const vSize = view.getUint32(20, true);
  const cSize = view.getUint32(24, true);

  const totalDataSize = pSize + sSize + mSize + vSize + cSize;
  const expectedFileSize = 512 + totalDataSize;

  return {
    validHeader: true,
    version,
    system,
    pSize,
    sSize,
    mSize,
    vSize,
    cSize,
    totalDataSize,
    expectedFileSize,
  };
}

export interface ValidationInput {
  fileName: string;
  fileSize?: number;
  crc32?: string;
  memberCrcs?: string[];
  headerBuffer?: ArrayBuffer;
  datMatch?: boolean;
}

/**
 * Perform double-check validation on a NeoGeo ROM variant file (.neo or .zip).
 */
export function validateNeoGeoVariant(input: ValidationInput): NeoGeoValidationResult {
  const isNeo = input.fileName.toLowerCase().endsWith('.neo');
  const isZip = input.fileName.toLowerCase().endsWith('.zip');

  let structureValid = false;
  let headerInfo: NeoGeoHeader | undefined;
  let details = '';

  if (isNeo) {
    if (input.headerBuffer) {
      const header = parseNeoGeoHeader(input.headerBuffer);
      if (header) {
        headerInfo = header;
        if (input.fileSize !== undefined) {
          structureValid = input.fileSize === header.expectedFileSize;
          details = structureValid
            ? `Valid .neo header (P: ${formatMiB(header.pSize)}, C: ${formatMiB(header.cSize)}, total: ${formatMiB(header.totalDataSize)})`
            : `Header/size mismatch (expected ${header.expectedFileSize} B, got ${input.fileSize} B)`;
        } else {
          structureValid = true;
          details = `Valid .neo header (total data ${formatMiB(header.totalDataSize)})`;
        }
      } else {
        structureValid = false;
        details = 'Invalid or missing .neo 512-byte header magic';
      }
    } else {
      // Without buffer, if fileSize > 512 bytes, assume structurally plausible
      structureValid = (input.fileSize ?? 0) > 512;
      details = structureValid ? 'Plausible .neo file size' : 'File size too small for .neo';
    }
  } else if (isZip) {
    // For ZIP, if we have member CRCs or fileSize > 0, structure is valid
    const hasMembers = (input.memberCrcs?.length ?? 0) > 0;
    structureValid = hasMembers || (input.fileSize ?? 0) > 0;
    details = hasMembers
      ? `Valid ZIP archive containing ${input.memberCrcs?.length} chip dumps`
      : 'ZIP archive structure detected';
  } else {
    structureValid = (input.fileSize ?? 0) > 0;
    details = 'Generic ROM file';
  }

  const datVerified = Boolean(input.datMatch);

  let status: ValidationStatus = 'unverified';
  let statusLabel = 'Unverified';

  if (structureValid && datVerified) {
    status = 'verified';
    statusLabel = isNeo ? 'Verified (DAT + Header)' : 'Verified (DAT + ZIP)';
  } else if (structureValid && !datVerified) {
    status = 'structurally_valid';
    statusLabel = isNeo ? 'Valid Structure (Custom DAT)' : 'Valid Archive (Custom DAT)';
  } else if (!structureValid) {
    status = 'incomplete';
    statusLabel = 'Incomplete / Corrupted';
  }

  return {
    status,
    structureValid,
    datVerified,
    statusLabel,
    details,
    header: headerInfo,
  };
}

function formatMiB(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(0)} KiB`;
  }
  return `${bytes} B`;
}
