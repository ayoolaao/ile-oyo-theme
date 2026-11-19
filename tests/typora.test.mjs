// Typora themes: colors from the palette, readable text everywhere the theme
// puts text on a background, every Typora variable set, and well-formed CSS.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, MIN, loadPalette, contrast } from '../scripts/lib/palette.mjs';
import { DIR, FILES, TEXT_PAIRS, colors, css } from '../scripts/targets/typora.mjs';

const palette = loadPalette();

// Color variables Typora 1.13 reads (TypeMark/style/base.css, base-control.css,
// mac.css), 2026-11. Layout variables (sizes, fonts) aren't listed.
const TYPORA_VARS = [
  'active-file-bg-color', 'active-file-border-color', 'active-file-text-color', 'active-toggle-btn-color',
  'bg-color', 'blur-text-color', 'border-color', 'color-popover-bg-color', 'control-text-color',
  'control-text-hover-color', 'drag-placeholder-color', 'focus-ring-color', 'heading-char-color',
  'item-hover-bg-color', 'item-hover-text-color', 'md-char-color', 'meta-content-color', 'node-fill',
  'panel-border-color', 'primary-btn-border-color', 'primary-btn-text-color', 'primary-color',
  'rawblock-edit-panel-bd', 'search-select-bg-color', 'search-select-text-color', 'select-text-bg-color',
  'select-text-font-color', 'side-bar-bg-color', 'table-border-color', 'text-color', 'window-border',
];

for (const [id, file] of Object.entries(FILES)) {
  const v = palette.variants[id];
  const c = colors(v);
  const text = readFileSync(join(ROOT, DIR, file), 'utf8');

  test(`${id}: file matches the palette`, () => {
    assert.equal(text, css(palette, id));
  });

  test(`${id}: every color is a palette color or a palette blend`, () => {
    const allowed = new Set(Object.values(c));
    const accents = new Set([...Object.values(v.palette), ...Object.values(v.ui)]);
    for (const hex of Object.values(c)) assert.match(hex, /^#[0-9A-F]{6}$/, `${hex} must be opaque #RRGGBB`);
    for (const [hex] of text.matchAll(/#[0-9A-Fa-f]{3,8}\b/g)) {
      assert.ok(allowed.has(hex), `${hex} is not one of the theme's colors`);
    }
    // Only the documented blends aren't palette colors.
    const blends = Object.entries(c).filter(([, hex]) => !accents.has(hex)).map(([k]) => k).sort();
    assert.deepEqual(blends, ['line', 'searchHit']);
  });

  test(`${id}: text reaches ${MIN}:1 on every background it's used on`, () => {
    for (const [fg, bg] of TEXT_PAIRS) {
      const ratio = contrast(c[fg], c[bg]);
      assert.ok(ratio >= MIN, `${fg} on ${bg}: ${c[fg]} on ${c[bg]} is ${ratio.toFixed(2)}:1`);
    }
  });

  test(`${id}: sets every Typora color variable; uses only defined ones`, () => {
    const root = text.match(/:root \{([^}]*)\}/)[1];
    const defined = new Set([...root.matchAll(/--([a-z0-9-]+):/g)].map((m) => m[1]));
    for (const name of TYPORA_VARS) assert.ok(defined.has(name), `--${name} not set`);
    for (const [, name] of text.matchAll(/var\(--([a-z0-9-]+)\)/g)) assert.ok(defined.has(name), `--${name} used, not set`);
  });

  test(`${id}: well-formed CSS`, () => {
    const body = text.replace(/\/\*[\s\S]*?\*\//g, '');
    let depth = 0;
    for (const ch of body) {
      if (ch === '{') depth++;
      if (ch === '}') depth--;
      assert.ok(depth >= 0 && depth <= 1, 'unbalanced or nested braces');
    }
    assert.equal(depth, 0);
    assert.doesNotMatch(body, /undefined|NaN/);
    for (const rule of body.split('}').filter((r) => r.trim())) {
      const declarations = rule.split('{')[1].trim();
      for (const d of declarations.split(';').map((s) => s.trim()).filter(Boolean)) {
        assert.match(d, /^-{0,2}[a-z-]+\s*:\s*\S/, `bad declaration: ${d}`);
      }
    }
  });
}
