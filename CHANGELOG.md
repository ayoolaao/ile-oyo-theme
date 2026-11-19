# Changelog

All notable changes to Ilé-Ọ̀yọ́ are listed here. Versions follow
[Semantic Versioning](https://semver.org/): a color change that alters how a
theme looks is a minor version; a fix that doesn't is a patch.

## Unreleased

- **Xcode**: Alẹ́ and Ọ̀sán source editor themes (`themes/xcode/`), with
  screenshots. Install with Settings → Appearance → Themes → Choose… → Import….
- **Firefox**: one theme that switches between Ọ̀sán (light) and Alẹ́ (dark)
  with the system setting (`themes/firefox/`), with screenshots.
- **Chrome**: Alẹ́ and Ọ̀sán as two theme extensions (`themes/chrome/`), with
  screenshots. Chrome themes can't switch with the system setting, so you pick
  one.
- **Kate**: Alẹ́ and Ọ̀sán color themes (`themes/kate/`), also for KWrite and
  KDevelop, with screenshots.
- **Zsh**: command-line highlighting for zsh-syntax-highlighting (with the
  zsh-autosuggestions color) and fast-syntax-highlighting, Alẹ́ and Ọ̀sán
  (`themes/zsh/`), with screenshots.
- **Terminal.app**: Alẹ́ and Ọ̀sán profiles with the iTerm2 colors
  (`themes/terminal/`), with screenshots.
- **Typora**: Alẹ́ and Ọ̀sán themes (`themes/typora/`) for the document,
  code blocks, source mode and Typora's interface, with screenshots.
- **JetBrains IDEs**: Alẹ́ and Ọ̀sán editor color schemes (`.icls`,
  `themes/jetbrains/`) for IntelliJ IDEA, PyCharm, WebStorm and the rest,
  with screenshots.
- **JetBrains IDE theme**: a theme plugin (`themes/jetbrains/plugin/`,
  `ile-oyo-jetbrains-<version>.jar` in releases) that colors the whole IDE
  (window, tool windows, tabs, menus, popups, controls) as well as the editor,
  built on the Islands look, for 2025.3 and later, with screenshots.
- **CSS**: screenshots of the demo page in both variants.

## 0.1.3 (2026-11-18)

No color changes.

- Fixes npm publishing in the release workflow. 0.1.2 reached the VS Code
  Marketplace but not npm, so npm goes from 0.1.1 to 0.1.3.
- CI and the release build now dry-run the npm publish, and a rerun of the
  release workflow skips a Marketplace version that's already live.

## 0.1.2 (2026-11-18)

No color changes. First release published by the new release workflow.

- Releases are published by GitHub Actions with Trusted Publishing: no
  publishing tokens. The npm package is staged and goes live after the
  maintainer approves it with 2FA, and it carries provenance.
- CI builds every release file on each pull request.
- The build and palette rules are documented in `docs/architecture.md`.
- `@vscode/vsce` 4.1.0.

## 0.1.1 (2026-11-17)

First Marketplace and npm release.

- Screenshots of both variants in VS Code and iTerm2, linked from the READMEs.
- VS Code publisher is now `jazzykid` (extension ID `jazzykid.ile-oyo-theme`).
  If you installed the v0.1.0 `.vsix` (`ayoolaao.ile-oyo-theme`), uninstall it.

## 0.1.0 (2026-11-16)

First release.

### Palette
- Two variants: **Alẹ́** (evening, dark) on ẹtù indigo `#1A2B4C`, and
  **Ọ̀sán** (afternoon, light) on sányán beige `#F4E6CE`.
- Every text color reaches 4.5:1 contrast against its background (WCAG 2.1
  AA); selection reaches 1.5:1; secondary UI text (`ui.muted`) passes on every
  surface.

### Themes
- **iTerm2**: `themes/iterm/Ile-Oyo-Ale.itermcolors`, `Ile-Oyo-Osan.itermcolors`.
- **CSS**: CSS variables, syntax highlighting for Prism, highlight.js and
  Shiki, Sass variables, and JS/TS tokens in `themes/css/`.
- **Visual Studio Code**: Alẹ́ and Ọ̀sán color themes in `themes/vscode/`
  (install from the repository; not on the Marketplace yet).

### Tooling
- `npm run build` generates every theme from `palette/ile-oyo.json`.
- `npm test` checks contrast, that generated files are current, the JS tokens,
  the Sass and TypeScript outputs, and the VS Code themes.
- `npm run preview` builds a local palette preview.
