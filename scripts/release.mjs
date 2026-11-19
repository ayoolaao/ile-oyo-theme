// Builds every release file into dist/:
//
//   npm run release:dist                 (runs the tests first)
//   node scripts/release.mjs --tag v0.2.0
//
// - ile-oyo-theme-<version>.vsix   VS Code extension
// - ile-oyo-theme-<version>.tgz    npm package (themes/css)
// - Ile-Oyo-{Ale,Osan}.itermcolors iTerm2 presets
// - Ile-Oyo-{Ale,Osan}.terminal   Terminal.app profiles
// - Ile-Oyo-{Ale,Osan}.icls       JetBrains editor color schemes
// - Ile-Oyo-{Ale,Osan}.xccolortheme Xcode themes
// - ile-oyo-firefox-<version>.zip  Firefox theme (for addons.mozilla.org)
// - ile-oyo-chrome-{ale,osan}-<version>.zip  Chrome themes (Chrome Web Store)
// - ile-oyo-{ale,osan}.theme      Kate themes
// - ile-oyo-{ale,osan}.css        Typora themes
// - ile-oyo-{ale,osan}.zsh, .ini  Zsh highlighting (zsh-syntax-highlighting, fast-syntax-highlighting)
// - release-notes.md               CHANGELOG section, install lines, SHA-256
//
// With --tag, fails unless the tag is v<palette version>. The release
// workflow publishes exactly these files, so what CI built and tested is what
// ships.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { changelogSection } from './lib/changelog.mjs';
import { ROOT, loadPalette } from './lib/palette.mjs';

const DIST = join(ROOT, 'dist');
const { version } = loadPalette();

const tagIndex = process.argv.indexOf('--tag');
if (tagIndex !== -1) {
  const tag = process.argv[tagIndex + 1];
  if (tag !== `v${version}`) {
    console.error(`Tag ${tag} doesn't match the palette version ${version} (expected v${version}).`);
    process.exit(1);
  }
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: ['ignore', 'ignore', 'inherit'] });
run(join(ROOT, 'node_modules/.bin/vsce'), ['package', '--no-dependencies', '-o', DIST], join(ROOT, 'themes/vscode'));
run('npm', ['pack', '--silent', '--pack-destination', DIST], join(ROOT, 'themes/css'));
run(join(ROOT, 'node_modules/.bin/web-ext'), [
  'build', '--source-dir', join(ROOT, 'themes/firefox'), '--artifacts-dir', DIST,
  '--filename', `ile-oyo-firefox-${version}.zip`, '--overwrite-dest',
], ROOT);
for (const id of ['ale', 'osan']) {
  // Named files only (Chrome caches a .pak in a folder it loads unpacked); -X
  // leaves out macOS file attributes.
  run('zip', ['-q', '-X', join(DIST, `ile-oyo-chrome-${id}-${version}.zip`), 'manifest.json', 'icon128.png', 'LICENSE', 'NOTICE'],
    join(ROOT, 'themes/chrome', id));
}
for (const v of ['Ale', 'Osan']) {
  copyFileSync(join(ROOT, `themes/iterm/Ile-Oyo-${v}.itermcolors`), join(DIST, `Ile-Oyo-${v}.itermcolors`));
  copyFileSync(join(ROOT, `themes/xcode/Ile-Oyo-${v}.xccolortheme`), join(DIST, `Ile-Oyo-${v}.xccolortheme`));
  copyFileSync(join(ROOT, `themes/terminal/Ile-Oyo-${v}.terminal`), join(DIST, `Ile-Oyo-${v}.terminal`));
  copyFileSync(join(ROOT, `themes/jetbrains/Ile-Oyo-${v}.icls`), join(DIST, `Ile-Oyo-${v}.icls`));
}
for (const f of ['ile-oyo-ale.theme', 'ile-oyo-osan.theme']) copyFileSync(join(ROOT, 'themes/kate', f), join(DIST, f));
for (const f of ['ile-oyo-ale.css', 'ile-oyo-osan.css']) copyFileSync(join(ROOT, 'themes/typora', f), join(DIST, f));
for (const id of ['ale', 'osan']) {
  copyFileSync(join(ROOT, `themes/zsh/ile-oyo-${id}.zsh`), join(DIST, `ile-oyo-${id}.zsh`));
  copyFileSync(join(ROOT, `themes/zsh/fast-syntax-highlighting/ile-oyo-${id}.ini`), join(DIST, `ile-oyo-${id}.ini`));
}

