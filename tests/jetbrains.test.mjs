// JetBrains schemes: well-formed, all 42 language defaults, keys the IDE
// knows, palette colors, and readable text on every background the scheme
// sets.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, MIN, loadPalette, contrast } from '../scripts/lib/palette.mjs';
import { DEFAULTS, DIR, FILES, PARENT, attributes, editorColors, scheme } from '../scripts/targets/jetbrains.mjs';

const palette = loadPalette();

// DefaultLanguageHighlighterColors in the IntelliJ Platform (2026.3).
const DEFAULT_KEYS = [
  'DEFAULT_ATTRIBUTE', 'DEFAULT_BLOCK_COMMENT', 'DEFAULT_BRACES', 'DEFAULT_BRACKETS', 'DEFAULT_CLASS_NAME',
  'DEFAULT_CLASS_REFERENCE', 'DEFAULT_COMMA', 'DEFAULT_CONSTANT', 'DEFAULT_DOC_COMMENT', 'DEFAULT_DOC_COMMENT_TAG',
  'DEFAULT_DOC_COMMENT_TAG_VALUE', 'DEFAULT_DOC_MARKUP', 'DEFAULT_DOT', 'DEFAULT_ENTITY', 'DEFAULT_FUNCTION_CALL',
  'DEFAULT_FUNCTION_DECLARATION', 'DEFAULT_GLOBAL_VARIABLE', 'DEFAULT_HIGHLIGHTED_REFERENCE', 'DEFAULT_IDENTIFIER',
  'DEFAULT_INSTANCE_FIELD', 'DEFAULT_INSTANCE_METHOD', 'DEFAULT_INTERFACE_NAME', 'DEFAULT_INVALID_STRING_ESCAPE',
  'DEFAULT_KEYWORD', 'DEFAULT_LABEL', 'DEFAULT_LINE_COMMENT', 'DEFAULT_LOCAL_VARIABLE', 'DEFAULT_METADATA',
  'DEFAULT_NUMBER', 'DEFAULT_OPERATION_SIGN', 'DEFAULT_PARAMETER', 'DEFAULT_PARENTHS', 'DEFAULT_PREDEFINED_SYMBOL',
  'DEFAULT_REASSIGNED_LOCAL_VARIABLE', 'DEFAULT_REASSIGNED_PARAMETER', 'DEFAULT_SEMICOLON', 'DEFAULT_STATIC_FIELD',
  'DEFAULT_STATIC_METHOD', 'DEFAULT_STRING', 'DEFAULT_TAG', 'DEFAULT_TEMPLATE_LANGUAGE_COLOR',
  'DEFAULT_VALID_STRING_ESCAPE',
];

// IntelliJ's own Default and Darcula schemes, from an installed IDE (skipped
// when none is installed, e.g. in CI).
const RESOURCES = ['WebStorm', 'IntelliJ IDEA', 'PyCharm']
  .map((app) => `/Applications/${app}.app/Contents/lib/intellij.platform.resources.jar`)
  .find((jar) => existsSync(jar));
function ideKeys() {
  const xml = execFileSync('unzip', ['-p', RESOURCES, 'DefaultColorSchemesManager.xml'], { encoding: 'utf8', maxBuffer: 1 << 24 });
  const block = (tag) => [...xml.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g'))]
    .flatMap((m) => [...m[1].matchAll(/^ {6}<option name="([^"]+)"/gm)].map((n) => n[1]));
  return { colors: new Set(block('colors')), attributes: new Set(block('attributes')) };
}

test('maps all 42 language-default attributes', () => {
  assert.deepEqual(Object.keys(DEFAULTS).sort(), [...DEFAULT_KEYS].sort());
});

test('every key exists in IntelliJ\'s own schemes', { skip: !RESOURCES && 'no JetBrains IDE installed' }, () => {
  const ide = ideKeys();
  for (const id of Object.keys(FILES)) {
    const v = palette.variants[id];
    for (const k of Object.keys(editorColors(v))) assert.ok(ide.colors.has(k), `unknown color ${k}`);
    for (const k of Object.keys(attributes(v))) {
      assert.ok(ide.attributes.has(k) || DEFAULT_KEYS.includes(k), `unknown attribute ${k}`);
    }
  }
});

for (const [id, file] of Object.entries(FILES)) {
  const v = palette.variants[id];
  const path = join(ROOT, DIR, file);
  const text = readFileSync(path, 'utf8');
  const attrs = attributes(v);
  const colors = editorColors(v);

  test(`${id}: file matches the palette; parent is ${PARENT[v.mode]}`, () => {
    assert.equal(text, scheme(palette, id));
    assert.match(text, new RegExp(`<scheme name="${palette.name} ${v.name}" version="142" parent_scheme="${PARENT[v.mode]}">`));
  });

  test(`${id}: well-formed XML`, { skip: !existsSync('/usr/bin/xmllint') && 'xmllint not installed' }, () => {
    execFileSync('xmllint', ['--noout', path]);
  });

  test(`${id}: opaque palette colors (plus highlights blended onto the background)`, () => {
    const all = [...Object.values(colors), ...Object.values(attrs).flatMap((a) => Object.values(a))]
      .filter((x) => typeof x === 'string');
    for (const h of all) assert.match(h, /^#[0-9A-F]{6}$/, h);
    const known = new Set([...Object.values(v.palette), ...Object.values(v.ui), ...Object.values(v.ansi)]);
    const blends = all.filter((h) => !known.has(h));
    // Only highlight backgrounds are blends.
    const blendKeys = new Set([
      'CARET_ROW_COLOR', 'SELECTION_BACKGROUND_INACTIVE', 'WHITESPACES_MODIFIED_LINES_COLOR',
    ]);
    for (const [k, h] of Object.entries(colors)) if (!known.has(h)) assert.ok(blendKeys.has(k), `${k} ${h}`);
    for (const [k, a] of Object.entries(attrs)) {
      for (const [n, h] of Object.entries(a)) {
        if (typeof h === 'string' && !known.has(h)) assert.equal(n, 'BACKGROUND', `${k}.${n} ${h} is not a palette color`);
      }
    }
    assert.ok(blends.length > 0);
  });

  test(`${id}: syntax colors reach ${MIN}:1 on the background`, () => {
    for (const key of Object.keys(DEFAULTS)) {
      const ratio = contrast(attrs[key].FOREGROUND, v.palette.bg);
      assert.ok(ratio >= MIN, `${key} ${attrs[key].FOREGROUND} is ${ratio.toFixed(2)}:1`);
    }
  });

  test(`${id}: text is readable on every background the scheme sets`, () => {
    for (const [key, a] of Object.entries(attrs)) {
      if (!a.BACKGROUND) continue;
      const fg = a.FOREGROUND ?? v.palette.fg;
      const ratio = contrast(fg, a.BACKGROUND);
      assert.ok(ratio >= MIN, `${key}: ${fg} on ${a.BACKGROUND} is ${ratio.toFixed(2)}:1`);
    }
    for (const bg of ['CARET_ROW_COLOR', 'SELECTION_BACKGROUND', 'SELECTION_BACKGROUND_INACTIVE']) {
      assert.ok(contrast(v.palette.fg, colors[bg]) >= MIN, `fg on ${bg}`);
    }
    assert.ok(contrast(colors.LINE_NUMBERS_COLOR, colors.GUTTER_BACKGROUND) >= MIN, 'line numbers');
  });
}
