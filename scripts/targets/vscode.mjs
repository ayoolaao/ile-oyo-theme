// VS Code target: one color theme JSON per variant for the extension in
// themes/vscode/. Workbench colors come from the palette by role; code colors
// come from the shared syntax roles (scripts/lib/syntax.mjs).
import { SYNTAX, STYLE } from '../lib/syntax.mjs';

const OUT = 'themes/vscode/themes';
export const FILES = { ale: 'ile-oyo-ale.json', osan: 'ile-oyo-osan.json' };

// Append a two-digit alpha to a #RRGGBB color.
const a = (hex, alpha) => `${hex.slice(0, 7)}${alpha}`;

// Workbench (UI) colors. Layout, outermost to innermost:
// title bar / activity bar / status bar = bg_darker, side bar / panels /
// inactive tabs = bg_dark, editor = bg, widgets and menus = bg_light.
// Àlàárì red is the brand accent (active borders, badges, progress); blue is
// for actions and links; semantic colors: error red, warning yellow, info blue.
// Secondary text (inactive tabs, descriptions, placeholders) uses ui.muted,
// which passes 4.5:1 on every surface; comment is for code only.
export function workbench(v) {
  const p = v.palette;
  const u = v.ui;
  const dark = v.mode === 'dark';
  const border = u.bg_darker;
  const ansiNames = ['Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White'];

  const c = {
    // Base
    foreground: p.fg,
    descriptionForeground: u.muted,
    errorForeground: p.red,
    focusBorder: a(p.blue, '99'),
    'selection.background': p.selection,
    'widget.shadow': dark ? '#00000066' : '#0000001F',
    'icon.foreground': p.fg,
    'textLink.foreground': p.blue,
    'textLink.activeForeground': p.cyan,
    'textPreformat.foreground': p.green,
    'textBlockQuote.background': u.bg_dark,
    'textBlockQuote.border': p.comment,
    'textCodeBlock.background': u.bg_dark,
    'textSeparator.foreground': p.comment,

    // Buttons, inputs, dropdowns, badges
    'button.background': p.blue,
    'button.foreground': p.bg,
    'button.hoverBackground': a(p.blue, 'DD'),
    'button.secondaryBackground': u.bg_light,
    'button.secondaryForeground': p.fg,
    'button.secondaryHoverBackground': u.bg_lighter,
    'dropdown.background': u.bg_light,
    'dropdown.border': border,
    'dropdown.foreground': p.fg,
    'input.background': dark ? u.bg_darker : u.bg_lighter,
    'input.foreground': p.fg,
    'input.border': dark ? u.bg_light : u.bg_darker,
    'input.placeholderForeground': u.muted,
    'inputOption.activeBorder': p.red,
    'inputOption.activeBackground': a(p.red, '33'),
    'inputValidation.errorBorder': p.red,
    'inputValidation.errorBackground': u.bg_light,
    'inputValidation.warningBorder': p.yellow,
    'inputValidation.warningBackground': u.bg_light,
    'inputValidation.infoBorder': p.blue,
    'inputValidation.infoBackground': u.bg_light,
    'checkbox.background': u.bg_light,
    'checkbox.border': dark ? u.bg_lighter : u.bg_darker,
    'checkbox.foreground': p.fg,
    'badge.background': p.red,
    'badge.foreground': p.bg,
    'progressBar.background': p.red,

    // Scrollbars
    'scrollbar.shadow': '#00000000',
    'scrollbarSlider.background': a(p.comment, '40'),
    'scrollbarSlider.hoverBackground': a(p.comment, '66'),
    'scrollbarSlider.activeBackground': a(p.comment, '99'),

    // Lists and trees
    'list.activeSelectionBackground': p.selection,
    'list.activeSelectionForeground': p.fg,
    'list.inactiveSelectionBackground': v.other.line_highlight,
    'list.inactiveSelectionForeground': p.fg,
    'list.hoverBackground': v.other.line_highlight,
    'list.hoverForeground': p.fg,
    'list.focusBackground': v.other.line_highlight,
    'list.focusOutline': a(p.blue, '99'),
    'list.dropBackground': v.other.tab_drop_bg,
    'list.highlightForeground': p.yellow,
    'list.errorForeground': p.red,
    'list.warningForeground': p.yellow,
    'tree.indentGuidesStroke': v.other.non_text,

    // Activity bar
    'activityBar.background': u.bg_darker,
    'activityBar.foreground': p.fg,
    'activityBar.inactiveForeground': u.muted,
    'activityBar.activeBorder': p.red,
    'activityBar.activeBackground': a(p.red, '1A'),
    'activityBar.border': u.bg_darker,
    'activityBarBadge.background': p.red,
    'activityBarBadge.foreground': p.bg,

    // Side bar
    'sideBar.background': u.bg_dark,
    'sideBar.foreground': p.fg,
    'sideBar.border': u.bg_darker,
    'sideBarTitle.foreground': p.fg,
    'sideBarSectionHeader.background': u.bg_dark,
    'sideBarSectionHeader.foreground': p.fg,
    'sideBarSectionHeader.border': u.bg_darker,

    // Editor groups and tabs
    'editorGroup.border': u.bg_darker,
    'editorGroup.dropBackground': v.other.tab_drop_bg,
    'editorGroupHeader.tabsBackground': u.bg_dark,
    'editorGroupHeader.tabsBorder': u.bg_darker,
    'editorGroupHeader.noTabsBackground': p.bg,
    'tab.activeBackground': p.bg,
    'tab.activeForeground': p.fg,
    'tab.activeBorderTop': p.red,
    'tab.inactiveBackground': u.bg_dark,
    'tab.inactiveForeground': u.muted,
    'tab.unfocusedActiveForeground': p.fg,
    'tab.unfocusedInactiveForeground': u.muted,
    'tab.unfocusedActiveBorderTop': a(p.red, '66'),
    'tab.border': u.bg_darker,
    'tab.hoverBackground': p.bg,
    'tab.activeModifiedBorder': p.orange,
    'tab.inactiveModifiedBorder': a(p.orange, '88'),

    // Editor
    'editor.background': p.bg,
    'editor.foreground': p.fg,
    'editorLineNumber.foreground': p.comment,
    'editorLineNumber.activeForeground': p.fg,
    'editorCursor.foreground': p.fg,
    'editor.selectionBackground': p.selection,
    'editor.inactiveSelectionBackground': v.other.line_highlight,
    'editor.selectionHighlightBackground': a(p.selection, '99'),
    'editor.lineHighlightBackground': a(p.selection, '40'),
    'editor.lineHighlightBorder': '#00000000',
    'editor.wordHighlightBackground': a(p.cyan, '26'),
    'editor.wordHighlightStrongBackground': a(p.green, '26'),
    'editor.findMatchBackground': a(p.orange, '66'),
    'editor.findMatchHighlightBackground': a(p.yellow, '40'),
    'editor.findRangeHighlightBackground': v.other.line_highlight,
    'editor.hoverHighlightBackground': a(p.cyan, '26'),
    'editor.rangeHighlightBackground': a(p.blue, '1A'),
    'editor.foldBackground': a(u.bg_darker, '80'),
    'editorLink.activeForeground': p.cyan,
    'editorWhitespace.foreground': v.other.non_text,
    'editorIndentGuide.background1': v.other.non_text,
    'editorIndentGuide.activeBackground1': a(p.comment, '80'),
    'editorRuler.foreground': v.other.non_text,
    'editorCodeLens.foreground': p.comment,
    'editorBracketMatch.background': a(p.selection, '80'),
    'editorBracketMatch.border': p.comment,
    'editorBracketHighlight.foreground1': p.fg,
    'editorBracketHighlight.foreground2': p.pink,
    'editorBracketHighlight.foreground3': p.cyan,
    'editorBracketHighlight.foreground4': p.green,
    'editorBracketHighlight.foreground5': p.purple,
    'editorBracketHighlight.foreground6': p.orange,
    'editorBracketHighlight.unexpectedBracket.foreground': p.red,
    'editorInlayHint.foreground': p.comment,
    'editorInlayHint.background': a(u.bg_light, '80'),
    'editorGhostText.foreground': p.comment,
    'editorError.foreground': p.red,
    'editorWarning.foreground': p.yellow,
    'editorInfo.foreground': p.blue,
    'editorHint.foreground': p.cyan,
    'editorUnnecessaryCode.opacity': '#000000AA',

    // Gutter and overview ruler
    'editorGutter.background': p.bg,
    'editorGutter.modifiedBackground': a(p.orange, 'AA'),
    'editorGutter.addedBackground': a(p.green, 'AA'),
    'editorGutter.deletedBackground': a(p.red, 'AA'),
    'editorOverviewRuler.border': u.bg_darker,
    'editorOverviewRuler.modifiedForeground': a(p.orange, '99'),
    'editorOverviewRuler.addedForeground': a(p.green, '99'),
    'editorOverviewRuler.deletedForeground': a(p.red, '99'),
    'editorOverviewRuler.errorForeground': a(p.red, 'CC'),
    'editorOverviewRuler.warningForeground': a(p.yellow, 'CC'),
    'editorOverviewRuler.infoForeground': a(p.blue, 'CC'),
    'editorOverviewRuler.findMatchForeground': a(p.orange, 'CC'),
    'editorOverviewRuler.selectionHighlightForeground': a(p.selection, 'CC'),

    // Diff and merge
    'diffEditor.insertedTextBackground': a(p.green, '26'),
    'diffEditor.removedTextBackground': a(p.red, '26'),
    'diffEditor.insertedLineBackground': a(p.green, '14'),
    'diffEditor.removedLineBackground': a(p.red, '14'),
    'merge.currentHeaderBackground': a(p.green, '66'),
    'merge.currentContentBackground': a(p.green, '26'),
    'merge.incomingHeaderBackground': a(p.blue, '66'),
    'merge.incomingContentBackground': a(p.blue, '26'),
    'editorOverviewRuler.currentContentForeground': p.green,
    'editorOverviewRuler.incomingContentForeground': p.blue,

    // Widgets: suggest, hover, peek, find
    'editorWidget.background': u.bg_light,
    'editorWidget.foreground': p.fg,
    'editorWidget.border': u.bg_darker,
    'editorSuggestWidget.background': u.bg_light,
    'editorSuggestWidget.border': u.bg_darker,
    'editorSuggestWidget.foreground': p.fg,
    'editorSuggestWidget.selectedBackground': p.selection,
    'editorSuggestWidget.highlightForeground': p.yellow,
    'editorHoverWidget.background': u.bg_light,
    'editorHoverWidget.border': u.bg_darker,
    'peekView.border': p.red,
    'peekViewEditor.background': p.bg,
    'peekViewEditor.matchHighlightBackground': a(p.yellow, '40'),
    'peekViewResult.background': u.bg_dark,
    'peekViewResult.fileForeground': p.fg,
    'peekViewResult.lineForeground': p.fg,
    'peekViewResult.matchHighlightBackground': a(p.yellow, '40'),
    'peekViewResult.selectionBackground': p.selection,
    'peekViewResult.selectionForeground': p.fg,
    'peekViewTitle.background': u.bg_darker,
    'peekViewTitleLabel.foreground': p.fg,
    'peekViewTitleDescription.foreground': u.muted,

    // Panels and terminal
    'panel.background': u.bg_dark,
    'panel.border': u.bg_darker,
    'panelTitle.activeBorder': p.red,
    'panelTitle.activeForeground': p.fg,
    'panelTitle.inactiveForeground': u.muted,
    'terminal.background': p.bg,
    'terminal.foreground': p.fg,
    'terminal.selectionBackground': p.selection,
    'terminalCursor.foreground': p.fg,

    // Status bar and title bar
    'statusBar.background': u.bg_darker,
    'statusBar.foreground': p.fg,
    'statusBar.border': u.bg_darker,
    'statusBar.noFolderBackground': u.bg_darker,
    'statusBar.debuggingBackground': p.orange,
    'statusBar.debuggingForeground': p.bg,
    'statusBarItem.remoteBackground': p.red,
    'statusBarItem.remoteForeground': p.bg,
    'statusBarItem.hoverBackground': a(p.selection, 'AA'),
    'statusBarItem.prominentBackground': p.red,
    'statusBarItem.prominentForeground': p.bg,
    'titleBar.activeBackground': u.bg_darker,
    'titleBar.activeForeground': p.fg,
    'titleBar.inactiveBackground': u.bg_darker,
    'titleBar.inactiveForeground': u.muted,
    'titleBar.border': u.bg_darker,

    // Menus, quick input, notifications
    'menu.background': u.bg_light,
    'menu.foreground': p.fg,
    'menu.selectionBackground': p.selection,
    'menu.selectionForeground': p.fg,
    'menu.separatorBackground': u.bg_darker,
    'menu.border': u.bg_darker,
    'quickInput.background': u.bg_light,
    'quickInput.foreground': p.fg,
    'quickInputList.focusBackground': p.selection,
    'pickerGroup.border': u.bg_darker,
    'pickerGroup.foreground': p.cyan,
    'notifications.background': u.bg_light,
    'notifications.foreground': p.fg,
    'notifications.border': u.bg_darker,
    'notificationCenterHeader.background': u.bg_darker,
    'notificationLink.foreground': p.blue,
    'notificationsErrorIcon.foreground': p.red,
    'notificationsWarningIcon.foreground': p.yellow,
    'notificationsInfoIcon.foreground': p.blue,

    // Git decorations
    'gitDecoration.modifiedResourceForeground': p.orange,
    'gitDecoration.deletedResourceForeground': p.red,
    'gitDecoration.untrackedResourceForeground': p.green,
    'gitDecoration.addedResourceForeground': p.green,
    'gitDecoration.ignoredResourceForeground': p.comment,
    'gitDecoration.conflictingResourceForeground': p.pink,
    'gitDecoration.submoduleResourceForeground': p.cyan,

    // Debugging, settings, breadcrumbs, minimap
    'debugToolBar.background': u.bg_light,
    'editor.stackFrameHighlightBackground': a(p.yellow, '33'),
    'editor.focusedStackFrameHighlightBackground': a(p.green, '33'),
    'settings.headerForeground': p.fg,
    'settings.modifiedItemIndicator': p.orange,
    'breadcrumb.foreground': u.muted,
    'breadcrumb.focusForeground': p.fg,
    'breadcrumb.activeSelectionForeground': p.fg,
    'breadcrumb.background': p.bg,
    'minimap.selectionHighlight': p.selection,
    'minimap.findMatchHighlight': a(p.orange, 'AA'),
    'minimapGutter.modifiedBackground': a(p.orange, 'AA'),
    'minimapGutter.addedBackground': a(p.green, 'AA'),
    'minimapGutter.deletedBackground': a(p.red, 'AA'),
  };

  ansiNames.forEach((name, i) => {
    c[`terminal.ansi${name}`] = v.ansi[`color${i}`];
    c[`terminal.ansiBright${name}`] = v.ansi[`color${i + 8}`];
  });
  return c;
}

