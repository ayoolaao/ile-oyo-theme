// Terminal.app target: one .terminal profile (an XML property list) per
// variant, with the same colors as the iTerm2 presets.
//
// Terminal stores each color as an NSKeyedArchiver archive of an NSColor. The
// archive is built here (as an XML property list, embedded as <data>) so the
// build stays portable: an sRGB NSColor whose color space is referenced by
// its ID (NSID 7, sRGB IEC61966-2.1) instead of an embedded ICC profile. On
// macOS, tests decode every color with NSKeyedUnarchiver and compare it with
// the palette. The font isn't set, so people keep their own.
import { parseHex } from '../lib/palette.mjs';

export const DIR = 'themes/terminal';
export const FILES = { ale: 'Ile-Oyo-Ale.terminal', osan: 'Ile-Oyo-Osan.terminal' };
const ANSI = ['Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White'];

/** Terminal profile key → hex color. Same choices as the iTerm2 presets. */
export function colors(v) {
  const p = v.palette;
  const out = {};
  ANSI.forEach((name, i) => {
    out[`ANSI${name}Color`] = v.ansi[`color${i}`];
    out[`ANSIBright${name}Color`] = v.ansi[`color${i + 8}`];
  });
  return {
    ...out,
    BackgroundColor: p.bg,
    TextColor: p.fg,
    TextBoldColor: p.fg,
    CursorColor: p.fg,
    SelectionColor: p.selection,
  };
}

const num = (x) => String(Number(x.toFixed(10)));
const uid = (n) => `<dict><key>CF$UID</key><integer>${n}</integer></dict>`;
const b64 = (s) => Buffer.from(s, 'latin1').toString('base64');

/** NSKeyedArchiver archive (XML plist) of an opaque sRGB NSColor. */
export function archiveColor(hex) {
  const { r, g, b, a } = parseHex(hex);
  if (a !== 1) throw new Error(`Terminal colors must be opaque: ${hex}`);
  const rgb = [r, g, b].map(num).join(' ');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0"><dict>',
    '<key>$archiver</key><string>NSKeyedArchiver</string>',
    '<key>$objects</key><array>',
    '<string>$null</string>',
    `<dict><key>$class</key>${uid(3)}<key>NSColorSpace</key><integer>1</integer>` +
      `<key>NSComponents</key><data>${b64(`${rgb} 1`)}</data>` +
      `<key>NSCustomColorSpace</key>${uid(2)}` +
      `<key>NSRGB</key><data>${b64(`${rgb}\0`)}</data></dict>`,
    `<dict><key>$class</key>${uid(4)}<key>NSID</key><integer>7</integer></dict>`,
    '<dict><key>$classes</key><array><string>NSColor</string><string>NSObject</string></array><key>$classname</key><string>NSColor</string></dict>',
    '<dict><key>$classes</key><array><string>NSColorSpace</string><string>NSObject</string></array><key>$classname</key><string>NSColorSpace</string></dict>',
    '</array>',
    `<key>$top</key><dict><key>root</key>${uid(1)}</dict>`,
    '<key>$version</key><integer>100000</integer>',
    '</dict></plist>',
    '',
  ].join('\n');
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function profile(palette, id) {
  const v = palette.variants[id];
  // Terminal names an imported profile after its file, so the name matches it.
  const name = FILES[id].replace(/\.terminal$/, '');
  const data = (xml) => b64(xml).match(/.{1,68}/g).map((line) => `\t${line}`).join('\n');
  // Keys sorted, as Terminal writes them when it exports a profile.
  const entries = Object.entries(colors(v))
    .map(([k, hex]) => [k, `<data>\n${data(archiveColor(hex))}\n\t</data>`])
    .concat([
      ['ProfileCurrentVersion', '<real>2.09</real>'],
      ['name', `<string>${escape(name)}</string>`],
      ['type', '<string>Window Settings</string>'],
    ])
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<!-- ${palette.name} ${v.name} (${v.meaning}, ${v.mode}) v${palette.version}`,
    '     Generated from palette/ile-oyo.json by `npm run build`. Do not edit by hand. -->',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    '<dict>',
    ...entries.flatMap(([k, value]) => [`\t<key>${k}</key>`, `\t${value}`]),
    '</dict>',
    '</plist>',
    '',
  ].join('\n');
}

export default function terminal(palette) {
  return Object.entries(FILES).map(([id, file]) => ({ path: `${DIR}/${file}`, contents: profile(palette, id) }));
}
