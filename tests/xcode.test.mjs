// Xcode themes: colors come from the palette, text is readable, and (on a Mac
// with Xcode) the files parse and use the same keys as Xcode's own theme.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, MIN, loadPalette, contrast } from '../scripts/lib/palette.mjs';
import { FILES, SYNTAX_MAP, theme, colorFor, fontFor, flatten, rgba } from '../scripts/targets/xcode.mjs';

const palette = loadPalette();
const XCODE_THEME = '/Applications/Xcode.app/Contents/SharedFrameworks/SourceEditor.framework/Versions/A/Resources/Default (Dark).xccolortheme';
const hasPlutil = existsSync('/usr/bin/plutil');
const readPlist = (path) => JSON.parse(execFileSync('/usr/bin/plutil', ['-convert', 'json', '-o', '-', path], { encoding: 'utf8' }));
const toHex = (s) => '#' + s.split(' ').slice(0, 3).map((x) => Math.round(Number(x) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();

for (const [id, file] of Object.entries(FILES)) {
  const v = palette.variants[id];
  const t = theme(v);

  test(`${id}: editor and syntax colors come from the palette`, () => {
    assert.equal(toHex(t.DVTSourceTextBackground), v.palette.bg);
    assert.equal(toHex(t.DVTSourceTextSelectionColor), v.palette.selection);
    assert.equal(toHex(t.DVTSourceTextSyntaxColors['xcode.syntax.plain']), v.palette.fg);
    for (const key of Object.keys(SYNTAX_MAP)) {
      assert.equal(toHex(t.DVTSourceTextSyntaxColors[key]), colorFor(v, key), key);
    }
  });

  test(`${id}: every syntax color reaches ${MIN}:1 against the background`, () => {
    for (const key of Object.keys(SYNTAX_MAP)) {
      const c = contrast(colorFor(v, key), v.palette.bg);
      assert.ok(c >= MIN, `${key} ${colorFor(v, key)} is ${c.toFixed(2)}:1`);
    }
  });

  test(`${id}: the current-line highlight is flattened onto the background`, () => {
    const flat = rgba(flatten(v.other.line_highlight, v.palette.bg));
    assert.equal(t.DVTSourceTextCurrentLineHighlightColor, flat);
    assert.ok(flat.endsWith(' 1'), 'opaque');
  });

  test(`${id}: the generated file parses and round-trips`, { skip: !hasPlutil && 'plutil not available' }, () => {
    const parsed = readPlist(join(ROOT, 'themes/xcode', file));
    assert.deepEqual(parsed, JSON.parse(JSON.stringify(t)));
  });
}

test('syntax fonts are SF Mono faces that exist on macOS', () => {
  const faces = new Set(Object.keys(SYNTAX_MAP).map(fontFor));
  for (const f of faces) assert.match(f, /^SFMono-(Medium|MediumItalic|Bold|BoldItalic) - 12\.0$/);
  assert.equal(fontFor('xcode.syntax.comment'), 'SFMono-MediumItalic - 12.0');
  assert.equal(fontFor('xcode.syntax.keyword'), 'SFMono-Medium - 12.0');
});

test('uses the same keys as Xcode\'s Default (Dark) theme', { skip: !(hasPlutil && existsSync(XCODE_THEME)) && 'Xcode not installed' }, () => {
  const xc = readPlist(XCODE_THEME);
  const ours = theme(palette.variants.ale);
  assert.deepEqual(Object.keys(ours).sort(), Object.keys(xc).sort());
  assert.deepEqual(Object.keys(ours.DVTSourceTextSyntaxColors).sort(), Object.keys(xc.DVTSourceTextSyntaxColors).sort());
  assert.deepEqual(Object.keys(ours.DVTSourceTextSyntaxFonts).sort(), Object.keys(xc.DVTSourceTextSyntaxFonts).sort());
});