// TextMate scopes for each syntax role.
const SCOPES = {
  comment: ['comment', 'punctuation.definition.comment', 'string.quoted.docstring'],
  keyword: [
    'keyword', 'keyword.control', 'keyword.operator', 'storage', 'storage.type', 'storage.modifier',
    'punctuation.definition.template-expression', 'punctuation.section.embedded',
  ],
  function: ['entity.name.function', 'support.function', 'meta.function-call.generic', 'entity.name.function.decorator', 'meta.decorator'],
  string: ['string', 'punctuation.definition.string', 'constant.other.symbol'],
  number: [
    'constant.numeric', 'constant.language', 'constant.character', 'constant.other',
    'support.constant', 'variable.other.constant', 'variable.other.enummember',
  ],
  type: [
    'entity.name.type', 'entity.name.class', 'entity.other.inherited-class', 'support.type', 'support.class',
    'entity.name.namespace', 'storage.type.primitive', 'storage.type.built-in',
  ],
  parameter: ['variable.parameter', 'meta.parameters variable'],
  property: [
    'variable.other.property', 'variable.other.object.property', 'support.type.property-name',
    'meta.object-literal.key', 'entity.other.attribute-name', 'support.variable.property',
  ],
  tag: ['entity.name.tag', 'meta.tag.sgml.doctype'],
  regex: ['string.regexp'],
  variable: ['variable', 'variable.other', 'meta.definition.variable', 'support.variable'],
  punctuation: ['punctuation', 'meta.brace', 'punctuation.definition.tag'],
  link: ['markup.underline.link', 'string.other.link'],
  deleted: ['markup.deleted', 'punctuation.definition.deleted'],
  inserted: ['markup.inserted', 'punctuation.definition.inserted'],
  changed: ['markup.changed', 'punctuation.definition.changed'],
  heading: ['markup.heading', 'entity.name.section', 'punctuation.definition.heading'],
  emphasis: ['markup.italic'],
  strong: ['markup.bold'],
};

