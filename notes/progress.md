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
  the right variant. Branch `feature/css`.

## Open questions

- Sass compile and `.d.ts` type-check not run yet: needs `sass` and
  `typescript` (blocked one-off `npx` download). Add as devDependencies?

## Next

1. Review CSS, open PR for `feature/css`.
2. VS Code extension (reuse the syntax roles).
