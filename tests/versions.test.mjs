// Every published package must carry the palette's version, so a release
// can't ship one target at a different version from the others.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { changelogSection } from '../scripts/lib/changelog.mjs';
import { ROOT, loadPalette } from '../scripts/lib/palette.mjs';

const { version } = loadPalette();
const pkg = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));

for (const p of ['package.json', 'themes/vscode/package.json', 'themes/css/package.json']) {
  test(`${p} version is ${version}`, () => assert.equal(pkg(p).version, version));
}

test('CHANGELOG has a dated, non-empty entry for this version', () => {
  const log = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
  assert.ok(changelogSection(log, version).length > 0);
});

test('changelogSection returns one entry and rejects undated ones', () => {
  const log = '# Changelog\n\n## Unreleased\n\n- next\n\n## 1.2.0 (2026-01-02)\n\n- b\n\n## 1.1.0 (2026-01-01)\n\n- a\n';
  assert.equal(changelogSection(log, '1.2.0'), '- b');
  assert.equal(changelogSection(log, '1.1.0'), '- a');
  assert.throws(() => changelogSection(log, '1.3.0'), /no dated/);
});
