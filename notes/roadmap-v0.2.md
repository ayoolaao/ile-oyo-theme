# Roadmap: v0.2 targets

Scoped 2026-11-16. Each target is a generator in `scripts/targets/<name>.mjs`
that reads the palette (and the shared syntax roles for anything that colors
code), plus tests and a README in `themes/<name>/`.

Size: **S** about a day, **M** a few days, **L** a week or more.

## Targets

| Target | Format | Size | How we test it | Distribution |
| ------ | ------ | ---- | -------------- | ------------ |
| Xcode | `.xccolortheme` property list | S | `plutil -lint`; colors read back; open in Xcode | File download |
| Chrome | Theme extension (`manifest.json` with `theme.colors`) | S | Manifest checks; load unpacked in Chrome | Chrome Web Store (one-time $5 developer fee) |
| Firefox | Static theme extension, `theme` + `dark_theme` | S | `web-ext lint`; load temporarily in Firefox | addons.mozilla.org (free) |
| Kate | KSyntaxHighlighting `.theme` (JSON) | S | JSON structure checks; open in Kate | File download |
| Zsh | zsh-syntax-highlighting styles + an oh-my-zsh prompt | S | `zsh -n` syntax check; source in a test shell | File download / plugin managers |
| Vim / Neovim | Vimscript colorscheme (works in both) | M | Load headless in `vim` and `nvim`, check highlight groups | Plugin managers (see risks) |
| Typora | Theme CSS (built on the CSS target) | M | Render sample Markdown in Typora; Chrome screenshot of the markup | File download |
| JetBrains | `.icls` editor color scheme (XML) | M | XML checks; import in a JetBrains IDE | File download; Marketplace later |
| Terminal.app | `.terminal` property list with archived `NSColor` data | M | `plutil -lint`; decode colors back; open in Terminal | File download |
| Notepad++ | XML style theme, per-language lexer styles | M–L | XML checks; needs Windows to view | File download |

## Per-target notes

### Xcode
- One file per variant, installed in
  `~/Library/Developer/Xcode/UserData/FontAndColorThemes/`.
- Colors are `"r g b a"` strings; source text, background, selection, cursor,
  line highlight, and one entry per Xcode syntax type mapped from the syntax
  roles.

### Chrome
- Chrome themes are fixed (no light/dark switching), so two extensions:
  Ilé-Ọ̀yọ́ Alẹ́ and Ilé-Ọ̀yọ́ Ọ̀sán.
- Colors are `[r, g, b]` arrays: frame, toolbar, tab text, bookmark text, new
  tab page background and text.
- Needs icons (reuse the extension icon).

### Firefox
- One extension: `theme` (Ọ̀sán) and `dark_theme` (Alẹ́) switch with the
  system setting.
- Keys: `frame`, `tab_background_text`, `toolbar`, `toolbar_text`,
  `toolbar_field`, `popup`, `sidebar`, `ntp_background`, accents.

### Kate
- Covers KDE's syntax-highlighting styles (Keyword, ControlFlow, Function,
  Variable, DataType, String, DecVal, Comment, Alert, and so on) plus editor
  colors (background, selection, current line, line numbers, markers).
- Also works in other KSyntaxHighlighting apps (KWrite, KDevelop).

### Zsh
- Zsh "themes" are prompts, not palettes. Two pieces:
  - `ZSH_HIGHLIGHT_STYLES` for zsh-syntax-highlighting, one file per variant,
    using hex colors.
  - An oh-my-zsh prompt theme using ANSI color names, so it follows whatever
    terminal theme is active (ours or not).

### Vim / Neovim
- `colors/ile-oyo.vim` picks Alẹ́ or Ọ̀sán from `&background`;
  `ile-oyo-ale.vim` and `ile-oyo-osan.vim` force one.
- Covers standard groups, diagnostics, Tree-sitter (`@keyword`, …) and LSP
  semantic groups (`@lsp.type.*`) from the syntax roles, and terminal colors.
- `termguicolors` uses the exact hex; a 256-color fallback is approximated.
- **Risk:** plugin managers expect `colors/` at the repository root. Options:
  a separate `ile-oyo.nvim` repository fed by the build, or documenting the
  `rtp` subdirectory option.

### Typora
- Typora themes are CSS for its own editor markup (`#write`, `.md-fences`,
  CodeMirror `cm-*` classes for code). Built on `ile-oyo.css`; one theme file
  per variant.

### JetBrains
- `.icls` covers the editor and code colors for all JetBrains IDEs.
- A full UI theme (tool windows, menus) needs a plugin built with Gradle:
  larger, so later.

### Terminal.app
- Colors are stored as archived `NSColor` objects inside the property list.
  Encode them in Node so the build stays portable, and check them by decoding.

### Notepad++
- Style theme XML with styles for each language lexer, mapped from the syntax
  roles; cover the common languages first.
- **Risk:** Windows-only; can't be viewed on this Mac.

## Suggested order

1. Xcode, Firefox, Chrome, Kate, Zsh (small, easy to verify here)
2. Vim / Neovim, Typora, JetBrains `.icls`, Terminal.app
3. Notepad++ (needs a Windows check)

## Open questions

- Which store listings are part of v0.2 (Chrome Web Store, Firefox add-ons,
  JetBrains Marketplace), and which targets ship as downloads only?
- Is a Windows machine or VM available to check Notepad++?
- Vim/Neovim: separate repository, or install from a subdirectory?
