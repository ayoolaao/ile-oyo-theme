# Decisions

Append new entries at the bottom. Don't rewrite old ones; add a new entry that
supersedes them.

## 2026-11-16: Variant names
Dark is **Alẹ́** (evening), light is **Ọ̀sán** (afternoon). Mirrors Dracula /
Alucard pairing, but with Yoruba names.

## 2026-11-16: One repo, generated targets
Dracula keeps ~400 submodules, each with hand-copied hex values. With three
targets and one maintainer, a single palette file plus generators is simpler and
keeps the ports from drifting apart.

## 2026-11-16: Node.js for the build
VS Code packaging (`vsce`) and the CSS npm package both expect Node, so the
build scripts are JS too.

## 2026-11-16: Accessibility floor
WCAG 2.1 AA (4.5:1) for all text colors against bg, enforced by the build. See
[spec.md](spec.md#rules).

## 2026-11-16: Meaning of the name
Ilé-Ọ̀yọ́ means "home of Ọ̀yọ́" (the historic Yoruba city and empire). The
"House of Beauty" gloss from the draft palette is retired. The README
description names the palette's sources: adire indigo, cotton cream, camwood
and coral reds, aṣọ-òkè gold, and clay.

## 2026-11-16: Palette sources are Ọ̀yọ́-specific
Supersedes the source list in "Meaning of the name". Adire is associated with
Abẹ́òkúta, not Ọ̀yọ́, so it is dropped. The palette is grounded in aṣọ-òkè
(aṣọ òfì), the cloth of Ọ̀yọ́'s agbádá and ìró àti bùbá: ẹtù (indigo), sányán
(beige), àlàárì (crimson), plus coral beads, gold thread, and clay.

## 2026-11-16: Spelling of the name
The name is **Ilé-Ọ̀yọ́**, with the low tone on the first Ọ, matching the city
(Ọ̀yọ́, Ọ̀yọ́ State). Earlier text spelled it "Ilé-Ọyọ́"; all files were
updated. ASCII identifiers (repo, package and file names) stay `ile-oyo`.

## 2026-11-16: Palette stays as close to the draft as accessibility allows
The from-scratch OKLCH redesign was replaced. Draft colors that pass are kept
exactly; failing ones keep hue and chroma and change only lightness, to 4.6:1.
Duplicates (blue = bg/fg, pink = red) were resolved with the nearest distinct
color. Details in palette-review.md.

## 2026-11-16: Alẹ́ text color
Alẹ́ fg is the warmer sányán `#F4E6CE` (11.4:1 on `#1A2B4C`) instead of the
draft's `#F5F5DC`, by preference. ANSI 7 matches it.

## 2026-11-16: Previews stay local
Previews are built as local files (`npm run preview`) and opened in the
browser. Nothing is published to the web unless explicitly asked.

## 2026-11-16: Warm Ọ̀sán, stronger selection
Ọ̀sán bg is `#F4E6CE`, the same sányán as Alẹ́ fg, with its beige UI tones
warmed to match. Selection must reach 1.5:1 against bg (checked); both
variants now sit near 1.55. The closest accent pairs (Alẹ́ comment/cyan,
red/pink) are accepted for now.

## 2026-11-16: Build pipeline and iTerm2 output
- One generator per app in `scripts/targets/`, run by `npm run build` after the
  palette passes validation. Shared rules live in `scripts/lib/palette.mjs`.
- Generated theme files are committed (users download them), guarded by
  `npm run build -- --check`.
- iTerm2 presets use ASCII filenames (`Ile-Oyo-Ale`, `Ile-Oyo-Osan`) to avoid
  Unicode filename problems across tools; colors use the sRGB color space.

## 2026-11-16: CSS scope and structure
Scope is color tokens plus code highlighting (options 1 and 2); no base page
styles, typography or forms. Variables use the `--ile-` prefix; variants switch
by `prefers-color-scheme` and the `data-ile-theme="ale" | "osan"` attribute,
which also works on a single element. Highlighting reads only the variables,
so it follows the active variant. Syntax roles (which color each code token
uses) are defined once and shared with later targets.

## 2026-11-16: Dev dependencies for tests
`sass` (1.83.0) and `typescript` (5.6.3) are pinned dev dependencies so
`npm test` can compile the Sass output and type-check the `.d.ts`. The build
stays dependency-free. npm skips `@parcel/watcher`'s install script (sass watch
mode only); not needed here.

## 2026-11-16: VS Code theme design
- Workbench surfaces step from `ui.bg_darker` (title/activity/status bars) to
  `ui.bg_dark` (side bar, panels) to `bg` (editor); widgets use `ui.bg_light`.
- Àlàárì red is the brand accent (active borders, badges, progress); blue is
  for buttons and links, so red doesn't read as "destructive" on every button.
- New palette color `ui.muted` for secondary UI text, required to pass 4.5:1 on
  every surface. Ọ̀sán's comment color failed on the darker panels (as low as
  3.96:1); Alẹ́'s comment already passed, so its `ui.muted` equals `comment`.
- Not yet: packaging and Marketplace publishing (needs a publisher account).
