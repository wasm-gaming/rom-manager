/**
 * The four layers, kept honest (the owner's structure for every front end):
 *
 * - helpers: functions with no dependencies and no memory — they import helpers only;
 * - components: no memory, no dependencies but helpers (and other components);
 * - lib: services, stores and libraries — helpers and lib;
 * - views: put all of it together.
 *
 * Reads every import (static, dynamic, `$importAll`, `import type`) of every file and
 * fails on one that reaches a layer it may not.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const SRC = resolve(__dirname);
const LAYERS = ['helpers', 'components', 'lib', 'views'] as const;
type Layer = (typeof LAYERS)[number];

const ALLOWED: Record<Layer, Layer[]> = {
  helpers: ['helpers'],
  components: ['components', 'helpers'],
  lib: ['lib', 'helpers'],
  views: ['views', 'components', 'lib', 'helpers'],
};

const SPECIFIER = /(?:from\s*|import\s*\(\s*|['"`]\s*,?\s*)['"]((?:\.\.?\/|@\/)[^'"]+)['"]/g;

function filesOf(layer: Layer): string[] {
  const dir = join(SRC, layer);
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(ts|html)$/.test(entry.name) && !/\.test(-helper)?\.ts$/.test(entry.name))
    .map((entry) => join(entry.parentPath ?? (entry as unknown as { path: string }).path, entry.name));
}

function layerOf(path: string): Layer | undefined {
  const [first] = relative(SRC, path).split(/[\\/]/);
  return (LAYERS as readonly string[]).includes(first) ? (first as Layer) : undefined;
}

describe('layers', () => {
  for (const layer of LAYERS) {
    it(`${layer} imports only ${ALLOWED[layer].join(', ')}`, () => {
      const violations: string[] = [];
      for (const file of filesOf(layer)) {
        for (const [, specifier] of readFileSync(file, 'utf8').matchAll(SPECIFIER)) {
          const target = specifier.startsWith('@/') ? join(SRC, specifier.slice(2)) : resolve(dirname(file), specifier);
          const reached = layerOf(target);
          if (reached && !ALLOWED[layer].includes(reached)) violations.push(`${relative(SRC, file)} → ${specifier}`);
        }
      }
      expect(violations).toEqual([]);
    });
  }
});
