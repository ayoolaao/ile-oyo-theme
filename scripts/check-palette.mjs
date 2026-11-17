// Checks palette/ile-oyo.json against the rules in notes/spec.md.
// Exits non-zero if any rule fails.
import { readFileSync } from 'node:fs';

const MIN = 4.5; // WCAG 2.1 AA, normal text
const MIN_SELECTION = 1.5; // selection must stand out from bg
const ACCENTS = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink'];

const palette = JSON.parse(
  readFileSync(new URL('../palette/ile-oyo.json', import.meta.url), 'utf8'),
);

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

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

if (errors.length) {
  console.error(`Palette check failed (${errors.length}):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`Palette check passed: ${Object.keys(palette.variants).length} variants, all text ≥ ${MIN}:1.`);
