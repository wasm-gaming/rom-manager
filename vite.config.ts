import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import yaml from '@rollup/plugin-yaml';
import { jq79 } from 'jq79/vite';
import path from 'path';

export default defineConfig({
  // The message catalogues are YAML, so they read as text and diff as text; the
  // plugin is what turns them into the modules `I18nService` imports.
  plugins: [preact(), yaml(), jq79()],
  root: 'src',
  publicDir: path.resolve(__dirname, 'static'),
  build: {
    target: 'ES2022',
    outDir: path.resolve(__dirname, 'dist-app'),
    emptyOutDir: true,
    // The jq79 UI is built beside the Preact one while it is migrated (next.html);
    // it becomes index.html when the migration is done.
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
        next: path.resolve(__dirname, 'src/next.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
