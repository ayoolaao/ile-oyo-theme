// Renders assets/icon/icon.svg with a locally installed Google Chrome:
//   themes/vscode/icon.png                256×256 (VS Code Marketplace)
//   themes/chrome/{ale,osan}/icon128.png  128×128 (Chrome Web Store)
// Corners are transparent. Run after changing the SVG:
//   npm run icon
import { copyFileSync, existsSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT } from './lib/palette.mjs';
import { DIR as CHROME_DIR, ICON as CHROME_ICON, VARIANTS } from './targets/chrome.mjs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!existsSync(CHROME)) {
  console.error(`Google Chrome not found at ${CHROME}; it renders the icon.`);
  process.exit(1);
}

const svg = readFileSync(join(ROOT, 'assets/icon/icon.svg'), 'utf8');
const dir = mkdtempSync(join(tmpdir(), 'ile-oyo-icon-'));

function render(size, out) {
  const page = join(dir, `icon-${size}.html`);
  writeFileSync(page, `<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--default-background-color=00000000', `--window-size=${size},${size}`,
    `--screenshot=${out}`, `file://${page}`,
  ], { stdio: 'ignore' });
  console.log(`Wrote ${out.slice(ROOT.length)} (${size}×${size})`);
}

render(256, join(ROOT, 'themes/vscode/icon.png'));
const chromeIcon = join(ROOT, CHROME_DIR, VARIANTS[0], CHROME_ICON);
render(128, chromeIcon);
for (const id of VARIANTS.slice(1)) copyFileSync(chromeIcon, join(ROOT, CHROME_DIR, id, CHROME_ICON));