// Specific scopes listed after the roles so they win over the broad ones above.
function extras(p) {
  return [
    { name: 'this / self', scope: ['variable.language'], settings: { foreground: p.purple, fontStyle: 'italic' } },
    { name: 'Escape sequences', scope: ['constant.character.escape'], settings: { foreground: p.pink } },
    { name: 'Inline code', scope: ['markup.inline.raw', 'markup.raw.inline'], settings: { foreground: p.green } },
    { name: 'Quotes', scope: ['markup.quote'], settings: { foreground: p.comment, fontStyle: 'italic' } },
    { name: 'Invalid', scope: ['invalid', 'invalid.illegal'], settings: { foreground: p.red, fontStyle: 'underline' } },
    { name: 'Deprecated', scope: ['invalid.deprecated'], settings: { foreground: p.orange, fontStyle: 'underline' } },
    { name: 'Template expressions', scope: ['meta.template.expression', 'meta.embedded'], settings: { foreground: p.fg } },
  ];
}

function tokenColors(v) {
  const p = v.palette;
  const rules = Object.entries(SCOPES).map(([role, scope]) => {
    const settings = { foreground: p[SYNTAX[role]] };
    if (STYLE[role]) settings.fontStyle = STYLE[role];
    return { name: role[0].toUpperCase() + role.slice(1), scope, settings };
  });
  // Variables and punctuation are the broadest scopes; put them first so
  // every more specific role overrides them.
  const broad = rules.filter((r) => ['Variable', 'Punctuation'].includes(r.name));
  const rest = rules.filter((r) => !broad.includes(r));
  return [...broad, ...rest, ...extras(p)];
}

