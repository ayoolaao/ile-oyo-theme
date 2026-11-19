// Xcode target: one .xccolortheme (an XML property list) per variant.
//
// The key set follows Xcode's own "Default (Dark)" theme in
// SourceEditor.framework (Xcode 27). Colors are "r g b a" strings in sRGB;
// semi-transparent palette colors are blended onto the background first so
// Xcode shows exactly the color we checked.
import { flatten, parseHex } from '../lib/palette.mjs';
import { SYNTAX, STYLE } from '../lib/syntax.mjs';

export const FILES = { ale: 'Ile-Oyo-Ale.xccolortheme', osan: 'Ile-Oyo-Osan.xccolortheme' };

// Xcode syntax type → syntax role (scripts/lib/syntax.mjs), or a palette color
// prefixed with "=" where no shared role fits.
export const SYNTAX_MAP = {
  'xcode.syntax.plain': 'variable',
  'xcode.syntax.comment': 'comment',
  'xcode.syntax.comment.doc': 'comment',
  'xcode.syntax.comment.doc.keyword': 'comment',
  'xcode.syntax.mark': 'comment',
  'xcode.syntax.keyword': 'keyword',
  'xcode.syntax.string': 'string',
  'xcode.syntax.character': 'string',
  'xcode.syntax.number': 'number',
  'xcode.syntax.url': 'link',
  'xcode.syntax.identifier.type': 'type',
  'xcode.syntax.identifier.type.system': 'type',
  'xcode.syntax.identifier.class': 'type',
  'xcode.syntax.identifier.class.system': 'type',
  'xcode.syntax.declaration.type': 'type',
  'xcode.syntax.identifier.function': 'function',
  'xcode.syntax.identifier.function.system': 'function',
  'xcode.syntax.declaration.other': 'function',
  'xcode.syntax.identifier.constant': 'number',
  'xcode.syntax.identifier.constant.system': 'number',
  'xcode.syntax.identifier.variable': 'variable',
  'xcode.syntax.identifier.variable.system': 'property',
  'xcode.syntax.identifier.macro': '=orange',
  'xcode.syntax.identifier.macro.system': '=orange',
  'xcode.syntax.preprocessor': '=orange',
  'xcode.syntax.attribute': '=orange',
  'xcode.syntax.markup.code': 'string',
  'xcode.syntax.markup.aside.kind': 'heading',
};

const SIZE = '12.0';
// Bold doc-comment keywords (- Parameter:) and MARK: lines, as Xcode does.
const BOLD = new Set(['xcode.syntax.comment.doc.keyword', 'xcode.syntax.mark']);

function roleOf(key) {
  const m = SYNTAX_MAP[key];
  return m.startsWith('=') ? null : m;
}

export function colorFor(v, key) {
  const m = SYNTAX_MAP[key];
  const name = m.startsWith('=') ? m.slice(1) : SYNTAX[m];
  return v.palette[name];
}

export function fontFor(key) {
  const style = STYLE[roleOf(key)];
  const bold = BOLD.has(key) || style === 'bold';
  const italic = style === 'italic';
  const face = bold && italic ? 'BoldItalic' : bold ? 'Bold' : italic ? 'MediumItalic' : 'Medium';
  return `SFMono-${face} - ${SIZE}`;
}

// Composite a #RRGGBBAA color over the background into an opaque color.
export { flatten };

const n = (x) => String(Number(x.toFixed(6)));
export const rgba = ({ r, g, b, a }) => `${n(r)} ${n(g)} ${n(b)} ${n(a)}`;

