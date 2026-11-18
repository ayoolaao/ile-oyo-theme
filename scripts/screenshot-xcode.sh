#!/usr/bin/env bash
# Takes a real Xcode screenshot of the theme that's selected in Xcode.
#
#   npm run screenshot:xcode -- ale     (select Ile-Oyo-Ale in Xcode first)
#   npm run screenshot:xcode -- osan    (select Ile-Oyo-Osan first)
#
# Xcode 27 keeps its theme choice in an undocumented setting, so this script
# doesn't change it: pick the theme in Xcode → Settings → Appearance →
# Themes (Ọ̀sán with Appearance set to Light), then run
# this. It opens scripts/screenshot/sample-swift/Loom.swift, sizes the window
# to 1280×800 and captures it to assets/screenshots/xcode-<variant>.png.
# macOS only; needs Screen Recording permission.
set -euo pipefail

variant="${1:-}"
case "$variant" in ale|osan) ;; *) echo "usage: $0 ale|osan" >&2; exit 1 ;; esac

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SAMPLE="$ROOT/scripts/screenshot/sample-swift/Loom.swift"
OUT="$ROOT/assets/screenshots/xcode-$variant.png"
mkdir -p "$(dirname "$OUT")"

open -a Xcode "$SAMPLE"
id="$(osascript <<'APPLESCRIPT'
tell application "Xcode"
  activate
  delay 4
  set w to (first window whose name is "Loom.swift")
  set index of w to 1
  set bounds of w to {100, 80, 1380, 880}
  delay 2
  return id of w
end tell
APPLESCRIPT
)"
screencapture -x -o -l "$id" "$OUT"
echo "wrote assets/screenshots/xcode-$variant.png"
