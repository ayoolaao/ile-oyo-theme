# Spec

## Name

**Ilé-Ọ̀yọ́** means *"home of Ọ̀yọ́"*, after the historic Yoruba city and empire.
(Not "House of Beauty"; that gloss was an early draft and is retired.)

Palette sources come from Ọ̀yọ́ specifically, chiefly *aṣọ-òkè* (*aṣọ òfì*),
the woven cloth of Ọ̀yọ́'s *agbádá* and *ìró àti bùbá*. Each is tied to a role:

| Source | Role in the palette |
| ------ | ------------------- |
| *Ẹtù* (indigo aṣọ-òkè) | Alẹ́ background, blues |
| *Sányán* (beige wild-silk aṣọ-òkè) | foreground (Alẹ́), background (Ọ̀sán) |
| *Àlàárì* (crimson aṣọ-òkè) | red, and pink from its magenta shade |
| Coral beads (*iyùn*) | echoed by red; no token of its own |
| Gold thread | yellow |
| Clay and earth | browns, oranges, UI surfaces |

Avoid attributing the palette to *adire*: it is associated with Abẹ́òkúta, not
Ọ̀yọ́.

## Variants

| Variant | Meaning   | Mode  |
| ------- | --------- | ----- |
| Alẹ́     | evening   | Dark  |
| Ọ̀sán    | afternoon | Light |

## First targets

1. iTerm2: a `.itermcolors` file per variant
2. CSS: custom properties, Sass variables, JS/TS tokens
3. Visual Studio Code: an extension with both variants

## Repo layout

```
palette/ile-oyo.json        the only place colors are defined (both variants)
scripts/lib/palette.mjs     load + validate (rules below); shared by check and build
scripts/check-palette.mjs   npm run check
scripts/build.mjs           npm run build: validate, then run every target
scripts/targets/<name>.mjs  one generator per app; returns [{ path, contents }]
scripts/preview.mjs         npm run preview (local HTML, git-ignored preview/)
themes/iterm/               generated .itermcolors (committed) + README
themes/css/                 generated CSS/Sass/JS (committed), demo.html, README
themes/vscode/              planned
notes/                      these notes
```

Generated theme files are committed so people can download them directly.
`npm run build -- --check` fails if any of them differs from a fresh build.

## Target: iTerm2

One preset per variant: `themes/iterm/Ile-Oyo-Ale.itermcolors` and
`Ile-Oyo-Osan.itermcolors` (ASCII filenames; iTerm shows the filename as the
preset name). Colors are written with `Color Space: sRGB` so iTerm reproduces
the hex values exactly.

| iTerm key | Palette source |
| --------- | -------------- |
| Ansi 0–15 | `ansi.color0`–`color15` |
| Background | `bg` |
| Foreground, Bold, Cursor, Selected Text | `fg` |
| Cursor Text | `bg` |
| Selection | `selection` |
| Link | `blue` |
| Cursor Guide | `selection` at 40% opacity |

## Syntax roles

Which palette color each kind of code token uses. Defined once in
`scripts/targets/css.mjs` (`SYNTAX`, also exported from the JS tokens) and
reused by every target that colors code (CSS highlighting now, VS Code next).

| Role | Color | Role | Color |
| ---- | ----- | ---- | ----- |
| keyword, operator | pink | comment | comment (italic) |
| function, property | green | variable, punctuation | fg |
| string | yellow | link | cyan |
| number, boolean, constant | purple | deleted | red |
| type, class, built-in | cyan | inserted | green |
| parameter | orange (italic) | changed | orange |
| tag | pink | heading | purple |
| regex | red | emphasis / strong | yellow / orange |

## Target: CSS

Files in `themes/css/`:

| File | Contents |
| ---- | -------- |
| `ile-oyo.css` | `--ile-*` variables for both variants |
| `ile-oyo-highlight.css` | Prism + highlight.js token rules and Shiki `--shiki-*` variables, all via `--ile-*` |
| `_ile-oyo.scss` | `$ile-<variant>-<token>` (all `!default`), maps `$ile-ale`, `$ile-osan`, `$ile-oyo` |
| `ile-oyo-tokens.js`, `.d.ts` | ES module: `ale`, `osan`, `syntax`, default export |

Variant selection: Ọ̀sán by default, Alẹ́ under `prefers-color-scheme: dark`;
`data-ile-theme="ale" | "osan"` on any element overrides it for that subtree.
`demo.html` is hand-written and uses only the variables.

One repo with generators, not Dracula's one-repo-per-app layout. Targets can be
split out later if needed.

## Palette shape

Defined in `palette/ile-oyo.json` under `variants.ale` and `variants.osan`.
Borrowed from Dracula, per variant:

- `palette`: bg, fg, selection, comment, and the syntax accents
  (red, orange, yellow, green, cyan, blue, purple, pink)
- `ui`: background scale (bg_darker → bg_lighter, float)
- `ansi`: color0–color15 for terminals
- `other`: translucent overlays (line highlight, tab drop, etc.)

Colors start from the author's draft palette. A draft color that fails a rule
keeps its OKLCH hue and chroma; only its lightness moves, just far enough to
pass (target 4.6:1, so hex rounding can't drop it below 4.5). Stored as hex.

## Rules

- **Contrast:** every text color (fg, comment, each accent) must reach
  **4.5:1** against its variant's `bg` (WCAG 2.1 AA).
- **ANSI contrast:** colors 1–6, 8 and 9–14 must reach 4.5:1 in both variants.
  Black and white swap roles by mode: in Alẹ́ (dark), white (7, 15) is text and
  black (0) is exempt; in Ọ̀sán (light), black (0) is text and white (7, 15) is
  exempt.
- **Selection:** `selection` must reach **1.5:1** against `bg` so highlighted
  text is easy to see. (The line highlight and tab-drop overlays are derived
  from it.)
- **Distinct accents:** no two syntax accents share a hex value, and none equals
  `bg`.
- **One source:** generated files are never hand-edited.
- **Enforced:** `npm run check` (scripts/check-palette.mjs) tests all of the
  above and exits non-zero on any failure.

## Tooling

Node.js (installed via nvm). Dev dependencies, pinned exactly: `sass` 1.83.0
and `typescript` 5.6.3, used only by `npm test`. The build itself has no
dependencies. The VS Code extension will need `vsce` for packaging.

| Command | What it does |
| ------- | ------------ |
| `npm run check` | Enforces the rules above; non-zero exit on failure |
| `npm run build` | Validates, then writes every target's files |
| `npm run build -- --check` | Fails if a committed generated file is out of date |
| `npm test` | All of the above, plus: JS tokens equal the palette (`node --test`), the Sass compiles (`tests/use.scss`), and the `.d.ts` type-checks (`tests/use.ts`) |
| `npm run preview` | Builds `preview/index.html` from the palette and opens it |
| `npm run preview -- --compare <file>` | Side-by-side with another palette (either format) → `preview/compare.html` |

Previews are local files in the git-ignored `preview/` folder. Nothing is
published to the web.
