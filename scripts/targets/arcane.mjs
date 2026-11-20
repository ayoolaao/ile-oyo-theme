// Arcane target: one application theme with both variants, in the format
// Arcane's Settings → Appearance → Import theme accepts. `light` is Ọ̀sán and
// `dark` is Alẹ́; Arcane switches with its own light/dark mode.
//
// Tokens are shadcn-style CSS variables (THEME_TOKENS in Arcane's
// frontend/src/lib/types/ui/theme.ts). Surfaces match the other targets:
// sidebar on ui.bg_dark, cards and popovers on the lighter UI step, borders
// as the palette's translucent non_text overlay, and àlàárì red as primary.
//
// Surfaces are opaque. Arcane's built-in themes give cards and the sidebar some
// alpha, but its components already add their own (bg-card/NN), and over a
// backdrop image it paints the shell a fixed color in dark mode; tested in
// Arcane 3.1.1, translucent surfaces looked the same and cost exact contrast.
import { SYNTAX } from '../lib/syntax.mjs';

export const DIR = 'themes/arcane';
export const FILE = 'ile-oyo.json';
// Imported themes must use a custom- id. Set explicitly: Arcane would
// otherwise slug the name, and the accented letters would become hyphens.
export const ID = 'custom-ile-oyo';

// Shadows sit outside the palette: a soft black in Alẹ́, an ẹtù-indigo tint
// in Ọ̀sán (the same alpha Arcane's built-in themes use).
const SHADOW = { dark: '#0000004D', light: '#1A2B4C1A' };

/** The 33 Arcane tokens for one variant. Values are #RRGGBB or #RRGGBBAA. */
export function tokens(v) {
  const p = v.palette;
  const u = v.ui;
  const dark = v.mode === 'dark';
  const syntax = (role) => p[SYNTAX[role]];

  // The accents are tuned to 4.6:1 on bg, so anything that carries colored or
  // muted text in Alẹ́ sits darker than bg (lighter would drop them to ~4:1).
  // Ọ̀sán's lighter cards only add contrast. Buttons and chips (secondary,
  // accent) carry fg alone and step away from bg: lighter in Alẹ́, darker in Ọ̀sán.
  const card = dark ? u.bg_dark : u.bg_light;
  const sidebar = dark ? u.bg_darker : u.bg_dark;
  const muted = dark ? u.bg_dark : u.bg_darker;
  const secondary = dark ? u.bg_lighter : u.bg_darker;
  const onPrimary = dark ? u.bg_darker : u.bg_lighter;

  return {
    background: p.bg,
    foreground: p.fg,
    card: card,
    'card-foreground': p.fg,
    popover: u.float,
    'popover-foreground': p.fg,
    primary: p.red,
    'primary-foreground': onPrimary,
    secondary: secondary,
    'secondary-foreground': p.fg,
    muted: muted,
    'muted-foreground': u.muted,
    accent: secondary,
    'accent-foreground': p.fg,
    border: v.other.non_text,
    input: v.other.non_text,
    ring: p.red,
    sidebar: sidebar,
    'sidebar-foreground': p.fg,
    'sidebar-primary': p.red,
    'sidebar-primary-foreground': onPrimary,
    'sidebar-accent': p.selection,
    'sidebar-accent-foreground': p.fg,
    'sidebar-border': v.other.non_text,
    'sidebar-ring': p.red,
    surface: u.bg_darker,
    'glass-shadow-color': SHADOW[v.mode],
    'syntax-comment': syntax('comment'),
    'syntax-keyword': syntax('keyword'),
    'syntax-property': syntax('property'),
    'syntax-string': syntax('string'),
    'syntax-number': syntax('number'),
    'syntax-operator': syntax('keyword'), // operators share the keyword role
  };
}

/**
 * Text/background pairs that must stay readable (checked in tests): text
 * first, then the surface it sits on.
 */
export const TEXT_PAIRS = [
  ['foreground', 'background'],
  ['card-foreground', 'card'],
  ['popover-foreground', 'popover'],
  ['primary-foreground', 'primary'],
  ['secondary-foreground', 'secondary'],
  ['muted-foreground', 'background'],
  ['muted-foreground', 'muted'],
  ['muted-foreground', 'card'],
  ['accent-foreground', 'accent'],
  ['sidebar-foreground', 'sidebar'],
  ['sidebar-primary-foreground', 'sidebar-primary'],
  ['sidebar-accent-foreground', 'sidebar-accent'],
  ['primary', 'background'],
  ['primary', 'card'],
  ['primary', 'sidebar'],
  ...['comment', 'keyword', 'property', 'string', 'number', 'operator'].flatMap((role) => [
    [`syntax-${role}`, 'background'],
    [`syntax-${role}`, 'card'],
  ]),
];

export function theme(palette) {
  const { ale, osan } = palette.variants;
  return {
    id: ID,
    name: palette.name,
    description: `${osan.name} (${osan.meaning}, light) and ${ale.name} (${ale.meaning}, dark), from the woven aṣọ-òkè of Ọ̀yọ́.`,
    light: tokens(osan),
    dark: tokens(ale),
  };
}

export default function arcane(palette) {
  return [{ path: `${DIR}/${FILE}`, contents: JSON.stringify(theme(palette), null, 2) + '\n' }];
}
