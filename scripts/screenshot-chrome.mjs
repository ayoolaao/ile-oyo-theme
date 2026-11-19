// Takes real Chrome screenshots of both variants for the READMEs.
//
//   npm run screenshot:chrome
//
// For each variant: starts a separate Chrome with a throwaway profile (your
// own Chrome and profile aren't touched), loads a copy of themes/chrome/<variant> over
// the DevTools protocol (branded Chrome ignores --load-extension), opens the
// CSS demo page plus a New Tab, captures the window and quits that Chrome.
// The demo is served from this repo on localhost, and the page gets the
// variant's light/dark color scheme. Writes
// assets/screenshots/chrome-{ale,osan}.png. macOS only; needs Google Chrome
// in /Applications and Screen Recording permission.
import { execFileSync, spawn } from 'node:child_process';
import { cpSync, createReadStream, existsSync, mkdirSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, normalize } from 'node:path';
import { ROOT, loadPalette } from './lib/palette.mjs';
import { DIR, VARIANTS } from './targets/chrome.mjs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9334;
const HTTP_PORT = 8123;
const DEMO = `http://localhost:${HTTP_PORT}/themes/css/demo.html`;
const OUT = join(ROOT, 'assets/screenshots');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (!existsSync(CHROME)) {
  console.error(`Google Chrome not found at ${CHROME}`);
  process.exit(1);
}

// Static server for the repo (localhost only), so the address bar shows a
// short URL instead of a local file path.
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = createServer((req, res) => {
  const path = normalize(join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  if (!path.startsWith(ROOT) || !existsSync(path) || !statSync(path).isFile()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
  createReadStream(path).pipe(res);
});
await new Promise((r) => server.listen(HTTP_PORT, '127.0.0.1', r));

// Minimal DevTools client.
async function devtools(url) {
  const ws = new WebSocket(url);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    pending.get(m.id)?.(m);
    pending.delete(m.id);
  };
  const send = (method, params = {}) => new Promise((r, j) => {
    pending.set(++id, (m) => (m.error ? j(new Error(`${method}: ${m.error.message}`)) : r(m.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });
  return { ws, send };
}

async function browserUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      return (await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`)).json()).webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error('Chrome did not open its DevTools port');
}

async function shoot(id) {
  const mode = loadPalette().variants[id].mode;
  const profile = mkdtempSync(join(tmpdir(), 'ile-oyo-chrome-'));
  const chrome = spawn(CHROME, [
    `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
    `--remote-debugging-port=${DEBUG_PORT}`, '--enable-unsafe-extension-debugging',
    '--window-size=1280,800', '--window-position=40,40', 'about:blank',
  ], { stdio: 'ignore' });
  try {
    const browser = await devtools(await browserUrl());
    // Load a copy: Chrome writes a cache file into a folder it loads unpacked.
    const ext = join(profile, 'theme');
    cpSync(join(ROOT, DIR, id), ext, { recursive: true });
    await browser.send('Extensions.loadUnpacked', { path: ext });

    // The "Installed theme" bar sits on the tab that was active at install;
    // open fresh tabs and close that one.
    const { targetInfos } = await browser.send('Target.getTargets');
    const blank = targetInfos.find((t) => t.type === 'page');
    await browser.send('Target.createTarget', { url: DEMO });
    await browser.send('Target.createTarget', { url: 'chrome://newtab/' });
    await browser.send('Target.closeTarget', { targetId: blank.targetId });

    const demo = (await browser.send('Target.getTargets')).targetInfos.find((t) => t.url === DEMO);
    await browser.send('Target.activateTarget', { targetId: demo.targetId });
    const page = await devtools(`ws://127.0.0.1:${DEBUG_PORT}/devtools/page/${demo.targetId}`);
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: mode }] });
    await sleep(2500);

    const win = execFileSync('osascript', ['-l', 'JavaScript', join(ROOT, 'scripts/lib/window-id.js'), 'Google Chrome', 'CSS Demo'], { encoding: 'utf8' }).trim();
    if (!win) throw new Error('Chrome window with the demo page not found');
    const out = join(OUT, `chrome-${id}.png`);
    execFileSync('screencapture', ['-x', '-o', '-l', win, out]);
    execFileSync('sips', ['-Z', '2560', out], { stdio: 'ignore' });
    console.log(`wrote assets/screenshots/chrome-${id}.png`);
    page.ws.close();
    browser.ws.close();
  } finally {
    chrome.kill();
    await sleep(1500);
    rmSync(profile, { recursive: true, force: true });
  }
}

try {
  mkdirSync(OUT, { recursive: true });
  for (const id of VARIANTS) await shoot(id);
} finally {
  server.close();
}
