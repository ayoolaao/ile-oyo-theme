// JetBrains target: one editor color scheme (.icls, XML) per variant, for
// every JetBrains IDE (IntelliJ IDEA, PyCharm, WebStorm, …).
//
// Each scheme inherits from the IDE's own: Alẹ́ from Darcula, Ọ̀sán from
// Default. It sets the editor colors (caret, gutter, selection, guides,
// change markers, file status), all 42 language-default attributes
// (DEFAULT_*, which every language inherits from) mapped to the shared syntax
// roles, the editor's general attributes (errors, search, caret highlights,
// braces, links, TODO), and the console's 16 ANSI colors (the iTerm palette).
// Colors are opaque: highlights are palette colors blended onto the
// background (blend in scripts/lib/palette.mjs).
//
// Attribute values: FONT_TYPE 1 bold, 2 italic, 3 both; EFFECT_TYPE 1
// underline, 2 wave underline, 3 strikeout (as in IntelliJ's own schemes).
import { blend } from '../lib/palette.mjs';
import { SYNTAX } from '../lib/syntax.mjs';
import { statusColors } from '../lib/status.mjs';

export const DIR = 'themes/jetbrains';
export const FILES = { ale: 'Ile-Oyo-Ale.icls', osan: 'Ile-Oyo-Osan.icls' };
export const PARENT = { dark: 'Darcula', light: 'Default' };

const BOLD = 1;
const ITALIC = 2;
const UNDERLINE = 1;
const WAVE = 2;
const STRIKE = 3;

/** Editor colors (the <colors> block): key → hex. */
export function editorColors(v) {
  const p = v.palette;
  const u = v.ui;
  const on = (hex, alpha) => blend(hex + alpha, p.bg);
  return {
    CARET_COLOR: p.fg,
    CARET_ROW_COLOR: blend(v.other.line_highlight, p.bg),
    CONSOLE_BACKGROUND_KEY: p.bg,
    GUTTER_BACKGROUND: p.bg,
    LINE_NUMBERS_COLOR: u.muted,
    LINE_NUMBER_ON_CARET_ROW_COLOR: p.fg,
    SELECTION_BACKGROUND: p.selection,
    SELECTION_BACKGROUND_INACTIVE: on(p.selection, '99'),
    INDENT_GUIDE: p.selection,
    VISUAL_INDENT_GUIDE: p.selection,
    SELECTED_INDENT_GUIDE: p.comment,
    RIGHT_MARGIN_COLOR: p.selection,
    METHOD_SEPARATORS_COLOR: p.selection,
    TEARLINE_COLOR: p.selection,
    SELECTED_TEARLINE_COLOR: p.comment,
    WHITESPACES: p.selection,
    FOLDED_TEXT_BORDER_COLOR: p.selection,
    ANNOTATIONS_COLOR: p.comment,
    DOCUMENTATION_COLOR: u.float,
    LOOKUP_COLOR: u.float,
    NOTIFICATION_BACKGROUND: u.float,
    DOC_COMMENT_LINK: p.blue,
    ADDED_LINES_COLOR: p.green,
    MODIFIED_LINES_COLOR: p.orange,
    DELETED_LINES_COLOR: p.red,
    WHITESPACES_MODIFIED_LINES_COLOR: on(p.orange, '66'),
    FILESTATUS_ADDED: p.green,
    FILESTATUS_MODIFIED: p.blue,
    FILESTATUS_DELETED: p.comment,
    FILESTATUS_RENAMED: p.cyan,
    FILESTATUS_MERGED: p.purple,
    FILESTATUS_UNKNOWN: p.red,
    FILESTATUS_IDEA_FILESTATUS_IGNORED: p.comment,
    FILESTATUS_IDEA_FILESTATUS_MERGED_WITH_CONFLICTS: p.red,
  };
}

// A language-default attribute: syntax role or '=<palette key>', plus style.
const ROLE = (role, font = 0, extra = {}) => ({ role, font, ...extra });

