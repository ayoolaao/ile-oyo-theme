// Every published package must carry the palette's version, so a release
// can't ship one target at a different version from the others.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadPalette } from '../scripts/lib/palette.mjs';

const { version } = loadPalette();
const pkg = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));

for (const p of ['package.json', 'themes/vscode/package.json', 'themes/css/package.json']) {
  test(`${p} version is ${version}`, () => assert.equal(pkg(p).version, version));
}

test('CHANGELOG has an entry for this version', () => {
  const log = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
  assert.match(log, new RegExp(`^## ${version.replace(/\./g, '\\.')} `, 'm'));
});
