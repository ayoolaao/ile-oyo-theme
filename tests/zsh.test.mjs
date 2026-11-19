// Zsh: every style both highlighters read, colors from the palette, readable
// text, and files that zsh (and fast-theme, when installed) accept.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT, MIN, loadPalette, contrast } from '../scripts/lib/palette.mjs';
import { FSH_STYLES, VARIANTS, ZSH_STYLES, ini, iniFile, zsh, zshFile } from '../scripts/targets/zsh.mjs';

const palette = loadPalette();

// zsh-syntax-highlighting docs/highlighters/main.md, 2026-11.
const ZSH_KEYS = [
  'unknown-token', 'reserved-word', 'alias', 'suffix-alias', 'global-alias', 'builtin', 'function', 'command',
  'precommand', 'commandseparator', 'hashed-command', 'autodirectory', 'path', 'path_pathseparator', 'path_prefix',
  'path_prefix_pathseparator', 'globbing', 'history-expansion', 'command-substitution',
  'command-substitution-unquoted', 'command-substitution-quoted', 'command-substitution-delimiter',
  'command-substitution-delimiter-unquoted', 'command-substitution-delimiter-quoted', 'process-substitution',
  'process-substitution-delimiter', 'arithmetic-expansion', 'single-hyphen-option', 'double-hyphen-option',
  'back-quoted-argument', 'back-quoted-argument-unclosed', 'back-quoted-argument-delimiter',
  'single-quoted-argument', 'single-quoted-argument-unclosed', 'double-quoted-argument',
  'double-quoted-argument-unclosed', 'dollar-quoted-argument', 'dollar-quoted-argument-unclosed', 'rc-quote',
  'dollar-double-quoted-argument', 'back-double-quoted-argument', 'back-dollar-quoted-argument', 'assign',
  'redirection', 'comment', 'named-fd', 'numeric-fd', 'arg0', 'default',
];

// The 61 styles in fast-theme's `order` (fast-syntax-highlighting), by the
// ini key each is read from (2026-11).
const FSH_KEYS = [
  'default', 'unknown-token', 'reserved-word', 'alias', 'suffix-alias', 'builtin', 'function', 'command',
  'precommand', 'commandseparator', 'hashed-command', 'path', 'pathseparator', 'globbing', 'globbing-ext',
  'history-expansion', 'single-hyphen-option', 'double-hyphen-option', 'back-quoted-argument',
  'single-quoted-argument', 'double-quoted-argument', 'dollar-quoted-argument',
  'back-or-dollar-double-quoted-argument', 'back-dollar-quoted-argument', 'assign', 'redirection', 'comment',
  'variable', 'mathvar', 'mathnum', 'matherr', 'assign-array-bracket', 'forvar', 'fornum', 'foroper', 'forsep',
  'exec-descriptor', 'here-string-tri', 'here-string-text', 'here-string-var', 'secondary', 'case-input',
  'case-parentheses', 'case-condition', 'correct-subtle', 'incorrect-subtle', 'subtle-separator', 'subtle-bg',
  'path-to-dir', 'paired-bracket', 'bracket-level-1', 'bracket-level-2', 'bracket-level-3', 'global-alias',
  'subcommand', 'single-sq-bracket', 'double-sq-bracket', 'double-paren', 'optarg-string', 'optarg-number',
  'recursive-base',
];

const has = (cmd) => {
  try {
    execFileSync('sh', ['-c', `command -v ${cmd}`], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};
const ZSH = has('zsh');
const FSH = [process.env.FSH_DIR, join(homedir(), '.zsh/plugins/fast-syntax-highlighting'),
  '/opt/homebrew/share/zsh-fast-syntax-highlighting'].find((d) => d && existsSync(join(d, 'fast-theme')));

test('every style both highlighters read, nothing else', () => {
  assert.deepEqual(Object.keys(ZSH_STYLES).sort(), [...ZSH_KEYS].sort());
  const fsh = Object.values(FSH_STYLES).flatMap((s) => Object.keys(s));
  assert.equal(new Set(fsh).size, fsh.length, 'duplicate fast-syntax-highlighting key');
  assert.deepEqual(fsh.sort(), [...FSH_KEYS].sort());
});

for (const id of VARIANTS) {
  const v = palette.variants[id];
  const zshText = readFileSync(join(ROOT, zshFile(id)), 'utf8');
  const iniText = readFileSync(join(ROOT, iniFile(id)), 'utf8');

  test(`${id}: files match the palette`, () => {
    assert.equal(zshText, zsh(palette, id));
    assert.equal(iniText, ini(palette, id));
  });

  test(`${id}: every color is a palette color; text reaches ${MIN}:1 on the background`, () => {
    const accents = new Set(Object.values(v.palette));
    for (const [, kind, hex] of (zshText + iniText).matchAll(/(fg=|bg=|bg:|= |,)?(#[0-9A-F]{6})\b/g)) {
      assert.ok(accents.has(hex), `${hex} is not a palette color`);
      if (kind !== 'bg=' && kind !== 'bg:') {
        assert.ok(contrast(hex, v.palette.bg) >= MIN, `${hex} on ${v.palette.bg} is below ${MIN}:1`);
      }
    }
  });

  test(`${id}: zsh parses and loads the .zsh file`, { skip: !ZSH && 'zsh not installed' }, () => {
    const file = join(ROOT, zshFile(id));
    execFileSync('zsh', ['-n', file]);
    const out = execFileSync('zsh', ['-f', '-c', `source ${JSON.stringify(file)} && print -r -- \${#ZSH_HIGHLIGHT_STYLES} \$ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE`], { encoding: 'utf8' }).trim();
    assert.equal(out, `${ZSH_KEYS.length} fg=${v.palette.comment}`);
  });

  test(`${id}: fast-theme loads the .ini with no missing or unparsed styles`,
    { skip: !(ZSH && FSH) && 'zsh or fast-syntax-highlighting not installed' }, () => {
      // A throwaway work dir, so the user's active fast-syntax-highlighting theme isn't changed.
      const work = mkdtempSync(join(tmpdir(), 'ile-oyo-fsh-'));
      try {
        const out = execFileSync('zsh', ['-f', '-c',
          `source ${JSON.stringify(join(FSH, 'fast-syntax-highlighting.plugin.zsh'))} && fast-theme -v ${JSON.stringify(join(ROOT, iniFile(id)))}`],
          { encoding: 'utf8', env: { ...process.env, FAST_WORK_DIR: work } });
        assert.doesNotMatch(out, /Missing style|fallback|cannot parse/i, out);
      } finally {
        rmSync(work, { recursive: true, force: true });
      }
    });
}
