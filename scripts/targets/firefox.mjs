// Firefox target: one static theme extension that follows the system setting.
// `theme` is Ọ̀sán (light) and `dark_theme` is Alẹ́ (dark); Firefox switches
// between them with its light/dark color scheme.
//
// Surfaces match the VS Code theme: the frame (title bar and tab strip) uses
// ui.bg_darker, the selected tab and toolbar use bg with an àlàárì-red tab
// line, inactive tab text uses ui.muted, and fields match VS Code's inputs.

export const DIR = 'themes/firefox';
export const ID = 'ile-oyo-theme@jazzykid.com';

/** theme.colors for one variant. Values are CSS colors (#RRGGBB or #RRGGBBAA). */
export function colors(v) {
  const p = v.palette;
  const u = v.ui;
  const dark = v.mode === 'dark';
  const field = dark ? u.bg_darker : u.bg_lighter;
  return {
    frame: u.bg_darker,
    frame_inactive: u.bg_darker,
    tab_background_text: u.muted,
    tab_selected: p.bg,
    tab_text: p.fg,
    tab_line: p.red,
    tab_loading: p.red,

    toolbar: p.bg,
    toolbar_text: p.fg,
    icons: p.fg,
    icons_attention: p.yellow,
    button_background_hover: v.other.line_highlight,
    button_background_active: p.selection,
    toolbar_top_separator: u.bg_darker,
    toolbar_bottom_separator: u.bg_darker,
    toolbar_vertical_separator: p.selection,

    toolbar_field: field,
    toolbar_field_text: p.fg,
    toolbar_field_border: dark ? u.bg_light : u.bg_darker,
    toolbar_field_focus: field,
    toolbar_field_text_focus: p.fg,
    toolbar_field_border_focus: p.blue,
    toolbar_field_highlight: p.selection,
    toolbar_field_highlight_text: p.fg,

    popup: u.bg_light,
    popup_text: p.fg,
    popup_border: u.bg_darker,
    popup_highlight: p.selection,
    popup_highlight_text: p.fg,

    sidebar: u.bg_dark,
    sidebar_text: p.fg,
    sidebar_border: u.bg_darker,
    sidebar_highlight: p.selection,
    sidebar_highlight_text: p.fg,

    ntp_background: p.bg,
    ntp_text: p.fg,
    ntp_card_background: u.bg_light,
  };
}

/** Text/background pairs that must stay readable (checked in tests). */
export const TEXT_PAIRS = [
  ['tab_text', 'tab_selected'],
  ['tab_background_text', 'frame'],
  ['toolbar_text', 'toolbar'],
  ['toolbar_field_text', 'toolbar_field'],
  ['toolbar_field_text_focus', 'toolbar_field_focus'],
  ['toolbar_field_highlight_text', 'toolbar_field_highlight'],
  ['popup_text', 'popup'],
  ['popup_highlight_text', 'popup_highlight'],
  ['sidebar_text', 'sidebar'],
  ['sidebar_highlight_text', 'sidebar_highlight'],
  ['ntp_text', 'ntp_background'],
  ['ntp_text', 'ntp_card_background'],
];

export function manifest(palette) {
  const { ale, osan } = palette.variants;
  return {
    manifest_version: 3,
    name: palette.name,
    version: palette.version,
    description: `${palette.name}: ${osan.name} (${osan.meaning}, light) and ${ale.name} (${ale.meaning}, dark), switching with your system.`,
    author: 'Ayoola Abimbola',
    homepage_url: 'https://github.com/ayoolaao/ile-oyo-theme',
    browser_specific_settings: { gecko: { id: ID } },
    theme: { colors: colors(osan) },
    dark_theme: { colors: colors(ale) },
  };
}

export default function firefox(palette) {
  return [{ path: `${DIR}/manifest.json`, contents: JSON.stringify(manifest(palette), null, 2) + '\n' }];
}
