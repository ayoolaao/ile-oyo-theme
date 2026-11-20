// Takes real Arcane screenshots of both variants for the READMEs.
//
//   npm run screenshot:arcane
//
// Starts a throwaway Arcane in Docker (pinned image, its own data volume,
// listening on localhost only), logs in as the generated admin, imports
// themes/arcane/ile-oyo.json the way Arcane's importer saves it (so Arcane's
// own validation runs on it), and captures the dashboard in dark mode (Alẹ́)
// and light mode (Ọ̀sán) with headless Chrome and a throwaway profile. The
// container and volume are removed afterwards. Writes
// assets/screenshots/arcane-{ale,osan}.png. Needs Docker running and Google
// Chrome in /Applications.
//
// Arcane needs the Docker socket to start, so it can see (and the dashboard
// shows) this machine's containers and images.
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { ROOT } from './lib/palette.mjs';
import { DIR, FILE } from './targets/arcane.mjs';

const IMAGE = 'getarcaneapp/manager:v3.1.1';
const NAME = 'ile-oyo-arcane-screenshot';
const PORT = 3553;
const BASE = `http://127.0.0.1:${PORT}`;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9336;
const OUT = join(ROOT, 'assets/screenshots');
const SHOTS = [
  { id: 'ale', mode: 'dark' },
  { id: 'osan', mode: 'light' },
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const docker = (...args) => execFileSync('docker', args, { encoding: 'utf8' }).trim();

if (!existsSync(CHROME)) {
  console.error(`Google Chrome not found at ${CHROME}`);
  process.exit(1);
}

const theme = JSON.parse(readFileSync(join(ROOT, DIR, FILE), 'utf8'));
const profile = mkdtempSync(join(tmpdir(), 'ile-oyo-arcane-chrome-'));
let chrome;

function cleanup() {
  chrome?.kill();
  try { docker('rm', '-f', NAME); } catch {}
  try { docker('volume', 'rm', '-f', NAME); } catch {}
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}

try {
  cleanup();
  docker('run', '-d', '--name', NAME, '-p', `127.0.0.1:${PORT}:3552`,
    '-v', '/var/run/docker.sock:/var/run/docker.sock', '-v', `${NAME}:/app/data`,
    '-e', `ARCANE_ENCRYPTION_KEY=${randomBytes(16).toString('hex')}`, '-e', 'TZ=UTC', IMAGE);

  // The first start writes a generated admin password into the data volume.
  let password;
  for (let i = 0; i < 60 && !password; i++) {
    await sleep(1000);
    try {
      // The image has no shell or cat; `docker cp … -` streams a tar archive,
      // with a 512-byte header (size in octal at offset 124) before the file.
      const tar = execFileSync('docker', ['cp', `${NAME}:/app/data/initial-admin-password`, '-'], { stdio: ['ignore', 'pipe', 'ignore'] });
      const size = parseInt(tar.subarray(124, 136).toString().replace(/\0.*$/, '').trim(), 8);
      password = tar.subarray(512, 512 + size).toString('utf8').trim();
    } catch {}
  }
  if (!password) throw new Error('Arcane did not start (no initial admin password after 60 s)');

  let cookies = [];
  const api = async (method, path, body) => {
    const r = await fetch(BASE + '/api' + path, {
      method,
      headers: { 'content-type': 'application/json', cookie: cookies.map(([k, v]) => `${k}=${v}`).join('; ') },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`${method} ${path}: ${r.status} ${await r.text()}`);
    const set = r.headers.getSetCookie().map((c) => c.split(';')[0].split('='));
    if (set.length) cookies = set;
  };
  for (let i = 0; i < 30; i++) {
    try { await api('POST', '/auth/login', { username: 'arcane', password }); break; } catch (e) {
      if (i === 29) throw e;
      await sleep(1000);
    }
  }
  // Skip the first-login password prompt; the volume is deleted afterwards.
  await api('POST', '/auth/password', { currentPassword: password, newPassword: `Aa1!-${randomBytes(12).toString('hex')}` });

  chrome = spawn(CHROME, [
    '--headless=new', `--user-data-dir=${profile}`, `--remote-debugging-port=${DEBUG_PORT}`,
    '--no-first-run', '--hide-scrollbars', 'about:blank',
  ], { stdio: 'ignore' });
  let wsUrl;
  for (let i = 0; i < 50 && !wsUrl; i++) {
    await sleep(200);
    wsUrl = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`).then((r) => r.json())
      .then((list) => list.find((t) => t.type === 'page')?.webSocketDebuggerUrl).catch(() => null);
  }
  const ws = new WebSocket(wsUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); pending.get(m.id)?.(m); pending.delete(m.id); };
  const send = (method, params = {}) => new Promise((r, j) => {
    pending.set(++id, (m) => (m.error ? j(new Error(`${method}: ${m.error.message}`)) : r(m.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  for (const [name, value] of cookies) await send('Network.setCookie', { name, value, url: BASE });

  for (const { id: variant, mode } of SHOTS) {
    await api('PATCH', '/auth/me/profile', {
      preferences: { customThemes: [theme], applicationTheme: theme.id, themeMode: mode, backdrop: 'none' },
    });
    // Arcane caches the last appearance in localStorage; start clean each time.
    await send('Runtime.evaluate', { expression: 'try { localStorage.clear() } catch {}' });
    await send('Page.navigate', { url: `${BASE}/dashboard` });
    await sleep(5000); // dashboard widgets load their stats after the page
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const file = join(OUT, `arcane-${variant}.png`);
    writeFileSync(file, Buffer.from(data, 'base64'));
    console.log(`  ✓ ${file.slice(ROOT.length)}`);
  }
  ws.close();
} finally {
  cleanup();
}
