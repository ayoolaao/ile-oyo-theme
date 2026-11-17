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

## Open questions

- Warm Ọ̀sán bg (`#F5F5DC` → e.g. `#F9EFDA`) to match the warmer Alẹ́ fg?
- Strengthen selection (draft values: 1.26 Alẹ́, 1.16 Ọ̀sán)?
- Alẹ́ comment/cyan and red/pink are the closest pairs; check in real code.

## Next

1. Merge PR #1 into `develop`.
2. Build script: palette → targets.
3. iTerm2 generator.
4. CSS generator.
5. VS Code extension.
