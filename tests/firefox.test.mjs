// Firefox theme: valid keys, colors from the palette, readable text, and a
// manifest that matches the palette version.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, MIN, loadPalette, contrast, parseHex } from '../scripts/lib/palette.mjs';
import { DIR, ID, TEXT_PAIRS, colors, manifest } from '../scripts/targets/firefox.mjs';

const palette = loadPalette();

// theme.colors keys documented on MDN (manifest.json/theme), 2026-11.
const KNOWN = new Set([
  'bookmark_text', 'button_background_active', 'button_background_hover', 'icons', 'icons_attention',
  'frame', 'frame_inactive', 'ntp_background', 'ntp_card_background', 'ntp_text', 'popup', 'popup_border',
  'popup_highlight', 'popup_highlight_text', 'popup_text', 'sidebar', 'sidebar_border', 'sidebar_highlight',
  'sidebar_highlight_text', 'sidebar_text', 'tab_background_text', 'tab_line', 'tab_loading', 'tab_selected',
  'tab_text', 'toolbar', 'toolbar_bottom_separator', 'toolbar_field', 'toolbar_field_border',
  'toolbar_field_border_focus', 'toolbar_field_focus', 'toolbar_field_highlight', 'toolbar_field_highlight_text',
  'toolbar_field_text', 'toolbar_field_text_focus', 'toolbar_text', 'toolbar_top_separator',
  'toolbar_vertical_separator',
]);

// Every color the palette defines for a variant, in any group.
const paletteColors = (v) =>
  new Set([...Object.values(v.palette), ...Object.values(v.ui), ...Object.values(v.other)]);

const committed = JSON.parse(readFileSync(join(ROOT, DIR, 'manifest.json'), 'utf8'));

test('manifest: MV3, gecko id, version and both variants', () => {
  assert.equal(committed.manifest_version, 3);
  assert.equal(committed.browser_specific_settings.gecko.id, ID);
  assert.equal(committed.version, palette.version);
  assert.deepEqual(committed, manifest(palette));
  assert.deepEqual(committed.theme.colors, colors(palette.variants.osan));
  assert.deepEqual(committed.dark_theme.colors, colors(palette.variants.ale));
});

for (const id of ['ale', 'osan']) {
  const v = palette.variants[id];
  const c = colors(v);

  test(`${id}: only documented keys, all colors from the palette`, () => {
    const allowed = paletteColors(v);
    for (const [key, value] of Object.entries(c)) {
      assert.ok(KNOWN.has(key), `unknown key ${key}`);
      assert.ok(allowed.has(value), `${key} ${value} is not a palette color`);
    }
  });

  test(`${id}: text reaches ${MIN}:1 on its background`, () => {
    for (const [text, bg] of TEXT_PAIRS) {
      assert.equal(parseHex(c[bg]).a, 1, `${bg} must be opaque to check contrast`);
      const ratio = contrast(c[text], c[bg]);
      assert.ok(ratio >= MIN, `${text} on ${bg}: ${c[text]} on ${c[bg]} is ${ratio.toFixed(2)}:1`);
    }
  });
}
