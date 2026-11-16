import { defineConfig } from 'vite';
import yaml from '@rollup/plugin-yaml';
import { jq79 } from 'jq79/vite';
import path from 'path';

const hostedByLauncher = process.env.VITE_HOST === 'play.germade';

export default defineConfig({
  // The message catalogues are YAML, so they read as text and diff as text; the
  // plugin is what turns them into the modules `I18nService` imports.
  plugins: [yaml(), jq79()],
  root: 'src',
  publicDir: path.resolve(__dirname, 'static'),
  build: {
    target: 'ES2022',
    outDir: path.resolve(__dirname, 'dist-app'),
    emptyOutDir: true,
    // The /roms/ build (play.germade) also ships `roms-sdk.js`: the library as a module the
    // launcher imports by that fixed name. Its exports are kept; everything else is hashed.
    ...(hostedByLauncher
      ? {
          rollupOptions: {
            input: {
              index: path.resolve(__dirname, 'src/index.html'),
              'roms-sdk': path.resolve(__dirname, 'src/roms-sdk.ts'),
            },
            preserveEntrySignatures: 'exports-only' as const,
            output: {
              entryFileNames: (chunk: { name: string }) => (chunk.name === 'roms-sdk' ? 'roms-sdk.js' : 'assets/[name]-[hash].js'),
            },
          },
        }
      : {}),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
