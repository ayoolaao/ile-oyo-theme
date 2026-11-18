#!/usr/bin/env bash
# Takes a real Firefox screenshot of the theme variant Firefox is showing.
#
#   npm run screenshot:firefox -- ale     (Firefox in dark mode)
#   npm run screenshot:firefox -- osan    (Firefox in light mode)
#
# Before running:
#   1. Load the theme: about:debugging → This Firefox → Load Temporary
#      Add-on… → themes/firefox/manifest.json.
#   2. Serve the repo (python3 -m http.server 8123 --bind 127.0.0.1) and open
#      http://localhost:8123/themes/css/demo.html, plus one New Tab, with the
#      demo tab active and zoom at 100%.
#   3. Set light or dark mode for the variant you want.
# The script finds that Firefox window (on any Space), captures it and scales
# it to 2560 px wide: assets/screenshots/firefox-<variant>.png. macOS only;
# needs Screen Recording permission.
set -euo pipefail

variant="${1:-}"
case "$variant" in ale|osan) ;; *) echo "usage: $0 ale|osan" >&2; exit 1 ;; esac

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/assets/screenshots/firefox-$variant.png"
id="$(osascript -l JavaScript "$ROOT/scripts/lib/window-id.js" Firefox "CSS Demo")"
if [ -z "$id" ]; then
  echo "No Firefox window showing the CSS demo page; see the steps at the top of this script." >&2
  exit 1
fi
mkdir -p "$(dirname "$OUT")"
osascript -e 'tell application "Firefox" to activate' && sleep 1.5
screencapture -x -o -l "$id" "$OUT"
sips -Z 2560 "$OUT" >/dev/null
echo "wrote assets/screenshots/firefox-$variant.png"
