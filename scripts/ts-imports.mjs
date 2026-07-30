/**
 * Let the dataset scripts import the application's own core modules.
 *
 * Node runs TypeScript by stripping its types, but it resolves imports the way
 * ESM does: `./rom-regions` has to name a file that exists. The application is
 * bundled by Vite and therefore writes its imports without an extension, so a
 * core module importing another one cannot be loaded from a script without this.
 *
 * Rewriting the application's imports instead was the alternative, and it would
 * mean shaping the app around the build scripts rather than the other way round.
 *
 * Registered through `--import`, which is the only point early enough: an
 * extension-less specifier is resolved while the module graph is being linked,
 * before any imported module body runs.
 */

import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (!specifier.startsWith('.') || /\.[a-z]+$/i.test(specifier)) throw error;

      return nextResolve(`${specifier}.ts`, context);
    }
  },
});
