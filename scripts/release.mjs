// Builds every release file into dist/:
//
//   npm run release:dist                 (runs the tests first)
//   node scripts/release.mjs --tag v0.2.0
//
// - ile-oyo-theme-<version>.vsix   VS Code extension
// - ile-oyo-theme-<version>.tgz    npm package (themes/css)
// - Ile-Oyo-{Ale,Osan}.itermcolors iTerm2 presets
// - Ile-Oyo-{Ale,Osan}.xccolortheme Xcode themes
// - ile-oyo-firefox-<version>.zip  Firefox theme (for addons.mozilla.org)
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
for (const v of ['Ale', 'Osan']) {
  copyFileSync(join(ROOT, `themes/iterm/Ile-Oyo-${v}.itermcolors`), join(DIST, `Ile-Oyo-${v}.itermcolors`));
  copyFileSync(join(ROOT, `themes/xcode/Ile-Oyo-${v}.xccolortheme`), join(DIST, `Ile-Oyo-${v}.xccolortheme`));
}

const expected = [
  `ile-oyo-theme-${version}.vsix`,
  `ile-oyo-theme-${version}.tgz`,
  'Ile-Oyo-Ale.itermcolors',
  'Ile-Oyo-Osan.itermcolors',
  'Ile-Oyo-Ale.xccolortheme',
  'Ile-Oyo-Osan.xccolortheme',
  `ile-oyo-firefox-${version}.zip`,
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
- **Xcode**: Settings → Appearance → Themes → Choose… → Import…, then select an \`.xccolortheme\` file.
- **Firefox**: addons.mozilla.org listing coming soon. To try it now: \`about:debugging\` → This Firefox → Load Temporary Add-on… → select \`ile-oyo-firefox-${version}.zip\`.
- **CSS**: [\`npm install ile-oyo-theme\`](https://www.npmjs.com/package/ile-oyo-theme), or copy the files from \`themes/css/\`.

### SHA-256
\`\`\`
${sums}
\`\`\`
`;
writeFileSync(join(DIST, 'release-notes.md'), notes);
console.log(`dist/ ready for v${version}:\n${sums}`);