function semanticTokenColors(v) {
  const p = v.palette;
  const color = (role) => p[SYNTAX[role]];
  return {
    parameter: { foreground: color('parameter'), italic: true },
    property: color('property'),
    'property.declaration': color('property'),
    function: color('function'),
    method: color('function'),
    class: color('type'),
    interface: color('type'),
    type: color('type'),
    typeParameter: color('type'),
    namespace: color('type'),
    enum: color('type'),
    enumMember: color('number'),
    variable: color('variable'),
    'variable.defaultLibrary': color('type'),
    'variable.readonly.defaultLibrary': color('number'),
    keyword: color('keyword'),
    decorator: color('function'),
    regexp: color('regex'),
  };
}

export function theme(palette, id) {
  const v = palette.variants[id];
  return {
    $schema: 'vscode://schemas/color-theme',
    name: `${palette.name} ${v.name}`,
    type: v.mode,
    semanticHighlighting: true,
    colors: workbench(v),
    tokenColors: tokenColors(v),
    semanticTokenColors: semanticTokenColors(v),
  };
}

export default function vscode(palette) {
  for (const role of Object.keys(SYNTAX)) {
    if (!SCOPES[role]) throw new Error(`vscode: no TextMate scopes for syntax role "${role}"`);
  }
  return Object.entries(FILES).map(([id, file]) => ({
    path: `${OUT}/${file}`,
    contents: `${JSON.stringify(theme(palette, id), null, 2)}\n`,
  }));
}
