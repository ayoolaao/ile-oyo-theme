// Takes real VS Code screenshots of both variants for the READMEs.
//
//   npm run screenshot:vscode
//
// Packages themes/vscode, installs it into a throwaway VS Code profile,
// opens scripts/screenshot/sample, and captures the window over the Chrome
// DevTools protocol (no macOS screen-recording permission needed). Writes
// assets/screenshots/vscode-{ale,osan}.png. macOS only; needs VS Code in
// /Applications.
import { execFileSync, spawn } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib/palette.mjs';

const APP = '/Applications/Visual Studio Code.app';
const ELECTRON = join(APP, 'Contents/MacOS/Code');
const CLI = join(APP, 'Contents/Resources/app/bin/code');
const PORT = 9333;
const SIZE = { width: 1280, height: 800 };
const SHOTS = { ale: 'Ilé-Ọ̀yọ́ Alẹ́', osan: 'Ilé-Ọ̀yọ́ Ọ̀sán' };
const OUT = join(ROOT, 'assets/screenshots');

// VS Code's IPC socket path must stay under 104 characters, so use /tmp.
const tmp = mkdtempSync('/tmp/ile-oyo-shot-');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const settingsFile = join(tmp, 'ud/User/settings.json');
const settings = (theme) => writeFileSync(settingsFile, JSON.stringify({
  'workbench.colorTheme': theme,
  'workbench.startupEditor': 'none',
  'workbench.tips.enabled': false,
  'workbench.secondarySideBar.defaultVisibility': 'hidden',
  'workbench.layoutControl.enabled': false,
  'chat.disableAIFeatures': true,
  'chat.commandCenter.enabled': false,
  'window.commandCenter': false,
  'telemetry.telemetryLevel': 'off',
  'update.mode': 'none',
  'extensions.ignoreRecommendations': true,
  'security.workspace.trust.enabled': false,
  'git.enabled': false,
  'editor.fontSize': 14,
  'editor.lineHeight': 22,
  'editor.minimap.enabled': false,
  'editor.cursorBlinking': 'solid',
  'editor.lightbulb.enabled': 'off',
}, null, 2));

// Minimal DevTools client for the workbench page.
async function connect() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === 'page' && t.url.includes('workbench'));
      if (page) {
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
        let id = 0;
        const pending = new Map();
        ws.onmessage = (e) => {
          const m = JSON.parse(e.data);
          pending.get(m.id)?.(m);
          pending.delete(m.id);
        };
        const send = (method, params = {}) => new Promise((r) => {
          pending.set(++id, r);
          ws.send(JSON.stringify({ id, method, params }));
        });
        return { ws, send };
      }
    } catch {}
    await sleep(500);
  }
  throw new Error('VS Code did not open a debuggable workbench');
}

let code;
try {
  mkdirSync(join(tmp, 'ud/User'), { recursive: true });
  cpSync(join(ROOT, 'scripts/screenshot/sample'), join(tmp, 'ws'), { recursive: true });

  const vsix = join(tmp, 'theme.vsix');
  execFileSync(join(ROOT, 'node_modules/.bin/vsce'), ['package', '--no-dependencies', '-o', vsix],
    { cwd: join(ROOT, 'themes/vscode'), stdio: 'ignore' });
  execFileSync(CLI, ['--user-data-dir', join(tmp, 'ud'), '--extensions-dir', join(tmp, 'ext'),
    '--install-extension', vsix], { stdio: 'ignore' });

  settings(SHOTS.ale);
  const env = { ...process.env };
  delete env.ELECTRON_RUN_AS_NODE; // set when run from VS Code's terminal
  code = spawn(ELECTRON, ['--user-data-dir', join(tmp, 'ud'), '--extensions-dir', join(tmp, 'ext'),
    `--remote-debugging-port=${PORT}`, '--new-window', join(tmp, 'ws'), join(tmp, 'ws/src/loom.ts')],
    { env, stdio: 'ignore' });

  const { ws, send } = await connect();
  // Fix the layout size and pixel density so every run matches.
  await send('Emulation.setDeviceMetricsOverride', { ...SIZE, deviceScaleFactor: 2, mobile: false });
  await sleep(6000); // let the language server and highlighting settle

  mkdirSync(OUT, { recursive: true });
  for (const [id, theme] of Object.entries(SHOTS)) {
    settings(theme);
    await sleep(3000);
    const { result } = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(OUT, `vscode-${id}.png`), Buffer.from(result.data, 'base64'));
    console.log(`wrote assets/screenshots/vscode-${id}.png`);
  }
  ws.close();
} finally {
  code?.kill();
  await sleep(1000);
  rmSync(tmp, { recursive: true, force: true });
}
