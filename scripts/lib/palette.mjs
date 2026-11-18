// Shared palette loading and validation. Used by check-palette.mjs and build.mjs.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const MIN = 4.5; // WCAG 2.1 AA, normal text
export const MIN_SELECTION = 1.5; // selection must stand out from bg
export const ACCENTS = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink'];

export function loadPalette() {
  return JSON.parse(readFileSync(new URL('../../palette/ile-oyo.json', import.meta.url), 'utf8'));
}

/** "#RRGGBB" or "#RRGGBBAA" → { r, g, b, a } with channels in 0–1. */
export function parseHex(hex) {
  const n = (i) => parseInt(hex.slice(i, i + 2), 16) / 255;
  return { r: n(1), g: n(3), b: n(5), a: hex.length === 9 ? n(7) : 1 };
}

function luminance(hex) {
  const { r, g, b } = parseHex(hex);
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Returns a list of rule violations (empty when the palette is valid). See docs/architecture.md. */
export function validate(palette) {
  const errors = [];
  const hexRe = /^#[0-9A-F]{6}([0-9A-F]{2})?$/;

  for (const [id, v] of Object.entries(palette.variants)) {
    const { bg } = v.palette;
    const tag = `${v.name} (${id})`;

    // Every color is well-formed uppercase hex.
    for (const group of ['palette', 'ui', 'ansi', 'other']) {
      for (const [k, hex] of Object.entries(v[group])) {
        if (!hexRe.test(hex)) errors.push(`${tag}: ${group}.${k} "${hex}" is not #RRGGBB[AA]`);
      }
    }

    // Text colors reach MIN against bg.
    for (const k of ['fg', 'comment', ...ACCENTS]) {
      const r = contrast(v.palette[k], bg);
      if (r < MIN) errors.push(`${tag}: ${k} ${v.palette[k]} is ${r.toFixed(2)}:1 against bg`);
    }

    // Selection is a surface, not text, but must be clearly visible.
    const sel = contrast(v.palette.selection, bg);
    if (sel < MIN_SELECTION) {
      errors.push(`${tag}: selection ${v.palette.selection} is ${sel.toFixed(2)}:1 against bg (min ${MIN_SELECTION})`);
    }

    // Muted UI text (inactive tabs, descriptions, placeholders) is still text:
    // it must pass on the editor and on every panel surface.
    for (const s of ['bg', 'bg_dark', 'bg_darker']) {
      const surface = s === 'bg' ? bg : v.ui[s];
      const r = contrast(v.ui.muted, surface);
      if (r < MIN) errors.push(`${tag}: ui.muted ${v.ui.muted} is ${r.toFixed(2)}:1 against ${s} ${surface}`);
    }

    // Accents are distinct from each other and from bg.
    const seen = new Map();
    for (const k of ACCENTS) {
      const hex = v.palette[k];
      if (hex === bg) errors.push(`${tag}: ${k} equals bg`);
      if (seen.has(hex)) errors.push(`${tag}: ${k} equals ${seen.get(hex)} (${hex})`);
      seen.set(hex, k);
    }

    // ANSI: colors 1-6 and 9-14 always count as text. Black and white depend on
    // the mode: in dark mode white (7, 15) is text and black (0) is a background;
    // in light mode it's the reverse. Bright black (8) is text in both.
    const exempt = v.mode === 'dark' ? [0] : [7, 15];
    for (let i = 0; i < 16; i++) {
      if (exempt.includes(i)) continue;
      const hex = v.ansi[`color${i}`];
      const r = contrast(hex, bg);
      if (r < MIN) errors.push(`${tag}: ansi color${i} ${hex} is ${r.toFixed(2)}:1 against bg`);
    }
  }
  return errors;
}
