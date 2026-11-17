// iTerm2 target: one .itermcolors file (an XML property list) per variant.
// Colors are written in the sRGB color space so iTerm shows the exact hex values.
import { parseHex } from '../lib/palette.mjs';

const FILES = { ale: 'Ile-Oyo-Ale.itermcolors', osan: 'Ile-Oyo-Osan.itermcolors' };

// iTerm key → where the color comes from in the variant.
function mapping(v) {
  const p = v.palette;
  const keys = {};
  for (let i = 0; i < 16; i++) keys[`Ansi ${i} Color`] = v.ansi[`color${i}`];
  Object.assign(keys, {
    'Background Color': p.bg,
    'Foreground Color': p.fg,
    'Bold Color': p.fg,
    'Cursor Color': p.fg,
    'Cursor Text Color': p.bg,
    'Selection Color': p.selection,
    'Selected Text Color': p.fg,
    'Link Color': p.blue,
    'Cursor Guide Color': `${p.selection}66`, // ~40% opacity
  });
  return keys;
}

const real = (x) => `<real>${Number(x.toFixed(10))}</real>`;

function colorDict(hex) {
  const { r, g, b, a } = parseHex(hex);
  return [
    '\t<dict>',
    '\t\t<key>Alpha Component</key>',
    `\t\t${real(a)}`,
    '\t\t<key>Blue Component</key>',
    `\t\t${real(b)}`,
    '\t\t<key>Color Space</key>',
    '\t\t<string>sRGB</string>',
    '\t\t<key>Green Component</key>',
    `\t\t${real(g)}`,
    '\t\t<key>Red Component</key>',
    `\t\t${real(r)}`,
    '\t</dict>',
  ].join('\n');
}

function plist(palette, v) {
  // iTerm sorts keys alphabetically when it exports; do the same for stable diffs.
  const entries = Object.entries(mapping(v)).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }));
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<!-- ${palette.name} ${v.name} (${v.meaning}, ${v.mode}) v${palette.version}`,
    '     Generated from palette/ile-oyo.json by `npm run build`. Do not edit by hand. -->',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    '<dict>',
    ...entries.flatMap(([key, hex]) => [`\t<key>${key}</key>`, colorDict(hex)]),
    '</dict>',
    '</plist>',
    '',
  ].join('\n');
}

export default function iterm(palette) {
  return Object.entries(FILES).map(([id, file]) => ({
    path: `themes/iterm/${file}`,
    contents: plist(palette, palette.variants[id]),
  }));
}
