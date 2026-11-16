// Export services for library usage
export { StorageService, storageService } from './StorageService';
export type { };

export { ROMMetadataService, romMetadataService } from './ROMMetadataService';
export type { ROMMetadata } from './ROMMetadataService';

// The library index other apps read (`.meta/<System>/index.json`) and the mods behind it.
export {
  LIBRARY_INDEX_VERSION,
  gameIdOf,
  modFit,
  modPathOf,
  ownerOfCrc,
  parseLibraryIndex,
  slugOf,
} from '../helpers/library-index';
export type { IndexGame, IndexMod, IndexVersion, LibraryIndex, ModRecord } from '../helpers/library-index';
export { applyPatch, crc32, crcHex, formatOf, isPatchName, parsePatch, PatchError, PATCH_EXTENSIONS } from '../helpers/patch';
export type { PatchErrorCode, PatchFormat, PatchInfo } from '../helpers/patch';
export { LibraryIndexService, indexPathOf, modsRegistryPathOf, readMods } from './LibraryIndexService';
export { ModService, modsDirOf } from './ModService';
export type { ModContext, ModImportResult, ModRefusal } from './ModService';
