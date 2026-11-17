// Renders assets/icon/icon.svg to themes/vscode/icon.png (256×256, transparent
// corners) with a locally installed Google Chrome. Run after changing the SVG:
//   npm run icon
import { existsSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT } from './lib/palette.mjs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SIZE = 256;
if (!existsSync(CHROME)) {
  console.error(`Google Chrome not found at ${CHROME}; it renders the icon.`);
  process.exit(1);
}

const svg = readFileSync(join(ROOT, 'assets/icon/icon.svg'), 'utf8');
const dir = mkdtempSync(join(tmpdir(), 'ile-oyo-icon-'));
const page = join(dir, 'icon.html');
writeFileSync(page, `<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block;width:${SIZE}px;height:${SIZE}px}</style>${svg}`);

const out = join(ROOT, 'themes/vscode/icon.png');
execFileSync(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--default-background-color=00000000', `--window-size=${SIZE},${SIZE}`,
  `--screenshot=${out}`, `file://${page}`,
], { stdio: 'ignore' });
console.log(`Wrote themes/vscode/icon.png (${SIZE}×${SIZE})`);
