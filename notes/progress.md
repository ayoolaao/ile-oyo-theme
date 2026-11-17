# Progress

## Done

- 2026-11-16: Analyzed Dracula's architecture ([dracula-analysis.md](dracula-analysis.md)).
- 2026-11-16: Picked variant names: Alẹ́ (dark), Ọ̀sán (light).
- 2026-11-16: Repo initialized with README; notes/ created.
- 2026-11-16: Reviewed draft palette ([palette-review.md](palette-review.md)).
- 2026-11-16: Name settled as Ilé-Ọ̀yọ́ ("home of Ọ̀yọ́"); palette sources are Ọ̀yọ́ aṣọ-òkè.
- 2026-11-16: Palette v0.1.0 in `palette/ile-oyo.json`; contrast check added
  (`npm run check`). Branch `feature/palette-revision`, PR #1 into `develop`.
- 2026-11-16: Local preview added (`npm run preview`, `--compare` for side by side).
- 2026-11-16: Palette rebased on the author's draft with minimal changes
  (replaces the from-scratch OKLCH design). Alẹ́ fg switched to `#F4E6CE`.
- 2026-11-16: Ọ̀sán bg warmed to `#F4E6CE`; selection strengthened to ~1.55:1
  in both variants and added to `npm run check`.
- 2026-11-16: PR #1 merged into `develop`.
- 2026-11-16: Build pipeline (`npm run build`, `--check`) and iTerm2 target:
  `themes/iterm/Ile-Oyo-{Ale,Osan}.itermcolors`. Validated with `plutil` and a
  round-trip check (every color reads back as the palette hex). Reviewed in
  iTerm2. Branch `feature/iterm`, PR #2 into `develop`.
- 2026-11-16: PR #2 merged into `develop`.
- 2026-11-16: CSS target (variables, highlighting for Prism/highlight.js/Shiki,
  Sass, JS/TS tokens) and `themes/css/demo.html`. Verified: JS tokens match the
  palette; in headless Chrome all 50 checked highlight colors match in both
  variants, the scoped `data-ile-theme` box works, and system light/dark picks
  the right variant. Demo reviewed. Branch `feature/css`, PR #3 into `develop`.
- 2026-11-16: `npm test` added: palette check, build check, JS token tests,
  Sass compile, TypeScript type-check (sass and typescript as dev dependencies).
  Each check was confirmed to fail when its file is broken.
- 2026-11-16: PR #3 merged into `develop`.
- 2026-11-16: VS Code target: extension in `themes/vscode/` with Alẹ́ and Ọ̀sán
  themes (257 UI colors, TextMate + semantic code colors). Syntax roles moved
  to `scripts/lib/syntax.mjs`. Added `ui.muted` to the palette after the tests
  found Ọ̀sán's secondary UI text at 3.96–4.26:1. `tests/vscode.test.mjs`: 16
  tests pass. Smoke-tested in VS Code. Branch `feature/vscode`, PR #4 into `develop`.
- 2026-11-16: PR #4 merged into `develop`.
- 2026-11-16: Release v0.1.0 prepared on `release/v0.1.0` (CHANGELOG); draft PR
  into `main` (#5), waiting on the license choice. v0.2 roadmap and website
  plan written.
- 2026-11-16: Icon concepts A–D drawn (`preview/icons.html`, local only).
- 2026-11-16: Packaging on `feature/packaging`: `@vscode/vsce` added;
  `npm run package:vscode` builds a 9 KB `.vsix` with no warnings (license
  skipped until chosen). npm package `ile-oyo-theme` in `themes/css`:
  `npm pack`/`npm publish --dry-run` pass; installing the tarball in a scratch
  project resolves the JS import, `/css`, `/highlight.css`, `/scss`, and the
  types (nodenext and bundler). Version-consistency tests added; 20 tests pass.

## Open questions

- License (README currently says "MIT (to be added)").
- VS Code extension icon: pick a concept (A–D).
- `npm audit`: 3 moderate advisories in `glob`/`minimatch` under `@vscode/vsce`
  (dev tooling only, not shipped). Revisit when vsce updates.

## Next

1. v0.1.0: add LICENSE, merge `release/v0.1.0` into `main`, tag `v0.1.0`,
   merge `main` back into `develop`.
2. VS Code Marketplace: add the chosen icon and LICENSE; author creates the
   publisher `ayoolaao` and runs `npm run publish:vscode`.
3. npm: add LICENSE; author runs `npm run publish:css`.
4. v0.2 targets: see [roadmap-v0.2.md](roadmap-v0.2.md).
5. Website: see [website-plan.md](website-plan.md).