/** DEFAULT_* attribute → role (all 42 the platform defines). */
export const DEFAULTS = {
  DEFAULT_IDENTIFIER: ROLE('variable'),
  DEFAULT_LOCAL_VARIABLE: ROLE('variable'),
  DEFAULT_REASSIGNED_LOCAL_VARIABLE: ROLE('variable', 0, { underline: true }),
  DEFAULT_GLOBAL_VARIABLE: ROLE('variable'),
  DEFAULT_KEYWORD: ROLE('keyword'),
  DEFAULT_OPERATION_SIGN: ROLE('keyword'),
  DEFAULT_LABEL: ROLE('keyword'),
  DEFAULT_STRING: ROLE('string'),
  DEFAULT_VALID_STRING_ESCAPE: ROLE('=pink'),
  DEFAULT_INVALID_STRING_ESCAPE: ROLE('=red', 0, { wave: true }),
  DEFAULT_NUMBER: ROLE('number'),
  DEFAULT_CONSTANT: ROLE('number'),
  DEFAULT_STATIC_FIELD: ROLE('number', ITALIC),
  DEFAULT_PREDEFINED_SYMBOL: ROLE('type'),
  DEFAULT_ENTITY: ROLE('number'),
  DEFAULT_LINE_COMMENT: ROLE('comment', ITALIC),
  DEFAULT_BLOCK_COMMENT: ROLE('comment', ITALIC),
  DEFAULT_DOC_COMMENT: ROLE('comment', ITALIC),
  DEFAULT_DOC_MARKUP: ROLE('comment'),
  DEFAULT_DOC_COMMENT_TAG: ROLE('comment', BOLD | ITALIC),
  DEFAULT_DOC_COMMENT_TAG_VALUE: ROLE('parameter', ITALIC),
  DEFAULT_FUNCTION_DECLARATION: ROLE('function'),
  DEFAULT_FUNCTION_CALL: ROLE('function'),
  DEFAULT_INSTANCE_METHOD: ROLE('function'),
  DEFAULT_STATIC_METHOD: ROLE('function', ITALIC),
  DEFAULT_PARAMETER: ROLE('parameter', ITALIC),
  DEFAULT_REASSIGNED_PARAMETER: ROLE('parameter', ITALIC, { underline: true }),
  DEFAULT_CLASS_NAME: ROLE('type'),
  DEFAULT_INTERFACE_NAME: ROLE('type', ITALIC),
  DEFAULT_CLASS_REFERENCE: ROLE('type'),
  DEFAULT_INSTANCE_FIELD: ROLE('property'),
  DEFAULT_METADATA: ROLE('=orange'), // annotations and decorators, as in Xcode and Kate
  DEFAULT_TAG: ROLE('tag'),
  DEFAULT_ATTRIBUTE: ROLE('property'),
  DEFAULT_HIGHLIGHTED_REFERENCE: ROLE('link', 0, { underline: true }),
  DEFAULT_TEMPLATE_LANGUAGE_COLOR: ROLE('variable'),
  DEFAULT_BRACES: ROLE('punctuation'),
  DEFAULT_BRACKETS: ROLE('punctuation'),
  DEFAULT_PARENTHS: ROLE('punctuation'),
  DEFAULT_DOT: ROLE('punctuation'),
  DEFAULT_COMMA: ROLE('punctuation'),
  DEFAULT_SEMICOLON: ROLE('punctuation'),
};

const ANSI = ['BLACK', 'RED', 'GREEN', 'YELLOW', 'BLUE', 'MAGENTA', 'CYAN'];

