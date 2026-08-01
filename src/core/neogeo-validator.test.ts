import { describe, expect, it } from 'vitest';
import { parseNeoGeoHeader, validateNeoGeoVariant } from './neogeo-validator';

describe('parseNeoGeoHeader', () => {
  it('returns null if buffer is less than 512 bytes', () => {
    const buffer = new ArrayBuffer(256);
    expect(parseNeoGeoHeader(buffer)).toBeNull();
  });

  it('returns null if magic is not NEO\\x01', () => {
    const buffer = new ArrayBuffer(512);
    const view = new Uint8Array(buffer);
    view[0] = 0x41; // 'A'
    view[1] = 0x42;
    view[2] = 0x43;
    expect(parseNeoGeoHeader(buffer)).toBeNull();
  });

  it('parses valid .neo header correctly', () => {
    const buffer = new ArrayBuffer(512);
    const bytes = new Uint8Array(buffer);
    bytes[0] = 0x4E; // 'N'
    bytes[1] = 0x45; // 'E'
    bytes[2] = 0x4F; // 'O'
    bytes[3] = 0x01; // \x01
    bytes[4] = 1;    // version 1
    bytes[5] = 0;    // MVS

    const view = new DataView(buffer);
    view.setUint32(8, 0x400000, true);  // P: 4 MiB
    view.setUint32(12, 0x20000, true);  // S: 128 KiB
    view.setUint32(16, 0x20000, true);  // M: 128 KiB
    view.setUint32(20, 0x800000, true); // V: 8 MiB
    view.setUint32(24, 0x1000000, true);// C: 16 MiB

    const header = parseNeoGeoHeader(buffer);
    expect(header).not.toBeNull();
    expect(header?.validHeader).toBe(true);
    expect(header?.version).toBe(1);
    expect(header?.pSize).toBe(0x400000);
    expect(header?.totalDataSize).toBe(0x400000 + 0x20000 + 0x20000 + 0x800000 + 0x1000000);
    expect(header?.expectedFileSize).toBe(512 + header!.totalDataSize);
  });
});

describe('validateNeoGeoVariant', () => {
  it('validates a verified .neo file matching DAT and header size', () => {
    const buffer = new ArrayBuffer(512);
    const bytes = new Uint8Array(buffer);
    bytes[0] = 0x4E; bytes[1] = 0x45; bytes[2] = 0x4F; bytes[3] = 0x01;
    const view = new DataView(buffer);
    view.setUint32(8, 1024, true);

    const result = validateNeoGeoVariant({
      fileName: 'mslug.neo',
      fileSize: 512 + 1024,
      headerBuffer: buffer,
      datMatch: true,
    });

    expect(result.status).toBe('verified');
    expect(result.statusLabel).toBe('Verified (DAT + Header)');
    expect(result.structureValid).toBe(true);
    expect(result.datVerified).toBe(true);
  });

  it('validates a verified .zip file with member CRCs matching DAT', () => {
    const result = validateNeoGeoVariant({
      fileName: 'mslug (1).zip',
      fileSize: 154200,
      memberCrcs: ['11111111', '22222222', '33333333'],
      datMatch: true,
    });

    expect(result.status).toBe('verified');
    expect(result.statusLabel).toBe('Verified (DAT + ZIP)');
    expect(result.structureValid).toBe(true);
    expect(result.datVerified).toBe(true);
  });

  it('marks incomplete when .neo file size does not match header declaration', () => {
    const buffer = new ArrayBuffer(512);
    const bytes = new Uint8Array(buffer);
    bytes[0] = 0x4E; bytes[1] = 0x45; bytes[2] = 0x4F; bytes[3] = 0x01;
    const view = new DataView(buffer);
    view.setUint32(8, 1024, true);

    const result = validateNeoGeoVariant({
      fileName: 'mslug.neo',
      fileSize: 100, // Truncated
      headerBuffer: buffer,
      datMatch: true,
    });

    expect(result.status).toBe('incomplete');
    expect(result.statusLabel).toBe('Incomplete / Corrupted');
    expect(result.structureValid).toBe(false);
  });
});