const expected = [
  `ile-oyo-theme-${version}.vsix`,
  `ile-oyo-theme-${version}.tgz`,
  'Ile-Oyo-Ale.itermcolors',
  'Ile-Oyo-Osan.itermcolors',
  'Ile-Oyo-Ale.terminal',
  'Ile-Oyo-Osan.terminal',
  'Ile-Oyo-Ale.icls',
  'Ile-Oyo-Osan.icls',
  'Ile-Oyo-Ale.xccolortheme',
  'Ile-Oyo-Osan.xccolortheme',
  `ile-oyo-firefox-${version}.zip`,
  `ile-oyo-chrome-ale-${version}.zip`,
  `ile-oyo-chrome-osan-${version}.zip`,
  'ile-oyo-ale.theme',
  'ile-oyo-osan.theme',
  'ile-oyo-ale.css',
  'ile-oyo-osan.css',
  'ile-oyo-ale.zsh',
  'ile-oyo-osan.zsh',
  'ile-oyo-ale.ini',
  'ile-oyo-osan.ini',
];
const found = readdirSync(DIST).sort();
if (JSON.stringify(found) !== JSON.stringify([...expected].sort())) {
  throw new Error(`dist/ has ${found.join(', ')}; expected ${expected.join(', ')}`);
}

const sums = expected
  .map((f) => `${createHash('sha256').update(readFileSync(join(DIST, f))).digest('hex')}  ${f}`)
  .join('\n');

const notes = `${changelogSection(readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8'), version)}

### Install
- **VS Code**: [Marketplace](https://marketplace.visualstudio.com/items?itemName=jazzykid.ile-oyo-theme) (\`code --install-extension jazzykid.ile-oyo-theme\`), or \`code --install-extension ile-oyo-theme-${version}.vsix\`.
  Then pick **Ilé-Ọ̀yọ́ Alẹ́** or **Ilé-Ọ̀yọ́ Ọ̀sán** under Preferences: Color Theme.
- **iTerm2**: double-click an \`.itermcolors\` file, or iTerm2 → Settings → Profiles → Colors → Color Presets → Import.
- **Terminal.app**: double-click an \`.terminal\` file (or Terminal → Settings → Profiles → … → Import…).
- **Xcode**: Settings → Appearance → Themes → Choose… → Import…, then select an \`.xccolortheme\` file.
- **Firefox**: addons.mozilla.org listing coming soon. To try it now: \`about:debugging\` → This Firefox → Load Temporary Add-on… → select \`ile-oyo-firefox-${version}.zip\`.
- **Chrome** (and other Chromium browsers): Chrome Web Store listing coming soon. To try it now: unzip \`ile-oyo-chrome-ale-${version}.zip\` (dark) or \`ile-oyo-chrome-osan-${version}.zip\` (light), open \`chrome://extensions\`, turn on Developer mode, click Load unpacked and select the unzipped folder.
- **JetBrains IDEs** (IntelliJ IDEA, PyCharm, WebStorm, …): Settings → Editor → Color Scheme → ⚙ → Import Scheme…, then select an \`.icls\` file.
- **Kate** (and KWrite, KDevelop): Settings → Configure Kate… (macOS: Kate → Settings…) → Color Themes → Import…, then select an \`ile-oyo-*.theme\` file.
- **Typora**: Settings → Appearance → Open Theme Folder, copy \`ile-oyo-ale.css\` / \`ile-oyo-osan.css\` there, restart Typora and pick Ile Oyo Ale or Ile Oyo Osan from the Themes menu.
- **Zsh**: with zsh-syntax-highlighting, add \`source /path/to/ile-oyo-ale.zsh\` (or \`ile-oyo-osan.zsh\`) to \`~/.zshrc\` after the plugin; it also colors zsh-autosuggestions. With fast-syntax-highlighting, run \`fast-theme /path/to/ile-oyo-ale.ini\` once.
- **CSS**: [\`npm install ile-oyo-theme\`](https://www.npmjs.com/package/ile-oyo-theme), or copy the files from \`themes/css/\`.

### SHA-256
\`\`\`
${sums}
\`\`\`
`;
writeFileSync(join(DIST, 'release-notes.md'), notes);
console.log(`dist/ ready for v${version}:\n${sums}`);
