// Arcane theme: exactly Arcane's tokens, an id and name its importer accepts,
// colors from the palette that pass its color check, and readable text.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, MIN, loadPalette, contrast, parseHex } from '../scripts/lib/palette.mjs';
import { DIR, FILE, ID, TEXT_PAIRS, theme, tokens } from '../scripts/targets/arcane.mjs';

const palette = loadPalette();

// THEME_TOKENS in getarcaneapp/arcane frontend/src/lib/types/ui/theme.ts, 2026-11.
const THEME_TOKENS = [
  'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
  'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
  'accent', 'accent-foreground', 'border', 'input', 'ring', 'sidebar', 'sidebar-foreground',
  'sidebar-primary', 'sidebar-primary-foreground', 'sidebar-accent', 'sidebar-accent-foreground',
  'sidebar-border', 'sidebar-ring', 'surface', 'glass-shadow-color', 'syntax-comment',
  'syntax-keyword', 'syntax-property', 'syntax-string', 'syntax-number', 'syntax-operator',
];

// Not palette colors, by design: the shadow tints (see SHADOW in arcane.mjs).
const OUTSIDE_PALETTE = new Set(['glass-shadow-color']);

const paletteColors = (v) =>
  new Set([...Object.values(v.palette), ...Object.values(v.ui), ...Object.values(v.other)]);

const committed = JSON.parse(readFileSync(join(ROOT, DIR, FILE), 'utf8'));

test('file: matches the build, with both variants', () => {
  assert.deepEqual(committed, theme(palette));
  assert.deepEqual(committed.light, tokens(palette.variants.osan));
  assert.deepEqual(committed.dark, tokens(palette.variants.ale));
});

// The import dialog and the backend (validateCustomThemes) both enforce these.
test('id and name: accepted by Arcane’s importer', () => {
  assert.equal(committed.id, ID);
  assert.match(committed.id, /^custom-[a-z0-9-]+$/);
  assert.ok(committed.id.length <= 48);
  const name = committed.name.trim();
  assert.ok(name.length > 0 && [...name].length <= 48, `name ${name} must be 1–48 characters`);
});

for (const [mode, id] of [['dark', 'ale'], ['light', 'osan']]) {
  const v = palette.variants[id];
  const t = committed[mode];

  test(`${id}: exactly Arcane’s tokens, as #RRGGBB or #RRGGBBAA`, () => {
    assert.deepEqual(Object.keys(t).sort(), [...THEME_TOKENS].sort());
    for (const [token, value] of Object.entries(t)) {
      assert.match(value, /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/, `${token} ${value}`);
    }
  });

  test(`${id}: colors come from the palette`, () => {
    const allowed = paletteColors(v);
    for (const [token, value] of Object.entries(t)) {
      if (OUTSIDE_PALETTE.has(token)) continue;
      assert.ok(allowed.has(value), `${token} ${value} is not a ${id} palette color`);
    }
  });

  test(`${id}: text reaches ${MIN}:1 on its surface`, () => {
    for (const [text, bg] of TEXT_PAIRS) {
      assert.equal(parseHex(t[bg]).a, 1, `${bg} must be opaque to check contrast`);
      const ratio = contrast(t[text], t[bg]);
      assert.ok(ratio >= MIN, `${text} on ${bg}: ${t[text]} on ${t[bg]} is ${ratio.toFixed(2)}:1`);
    }
  });
}
