/**
 * The `roms-sdk.js` entry of the `/roms/` build: the library services (`lib/roms-sdk`) and the
 * add dialog (`views/add-dialog`), which needs the UI layer and so cannot live in lib.
 */
export * from './lib/roms-sdk';
export { openAddDialog, type AddDialogOptions } from './views/add-dialog';
