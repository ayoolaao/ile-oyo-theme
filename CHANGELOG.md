# Changelog

All notable changes to Ilé-Ọ̀yọ́ are listed here. Versions follow
[Semantic Versioning](https://semver.org/): a color change that alters how a
theme looks is a minor version; a fix that doesn't is a patch.

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
