// Terminal.app profiles: the color keys Terminal uses, every color decoded
// back from its archive, readable text, and (on macOS) colors that
// NSKeyedUnarchiver reads as exact sRGB.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, MIN, MIN_SELECTION, loadPalette, contrast } from '../scripts/lib/palette.mjs';
import { DIR, FILES, colors, profile } from '../scripts/targets/terminal.mjs';

const palette = loadPalette();
const MAC = process.platform === 'darwin' && existsSync('/usr/bin/osascript');

// Color keys in Terminal's bundled profiles (Terminal.app/Contents/Resources/
// Initial Settings/*.terminal), 2026-11.
const COLOR_KEYS = [
  'ANSIBlackColor', 'ANSIRedColor', 'ANSIGreenColor', 'ANSIYellowColor', 'ANSIBlueColor', 'ANSIMagentaColor',
  'ANSICyanColor', 'ANSIWhiteColor', 'ANSIBrightBlackColor', 'ANSIBrightRedColor', 'ANSIBrightGreenColor',
  'ANSIBrightYellowColor', 'ANSIBrightBlueColor', 'ANSIBrightMagentaColor', 'ANSIBrightCyanColor',
  'ANSIBrightWhiteColor', 'BackgroundColor', 'TextColor', 'TextBoldColor', 'CursorColor', 'SelectionColor',
];

// Reads <key>…</key><data>…</data> pairs from the outer plist and decodes the
// NSRGB components inside each archive.
function decode(text) {
  const out = {};
  for (const [, key, data] of text.matchAll(/<key>(\w+Color)<\/key>\s*<data>([^<]+)<\/data>/g)) {
    const archive = Buffer.from(data.replace(/\s+/g, ''), 'base64').toString('latin1');
    const rgb = archive.match(/<key>NSRGB<\/key><data>([^<]+)<\/data>/)[1];
    const comps = Buffer.from(rgb, 'base64').toString('latin1').replace(/\0$/, '').split(' ').map(Number);
    out[key] = '#' + comps.map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  return out;
}

for (const [id, file] of Object.entries(FILES)) {
  const v = palette.variants[id];
  const path = join(ROOT, DIR, file);
  const text = readFileSync(path, 'utf8');

  test(`${id}: file matches the palette`, () => {
    assert.equal(text, profile(palette, id));
    assert.match(text, new RegExp(`<key>name</key>\\s*<string>${file.replace('.terminal', '')}</string>`));
  });

  test(`${id}: all 21 Terminal colors, decoded back to the palette`, () => {
    const decoded = decode(text);
    assert.deepEqual(Object.keys(decoded).sort(), [...COLOR_KEYS].sort());
    assert.deepEqual(decoded, colors(v));
  });

  test(`${id}: text is readable and the selection stands out`, () => {
    const c = colors(v);
    assert.ok(contrast(c.TextColor, c.BackgroundColor) >= MIN);
    assert.ok(contrast(c.TextColor, c.SelectionColor) >= MIN);
    assert.ok(contrast(c.SelectionColor, c.BackgroundColor) >= MIN_SELECTION);
  });

  test(`${id}: plutil accepts it and NSKeyedUnarchiver reads exact sRGB`, { skip: !MAC && 'macOS only' }, () => {
    execFileSync('plutil', ['-lint', path]);
    const script = `
      ObjC.import('AppKit');
      function run(argv) {
        const p = $.NSDictionary.dictionaryWithContentsOfFile(argv[0]);
        const keys = ObjC.deepUnwrap(p.allKeys).filter((k) => k.endsWith('Color'));
        const out = {};
        for (const k of keys) {
          const c = $.NSKeyedUnarchiver.unarchivedObjectOfClassFromDataError($.NSColor, p.objectForKey(k), null);
          if (!c.colorSpace.isEqual($.NSColorSpace.sRGBColorSpace)) return 'not sRGB: ' + k;
          out[k] = '#' + [c.redComponent, c.greenComponent, c.blueComponent]
            .map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
        }
        return JSON.stringify(out);
      }`;
    const out = execFileSync('osascript', ['-l', 'JavaScript', '-e', script, path], { encoding: 'utf8' }).trim();
    assert.deepEqual(JSON.parse(out), colors(v));
  });
}
