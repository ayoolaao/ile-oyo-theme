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
- 2026-11-17: License Apache-2.0 (+ NOTICE reserving the name and icon); the
  build copies both into each package. Icon: concept D, source
  `assets/icon/icon.svg`, rendered to `themes/vscode/icon.png` by
  `npm run icon`. `.vsix` now 9 files incl. icon, LICENSE, NOTICE, no
  warnings; 22 tests pass. PR `feature/packaging` → `release/v0.1.0`.
- 2026-11-17: PR #6 merged into `release/v0.1.0`. Release check on a clean
  `npm ci`: 22 tests pass; npm dry run OK. Fixed `package:vscode` failing when
  `dist/` doesn't exist yet. PR #5 marked ready.
- 2026-11-17: **v0.1.0 released.** PR #5 merged into `main` (merge commit
  `9881615`); annotated tag `v0.1.0`; GitHub Release with the `.vsix` and both
  `.itermcolors` files (built from `main` after `npm ci`; downloaded assets
  verified by SHA-256). `main` merged back into `develop`.

- 2026-11-17: Screenshots (branch `feature/screenshots`): VS Code Alẹ́ and
  Ọ̀sán captured by `npm run screenshot:vscode` (2560×1600) and linked from
  the root and VS Code READMEs. `npm run demo:terminal` added for the iTerm2
  shots.
- 2026-11-17: Repository made public. Marketplace publisher created: ID and
  name `jazzykid`, owned by the jazzykid0629@outlook.com Microsoft account;
  manifest `publisher` changed to match. iTerm2 shots captured by
  `npm run screenshot:iterm` (after Screen Recording was allowed for VS Code)
  and linked from the iTerm2 README.

- 2026-11-17: PR #8 merged. Release branch `release/v0.1.1`: versions bumped
  to 0.1.1, VS Code README installs from the Marketplace
  (`jazzykid.ile-oyo-theme`), root README links the listing. Checked: 22 tests
  pass; `.vsix` identity `jazzykid` 0.1.1 (9 files); npm dry run 0.1.1 (9
  files); the npm name `ile-oyo-theme` is still free.

## Open questions

- Revisit the fg color (author's request, later). After any palette change,
  rerun `npm run screenshot:vscode` and retake the iTerm2 shots.

- `npm audit`: 3 moderate advisories in `glob`/`minimatch` under `@vscode/vsce`
  (dev tooling only, not shipped). Revisit when vsce updates.

## Next

1. Merge `release/v0.1.1` into `main`; tag `v0.1.1`; GitHub Release with the
   `.vsix` and `.itermcolors`; merge `main` back into `develop`.
2. Publish v0.1.1 from `main`:
   - VS Code Marketplace: publisher `jazzykid` exists (owner account
     jazzykid0629@outlook.com); `npx vsce login jazzykid` with a personal
     access token, then `npm run publish:vscode`.
   - npm: `npm login`, then `npm run publish:css` from `main`.
3. Update the release notes' "npm package coming soon" line once published.
4. v0.2 targets: see [roadmap-v0.2.md](roadmap-v0.2.md).
5. Website at `ile-oyo.jazzykid.com` (Astro on Cloudflare Pages); store on
   Shopify at akeetan.com. See [website-plan.md](website-plan.md).
