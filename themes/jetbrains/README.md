# Ilé-Ọ̀yọ́ for JetBrains IDEs

Editor color schemes for IntelliJ IDEA, PyCharm, WebStorm and every other
JetBrains IDE, one per variant.

| File | Scheme | Variant |
| ---- | ------ | ------- |
| `Ile-Oyo-Ale.icls` | Ilé-Ọ̀yọ́ Alẹ́ | **Alẹ́** (evening, dark) |
| `Ile-Oyo-Osan.icls` | Ilé-Ọ̀yọ́ Ọ̀sán | **Ọ̀sán** (afternoon, light) |

![Ilé-Ọ̀yọ́ Alẹ́ in WebStorm](../../assets/screenshots/jetbrains-ale.png)

![Ilé-Ọ̀yọ́ Ọ̀sán in WebStorm](../../assets/screenshots/jetbrains-osan.png)

The screenshots show WebStorm with the Islands Dark and Islands Light looks.

## Install

1. Download `Ile-Oyo-Ale.icls` and/or `Ile-Oyo-Osan.icls` from
   [GitHub Releases](https://github.com/ayoolaao/ile-oyo-theme/releases), or
   use the files in this folder.
2. In the IDE, open **Settings → Editor → Color Scheme**.
3. Click the **⚙** (gear) next to the scheme list → **Import Scheme…** and
   select a `.icls` file.
4. Pick **Ilé-Ọ̀yọ́ Alẹ́** or **Ilé-Ọ̀yọ́ Ọ̀sán** as the scheme and click **OK**.

These schemes color the editor and console. The rest of the IDE (tool
windows, tabs, menus) keeps its look: use a dark look (Islands Dark,
Darcula) with Alẹ́ and a light one (Islands Light) with Ọ̀sán. A full IDE
theme is planned.

## What's in the scheme

- Every language-default color (keywords, strings, numbers, functions,
  types, parameters, fields, comments, doc comments, markup), so all
  languages are covered, mapped to the same syntax roles as the VS Code,
  Xcode and Kate themes. Language-specific colors follow the defaults.
- The editor: caret and current line, selection, line numbers, guides,
  change markers, file status colors, errors and warnings, search and caret
  highlights, matching braces, links, TODO, inlay hints, breakpoints.
- The console's 16 ANSI colors, the same as the iTerm2 and Terminal.app
  presets.
- Alẹ́ is based on IntelliJ's Darcula scheme and Ọ̀sán on its Default (light)
  scheme, so anything the scheme doesn't set falls back to those.
- Every syntax color reaches WCAG AA contrast (4.5:1) on the background, and
  text stays at 4.5:1 on every highlight and inlay background.

The `.icls` files are generated from `palette/ile-oyo.json` by
`npm run build`. Don't edit them by hand; change the palette and rebuild.
`npm run screenshot:jetbrains -- open ale` (then `capture ale`; the same for
`osan`) retakes a screenshot in WebStorm with a throwaway config, so your own
IDE settings aren't touched; see the steps at the top of
`scripts/screenshot-jetbrains.sh`.
