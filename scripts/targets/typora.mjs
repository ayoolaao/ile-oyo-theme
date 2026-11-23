// Typora target: one self-contained theme CSS per variant. Typora lists a
// theme by its file name, so ile-oyo-ale.css shows as "Ile Oyo Ale".
//
// Three parts:
//   - Typora's interface variables (:root) and the dark-theme overrides its
//     menus, dialogs and panels need (the same elements Typora's own Night
//     theme styles);
//   - the document: headings, links, quotes, lists, tables, code, highlights,
//     GitHub-style alerts;
//   - code: CodeMirror tokens in code blocks (.cm-s-inner) mapped to the
//     shared syntax roles, and Markdown source mode (.cm-s-typora-default).
//
// Every color is an opaque palette color or a palette color blended onto the
// background (blend in scripts/lib/palette.mjs). TEXT_PAIRS lists each text
// color with the background it sits on; tests check them for 4.5:1.
import { blend } from '../lib/palette.mjs';
import { SYNTAX } from '../lib/syntax.mjs';
import { STATUS } from '../lib/status.mjs';

export const DIR = 'themes/typora';
export const FILES = { ale: 'ile-oyo-ale.css', osan: 'ile-oyo-osan.css' };

const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif';
const MONO = '"SF Mono", Menlo, Consolas, "Liberation Mono", "Noto Sans Mono", monospace';

/** The named colors the theme uses, for one variant. */
export function colors(v) {
  const p = v.palette;
  const u = v.ui;
  const dark = v.mode === 'dark';
  const on = (hex, alpha) => blend(hex + alpha, p.bg);
  const role = (r) => p[SYNTAX[r]];
  return {
    bg: p.bg,
    fg: p.fg,
    muted: u.muted,
    comment: p.comment,
    selection: p.selection,
    sidebar: u.bg_dark,
    // Code blocks, inline code and table heads; menus, dialogs and popovers.
    // Both move away from the text color (darker in Alẹ́, lighter in Ọ̀sán),
    // so every accent keeps 4.5:1 on them.
    surface: dark ? u.bg_dark : u.bg_light,
    float: dark ? u.bg_dark : u.bg_light,
    raised: dark ? u.bg_lighter : u.bg_darker, // hover in menus and lists
    border: dark ? u.bg_light : u.bg_darker,
    line: blend(v.other.line_highlight, p.bg),
    searchHit: on(p.yellow, '66'),
    link: p.blue,
    accent: p.red, // àlàárì: active file, focus markers
    heading: p.fg,
    quote: p.comment,
    mark: p.yellow,
    markText: p.bg,
    red: p.red,
    orange: p.orange,
    yellow: p.yellow,
    green: p.green,
    cyan: p.cyan,
    blue: p.blue,
    purple: p.purple,
    pink: p.pink,
    keyword: role('keyword'),
    function: role('function'),
    string: role('string'),
    number: role('number'),
    type: role('type'),
    parameter: role('parameter'),
    property: role('property'),
    tag: role('tag'),
    regex: role('regex'),
    variable: role('variable'),
    link2: role('link'),
    headingCode: role('heading'),
  };
}

