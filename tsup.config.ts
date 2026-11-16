import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/lib/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2022',
  splitting: false,
  external: ['jq79', '@cloudauthn/vfs-sync'],
});
