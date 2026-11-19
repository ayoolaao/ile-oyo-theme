// Copies LICENSE and NOTICE into every package folder, so the VS Code
// extension and the npm package ship them. The root files are the source.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../lib/palette.mjs';

const PACKAGES = ['themes/vscode', 'themes/css', 'themes/firefox', 'themes/chrome/ale', 'themes/chrome/osan'];
const FILES = ['LICENSE', 'NOTICE'];

export default function legal() {
  return PACKAGES.flatMap((dir) =>
    FILES.map((f) => ({ path: `${dir}/${f}`, contents: readFileSync(join(ROOT, f), 'utf8') })),
  );
}
