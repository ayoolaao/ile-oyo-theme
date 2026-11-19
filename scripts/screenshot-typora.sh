#!/usr/bin/env bash
# Takes real Typora screenshots of both themes for the README.
#
#   npm run screenshot:typora      (quit Typora first)
#
# Saves Typora's preferences, copies themes/typora/*.css into Typora's theme
# folder, selects each theme, opens scripts/screenshot/sample-markdown/
# weaving.md and captures the window: assets/screenshots/typora-{ale,osan}.png.
# Afterwards Typora quits, its preferences are restored and only the theme
# files this script added are removed. macOS only; needs Screen Recording
# permission.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/assets/screenshots"
DOMAIN=abnerworks.Typora
THEMES="$HOME/Library/Application Support/abnerworks.Typora/themes"
TMP="$(mktemp -d)"

if pgrep -x Typora >/dev/null; then
  echo "Quit Typora first; its preferences are restored afterwards." >&2
  exit 1
fi

had_prefs=0
if defaults export "$DOMAIN" "$TMP/prefs.plist" 2>/dev/null; then had_prefs=1; fi
mkdir -p "$THEMES" "$OUT"
added=()
for f in "$ROOT"/themes/typora/*.css; do
  name="$(basename "$f")"
  if [ -e "$THEMES/$name" ]; then cp "$THEMES/$name" "$TMP/$name"; else added+=("$name"); fi
  cp "$f" "$THEMES/$name"
done

quit_typora() {
  osascript -e 'tell application "Typora" to quit' 2>/dev/null || true
  for _ in $(seq 1 20); do pgrep -x Typora >/dev/null || return 0; sleep 0.5; done
  pkill -x Typora 2>/dev/null || true
  for _ in $(seq 1 20); do pgrep -x Typora >/dev/null || return 0; sleep 0.5; done
}

restore() {
  quit_typora
  # Replace the whole domain with the saved copy (import alone merges).
  defaults delete "$DOMAIN" 2>/dev/null || true
  if [ "$had_prefs" = 1 ]; then defaults import "$DOMAIN" "$TMP/prefs.plist"; fi
  for name in "${added[@]}"; do rm -f "$THEMES/$name"; done
  for f in "$TMP"/*.css; do [ -e "$f" ] && cp "$f" "$THEMES/"; done
  rm -rf "$TMP"
}
trap restore EXIT

# A copy of the sample, so Typora doesn't touch the one in the repo.
cp "$ROOT/scripts/screenshot/sample-markdown/weaving.md" "$TMP/weaving.md"

for id in ale osan; do
  # Typora names a theme after its file: ile-oyo-ale.css → "Ile Oyo Ale".
  theme="$(echo "ile-oyo-$id" | awk -F- '{for (i = 1; i <= NF; i++) $i = toupper(substr($i, 1, 1)) substr($i, 2)} 1' OFS=' ')"
  defaults write "$DOMAIN" theme -string "$theme"
  defaults write "$DOMAIN" useSeparateDarkTheme -bool false
  # Typora paints its window with a cached copy of the last theme's
  # background, so set it to this theme's; also a fixed window and font size.
  read -r r g b < <(sed -nE 's/^ *--bg-color: #(..)(..)(..);/\1 \2 \3/p' "$ROOT/themes/typora/ile-oyo-$id.css" |
    { read -r x y z; printf '%d %d %d\n' "0x$x" "0x$y" "0x$z"; })
  defaults write "$DOMAIN" backgroundColor -string "rgba($r, $g, $b, 256)"
  defaults write "$DOMAIN" backgroundColor2 -array "$r" "$g" "$b" 1
  defaults write "$DOMAIN" ClosedWindowFrame -string "{{200, 200}, {1180, 940}}"
  defaults write "$DOMAIN" useCustomFontSize -bool false
  open -a Typora "$TMP/weaving.md"
  sleep 6
  win="$(osascript -l JavaScript "$ROOT/scripts/lib/window-id.js" Typora weaving)"
  if [ -z "$win" ]; then echo "Typora window with weaving.md not found" >&2; exit 1; fi
  screencapture -x -o -l "$win" "$OUT/typora-$id.png"
  # Typora keeps its own window size; crop to 16:10 from the top (the sample
  # fits) and scale to at most 2560 px.
  osascript -l JavaScript "$ROOT/scripts/lib/crop-top.js" "$OUT/typora-$id.png" 0.625 >/dev/null
  sips -Z 2560 "$OUT/typora-$id.png" >/dev/null
  echo "wrote assets/screenshots/typora-$id.png"
  quit_typora
done
