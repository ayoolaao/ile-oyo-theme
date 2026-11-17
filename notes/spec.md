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

## Repo layout (planned)

```
palette/ile-oyo.json   the only place colors are defined (both variants)
scripts/               build: palette → every target; contrast check
themes/css/            generated output + any hand-written Sass
themes/iterm/          generated .itermcolors files
themes/vscode/         mapping (which color goes where) + generated theme JSON
notes/                 these notes
```

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
- **Distinct accents:** no two syntax accents share a hex value, and none equals
  `bg`.
- **One source:** generated files are never hand-edited.
- **Enforced:** `npm run check` (scripts/check-palette.mjs) tests all of the
  above and exits non-zero on any failure.

## Tooling

Node.js (installed via nvm). The VS Code extension needs `vsce` for packaging.

| Command | What it does |
| ------- | ------------ |
| `npm run check` | Enforces the rules above; non-zero exit on failure |
| `npm run preview` | Builds `preview/index.html` from the palette and opens it |
| `npm run preview -- --compare <file>` | Side-by-side with another palette (either format) → `preview/compare.html` |

Previews are local files in the git-ignored `preview/` folder. Nothing is
published to the web.
