import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/services/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2022',
  splitting: false,
  external: ['preact', '@cloudauthn/vfs-sync'],
});
