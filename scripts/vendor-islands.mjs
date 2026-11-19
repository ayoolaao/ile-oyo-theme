// Snapshots the color references of JetBrains' Islands Dark and Islands Light
// themes from an installed IDE into scripts/targets/data/islands-*.json:
//
//   node scripts/vendor-islands.mjs [/Applications/WebStorm.app]
//
// The JetBrains IDE theme (scripts/targets/jetbrains-theme.mjs) builds on
// Islands. Redefining Islands' named colors isn't enough (Islands resolves its
// own references), so the theme sets every UI key whose color goes through a
// name it redefines; this snapshot says which keys those are. Rerun after an
// IDE update; tests/jetbrains-theme.test.mjs compares it with the installed
// IDE. Source: IntelliJ Platform (Apache-2.0), platform/platform-resources.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib/palette.mjs';

export const THEMES = {
  dark: 'themes/islands/ManyIslandsDark.theme.json',
  light: 'themes/islands/ManyIslandsLight.theme.json',
};
export const DATA = (mode) => join(ROOT, `scripts/targets/data/islands-${mode}.json`);

export function findResourcesJar(app) {
  const apps = app ? [app] : ['WebStorm', 'IntelliJ IDEA', 'PyCharm'].map((a) => `/Applications/${a}.app`);
  return apps.map((a) => join(a, 'Contents/lib/intellij.platform.resources.jar')).find((j) => existsSync(j));
}

const isColor = (v) => typeof v === 'string' && /^(#[0-9A-Fa-f]{6,8}|[a-z][a-z0-9-]*)$/.test(v) && !v.includes('/');

/** { colors, ui } with ui flattened to dotted keys, color-valued entries only. */
export function extract(jar, mode) {
  const theme = JSON.parse(execFileSync('unzip', ['-p', jar, THEMES[mode]], { encoding: 'utf8', maxBuffer: 1 << 24 }));
  const ui = {};
  const walk = (obj, prefix) => {
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, key);
      else if (isColor(v) && (v.startsWith('#') || v in theme.colors)) ui[key] = v;
    }
  };
  walk(theme.ui, '');
  return { name: theme.name, parentTheme: theme.parentTheme, colors: theme.colors, ui };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const jar = findResourcesJar(process.argv[2]);
  if (!jar) {
    console.error('No JetBrains IDE found; pass its .app path.');
    process.exit(1);
  }
  mkdirSync(join(ROOT, 'scripts/targets/data'), { recursive: true });
  for (const mode of Object.keys(THEMES)) {
    const data = extract(jar, mode);
    writeFileSync(DATA(mode), JSON.stringify({ _source: `${jar} ${THEMES[mode]} (IntelliJ Platform, Apache-2.0)`.replace(/^\/Applications\//, ''), ...data }, null, 1) + '\n');
    console.log(`islands-${mode}.json: ${Object.keys(data.colors).length} colors, ${Object.keys(data.ui).length} UI keys`);
  }
}
