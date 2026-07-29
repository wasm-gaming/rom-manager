import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';

export default defineConfig({
  plugins: [preact()],
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
