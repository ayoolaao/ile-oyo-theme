// Kate target: one KSyntaxHighlighting color theme (.theme, JSON) per variant.
// The same files work in KWrite, KDevelop and other apps that use KDE's
// syntax-highlighting framework.
//
// The style and editor-color names are the full set in KDE's own Breeze
// themes (frameworks/syntax-highlighting, data/themes). Every color is
// opaque: Qt reads alpha as #AARRGGBB, so semi-transparent palette colors and
// highlights are blended onto the background, like the VS Code theme's.
import { blend } from '../lib/palette.mjs';
import { SYNTAX, STYLE } from '../lib/syntax.mjs';
import { STATUS, statusColors } from '../lib/status.mjs';

export const DIR = 'themes/kate';
export const FILES = { ale: 'ile-oyo-ale.theme', osan: 'ile-oyo-osan.theme' };

// KDE text style → syntax role (scripts/lib/syntax.mjs), or '=<palette key>'
// for a color with no role. Extra styling is in STYLES below.
export const STYLE_MAP = {
  Normal: 'variable',
  Keyword: 'keyword',
  ControlFlow: 'keyword',
  Operator: 'keyword',
  Import: 'keyword',
  Function: 'function',
  Variable: 'parameter', // shell, PHP and Perl $variables
  BuiltIn: 'type',
  Extension: 'type', // library types and functions (Qt, STL)
  DataType: 'type',
  Preprocessor: '=orange', // as in the Xcode theme
  Attribute: '=orange',
  Char: 'string',
  String: 'string',
  VerbatimString: 'string',
  SpecialString: 'regex', // regular expressions
  SpecialChar: 'keyword', // escapes such as \n
  DecVal: 'number',
  BaseN: 'number',
  Float: 'number',
  Constant: 'number',
  Comment: 'comment',
  Documentation: 'comment',
  Annotation: 'comment', // @param in doc comments (bold, below)
  CommentVar: 'parameter', // the name after @param
  RegionMarker: '=purple',
  Information: `=${STATUS.info}`,
  Warning: `=${STATUS.warning}`,
  Alert: '=red', // TODO, FIXME
  Error: `=${STATUS.error}`,
  Others: 'property',
};

// Styling beyond the role's own italic/bold (STYLE in syntax.mjs).
const EXTRA = {
  Annotation: { bold: true },
  Alert: { bold: true },
  Error: { underline: true },
};

export function colorFor(v, style) {
  const ref = STYLE_MAP[style];
  return v.palette[ref.startsWith('=') ? ref.slice(1) : SYNTAX[ref]];
}

function textStyles(v) {
  const out = {};
  for (const [style, ref] of Object.entries(STYLE_MAP)) {
    const color = colorFor(v, style);
    const look = ref.startsWith('=') ? undefined : STYLE[ref];
    out[style] = {
      'text-color': color,
      'selected-text-color': color,
      ...(look === 'italic' && { italic: true }),
      ...(look === 'bold' && { bold: true }),
      ...EXTRA[style],
    };
  }
  // Normal sets every flag so other styles inherit plain text.
  Object.assign(out.Normal, { bold: false, italic: false, underline: false, 'strike-through': false });
  return out;
}

export function editorColors(v) {
  const p = v.palette;
  const u = v.ui;
  const on = (hex, alpha) => blend(hex + alpha, p.bg);
  return {
    BackgroundColor: p.bg,
    TextSelection: p.selection,
    CurrentLine: blend(v.other.line_highlight, p.bg),
    SearchHighlight: on(p.yellow, '40'),
    ReplaceHighlight: on(p.orange, '66'),
    BracketMatching: on(p.cyan, '40'),
    CodeFolding: on(p.blue, '26'),

    IconBorder: p.bg,
    LineNumbers: u.muted,
    CurrentLineNumber: p.fg,
    Separator: u.bg_darker,
    ModifiedLines: p.orange,
    SavedLines: p.green,

    IndentationLine: p.selection,
    TabMarker: p.selection,
    WordWrapMarker: p.selection,
    SpellChecking: p.red,

    MarkBookmark: p.blue,
    MarkBreakpointActive: p.red,
    MarkBreakpointReached: p.yellow,
    MarkBreakpointDisabled: p.purple,
    MarkExecution: p.selection,
    MarkWarning: statusColors(v).warning,
    MarkError: statusColors(v).error,

    TemplateBackground: u.bg_dark,
    TemplatePlaceholder: on(p.green, '33'),
    TemplateFocusedPlaceholder: on(p.green, '66'),
    TemplateReadOnlyPlaceholder: on(p.red, '33'),
  };
}

/** "0.1.3" → 103: Kate keeps the theme with the highest revision. */
export const revision = (version) => {
  const [major, minor, patch] = version.split('.').map(Number);
  return major * 10000 + minor * 100 + patch;
};

export function theme(palette, id) {
  const v = palette.variants[id];
  return {
    metadata: {
      name: `${palette.name} ${v.name}`,
      revision: revision(palette.version),
      license: 'SPDX-License-Identifier: Apache-2.0',
      copyright: ['SPDX-FileCopyrightText: 2026 Ayoola Abimbola'],
    },
    'text-styles': textStyles(v),
    'editor-colors': editorColors(v),
  };
}

export default function kate(palette) {
  return Object.entries(FILES).map(([id, file]) => ({
    path: `${DIR}/${file}`,
    contents: JSON.stringify(theme(palette, id), null, 4) + '\n',
  }));
}
