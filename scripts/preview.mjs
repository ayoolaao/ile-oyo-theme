// Builds a local HTML preview of the palette and opens it in the browser.
//
//   npm run preview                          current palette → preview/index.html
//   npm run preview -- --compare <file>      side by side    → preview/compare.html
//   add --no-open to skip opening the browser
//
// --compare accepts either this repo's format (variants.ale / variants.osan) or
// the earlier draft format (dark / light). Output goes to preview/, which is
// git-ignored.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const args = process.argv.slice(2);
const open = !args.includes('--no-open');
const cmpIdx = args.indexOf('--compare');
const comparePath = cmpIdx >= 0 ? args[cmpIdx + 1] : null;
if (cmpIdx >= 0 && !comparePath) {
  console.error('Usage: npm run preview -- --compare <path/to/palette.json>');
  process.exit(1);
}

const current = JSON.parse(readFileSync(resolve(root, 'palette/ile-oyo.json'), 'utf8'));

// Bring either palette format into { label, source, variants: { ale, osan } }.
function normalize(json, label, source) {
  if (json.variants) return { label, source, variants: json.variants };
  if (json.dark && json.light) {
    const names = current.variants;
    const pick = (v, id) => ({ ...names[id], palette: v.palette, ui: v.ui, ansi: v.ansi, other: v.other });
    return { label, source, variants: { ale: pick(json.dark, 'ale'), osan: pick(json.light, 'osan') } };
  }
  throw new Error(`${source}: unrecognized palette format (expected "variants" or "dark"/"light")`);
}

const palettes = [];
if (comparePath) {
  const abs = resolve(process.cwd(), comparePath);
  const other = JSON.parse(readFileSync(abs, 'utf8'));
  palettes.push(normalize(other, other.version ? `Draft ${other.version}` : 'Draft', abs));
}
palettes.push(normalize(current, `v${current.version}`, relative(process.cwd(), resolve(root, 'palette/ile-oyo.json'))));

const title = comparePath ? 'Ilé-Ọ̀yọ́ Comparison' : 'Ilé-Ọ̀yọ́ Preview';
// JSON is embedded in a <script>; escape "<" so no value can close the tag.
const data = JSON.stringify({ palettes }).replace(/</g, '\\u003c');
const html = readFileSync(resolve(root, 'scripts/preview/template.html'), 'utf8')
  .replace('__TITLE__', title)
  .replace('__DATA__', () => data);

const outDir = resolve(root, 'preview');
mkdirSync(outDir, { recursive: true });
const out = resolve(outDir, comparePath ? 'compare.html' : 'index.html');
writeFileSync(out, html);
console.log(`Wrote ${relative(process.cwd(), out)}`);

if (open) {
  const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  spawn(cmd, [out], { stdio: 'ignore', detached: true, shell: process.platform === 'win32' }).unref();
}