// Every non-syntax key → its color (as a hex string, flattened onto bg).
function editorColors(v) {
  const p = v.palette;
  const u = v.ui;
  const o = v.other;
  return {
    DVTSourceTextBackground: p.bg,
    DVTSourceTextSelectionColor: p.selection,
    DVTSourceTextInsertionPointColor: p.fg,
    DVTSourceTextCurrentLineHighlightColor: o.line_highlight,
    DVTSourceTextInvisiblesColor: p.comment,
    DVTSourceTextBlockDimBackgroundColor: p.comment,
    DVTDebuggerInstructionPointerColor: p.selection,

    DVTConsoleTextBackgroundColor: p.bg,
    DVTConsoleTextSelectionColor: p.selection,
    DVTConsoleTextInsertionPointColor: p.fg,
    DVTConsoleDebuggerInputTextColor: p.fg,
    DVTConsoleDebuggerOutputTextColor: p.fg,
    DVTConsoleDebuggerPromptTextColor: p.green,
    DVTConsoleExectuableInputTextColor: p.fg, // sic: Xcode's spelling
    DVTConsoleExectuableOutputTextColor: p.fg,

    DVTMarkupTextBackgroundColor: u.bg_dark,
    DVTMarkupTextBorderColor: p.selection,
    DVTMarkupTextNormalColor: p.fg,
    DVTMarkupTextPrimaryHeadingColor: p.purple,
    DVTMarkupTextSecondaryHeadingColor: p.purple,
    DVTMarkupTextOtherHeadingColor: p.purple,
    DVTMarkupTextEmphasisColor: p[SYNTAX.emphasis],
    DVTMarkupTextStrongColor: p[SYNTAX.strong],
    DVTMarkupTextLinkColor: p.blue,
    DVTMarkupTextInlineCodeColor: p[SYNTAX.string],

    DVTScrollbarMarkerAnalyzerColor: p.blue,
    DVTScrollbarMarkerBreakpointColor: p.blue,
    DVTScrollbarMarkerDiffColor: p.comment,
    DVTScrollbarMarkerDiffConflictColor: p.red,
    DVTScrollbarMarkerErrorColor: p.red,
    DVTScrollbarMarkerRuntimeIssueColor: p.purple,
    DVTScrollbarMarkerWarningColor: p.yellow,
  };
}

const FONTS = {
  DVTConsoleDebuggerInputTextFont: 'SFMono-Bold - 12.0',
  DVTConsoleDebuggerOutputTextFont: 'SFMono-Medium - 12.0',
  DVTConsoleDebuggerPromptTextFont: 'SFMono-Bold - 12.0',
  DVTConsoleExectuableInputTextFont: 'SFMono-Medium - 12.0',
  DVTConsoleExectuableOutputTextFont: 'SFMono-Bold - 12.0',
  DVTMarkupTextCodeFont: 'SFMono-Regular - 10.0',
  DVTMarkupTextEmphasisFont: '.AppleSystemUIFontItalic - 10.0',
  DVTMarkupTextLinkFont: '.AppleSystemUIFont - 10.0',
  DVTMarkupTextNormalFont: '.AppleSystemUIFont - 10.0',
  DVTMarkupTextOtherHeadingFont: '.AppleSystemUIFont - 14.0',
  DVTMarkupTextPrimaryHeadingFont: '.AppleSystemUIFont - 24.0',
  DVTMarkupTextSecondaryHeadingFont: '.AppleSystemUIFont - 18.0',
  DVTMarkupTextStrongFont: '.AppleSystemUIFontBold - 10.0',
};

/** The theme as a plain object: { key: string | number | { key: string } }. */
export function theme(v) {
  const bg = v.palette.bg;
  const out = { DVTFontAndColorVersion: 1, DVTLineSpacing: 1.1, ...FONTS };
  for (const [k, hex] of Object.entries(editorColors(v))) out[k] = rgba(flatten(hex, bg));
  out.DVTSourceTextSyntaxColors = {};
  out.DVTSourceTextSyntaxFonts = {};
  for (const key of Object.keys(SYNTAX_MAP)) {
    out.DVTSourceTextSyntaxColors[key] = rgba(flatten(colorFor(v, key), bg));
    out.DVTSourceTextSyntaxFonts[key] = fontFor(key);
  }
  return out;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const sorted = (o) => Object.entries(o).sort(([a], [b]) => a.localeCompare(b, 'en'));

function plistValue(value, indent) {
  if (typeof value === 'number') {
    return Number.isInteger(value) ? `${indent}<integer>${value}</integer>` : `${indent}<real>${value}</real>`;
  }
  if (typeof value === 'string') return `${indent}<string>${esc(value)}</string>`;
  return [
    `${indent}<dict>`,
    ...sorted(value).flatMap(([k, x]) => [`${indent}\t<key>${esc(k)}</key>`, plistValue(x, `${indent}\t`)]),
    `${indent}</dict>`,
  ].join('\n');
}

function plist(palette, v) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<!-- ${palette.name} ${v.name} (${v.meaning}, ${v.mode}) v${palette.version}`,
    '     Generated from palette/ile-oyo.json by `npm run build`. Do not edit by hand. -->',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    plistValue(theme(v), ''),
    '</plist>',
    '',
  ].join('\n');
}

export default function xcode(palette) {
  return Object.entries(FILES).map(([id, file]) => ({
    path: `themes/xcode/${file}`,
    contents: plist(palette, palette.variants[id]),
  }));
}