/** Every attribute this scheme sets: name → { FOREGROUND, BACKGROUND, … } (hex or numbers). */
export function attributes(v) {
  const p = v.palette;
  const u = v.ui;
  const s = statusColors(v);
  const on = (hex, alpha) => blend(hex + alpha, p.bg);
  // Inlays and folded text: a surface that moves away from the text color
  // (darker in Alẹ́, lighter in Ọ̀sán), so their text keeps 4.5:1, as in Typora.
  const surface = v.mode === 'dark' ? u.bg_dark : u.bg_light;
  const out = {
    TEXT: { FOREGROUND: p.fg, BACKGROUND: p.bg },
  };
  for (const [key, { role, font, underline, wave }] of Object.entries(DEFAULTS)) {
    const fg = role.startsWith('=') ? p[role.slice(1)] : p[SYNTAX[role]];
    out[key] = {
      FOREGROUND: fg,
      ...(font && { FONT_TYPE: font }),
      ...(underline && { EFFECT_COLOR: fg, EFFECT_TYPE: UNDERLINE }),
      ...(wave && { EFFECT_COLOR: fg, EFFECT_TYPE: WAVE }),
    };
  }
  Object.assign(out, {
    ERRORS_ATTRIBUTES: { EFFECT_COLOR: s.error, EFFECT_TYPE: WAVE, ERROR_STRIPE_COLOR: s.error },
    WARNING_ATTRIBUTES: { EFFECT_COLOR: s.warning, EFFECT_TYPE: WAVE, ERROR_STRIPE_COLOR: s.warning },
    INFO_ATTRIBUTES: { EFFECT_COLOR: p.comment, EFFECT_TYPE: WAVE, ERROR_STRIPE_COLOR: p.comment },
    TYPO: { EFFECT_COLOR: p.cyan, EFFECT_TYPE: WAVE },
    WRONG_REFERENCES_ATTRIBUTES: { FOREGROUND: p.red },
    BAD_CHARACTER: { EFFECT_COLOR: p.red, EFFECT_TYPE: WAVE },
    DEPRECATED_ATTRIBUTES: { EFFECT_COLOR: p.fg, EFFECT_TYPE: STRIKE },
    MARKED_FOR_REMOVAL_ATTRIBUTES: { EFFECT_COLOR: p.red, EFFECT_TYPE: STRIKE },
    NOT_USED_ELEMENT_ATTRIBUTES: { FOREGROUND: p.comment },
    TODO_DEFAULT_ATTRIBUTES: { FOREGROUND: p.yellow, FONT_TYPE: BOLD | ITALIC, ERROR_STRIPE_COLOR: p.yellow },
    HYPERLINK_ATTRIBUTES: { FOREGROUND: p.blue, EFFECT_COLOR: p.blue, EFFECT_TYPE: UNDERLINE },
    FOLLOWED_HYPERLINK_ATTRIBUTES: { FOREGROUND: p.purple, EFFECT_COLOR: p.purple, EFFECT_TYPE: UNDERLINE },
    SEARCH_RESULT_ATTRIBUTES: { BACKGROUND: on(p.yellow, '40'), ERROR_STRIPE_COLOR: p.yellow },
    TEXT_SEARCH_RESULT_ATTRIBUTES: { BACKGROUND: on(p.orange, '66'), ERROR_STRIPE_COLOR: p.orange },
    WRITE_SEARCH_RESULT_ATTRIBUTES: { BACKGROUND: on(p.red, '40'), ERROR_STRIPE_COLOR: p.red },
    IDENTIFIER_UNDER_CARET_ATTRIBUTES: { BACKGROUND: on(p.cyan, '26'), ERROR_STRIPE_COLOR: p.cyan },
    WRITE_IDENTIFIER_UNDER_CARET_ATTRIBUTES: { BACKGROUND: on(p.green, '26'), ERROR_STRIPE_COLOR: p.green },
    MATCHED_BRACE_ATTRIBUTES: { BACKGROUND: on(p.cyan, '40'), FONT_TYPE: BOLD },
    UNMATCHED_BRACE_ATTRIBUTES: { BACKGROUND: on(p.red, '40') },
    FOLDED_TEXT_ATTRIBUTES: { FOREGROUND: p.comment, BACKGROUND: surface },
    INLINE_PARAMETER_HINT: { FOREGROUND: u.muted, BACKGROUND: surface },
    INLINE_PARAMETER_HINT_HIGHLIGHTED: { FOREGROUND: p.fg, BACKGROUND: surface },
    INLAY_DEFAULT: { FOREGROUND: u.muted, BACKGROUND: surface },
    BREAKPOINT_ATTRIBUTES: { BACKGROUND: on(p.red, '33') },
    EXECUTIONPOINT_ATTRIBUTES: { BACKGROUND: on(p.blue, '40') },
    BOOKMARKS_ATTRIBUTES: { ERROR_STRIPE_COLOR: p.blue },
    CONSOLE_NORMAL_OUTPUT: { FOREGROUND: p.fg },
    CONSOLE_ERROR_OUTPUT: { FOREGROUND: s.error },
    CONSOLE_SYSTEM_OUTPUT: { FOREGROUND: p.comment },
    CONSOLE_USER_INPUT: { FOREGROUND: p.green, FONT_TYPE: ITALIC },
  });
  ANSI.forEach((name, i) => {
    out[`CONSOLE_${name}_OUTPUT`] = { FOREGROUND: v.ansi[`color${i}`] };
    if (i > 0) out[`CONSOLE_${name}_BRIGHT_OUTPUT`] = { FOREGROUND: v.ansi[`color${i + 8}`] };
  });
  Object.assign(out, {
    CONSOLE_GRAY_OUTPUT: { FOREGROUND: v.ansi.color7 },
    CONSOLE_DARKGRAY_OUTPUT: { FOREGROUND: v.ansi.color8 },
    CONSOLE_WHITE_OUTPUT: { FOREGROUND: v.ansi.color15 },
  });
  return out;
}

const hex = (h) => h.slice(1).toUpperCase();
const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function scheme(palette, id) {
  const v = palette.variants[id];
  const name = `${palette.name} ${v.name}`;
  const colors = Object.entries(editorColors(v))
    .map(([k, h]) => `    <option name="${k}" value="${hex(h)}" />`);
  const attrs = Object.entries(attributes(v)).map(([k, values]) => {
    const opts = Object.entries(values).map(([n, val]) =>
      `        <option name="${n}" value="${typeof val === 'number' ? val : hex(val)}" />`);
    return [`    <option name="${k}">`, '      <value>', ...opts, '      </value>', '    </option>'].join('\n');
  });
  return `<!-- ${name} (${v.meaning}, ${v.mode}) v${palette.version}
     Generated from palette/ile-oyo.json by \`npm run build\`. Do not edit by hand. -->
<scheme name="${escape(name)}" version="142" parent_scheme="${PARENT[v.mode]}">
  <metaInfo>
    <property name="ideVersion">2025.3</property>
    <property name="originalScheme">${escape(name)}</property>
  </metaInfo>
  <colors>
${colors.join('\n')}
  </colors>
  <attributes>
${attrs.join('\n')}
  </attributes>
</scheme>
`;
}

export default function jetbrains(palette) {
  return Object.entries(FILES).map(([id, file]) => ({ path: `${DIR}/${file}`, contents: scheme(palette, id) }));
}
