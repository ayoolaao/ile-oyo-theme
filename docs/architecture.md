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
scripts/screenshot-vscode.mjs  npm run screenshot:vscode (real VS Code, sample in scripts/screenshot/)
scripts/screenshot-iterm.sh npm run screenshot:iterm (real iTerm2, temporary dynamic profiles)
scripts/screenshot-xcode.sh npm run screenshot:xcode -- ale|osan (real Xcode, theme picked by hand)
scripts/terminal-demo.sh    npm run demo:terminal (fixed scene for terminal screenshots)
assets/screenshots/         README images (committed; Marketplace links them from main)
themes/iterm/               generated .itermcolors (committed) + README
themes/css/                 generated CSS/Sass/JS (committed), demo.html, README
themes/xcode/               generated .xccolortheme (committed) + README
themes/vscode/              extension: package.json + README (hand-written), themes/*.json (generated)
docs/                       this document
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

## Target: Xcode

One `.xccolortheme` property list per variant in `themes/xcode/`
(`scripts/targets/xcode.mjs`). The key set matches Xcode's own "Default
(Dark)" theme (`SourceEditor.framework`), checked by `tests/xcode.test.mjs`
when Xcode is installed. Colors are `"r g b a"` strings; semi-transparent
palette colors (the current-line highlight) are blended onto the background
so they're opaque.

Each Xcode syntax type maps to a syntax role (below), except macros,
preprocessor directives and attributes, which use orange. Fonts are SF Mono
Medium 12 pt; comments are italic, and doc-comment keywords and `MARK:` lines
bold, as in Xcode.

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

## Tooling

Node.js (installed via nvm). Dev dependencies, pinned exactly: `sass` 1.83.0
and `typescript` 5.6.3 (tests), `@vscode/vsce` 4.1.0 (packaging and publishing). The build
itself has no dependencies. The root `package.json` is private
(`ile-oyo-theme-repo`) and never published.

## Packages

| Package | Folder | Name | Contents |
| ------- | ------ | ---- | -------- |
| VS Code extension | `themes/vscode` | `jazzykid.ile-oyo-theme` | manifest, README, both themes, icon, LICENSE, NOTICE |
| npm | `themes/css` | `ile-oyo-theme` | CSS, highlight CSS, Sass, JS tokens + types; ES module only. Subpaths: `/css`, `/highlight.css`, `/scss` |

Every package's version must equal `palette.version`, and `CHANGELOG.md` must
have a dated entry for it, `## <version> (YYYY-MM-DD)` (`tests/versions.test.mjs`).

| Command | What it does |
| ------- | ------------ |
| `npm run check` | Enforces the rules above; non-zero exit on failure |
| `npm run build` | Validates, then writes every target's files |
| `npm run build -- --check` | Fails if a committed generated file is out of date |
| `npm test` | All of the above, plus: JS tokens equal the palette (`node --test`), the Sass compiles (`tests/use.scss`), the `.d.ts` type-checks (`tests/use.ts`), VS Code theme checks, and package versions match the palette |
| `npm run package:vscode` | Tests, then `dist/ile-oyo-theme-<version>.vsix` |
| `npm run pack:css` | Tests, then `npm pack --dry-run` of `themes/css` |
| `npm run release:dist` | Tests, then every release file into `dist/`: `.vsix`, npm `.tgz`, both `.itermcolors` and `.xccolortheme`, `release-notes.md` (CHANGELOG entry, install lines, SHA-256) |
| `npm run screenshot:vscode`, `screenshot:iterm`, `screenshot:xcode -- ale\|osan` | Retake the README screenshots (macOS) |
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
     `.itermcolors` and `.xccolortheme` files and `release-notes.md`, only after both stores succeed.

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
