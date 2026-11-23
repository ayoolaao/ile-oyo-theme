// Status roles (scripts/lib/status.mjs): every target shows error, warning,
// info and success in the same palette color, and the tinted surfaces keep
// their text readable.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPalette, contrast, MIN } from '../scripts/lib/palette.mjs';
import { STATUS, statusColors } from '../scripts/lib/status.mjs';
import { workbench } from '../scripts/targets/vscode.mjs';
import { namedColors } from '../scripts/targets/jetbrains-theme.mjs';
import { attributes } from '../scripts/targets/jetbrains.mjs';
import { colorFor } from '../scripts/targets/kate.mjs';
import typora, { FILES as TYPORA_FILES } from '../scripts/targets/typora.mjs';

const palette = loadPalette();
const NON_TEXT = 3; // WCAG 2.1 1.4.11, borders and icons

test('every status role points at a palette accent', () => {
  for (const [role, key] of Object.entries(STATUS)) {
    assert.ok(key in palette.variants.ale.palette, `${role} → ${key}`);
  }
});

for (const [id, v] of Object.entries(palette.variants)) {
  const s = statusColors(v);
  const status = (role) => v.palette[STATUS[role]];

  test(`${id}: status colors pass 4.5:1 on bg`, () => {
    for (const role of Object.keys(STATUS)) {
      assert.ok(contrast(s[role], v.palette.bg) >= MIN, role);
    }
  });

  test(`${id}: tinted status surfaces keep fg at 4.5:1 and the status color at 3:1`, () => {
    for (const role of Object.keys(STATUS)) {
      const bg = s[`${role}Bg`];
      const fg = contrast(v.palette.fg, bg);
      const mark = contrast(s[role], bg);
      assert.ok(fg >= MIN, `fg on ${role}Bg ${bg}: ${fg.toFixed(2)}`);
      assert.ok(mark >= NON_TEXT, `${role} on ${role}Bg ${bg}: ${mark.toFixed(2)}`);
    }
  });

  test(`${id}: every target uses the status roles`, () => {
    const vs = workbench(v);
    assert.equal(vs['editorError.foreground'], status('error'));
    assert.equal(vs['editorWarning.foreground'], status('warning'));
    assert.equal(vs['editorInfo.foreground'], status('info'));

    const jb = namedColors(v);
    assert.equal(jb['text-error'], status('error'));
    assert.equal(jb['text-warning'], status('warning'));
    assert.equal(jb['text-success'], status('success'));

    const icls = attributes(v);
    assert.equal(icls.ERRORS_ATTRIBUTES.EFFECT_COLOR, status('error'));
    assert.equal(icls.WARNING_ATTRIBUTES.EFFECT_COLOR, status('warning'));

    assert.equal(colorFor(v, 'Error'), status('error'));
    assert.equal(colorFor(v, 'Warning'), status('warning'));
    assert.equal(colorFor(v, 'Information'), status('info'));

    const css = typora(palette).find((f) => f.path.endsWith(TYPORA_FILES[id])).contents;
    for (const [alert, role] of [['note', 'info'], ['tip', 'success'], ['warning', 'warning'], ['caution', 'error']]) {
      assert.ok(css.includes(`.md-alert-text-${alert} { color: ${status(role)}; }`), `typora ${alert}`);
    }
  });
}