/** [text color, background] names that must reach 4.5:1 (checked in tests). */
export const TEXT_PAIRS = [
  ['fg', 'bg'], ['fg', 'sidebar'], ['fg', 'surface'], ['fg', 'float'], ['fg', 'raised'], ['fg', 'line'],
  ['fg', 'selection'], ['fg', 'searchHit'], ['muted', 'bg'], ['muted', 'sidebar'], ['muted', 'float'],
  ['link', 'bg'], ['quote', 'bg'], ['comment', 'surface'], ['markText', 'mark'],
  ...['keyword', 'function', 'string', 'number', 'type', 'parameter', 'property', 'tag', 'regex', 'link2',
    'headingCode', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink'].map((c) => [c, 'surface']),
  ...['red', 'green', 'yellow', 'blue', 'purple', 'orange', 'link', 'headingCode', 'keyword'].map((c) => [c, 'bg']),
];

// CodeMirror token class → color name (and style), for code blocks.
export const CODE = {
  keyword: 'keyword',
  operator: 'keyword',
  def: 'function',
  variable: 'variable',
  'variable-2': 'parameter',
  'variable-3': 'type',
  type: 'type',
  property: 'property',
  string: 'string',
  'string-2': 'regex',
  number: 'number',
  atom: 'number',
  builtin: 'type',
  comment: 'comment italic',
  meta: 'orange',
  qualifier: 'orange',
  tag: 'tag',
  attribute: 'property',
  header: 'headingCode bold',
  quote: 'comment italic',
  link: 'link2',
  url: 'link2',
  hr: 'comment',
  bracket: 'fg',
  negative: 'red',
  positive: 'green',
  error: STATUS.error,
  em: 'fg italic',
  strong: 'fg bold',
  strikethrough: 'fg strike',
};

// Markdown source mode token class → color name (and style).
export const SOURCE = {
  header: 'headingCode bold',
  quote: 'quote italic',
  link: 'link2',
  url: 'link2',
  string: 'link2',
  comment: 'orange', // inline code
  code: 'orange',
  'variable-2': 'pink', // list markers
  'variable-3': 'pink',
  keyword: 'pink',
  hr: 'comment',
  em: 'fg italic',
  strong: 'fg bold',
  strikethrough: 'fg strike',
  atom: 'number',
  number: 'number',
  property: 'property',
  tag: 'tag',
  attribute: 'property',
  meta: 'comment',
};

const decl = (c, spec) => {
  const [name, ...styles] = spec.split(' ');
  const out = [`color: ${c[name]};`];
  if (styles.includes('italic')) out.push('font-style: italic;');
  if (styles.includes('bold')) out.push('font-weight: 600;');
  if (styles.includes('strike')) out.push('text-decoration: line-through;');
  return out.join(' ');
};

const header = (palette, v) => `/*
 * ${palette.name} ${v.name} (${v.meaning}, ${v.mode}) for Typora, v${palette.version}
 * Generated from palette/ile-oyo.json by \`npm run build\`. Do not edit by hand.
 * https://github.com/ayoolaao/ile-oyo-theme
 */`;

export function css(palette, id) {
  const v = palette.variants[id];
  const c = colors(v);
  const code = Object.entries(CODE)
    .map(([cls, spec]) => `.cm-s-inner .cm-${cls} { ${decl(c, spec)} }`)
    .join('\n');
  const source = Object.entries(SOURCE)
    .map(([cls, spec]) => `.cm-s-typora-default .cm-${cls} { ${decl(c, spec)} }`)
    .join('\n');

  return `${header(palette, v)}

:root {
  --bg-color: ${c.bg};
  --text-color: ${c.fg};
  --side-bar-bg-color: ${c.sidebar};
  --control-text-color: ${c.muted};
  --control-text-hover-color: ${c.fg};
  --primary-color: ${c.link};
  --primary-btn-border-color: ${c.link};
  --primary-btn-text-color: ${c.bg};
  --select-text-bg-color: ${c.selection};
  --select-text-font-color: ${c.fg};
  --search-select-bg-color: ${c.searchHit};
  --search-select-text-color: ${c.fg};
  --item-hover-bg-color: ${c.raised};
  --item-hover-text-color: ${c.fg};
  --active-file-bg-color: ${c.raised};
  --active-file-text-color: ${c.fg};
  --active-file-border-color: ${c.accent};
  --active-toggle-btn-color: ${c.raised};
  --window-border: 1px solid ${c.border};
  --panel-border-color: ${c.border};
  --border-color: ${c.border};
  --table-border-color: ${c.border};
  --color-popover-bg-color: ${c.float};
  --rawblock-edit-panel-bd: ${c.surface};
  --md-char-color: ${c.comment};
  --heading-char-color: ${c.comment};
  --meta-content-color: ${c.comment};
  --blur-text-color: ${c.selection};
  --drag-placeholder-color: ${c.selection};
  --focus-ring-color: ${c.link};
  --node-fill: ${c.surface};
  --monospace: ${MONO};
}

/* Document */

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}
html, body {
  background: ${c.bg};
  color: ${c.fg};
  font-family: ${SANS};
  line-height: 1.65;
}
#write {
  max-width: 860px;
  padding: 30px 30px 100px;
}
::selection { background: ${c.selection}; color: ${c.fg}; }
h1, h2, h3, h4, h5, h6 {
  color: ${c.heading};
  font-weight: 600;
  line-height: 1.3;
  margin: 1.4em 0 0.6em;
}
h1 { font-size: 2em; padding-bottom: 0.3em; border-bottom: 1px solid ${c.border}; }
h2 { font-size: 1.5em; padding-bottom: 0.3em; border-bottom: 1px solid ${c.border}; }
h3 { font-size: 1.25em; }
h4 { font-size: 1em; }
h5 { font-size: 0.875em; }
h6 { font-size: 0.85em; color: ${c.muted}; }
a, .md-def-url { color: ${c.link}; }
a:hover { color: ${c.link}; text-decoration: underline; }
p, ul, ol, blockquote, table, pre { margin: 0.8em 0; }
strong, b { font-weight: 600; }
hr { border: 0; height: 2px; background: ${c.border}; margin: 1.6em 0; }
blockquote {
  margin-left: 0;
  padding: 0 1em;
  color: ${c.quote};
  border-left: 4px solid ${c.selection};
}
mark { background: ${c.mark}; color: ${c.markText}; padding: 0 0.2em; border-radius: 3px; }
sup.md-footnote { color: ${c.link}; }
.md-task-list-item > input { accent-color: ${c.green}; }
table { border-collapse: collapse; }
table th { background: ${c.surface}; font-weight: 600; }
table th, table td { border: 1px solid ${c.border}; padding: 6px 13px; }
code, tt, kbd {
  font-family: var(--monospace);
  font-size: 0.9em;
  background: ${c.surface};
  border-radius: 4px;
  padding: 0.15em 0.35em;
}
kbd { border: 1px solid ${c.border}; box-shadow: inset 0 -1px 0 ${c.border}; }
#write pre.md-meta-block { background: ${c.surface}; color: ${c.comment}; border-radius: 6px; }
.md-alert-text-note { color: ${c[STATUS.info]}; }
.md-alert-text-tip { color: ${c[STATUS.success]}; }
.md-alert-text-important { color: ${c.purple}; }
.md-alert-text-warning { color: ${c[STATUS.warning]}; }
.md-alert-text-caution { color: ${c[STATUS.error]}; }
.md-alert-note { border-left-color: ${c[STATUS.info]}; }
.md-alert-tip { border-left-color: ${c[STATUS.success]}; }
.md-alert-important { border-left-color: ${c.purple}; }
.md-alert-warning { border-left-color: ${c[STATUS.warning]}; }
.md-alert-caution { border-left-color: ${c[STATUS.error]}; }
.md-toc-item { color: ${c.link}; }
.md-inline-math svg { color: ${c.fg}; }

/* Code blocks */

pre.md-fences, .CodeMirror-wrap .CodeMirror-code pre {
  font-family: var(--monospace);
}
pre.md-fences {
  background: ${c.surface};
  border-radius: 6px;
  padding: 8px 4px;
  font-size: 0.9em;
}
.CodeMirror-gutters { background: ${c.surface}; border-right: 0; }
.CodeMirror-linenumber { color: ${c.muted}; }
.CodeMirror div.CodeMirror-cursor { border-left: 2px solid ${c.fg}; }
.CodeMirror-selected, .CodeMirror-selectedtext, .CodeMirror-focused .CodeMirror-selected { background: ${c.selection}; }
.CodeMirror-activeline-background { background: ${c.line}; }
.cm-s-inner { color: ${c.fg}; }
${code}

/* Source mode */

.cm-s-typora-default { color: ${c.fg}; }
.CodeMirror.cm-s-typora-default div.CodeMirror-cursor { border-left: 2px solid ${c.fg}; }
.cm-s-typora-default .CodeMirror-activeline-background { background: ${c.line}; }
${source}

/* Interface */

#typora-sidebar, .sidebar-content, .sidebar-footer { background: ${c.sidebar}; color: ${c.fg}; }
.sidebar-tabs { border-bottom: 1px solid ${c.border}; }
.outline-item:hover, .file-node-content:hover, .file-list-item:hover { background: ${c.raised}; color: ${c.fg}; }
.file-list-item { border-bottom: 1px solid ${c.border}; }
.file-list-item-summary, .file-list-item-time { color: ${c.muted}; }
.file-list-item.active, .file-library-node.active > .file-node-background {
  background: ${c.raised};
  border-left: 4px solid ${c.accent};
}
.active-tab-files #info-panel-tab-file, .active-tab-outline #info-panel-tab-outline { border-bottom-color: ${c.accent}; }
footer, footer.ty-footer, #footer-word-count { color: ${c.muted}; border-color: ${c.border}; }

.dropdown-menu, .context-menu, #spell-check-panel, #footer-word-count-info, .popover, #toc-dropmenu,
.auto-suggest-container, .modal-content, #typora-quick-open, .megamenu-content, .md-diagram-panel {
  background: ${c.float};
  color: ${c.fg};
  border-color: ${c.border};
}
.dropdown-menu > li > a, .context-menu > li > a, .popover-title, .modal-title { color: ${c.fg}; }
.dropdown-menu > li > a:hover, .dropdown-menu > li > a:focus, .context-menu > li > a:hover,
.typora-quick-open-item.active, .typora-quick-open-item:hover, .ty-preferences .nav-group-item.active {
  background: ${c.raised};
  color: ${c.fg};
}
.dropdown-menu .divider, .context-menu.dropdown-menu .divider { background: ${c.border}; }
.popover.bottom > .arrow:after { border-bottom-color: ${c.float}; }
.popover.top > .arrow:after { border-top-color: ${c.float}; }
#ty-tooltip, div.code-tooltip { background: ${c.float}; color: ${c.fg}; }
.modal-backdrop.in { opacity: 0.5; }

input, select, textarea, .modal-content input, #typora-quick-open input, #md-searchpanel input,
.ty-preferences input[type="search"] {
  background: ${c.bg};
  color: ${c.fg};
  border: 1px solid ${c.border};
}
.btn, .btn-default { background: transparent; color: ${c.fg}; border-color: ${c.border}; }
.btn-default:hover, .btn-default:focus { background: ${c.raised}; color: ${c.fg}; }
.btn-primary { background: ${c.link}; color: ${c.bg}; border-color: ${c.link}; }
#md-searchpanel { background: ${c.sidebar}; border-bottom: 1px solid ${c.border}; }
.md-search-hit { background: ${c.searchHit}; color: ${c.fg}; }
.md-search-hit * { color: ${c.fg}; }

::-webkit-scrollbar-thumb { background: ${c.selection}; border-radius: 4px; }
::-webkit-scrollbar-thumb:active { background: ${c.muted}; }

.on-focus-mode .md-end-block:not(.md-focus):not(.md-focus-container) * { color: ${c.selection}; }
.on-focus-mode li[cid]:not(.md-focus-container) { color: ${c.selection}; }
`;
}

export default function typora(palette) {
  return Object.entries(FILES).map(([id, file]) => ({ path: `${DIR}/${file}`, contents: css(palette, id) }));
}
