// JetBrains IDE theme: a theme plugin that colors the whole IDE (window, tool
// windows, tabs, popups, menus, controls) and bundles the editor schemes.
//
// Files in themes/jetbrains/plugin/ (zipped into a .jar by
// scripts/release.mjs; no Gradle needed for a theme-only plugin):
//   META-INF/plugin.xml               two themeProviders
//   themes/Ile-Oyo-<V>.theme.json     the UI theme
//   themes/Ile-Oyo-<V>.xml            the editor scheme (same as the .icls)
//
// Each theme builds on JetBrains' Islands look (parentTheme Islands Dark or
// Islands Light) and redefines its named colors by role (text-*, editor-bg,
// tool-window-bg, popup-bg, accent-*, selection-*, tab-*, control-*). Islands resolves its own references, so
// redefining names alone changes nothing: the theme also sets every UI key
// whose color goes through a redefined name, found in a snapshot of the
// Islands themes (scripts/targets/data/islands-*.json, made by
// scripts/vendor-islands.mjs). Only colors change; shapes, spacing and icons
// stay JetBrains'.
import { readFileSync } from 'node:fs';
import { blend } from '../lib/palette.mjs';
import { statusColors } from '../lib/status.mjs';
import { FILES as SCHEME_FILES, scheme } from './jetbrains.mjs';

export const DIR = 'themes/jetbrains/plugin';
export const PLUGIN_ID = 'com.jazzykid.ile-oyo-theme';
export const PARENT = { dark: 'Islands Dark', light: 'Islands Light' };
export const SINCE_BUILD = '253'; // 2025.3, the first release with Islands
const base = (id) => SCHEME_FILES[id].replace(/\.icls$/, '');
export const providerId = (id) => `ile-oyo-${id}`;

/** Named colors this theme redefines → hex (all opaque). */
export function namedColors(v) {
  const p = v.palette;
  const u = v.ui;
  const s = statusColors(v);
  const dark = v.mode === 'dark';
  const on = (hex, alpha) => blend(hex + alpha, p.bg);
  const field = dark ? u.bg_darker : u.bg_lighter;
  const raised = dark ? u.bg_light : u.bg_darker;
  const popup = dark ? u.bg_dark : u.bg_light; // moves away from the text color, as in Typora
  return {
    // Text
    'text-default': p.fg,
    'text-muted': u.muted,
    'text-secondary': u.muted,
    'text-disabled': p.comment,
    'text-link': p.blue,
    'text-error': s.error,
    'text-warning': s.warning,
    'text-success': s.success,
    'text-over-accent': p.bg,
    'editor-text': p.fg,
    'popup-completion-match-text': p.blue,

    // Surfaces: islands (editor, tool windows, dialogs) on bg, the window
    // frame around them on bg_darker, popups and menus on their own surface.
    // Set by role, not by layer-*: Islands Dark and Light stack their layers
    // in opposite orders (the editor is layer-0 in dark, layer-2 in light).
    'editor-bg': p.bg,
    'editor-bg-inline': u.bg_dark,
    'editor-border': p.selection,
    'editor-border-inline': p.selection,
    'tool-window-bg': p.bg,
    'tool-window-bg-inline': u.bg_dark,
    'tool-window-border': p.selection,
    'tool-window-border-inline': p.selection,
    'dialog-bg': p.bg,
    'dialog-bg-inline': u.bg_dark,
    'dialog-border': p.selection,
    'feedback-bg': raised,
    'feedback-border': raised,
    'feedback-bg-inline': p.bg,
    'editor-floating-toolbar-bg': raised,
    'main-window-bg': u.bg_darker,
    'main-window-bg-alt': u.bg_dark,
    'main-window-border': u.bg_darker,
    'tool-window-bg-alt': u.bg_dark,
    'editor-border-alt': p.selection,
    'popup-bg': popup,
    'popup-bg-inline': popup,
    'popup-border': p.selection,
    'popup-border-inline': p.selection,

    // Controls
    'control-bg': field,
    'control-bg-disabled': u.bg_dark,
    'control-bg-raised': raised,
    'control-border': p.selection,
    'control-border-disabled': p.selection,
    'control-border-raised': p.comment,
    'control-bg-small': p.selection,
    'control-bg-small-disabled': raised,
    'control-border-small': p.comment,

    // Accents: blue for focus and primary actions, the status colors for
    // errors, warnings and success, purple for AI.
    'accent-brand-bg': p.blue,
    'accent-brand-border': p.blue,
    'accent-brand-bg-secondary': on(p.blue, '33'),
    'accent-brand-border-secondary': on(p.blue, '80'),
    'accent-error-bg': s.error,
    'accent-error-border': s.error,
    'accent-error-bg-secondary': on(s.error, '33'),
    'accent-error-border-secondary': on(s.error, '80'),
    'accent-warning-bg': s.warning,
    'accent-warning-border': s.warning,
    'accent-warning-bg-secondary': on(s.warning, '33'),
    'accent-warning-border-secondary': on(s.warning, '80'),
    'accent-success-bg': s.success,
    'accent-success-border': s.success,
    'accent-success-bg-secondary': on(s.success, '33'),
    'accent-success-border-secondary': on(s.success, '80'),
    'accent-neutral-bg': p.comment,
    'accent-ai-bg': on(p.purple, '33'),
    'accent-ai-border': p.purple,

    // Selection, hover, tabs (the selected tab is underlined in àlàárì red)
    'selection-bg-active': p.selection,
    'selection-bg-active-muted': on(p.selection, '99'),
    'selection-bg-inactive': on(p.selection, '80'),
    'selection-bg-hovered': raised,
    'tab-selected-bg-active': p.selection,
    'tab-selected-bg-inactive': raised,
    'tab-selected-border-active': p.red,
    'tab-selected-border-inactive': p.comment,
    'toolbar-selected-bg': on(p.blue, '66'),
    'toolbar-selected-bg-hovered': on(p.blue, '80'),
    'search-match-bg': on(p.yellow, '66'),
    'tree-indent-guide-border': p.selection,
    'icon-default-stroke': u.muted,
  };
}

