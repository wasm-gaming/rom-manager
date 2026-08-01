import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import yaml from '@rollup/plugin-yaml';
import path from 'path';

export default defineConfig({
  // The message catalogues are YAML, so they read as text and diff as text; the
  // plugin is what turns them into the modules `I18nService` imports.
  plugins: [preact(), yaml()],
  root: 'src',
  publicDir: path.resolve(__dirname, 'static'),
  build: {
    target: 'ES2022',
    outDir: path.resolve(__dirname, 'dist-app'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
