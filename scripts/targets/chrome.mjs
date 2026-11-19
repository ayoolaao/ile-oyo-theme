// Chrome target: one static theme extension per variant. Chrome themes can't
// switch with the system's light/dark setting, so Alẹ́ and Ọ̀sán are separate
// extensions in themes/chrome/ale and themes/chrome/osan.
//
// Surfaces match the Firefox and VS Code themes: the frame and inactive tabs
// use ui.bg_darker, the selected tab and toolbar use bg, inactive tab text
// uses ui.muted, and the address bar matches VS Code's inputs. Incognito
// colors are left to Chrome so incognito windows still look different.
//
// Chrome reads colors as [r, g, b] arrays; the keys it accepts are
// kOverwritableColorTable in Chromium's chrome/browser/themes/browser_theme_pack.cc.
import { parseHex } from '../lib/palette.mjs';

export const DIR = 'themes/chrome';
export const VARIANTS = ['ale', 'osan'];
export const ICON = 'icon128.png';

export function rgb(hex) {
  const { r, g, b, a } = parseHex(hex);
  if (a !== 1) throw new Error(`Chrome theme colors must be opaque: ${hex}`);
  return [r, g, b].map((c) => Math.round(c * 255));
}

/** Theme colors for one variant, as hex (converted to [r, g, b] in the manifest). */
export function hexColors(v) {
  const p = v.palette;
  const u = v.ui;
  const field = v.mode === 'dark' ? u.bg_darker : u.bg_lighter;
  return {
    frame: u.bg_darker,
    frame_inactive: u.bg_darker,
    background_tab: u.bg_darker,
    background_tab_inactive: u.bg_darker,
    tab_text: p.fg,
    tab_background_text: u.muted,
    tab_background_text_inactive: u.muted,

    toolbar: p.bg,
    toolbar_text: p.fg,
    toolbar_button_icon: p.fg,
    bookmark_text: p.fg,

    omnibox_background: field,
    omnibox_text: p.fg,

    ntp_background: p.bg,
    ntp_text: p.fg,
    ntp_link: p.blue,
  };
}

/** Text/background pairs that must stay readable (checked in tests). */
export const TEXT_PAIRS = [
  ['tab_text', 'toolbar'],
  ['tab_background_text', 'background_tab'],
  ['tab_background_text_inactive', 'background_tab_inactive'],
  ['toolbar_text', 'toolbar'],
  ['bookmark_text', 'toolbar'],
  ['omnibox_text', 'omnibox_background'],
  ['ntp_text', 'ntp_background'],
  ['ntp_link', 'ntp_background'],
];

export function manifest(palette, id) {
  const v = palette.variants[id];
  const name = `${palette.name} ${v.name}`;
  return {
    manifest_version: 3,
    name,
    version: palette.version,
    description: `${name} (${v.meaning}, ${v.mode}): colors from Ọ̀yọ́ aṣọ-òkè.`,
    author: 'Ayoola Abimbola',
    homepage_url: 'https://github.com/ayoolaao/ile-oyo-theme',
    icons: { 128: ICON },
    theme: {
      colors: Object.fromEntries(Object.entries(hexColors(v)).map(([k, hex]) => [k, rgb(hex)])),
    },
  };
}

export default function chrome(palette) {
  return VARIANTS.map((id) => ({
    path: `${DIR}/${id}/manifest.json`,
    contents:
      JSON.stringify(manifest(palette, id), null, 2).replace(/\[\s+(\d+),\s+(\d+),\s+(\d+)\s+\]/g, '[$1, $2, $3]') +
      '\n',
  }));
}