/** [text, background] named colors that must reach 4.5:1 (checked in tests). */
export const TEXT_PAIRS = [
  ...['editor-bg', 'editor-bg-inline', 'tool-window-bg', 'dialog-bg', 'feedback-bg', 'main-window-bg', 'popup-bg',
    'control-bg', 'selection-bg-active', 'selection-bg-hovered', 'tab-selected-bg-active', 'search-match-bg']
    .map((bg) => ['text-default', bg]),
  ...['tool-window-bg', 'dialog-bg', 'main-window-bg', 'popup-bg']
    .flatMap((bg) => ['text-muted', 'text-link', 'text-error', 'text-success'].map((t) => [t, bg])),
  ['text-over-accent', 'accent-brand-bg'],
  ['text-over-accent', 'accent-error-bg'],
  ['text-over-accent', 'accent-success-bg'],
  ['text-default', 'accent-brand-bg-secondary'],
];

const islands = (mode) =>
  JSON.parse(readFileSync(new URL(`./data/islands-${mode}.json`, import.meta.url), 'utf8'));

/** Follows a color reference through named colors; returns [hex, names passed]. */
export function resolve(ref, colors) {
  const seen = [];
  while (ref in colors && !seen.includes(ref)) {
    seen.push(ref);
    ref = colors[ref];
  }
  return [ref, seen];
}

/** UI keys (dotted) whose Islands color goes through a name we redefine → our hex. */
export function uiOverrides(v) {
  const parent = islands(v.mode);
  const ours = namedColors(v);
  const merged = { ...parent.colors, ...ours };
  const out = {};
  for (const [key, ref] of Object.entries(parent.ui)) {
    const [, names] = resolve(ref, parent.colors);
    if (!names.some((n) => n in ours)) continue;
    const [hex] = resolve(ref, merged);
    out[key] = hex;
  }
  // The selected editor tab and tool-window tab: àlàárì-red underline.
  out['EditorTabs.underlinedBorderColor'] = v.palette.red;
  out['ToolWindow.HeaderTab.underlineColor'] = v.palette.red;
  return out;
}

// Dotted keys → theme JSON "ui": the "*" wildcard must stay an object.
function uiObject(flat) {
  const ui = {};
  for (const [key, hex] of Object.entries(flat).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
    if (key.startsWith('*.')) (ui['*'] ??= {})[key.slice(2)] = hex;
    else ui[key] = hex;
  }
  return ui;
}

export function themeJson(palette, id) {
  const v = palette.variants[id];
  return {
    name: `${palette.name} ${v.name}`,
    dark: v.mode === 'dark',
    author: 'Ayoola Abimbola',
    parentTheme: PARENT[v.mode],
    editorScheme: `/themes/${base(id)}.xml`,
    colors: namedColors(v),
    ui: uiObject(uiOverrides(v)),
  };
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function pluginXml(palette) {
  const { ale, osan } = palette.variants;
  const providers = ['ale', 'osan']
    // targetUi: listed with the Islands themes, as JetBrains' own are.
    .map((id) => `    <themeProvider id="${providerId(id)}" path="/themes/${base(id)}.theme.json" targetUi="islands" />`)
    .join('\n');
  return `<idea-plugin>
  <id>${PLUGIN_ID}</id>
  <name>${escape(palette.name)}</name>
  <version>${palette.version}</version>
  <vendor url="https://github.com/ayoolaao/ile-oyo-theme">jazzykid</vendor>
  <description><![CDATA[
    <p>${palette.name}: ${ale.name} (${ale.meaning}, dark) and ${osan.name} (${osan.meaning}, light),
    colors from Ọ̀yọ́ aṣọ-òkè. Themes the whole IDE and the editor.</p>
    <p>Choose <b>${palette.name} ${ale.name}</b> or <b>${palette.name} ${osan.name}</b> in
    Settings → Appearance &amp; Behavior → Appearance → Theme.</p>
  ]]></description>
  <idea-version since-build="${SINCE_BUILD}" />
  <depends>com.intellij.modules.platform</depends>
  <extensions defaultExtensionNs="com.intellij">
${providers}
  </extensions>
</idea-plugin>
`;
}

export default function jetbrainsTheme(palette) {
  return [
    { path: `${DIR}/META-INF/plugin.xml`, contents: pluginXml(palette) },
    ...['ale', 'osan'].flatMap((id) => [
      { path: `${DIR}/themes/${base(id)}.theme.json`, contents: JSON.stringify(themeJson(palette, id), null, 2) + '\n' },
      { path: `${DIR}/themes/${base(id)}.xml`, contents: scheme(palette, id) },
    ]),
  ];
}
