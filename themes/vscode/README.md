# Ilé-Ọ̀yọ́ for Visual Studio Code

*Home of Ọ̀yọ́.* A color theme woven from *aṣọ-òkè*: the indigo of *ẹtù*, the
beige of *sányán*, and the crimson of *àlàárì*.

| Theme | Variant |
| ----- | ------- |
| **Ilé-Ọ̀yọ́ Alẹ́** | evening, dark |
| **Ilé-Ọ̀yọ́ Ọ̀sán** | afternoon, light |

Every text color meets WCAG 2.1 AA contrast (4.5:1) against its background.

## Install

Not on the Marketplace yet. Two ways to install it now:

**From a `.vsix` file** (built with `npm run package:vscode`, or attached to a
GitHub release):

```sh
code --install-extension ile-oyo-theme-0.1.0.vsix
```

**From this repository:**

1. Copy or link this folder into your VS Code extensions folder:

   ```sh
   ln -s "$PWD/themes/vscode" ~/.vscode/extensions/ile-oyo-theme
   ```

2. Restart VS Code.

Then run **Preferences: Color Theme** (`⌘K ⌘T` / `Ctrl+K Ctrl+T`) and pick
**Ilé-Ọ̀yọ́ Alẹ́** or **Ilé-Ọ̀yọ́ Ọ̀sán**.

To match your system's light/dark setting, add to `settings.json`:

```json
"window.autoDetectColorScheme": true,
"workbench.preferredDarkColorTheme": "Ilé-Ọ̀yọ́ Alẹ́",
"workbench.preferredLightColorTheme": "Ilé-Ọ̀yọ́ Ọ̀sán"
```

## Development

The files in `themes/` are generated from `palette/ile-oyo.json` by
`npm run build` at the repository root. Don't edit them by hand.

From the repository root: `npm run package:vscode` runs the tests and writes
`dist/ile-oyo-theme-<version>.vsix`; `npm run publish:vscode` publishes to the
Marketplace (needs a `vsce login` for the `publisher` in `package.json`).
