// Kate themes: the full KDE style and editor-color sets, colors from the
// palette, readable text, and files that match the palette.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, MIN, MIN_SELECTION, loadPalette, contrast } from '../scripts/lib/palette.mjs';
import { DIR, FILES, STYLE_MAP, editorColors, revision, theme } from '../scripts/targets/kate.mjs';

const palette = loadPalette();

// The text styles and editor colors in KDE's Breeze Dark theme
// (frameworks/syntax-highlighting, data/themes/breeze-dark.theme), 2026-11.
const TEXT_STYLES = [
  'Normal', 'Keyword', 'Function', 'Variable', 'ControlFlow', 'Operator', 'BuiltIn', 'Extension',
  'Preprocessor', 'Attribute', 'Char', 'SpecialChar', 'String', 'VerbatimString', 'SpecialString', 'Import',
  'DataType', 'DecVal', 'BaseN', 'Float', 'Constant', 'Comment', 'Documentation', 'Annotation', 'CommentVar',
  'RegionMarker', 'Information', 'Warning', 'Alert', 'Error', 'Others',
];
const EDITOR_COLORS = [
  'BackgroundColor', 'CodeFolding', 'BracketMatching', 'CurrentLine', 'IconBorder', 'IndentationLine',
  'LineNumbers', 'CurrentLineNumber', 'MarkBookmark', 'MarkBreakpointActive', 'MarkBreakpointReached',
  'MarkBreakpointDisabled', 'MarkExecution', 'MarkWarning', 'MarkError', 'ModifiedLines', 'ReplaceHighlight',
  'SavedLines', 'SearchHighlight', 'TextSelection', 'Separator', 'SpellChecking', 'TabMarker',
  'TemplateBackground', 'TemplatePlaceholder', 'TemplateFocusedPlaceholder', 'TemplateReadOnlyPlaceholder',
  'WordWrapMarker',
];
const OPAQUE = /^#[0-9A-F]{6}$/;

test('revision grows with the version', () => {
  assert.equal(revision('0.1.3'), 103);
  assert.ok(revision('0.2.0') > revision('0.1.9'));
  assert.ok(revision('1.0.0') > revision('0.99.99'));
});

for (const [id, file] of Object.entries(FILES)) {
  const v = palette.variants[id];
  const committed = JSON.parse(readFileSync(join(ROOT, DIR, file), 'utf8'));
  const styles = committed['text-styles'];
  const editor = committed['editor-colors'];

  test(`${id}: file matches the palette`, () => {
    assert.deepEqual(committed, theme(palette, id));
    assert.equal(committed.metadata.name, `${palette.name} ${v.name}`);
    assert.equal(committed.metadata.revision, revision(palette.version));
  });

  test(`${id}: every KDE text style and editor color, nothing else`, () => {
    assert.deepEqual(Object.keys(styles).sort(), [...TEXT_STYLES].sort());
    assert.deepEqual(Object.keys(STYLE_MAP).sort(), [...TEXT_STYLES].sort());
    assert.deepEqual(Object.keys(editor).sort(), [...EDITOR_COLORS].sort());
  });

  // On the background only, like every target. On the current-line highlight
  // most accents are ~3.8:1; that's a palette question (notes: open questions).
  test(`${id}: text colors are palette colors and reach ${MIN}:1 on the background`, () => {
    const accents = new Set(Object.values(v.palette));
    for (const [name, s] of Object.entries(styles)) {
      const c = s['text-color'];
      assert.ok(accents.has(c), `${name} ${c} is not a palette color`);
      const ratio = contrast(c, editor.BackgroundColor);
      assert.ok(ratio >= MIN, `${name}: ${c} on ${editor.BackgroundColor} is ${ratio.toFixed(2)}:1`);
    }
  });

  test(`${id}: editor colors are opaque; line numbers readable; selection stands out`, () => {
    for (const [name, c] of Object.entries(editor)) assert.match(c, OPAQUE, name);
    assert.deepEqual(editorColors(v), editor);
    assert.ok(contrast(editor.LineNumbers, editor.IconBorder) >= MIN);
    assert.ok(contrast(editor.TextSelection, editor.BackgroundColor) >= MIN_SELECTION);
    for (const k of ['SearchHighlight', 'ReplaceHighlight', 'BracketMatching']) {
      assert.notEqual(editor[k], editor.BackgroundColor, k);
    }
  });
}
