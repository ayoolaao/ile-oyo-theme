// Builds every target from palette/ile-oyo.json.
//
//   npm run build              validate the palette, then write all target files
//   npm run build -- --check   fail if any committed file differs from what the build would write
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ROOT, loadPalette, validate } from './lib/palette.mjs';
import iterm from './targets/iterm.mjs';
import css from './targets/css.mjs';
import vscode from './targets/vscode.mjs';
import xcode from './targets/xcode.mjs';
import firefox from './targets/firefox.mjs';
import chrome from './targets/chrome.mjs';
import kate from './targets/kate.mjs';
import legal from './targets/legal.mjs';

const TARGETS = { iterm, css, vscode, xcode, firefox, chrome, kate, legal };
const checkOnly = process.argv.includes('--check');

const palette = loadPalette();
const errors = validate(palette);
if (errors.length) {
  console.error(`Palette check failed (${errors.length}); nothing built:`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

let stale = 0;
for (const [name, build] of Object.entries(TARGETS)) {
  for (const { path, contents } of build(palette)) {
    const abs = join(ROOT, path);
    const current = existsSync(abs) ? readFileSync(abs, 'utf8') : null;
    if (checkOnly) {
      if (current !== contents) {
        console.error(`  ✗ ${path} is out of date`);
        stale++;
      }
      continue;
    }
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, contents);
    console.log(`  ${current === contents ? '=' : '✓'} ${path}  (${name})`);
  }
}

if (checkOnly) {
  if (stale) {
    console.error(`${stale} generated file(s) out of date. Run \`npm run build\`.`);
    process.exit(1);
  }
  console.log('Generated files are up to date.');
}
