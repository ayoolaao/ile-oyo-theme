// Checks the generated VS Code themes and the extension manifest.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, contrast, loadPalette } from '../scripts/lib/palette.mjs';
import { FILES } from '../scripts/targets/vscode.mjs';

const palette = loadPalette();
const dir = join(ROOT, 'themes/vscode');
const manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
const themes = Object.fromEntries(
  Object.entries(FILES).map(([id, f]) => [id, JSON.parse(readFileSync(join(dir, 'themes', f), 'utf8'))]),
);
const HEX = /^#[0-9A-F]{6}([0-9A-F]{2})?$/;

// Text shown in the UI, as [label, foreground key, background key]. Must reach 4.5:1.
const TEXT_PAIRS = [
  ['editor text', 'editor.foreground', 'editor.background'],
  ['line numbers', 'editorLineNumber.foreground', 'editor.background'],
  ['side bar', 'sideBar.foreground', 'sideBar.background'],
  ['status bar', 'statusBar.foreground', 'statusBar.background'],
  ['title bar', 'titleBar.activeForeground', 'titleBar.activeBackground'],
  ['inactive title bar', 'titleBar.inactiveForeground', 'titleBar.inactiveBackground'],
  ['active tab', 'tab.activeForeground', 'tab.activeBackground'],
  ['inactive tab', 'tab.inactiveForeground', 'tab.inactiveBackground'],
  ['description', 'descriptionForeground', 'sideBar.background'],
  ['panel inactive title', 'panelTitle.inactiveForeground', 'panel.background'],
  ['placeholder', 'input.placeholderForeground', 'input.background'],
  ['breadcrumb', 'breadcrumb.foreground', 'breadcrumb.background'],
  ['widget', 'editorWidget.foreground', 'editorWidget.background'],
  ['menu', 'menu.foreground', 'menu.background'],
  ['selected list item', 'list.activeSelectionForeground', 'list.activeSelectionBackground'],
  ['button', 'button.foreground', 'button.background'],
  ['badge', 'badge.foreground', 'badge.background'],
  ['activity bar badge', 'activityBarBadge.foreground', 'activityBarBadge.background'],
  ['debugging status bar', 'statusBar.debuggingForeground', 'statusBar.debuggingBackground'],
  ['remote status item', 'statusBarItem.remoteForeground', 'statusBarItem.remoteBackground'],
];
// Icons only: 3:1 (WCAG non-text contrast).
const ICON_PAIRS = [['inactive activity bar icon', 'activityBar.inactiveForeground', 'activityBar.background']];

for (const [id, t] of Object.entries(themes)) {
  const v = palette.variants[id];

  test(`${id}: name and type match the palette`, () => {
    assert.equal(t.name, `${palette.name} ${v.name}`);
    assert.equal(t.type, v.mode);
  });

  test(`${id}: every color value is #RRGGBB or #RRGGBBAA`, () => {
    for (const [k, hex] of Object.entries(t.colors)) assert.match(hex, HEX, k);
    for (const r of t.tokenColors) if (r.settings.foreground) assert.match(r.settings.foreground, HEX, r.name);
  });

  test(`${id}: UI text reaches 4.5:1, icons 3:1`, () => {
    for (const [label, fg, bg] of TEXT_PAIRS) {
      const r = contrast(t.colors[fg], t.colors[bg]);
      assert.ok(r >= 4.5, `${label}: ${t.colors[fg]} on ${t.colors[bg]} is ${r.toFixed(2)}:1`);
    }
    for (const [label, fg, bg] of ICON_PAIRS) {
      const r = contrast(t.colors[fg], t.colors[bg]);
      assert.ok(r >= 3, `${label}: ${r.toFixed(2)}:1`);
    }
  });

  test(`${id}: code colors come from the palette`, () => {
    const allowed = new Set(Object.values(v.palette));
    for (const r of t.tokenColors) {
      if (r.settings.foreground) assert.ok(allowed.has(r.settings.foreground), `${r.name}: ${r.settings.foreground}`);
    }
  });

  test(`${id}: terminal colors equal the palette ANSI colors`, () => {
    const names = ['Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White'];
    names.forEach((n, i) => {
      assert.equal(t.colors[`terminal.ansi${n}`], v.ansi[`color${i}`]);
      assert.equal(t.colors[`terminal.ansiBright${n}`], v.ansi[`color${i + 8}`]);
    });
  });
}

test('extension icon is a 256×256 PNG referenced by the manifest', () => {
  assert.equal(manifest.icon, 'icon.png');
  const png = readFileSync(join(dir, 'icon.png'));
  assert.equal(png.toString('latin1', 1, 4), 'PNG');
  assert.equal(png.readUInt32BE(16), 256);
  assert.equal(png.readUInt32BE(20), 256);
});

test('extension ships LICENSE and NOTICE identical to the repository root', () => {
  for (const f of ['LICENSE', 'NOTICE']) {
    assert.equal(readFileSync(join(dir, f), 'utf8'), readFileSync(join(ROOT, f), 'utf8'), f);
  }
});

test('manifest lists both themes with matching labels, types and files', () => {
  const entries = manifest.contributes.themes;
  assert.equal(entries.length, Object.keys(FILES).length);
  for (const [id, file] of Object.entries(FILES)) {
    const entry = entries.find((e) => e.path === `./themes/${file}`);
    assert.ok(entry, `no manifest entry for ${file}`);
    assert.equal(entry.label, themes[id].name);
    assert.equal(entry.uiTheme, themes[id].type === 'dark' ? 'vs-dark' : 'vs');
    assert.ok(existsSync(join(dir, 'themes', file)));
  }
});

// Every workbench color key must be one VS Code actually registers: either in
// the workbench itself or as a color contributed by a built-in extension (the
// Git extension owns gitDecoration.*). Uses the locally installed VS Code;
// skipped on machines without it.
const APP = '/Applications/Visual Studio Code.app/Contents/Resources/app';
const BUNDLE = join(APP, 'out/vs/workbench/workbench.desktop.main.js');
test('every workbench color key is registered by VS Code', { skip: !existsSync(BUNDLE) && 'VS Code not installed' }, () => {
  const src = readFileSync(BUNDLE, 'utf8');
  const contributed = new Set();
  for (const ext of readdirSync(join(APP, 'extensions'))) {
    const pkg = join(APP, 'extensions', ext, 'package.json');
    if (!existsSync(pkg)) continue;
    for (const c of JSON.parse(readFileSync(pkg, 'utf8')).contributes?.colors ?? []) contributed.add(c.id);
  }
  const unknown = Object.keys(themes.ale.colors).filter((k) => !src.includes(`"${k}"`) && !contributed.has(k));
  assert.deepEqual(unknown, [], `unknown keys: ${unknown.join(', ')}`);
});
