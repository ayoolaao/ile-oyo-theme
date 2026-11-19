# Architecture

How Ilé-Ọ̀yọ́ is built: the palette, the rules it must pass, and how each
app's theme is generated from it.

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

## Targets

| App | Folder | Generator | Variants | How people get it |
| --- | ------ | --------- | -------- | ----------------- |
| iTerm2 | `themes/iterm/` | `iterm.mjs` | one `.itermcolors` each | GitHub Releases |
| CSS | `themes/css/` | `css.mjs` | both in one stylesheet | npm `ile-oyo-theme` |
| VS Code | `themes/vscode/` | `vscode.mjs` | two themes in one extension | Marketplace `jazzykid.ile-oyo-theme`, GitHub Releases |
| Xcode | `themes/xcode/` | `xcode.mjs` | one `.xccolortheme` each | GitHub Releases |
| Firefox | `themes/firefox/` | `firefox.mjs` | one theme, switches with the system | addons.mozilla.org (coming), GitHub Releases |
| Chrome | `themes/chrome/` | `chrome.mjs` | one theme extension each | Chrome Web Store (coming), GitHub Releases |
| Kate | `themes/kate/` | `kate.mjs` | one `.theme` each | GitHub Releases |
| Zsh | `themes/zsh/` | `zsh.mjs` | one `.zsh` (zsh-syntax-highlighting) and one `.ini` (fast-syntax-highlighting) each | GitHub Releases |

Generators live in `scripts/targets/`. More apps are planned for v0.2
(Typora, JetBrains, Terminal.app, Notepad++).

## Repo layout

```
palette/ile-oyo.json           the only place colors are defined (both variants)

scripts/lib/palette.mjs        load + validate (rules below); shared by check and build
scripts/lib/syntax.mjs         syntax roles (below), shared by every code-coloring target
scripts/lib/changelog.mjs      reads one version's CHANGELOG entry
scripts/check-palette.mjs      npm run check
scripts/build.mjs              npm run build: validate, then run every target
scripts/targets/<name>.mjs     one generator per app; returns [{ path, contents }]
scripts/release.mjs            npm run release:dist: every release file into dist/
scripts/preview.mjs            npm run preview (local HTML, git-ignored preview/)
scripts/icon.mjs               npm run icon: renders assets/icon/icon.svg to the VS Code and Chrome icons

scripts/screenshot-vscode.mjs  npm run screenshot:vscode (real VS Code; sample in scripts/screenshot/sample/)
scripts/screenshot-iterm.sh    npm run screenshot:iterm (real iTerm2, temporary dynamic profiles)
scripts/screenshot-xcode.sh    npm run screenshot:xcode -- ale|osan (real Xcode; theme picked by hand)
scripts/screenshot-firefox.sh  npm run screenshot:firefox -- ale|osan (real Firefox; theme loaded by hand)
scripts/screenshot-chrome.mjs  npm run screenshot:chrome (real Chrome, throwaway profile)
scripts/screenshot-kate.sh     npm run screenshot:kate (real Kate; settings restored afterwards)
scripts/screenshot-zsh.sh      npm run screenshot:zsh (real zsh + fast-syntax-highlighting in iTerm2)
scripts/terminal-demo.sh       npm run demo:terminal (fixed scene for terminal screenshots)
scripts/lib/window-id.js       finds an app's window number for screencapture -l

themes/<app>/                  generated files (committed) + a hand-written README per app
tests/                         node --test suites, plus use.scss and use.ts (API checks)
assets/icon/                   icon source (SVG)
assets/screenshots/            README images (Marketplace and npm link them from main)
docs/                          this document
.github/workflows/             ci.yml (every push/PR) and release.yml (v* tags)
```

Generated theme files are committed so people can download them directly.
`npm run build -- --check` fails if any of them differs from a fresh build.
`themes/vscode/package.json` and the READMEs are hand-written.

## Palette shape

Defined in `palette/ile-oyo.json` under `variants.ale` and `variants.osan`.
Borrowed from Dracula, per variant:

- `palette`: bg, fg, selection, comment, and the syntax accents
  (red, orange, yellow, green, cyan, blue, purple, pink)
