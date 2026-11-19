// JetBrains IDE theme plugin: the generated files match the palette, the
// plugin declares both themes, every UI color is opaque, text stays readable
// on the theme's surfaces, and the vendored Islands snapshot matches the
// installed IDE (skipped when none is installed, e.g. in CI).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, MIN, loadPalette, contrast } from '../scripts/lib/palette.mjs';
import { DIR, PARENT, TEXT_PAIRS, namedColors, pluginXml, providerId, themeJson, uiOverrides } from '../scripts/targets/jetbrains-theme.mjs';
import { scheme } from '../scripts/targets/jetbrains.mjs';
import { DATA, extract, findResourcesJar } from '../scripts/vendor-islands.mjs';

const palette = loadPalette();
const HEX = /^#[0-9A-F]{6}$/i;
const FILE = { ale: 'Ile-Oyo-Ale', osan: 'Ile-Oyo-Osan' };
const read = (p) => readFileSync(join(ROOT, DIR, p), 'utf8');

test('plugin.xml declares one theme provider per variant', () => {
  const xml = read('META-INF/plugin.xml');
  assert.equal(xml, pluginXml(palette));
  for (const [id, base] of Object.entries(FILE)) {
    assert.ok(xml.includes(`id="${providerId(id)}" path="/themes/${base}.theme.json"`), id);
  }
});

for (const [id, base] of Object.entries(FILE)) {
  const v = palette.variants[id];
  const json = JSON.parse(read(`themes/${base}.theme.json`));

  test(`${id}: files match the palette`, () => {
    assert.deepEqual(json, themeJson(palette, id));
    assert.equal(read(`themes/${base}.xml`), scheme(palette, id));
    assert.equal(json.parentTheme, PARENT[v.mode]);
    assert.equal(json.dark, v.mode === 'dark');
    assert.equal(json.editorScheme, `/themes/${base}.xml`);
  });

  test(`${id}: every color is opaque #RRGGBB`, () => {
    for (const [k, hex] of Object.entries(namedColors(v))) assert.match(hex, HEX, k);
    const ui = uiOverrides(v);
    assert.ok(Object.keys(ui).length > 200, 'too few UI overrides');
    for (const [k, hex] of Object.entries(ui)) assert.match(hex, HEX, k);
  });

  test(`${id}: text reaches ${MIN}:1 on the theme's surfaces`, () => {
    const c = namedColors(v);
    for (const [fg, bg] of TEXT_PAIRS) {
      assert.ok(c[fg] && c[bg], `${fg} / ${bg} not defined`);
      const r = contrast(c[fg], c[bg]);
      assert.ok(r >= MIN, `${fg} on ${bg}: ${r.toFixed(2)}`);
    }
  });
}

const jar = findResourcesJar();
test('the Islands snapshot matches the installed IDE', { skip: !jar && 'no JetBrains IDE installed' }, () => {
  for (const mode of ['dark', 'light']) {
    const { _source, ...saved } = JSON.parse(readFileSync(DATA(mode), 'utf8'));
    assert.deepEqual(saved, extract(jar, mode), `islands-${mode}.json is stale: run node scripts/vendor-islands.mjs`);
  }
});
