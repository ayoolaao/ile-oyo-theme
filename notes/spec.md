# Spec

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

Borrowed from Dracula, per variant:

- `palette`: bg, fg, selection, comment, and the syntax accents
  (red, orange, yellow, green, cyan, blue, purple, pink)
- `ui`: background scale (bg_darker → bg_lighter, float)
- `ansi`: color0–color15 for terminals
- `other`: translucent overlays (line highlight, tab drop, etc.)

## Rules

- **Contrast:** every text color (fg, comment, each accent, ANSI 1–7 and 9–15)
  must reach **4.5:1** against its variant's `bg` (WCAG 2.1 AA). The build fails
  otherwise. Exception: `comment` may drop to 3.0:1 if we decide so explicitly.
- **Distinct accents:** no two syntax accents share a hex value, and none equals
  `bg`.
- **One source:** generated files are never hand-edited.

## Tooling

Node.js (installed via nvm). The VS Code extension needs `vsce` for packaging.
