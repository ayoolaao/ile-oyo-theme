// Chrome themes: keys Chrome accepts, colors from the palette, readable text,
// manifests that match the palette, and the files each extension needs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, MIN, loadPalette, contrast } from '../scripts/lib/palette.mjs';
import { DIR, ICON, VARIANTS, TEXT_PAIRS, hexColors, manifest, rgb } from '../scripts/targets/chrome.mjs';

const palette = loadPalette();

// kOverwritableColorTable in Chromium's chrome/browser/themes/browser_theme_pack.cc, 2026-11.
const KNOWN = new Set([
  'background_tab', 'background_tab_inactive', 'background_tab_incognito', 'background_tab_incognito_inactive',
  'bookmark_text', 'button_background', 'frame', 'frame_inactive', 'frame_incognito', 'frame_incognito_inactive',
  'ntp_background', 'ntp_header', 'ntp_link', 'ntp_text', 'omnibox_background', 'omnibox_text',
  'tab_background_text', 'tab_background_text_inactive', 'tab_background_text_incognito',
  'tab_background_text_incognito_inactive', 'tab_text', 'toolbar', 'toolbar_button_icon', 'toolbar_text',
]);

const paletteColors = (v) =>
  new Set([...Object.values(v.palette), ...Object.values(v.ui), ...Object.values(v.other)]);

test('rgb: hex to 0–255 channels; rejects transparency', () => {
  assert.deepEqual(rgb('#1A2B4C'), [26, 43, 76]);
  assert.throws(() => rgb('#1A2B4C80'));
});

for (const id of VARIANTS) {
  const v = palette.variants[id];
  const c = hexColors(v);
  const committed = JSON.parse(readFileSync(join(ROOT, DIR, id, 'manifest.json'), 'utf8'));

  test(`${id}: manifest matches the palette`, () => {
    assert.equal(committed.manifest_version, 3);
    assert.equal(committed.version, palette.version);
    assert.equal(committed.name, `${palette.name} ${v.name}`);
    assert.deepEqual(committed, manifest(palette, id));
  });

  test(`${id}: only keys Chrome accepts, all colors from the palette`, () => {
    const allowed = paletteColors(v);
    for (const [key, value] of Object.entries(c)) {
      assert.ok(KNOWN.has(key), `unknown key ${key}`);
      assert.ok(allowed.has(value), `${key} ${value} is not a palette color`);
    }
  });

  test(`${id}: text reaches ${MIN}:1 on its background`, () => {
    for (const [text, bg] of TEXT_PAIRS) {
      const ratio = contrast(c[text], c[bg]);
      assert.ok(ratio >= MIN, `${text} on ${bg}: ${c[text]} on ${c[bg]} is ${ratio.toFixed(2)}:1`);
    }
  });

  test(`${id}: icon, LICENSE and NOTICE are in the extension folder`, () => {
    for (const f of [ICON, 'LICENSE', 'NOTICE']) assert.ok(existsSync(join(ROOT, DIR, id, f)), `missing ${f}`);
  });
}
