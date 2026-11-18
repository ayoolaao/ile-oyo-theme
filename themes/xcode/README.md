# Ilé-Ọ̀yọ́ for Xcode

Two source editor themes:

| File | Variant |
| ---- | ------- |
| `Ile-Oyo-Ale.xccolortheme` | **Alẹ́** (evening), dark |
| `Ile-Oyo-Osan.xccolortheme` | **Ọ̀sán** (afternoon), light |

## Install

1. Copy the files into Xcode's themes folder (create it if it doesn't exist):

   ```sh
   mkdir -p ~/Library/Developer/Xcode/UserData/FontAndColorThemes
   cp Ile-Oyo-*.xccolortheme ~/Library/Developer/Xcode/UserData/FontAndColorThemes/
   ```

2. Restart Xcode.
3. Open **Xcode → Settings → Themes** and choose **Ile-Oyo-Ale** or
   **Ile-Oyo-Osan**.

## What's in each theme

- The source editor: background, text, selection, cursor, current line,
  invisibles, and every Xcode syntax type (keywords, strings, types,
  functions, macros, attributes, doc comments and more).
- The console and the documentation (markup) colors.
- Fonts: SF Mono Medium 12 pt, with italic comments, as in Xcode's defaults.
  Change the font or size in Xcode's settings; the colors stay.
- Every syntax color reaches WCAG AA contrast (4.5:1) against the background.

These files are generated from `palette/ile-oyo.json` by `npm run build`.
Don't edit them by hand; change the palette and rebuild.
