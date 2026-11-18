// Checks palette/ile-oyo.json against the rules in docs/architecture.md.
// Exits non-zero if any rule fails.
import { loadPalette, validate, MIN } from './lib/palette.mjs';

const palette = loadPalette();
const errors = validate(palette);

if (errors.length) {
  console.error(`Palette check failed (${errors.length}):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`Palette check passed: ${Object.keys(palette.variants).length} variants, all text ≥ ${MIN}:1.`);