- `ui`: background scale (bg_darker → bg_lighter, float) and `muted`, the
  secondary UI text color (inactive tabs, descriptions, placeholders)
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
- **Muted UI text:** `ui.muted` must reach 4.5:1 against `bg`, `ui.bg_dark` and
  `ui.bg_darker`, because it's drawn on all of them. (`comment` only has to
  pass on `bg`, where code is.)
- **Distinct accents:** no two syntax accents share a hex value, and none equals
  `bg`.
- **One source:** generated files are never hand-edited.
- **Enforced:** `npm run check` (scripts/check-palette.mjs) tests all of the
  above and exits non-zero on any failure.

## Syntax roles

Which palette color each kind of code token uses. Defined once in
`scripts/targets/css.mjs` (`SYNTAX`, also exported from the JS tokens) and
reused by every target that colors code (CSS highlighting and VS Code). Now
lives in `scripts/lib/syntax.mjs` with `STYLE` (italic: comment, parameter;
bold: heading, strong).

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

## Target: VS Code

Extension in `themes/vscode/`: `package.json` (manifest, hand-written; publisher
`jazzykid`, the author's Marketplace publisher) and generated
`themes/ile-oyo-ale.json` / `ile-oyo-osan.json` (labels "Ilé-Ọ̀yọ́ Alẹ́",
"Ilé-Ọ̀yọ́ Ọ̀sán").

Workbench layout, outermost to innermost: title bar, activity bar and status
bar on `ui.bg_darker`; side bar, panels and inactive tabs on `ui.bg_dark`;
editor and active tab on `bg`; widgets, menus and notifications on
`ui.bg_light`.

| Role | Color |
| ---- | ----- |
| Brand accent: active tab/panel/activity border, badges, progress, peek border | red (àlàárì) |
| Buttons, links, info | blue |
| Errors / warnings | red / yellow |
| Secondary text | `ui.muted` |
| Selection, active list item | `selection` |
| Git: modified, added/untracked, deleted, conflict, ignored | orange, green, red, pink, `comment` |
| Terminal | `ansi.color0`–`color15` |

Code colors: TextMate scopes per syntax role, plus semantic token colors for
the same roles (`semanticHighlighting: true`). `tests/vscode.test.mjs` checks
UI text contrast (4.5:1; icons 3:1), that code colors come from the palette,
the terminal colors, the manifest, and that every color key is registered by
the installed VS Code.

One repo with generators, not Dracula's one-repo-per-app layout. Targets can be
split out later if needed.

## Target: Xcode

One `.xccolortheme` property list per variant in `themes/xcode/`
(`scripts/targets/xcode.mjs`). The key set matches Xcode's own "Default
(Dark)" theme (`SourceEditor.framework`), checked by `tests/xcode.test.mjs`
when Xcode is installed. Colors are `"r g b a"` strings; semi-transparent
palette colors (the current-line highlight) are blended onto the background
so they're opaque.

Each Xcode syntax type maps to a syntax role (above), except macros,
preprocessor directives and attributes, which use orange. Fonts are SF Mono
Medium 12 pt; comments are italic, and doc-comment keywords and `MARK:` lines
bold, as in Xcode.

## Target: Firefox

One static theme extension in `themes/firefox/` (`scripts/targets/firefox.mjs`),
Manifest V3, ID `ile-oyo-theme@jazzykid.com`. `theme` is Ọ̀sán and
`dark_theme` is Alẹ́; Firefox switches between them with its light/dark color
scheme. Surfaces follow the VS Code theme: frame `ui.bg_darker`, selected tab
and toolbar `bg` with a red tab line, inactive tab text `ui.muted`, fields like
VS Code's inputs, popups `ui.bg_light`, sidebar `ui.bg_dark`.
`tests/firefox.test.mjs` checks the keys against MDN's list, that every color
is a palette color, and 4.5:1 for 12 text/background pairs. `npm test` also
runs `web-ext lint` (Mozilla's add-on linter) with warnings as errors.

## Target: Chrome

One static theme extension per variant in `themes/chrome/ale/` and
`themes/chrome/osan/` (`scripts/targets/chrome.mjs`), Manifest V3. Chrome
themes can't follow the system's light/dark setting, so the variants are
separate extensions. Colors are `[r, g, b]` arrays and must be opaque.
Surfaces match the Firefox theme: frame and inactive tabs `ui.bg_darker`,
selected tab and toolbar `bg`, inactive tab text `ui.muted`, the address bar
like VS Code's inputs, new tab page `bg` with blue links. Incognito colors are
left to Chrome so incognito windows still look different. Chrome has no
tab-line color. Each folder carries a 128 px icon (`npm run icon`), LICENSE
and NOTICE. `tests/chrome.test.mjs` checks the keys against Chromium's
`kOverwritableColorTable` (`chrome/browser/themes/browser_theme_pack.cc`),
that every color is a palette color, and 4.5:1 for 8 text/background pairs.

## Target: Kate

One KSyntaxHighlighting color theme (JSON) per variant in `themes/kate/`
(`scripts/targets/kate.mjs`); the same files work in KWrite and KDevelop. The
31 text styles and 28 editor colors are the full set in KDE's Breeze themes.
Each text style maps to a syntax role; KDE-only styles: Variable (shell and
PHP `$variables`) and CommentVar use the parameter color, preprocessor and
attributes orange (as in Xcode), escapes pink, regular expressions red,
TODO/FIXME (Alert) bold red. Every color is opaque, because Qt reads alpha as
`#AARRGGBB`: the current line, search, replace and bracket highlights are
palette colors blended onto the background (`blend` in
`scripts/lib/palette.mjs`), with the same strengths as the VS Code theme.
`metadata.revision` comes from the version (0.1.3 → 103), so Kate prefers the
newest copy. `tests/kate.test.mjs` checks the full key sets, palette colors and
4.5:1 text. On the current-line highlight most accents fall to about 3.8:1
(as in Xcode; about 4.1:1 in VS Code); the palette rules only cover the
background.

## Target: Zsh

Command-line highlighting, one file per variant per plugin, in `themes/zsh/`
(`scripts/targets/zsh.mjs`): `ile-oyo-<variant>.zsh` sets every
zsh-syntax-highlighting main-highlighter style (`ZSH_HIGHLIGHT_STYLES`) and
the zsh-autosuggestions color; `fast-syntax-highlighting/ile-oyo-<variant>.ini`
sets every style `fast-theme` reads, so none falls back. Colors are
`#RRGGBB` (24-bit, or nearest 256-color via `zsh/nearcolor`); plain text uses
the terminal foreground. Roles: keywords and operators pink, commands green,
builtins and aliases cyan, strings yellow, numbers and options purple,
`$variables` orange, escapes pink, comments in the comment color, unknown
commands bold red. No italic: `fast-theme` accepts only bold and underline.
`tests/zsh.test.mjs` checks both key sets (from the plugins' sources), palette
colors and 4.5:1; where zsh is installed it also runs `zsh -n`, sources the
file, and loads the `.ini` with the real `fast-theme` (throwaway work dir)
expecting no missing or unparsed styles.

## Tooling

Node.js (installed via nvm). Dev dependencies, pinned exactly: `sass` 1.83.0
and `typescript` 5.6.3 (tests), `@vscode/vsce` 4.1.0 (packaging and publishing), `web-ext` 10.8.0 (Firefox lint and packaging). The build
itself has no dependencies. The root `package.json` is private
(`ile-oyo-theme-repo`) and never published.

## Packages

| Package | Folder | Name | Contents |
| ------- | ------ | ---- | -------- |
| VS Code extension | `themes/vscode` | `jazzykid.ile-oyo-theme` | manifest, README, both themes, icon, LICENSE, NOTICE |
| npm | `themes/css` | `ile-oyo-theme` | CSS, highlight CSS, Sass, JS tokens + types; ES module only. Subpaths: `/css`, `/highlight.css`, `/scss` |
| Firefox add-on | `themes/firefox` | `ile-oyo-theme@jazzykid.com` | manifest (both variants), README, LICENSE, NOTICE |
| Chrome themes | `themes/chrome/{ale,osan}` | Ilé-Ọ̀yọ́ Alẹ́, Ilé-Ọ̀yọ́ Ọ̀sán | manifest, icon, LICENSE, NOTICE |

Every package's version (and the Firefox and Chrome manifests') must equal
`palette.version`, and `CHANGELOG.md` must
have a dated entry for it, `## <version> (YYYY-MM-DD)` (`tests/versions.test.mjs`).

## Commands

| Command | What it does |
| ------- | ------------ |
| `npm run check` | Enforces the palette rules; non-zero exit on failure |
| `npm run build` | Validates, then writes every target's files |
| `npm run build -- --check` | Fails if a committed generated file is out of date |
| `npm test` | `check` and `build -- --check`, plus the `node --test` suites (JS tokens, VS Code, Xcode, Firefox, Chrome, Kate, Zsh, versions), the Sass compile (`tests/use.scss`), the `.d.ts` type-check (`tests/use.ts`), and `web-ext lint` on the Firefox theme |
| `npm run lint:firefox` | Mozilla's add-on linter on `themes/firefox`, warnings as errors |
| `npm run package:vscode` | Tests, then `dist/ile-oyo-theme-<version>.vsix` |
| `npm run pack:css` | Tests, then `npm pack --dry-run` of `themes/css` |
| `npm run release:dist` | Tests, then every release file into `dist/`: `.vsix`, npm `.tgz`, both `.itermcolors` and `.xccolortheme`, the Firefox `.zip`, both Chrome `.zip`s, both Kate `.theme` files, the Zsh `.zsh` and `.ini` files, `release-notes.md` (CHANGELOG entry, install lines, SHA-256) |
| `npm run screenshot:vscode`, `screenshot:iterm`, `screenshot:chrome`, `screenshot:kate`, `screenshot:zsh`, `screenshot:xcode` and `screenshot:firefox` (`-- ale\|osan`) | Retake the README screenshots (macOS) |
| `npm run preview` | Builds `preview/index.html` from the palette and opens it |
| `npm run preview -- --compare <file>` | Side-by-side with another palette (either format) → `preview/compare.html` |

Previews are local files in the git-ignored `preview/` folder. Nothing is
published to the web.

## Releasing

Releases are published by GitHub Actions with Trusted Publishing (OpenID
Connect), so no publishing tokens exist anywhere.

1. On a release branch: bump `version` in `palette/ile-oyo.json` and the three
   `package.json` files, run `npm run build`, add a dated `CHANGELOG.md`
   entry, and merge to `main`.
2. Tag the merge commit: `git tag -a v<version> -m "Ilé-Ọ̀yọ́ v<version>"` and
   push the tag.
3. `.github/workflows/release.yml` then:
   - **build**: `npm test`, then `scripts/release.mjs --tag`, which fails
     unless the tag matches the palette version;
   - **publish-vscode**: `vsce publish --oidc` with the built `.vsix`;
   - **publish-npm**: `npm stage publish` with the built `.tgz`, with
     provenance. The trusted publisher is stage-only, so the version waits
     until you approve it with 2FA (`npm stage approve <id>`, or Staged
     Packages on npmjs.com);
   - **github-release**: the GitHub Release with the `.vsix`, the
     `.itermcolors` and `.xccolortheme` files, the Firefox and Chrome `.zip`s, the Kate `.theme` and Zsh files and `release-notes.md`, only after both stores succeed.

The publish jobs run in the `release` environment, which can require approval
before they start. Trusted Publishing policies name this repository,
`release.yml` and the `release` environment:

- Marketplace: publisher `jazzykid` → Trusted Publishing.
- npm: package `ile-oyo-theme` → Settings → Trusted publisher (GitHub
  Actions), with "Allow npm publish" and "Allow npm dist-tag" left unchecked
  (stage-only). Publishing access: "Require two-factor authentication and
  disallow tokens".

`.github/workflows/ci.yml` runs `npm run release:dist` on every push and pull
request, so problems show up before a tag is pushed. Fallback if Actions is
unavailable: upload the `.vsix` by hand on the Marketplace's manage page, and
`npm publish` the `.tgz` after `npm login`.
