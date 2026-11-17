# Dracula analysis

Reference clone: `/Users/ayoolaao/WorkSpace/dev/dracula-theme`. Analyzed 2026-11-16.

## Main repo

Holds almost no code: a README with the palette tables, the WCAG note, and about
400 git submodules (`themes/<app>`), one repo per app with its own maintainer.
No shared color source; each port copies hex values by hand.

## Visual Studio Code (`themes/visual-studio-code`)

- `src/dracula.yml` (~1,100 lines): colors defined once as YAML anchors
  (`&BG`, `&PINK`, …) in a `dracula:` block, then referenced in `colors:` (UI)
  and `tokenColors:` (syntax). A custom `!alpha` YAML tag appends alpha to a hex.
- `scripts/generate.js` loads the YAML, drops empty entries, and builds a
  **Soft** variant by desaturating bright colors 20% (tinycolor2).
- `scripts/build.js` writes `theme/dracula.json` and `theme/dracula-soft.json`.
- `package.json` `contributes.themes` lists both; `vsce` packages the extension.

**Borrow:** YAML with anchors for the mapping, generated JSON, variants
derived in code.

## CSS (`themes/dracula-css`)

- Sass partials (`_variables.scss`, `_variables-light.scss`, `_base.scss`,
  `_code.scss`, `_syntax-highlighting.scss`, …) imported by `dracula.scss`.
- Variables marked `!default` so users can override them; emitted as CSS custom
  properties.
- Two color groups: a bright **syntax palette** and a separate **functional**
  set (error / warning / success / info / focus) for UI states only.
- Outputs: `dracula.css`, `dracula.min.css`, `dracula-variables.css`, and ESM
  TS tokens (`src/js/tokens.ts`).
- Jest tests check build output and WCAG contrast.

**Borrow:** variables-only output, TS tokens, contrast tests, functional-color
split.

## iTerm2 (`themes/iterm`)

A hand-written `Dracula.itermcolors` property list: ANSI 0–15, plus background,
foreground, bold, cursor, cursor text, selection, and selected-text colors, each
as float RGB components.

**Borrow:** the key set. We generate the file instead of writing it by hand.
