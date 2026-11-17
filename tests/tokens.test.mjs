// The generated JS tokens must match the palette exactly.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import tokens, { ale, osan, syntax } from '../themes/css/ile-oyo-tokens.js';
import { loadPalette } from '../scripts/lib/palette.mjs';

const palette = loadPalette();
const camel = (k) => k.replace(/_(\w)/g, (_, c) => c.toUpperCase());

for (const [id, v] of Object.entries({ ale, osan })) {
  const p = palette.variants[id];
  test(`${id}: colors, ui, ansi and other match the palette`, () => {
    assert.deepEqual(v.colors, p.palette);
    assert.deepEqual(v.ui, Object.fromEntries(Object.entries(p.ui).map(([k, x]) => [camel(k), x])));
    assert.deepEqual(v.ansi, Array.from({ length: 16 }, (_, i) => p.ansi[`color${i}`]));
    assert.deepEqual(v.other, Object.fromEntries(Object.entries(p.other).map(([k, x]) => [camel(k), x])));
    assert.equal(v.mode, p.mode);
  });
}

test('every syntax role points at a palette color', () => {
  for (const [role, key] of Object.entries(syntax)) {
    assert.ok(key in palette.variants.ale.palette, `${role} → ${key}`);
  }
});

test('default export has both variants and syntax', () => {
  assert.equal(tokens.ale, ale);
  assert.equal(tokens.osan, osan);
  assert.equal(tokens.syntax, syntax);
});
