#!/usr/bin/env bash
# Takes a real JetBrains IDE screenshot of one scheme, in two steps:
#
#   npm run screenshot:jetbrains -- open ale      (or osan)
#     Starts WebStorm (or IDE=…) with a throwaway config folder (your own IDE
#     settings aren't read or changed), with the matching Islands look (dark
#     for Alẹ́, light for Ọ̀sán), and opens a copy of
#     scripts/screenshot/sample/src/loom.ts in LightEdit mode.
#     Then, by hand: Settings → Editor → Color Scheme → ⚙ → Import Scheme… →
#     themes/jetbrains/Ile-Oyo-<Variant>.icls → OK, close Settings.
#     (The IDE ignores a scheme selected in config files, so this step is
#     manual; it also tests the install steps in the README.)
#
#   npm run screenshot:jetbrains -- capture ale
#     Captures the window to assets/screenshots/jetbrains-<variant>.png and
#     quits that IDE, deleting its throwaway folder.
#
# macOS only; needs Screen Recording permission.
set -euo pipefail

step="${1:-}"
id="${2:-}"
case "$step" in open|capture) ;; *) echo "usage: $0 open|capture ale|osan" >&2; exit 1 ;; esac
case "$id" in ale|osan) ;; *) echo "usage: $0 open|capture ale|osan" >&2; exit 1 ;; esac

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/assets/screenshots"
IDE="${IDE:-WebStorm}"
APP="/Applications/$IDE.app"
BIN="$APP/Contents/MacOS/$(echo "$IDE" | tr '[:upper:]' '[:lower:]' | tr -d ' ')"
if [ ! -x "$BIN" ]; then echo "$IDE not found at $APP (set IDE=…)" >&2; exit 1; fi
# The launcher reads <envVarBaseName>_PROPERTIES (e.g. WEBIDE_PROPERTIES for
# WebStorm); without it the IDE would use your own config folder.
PROPS_VAR="$(python3 -c 'import json, sys; print(json.load(open(sys.argv[1]))["envVarBaseName"])' \
  "$APP/Contents/Resources/product-info.json")_PROPERTIES"
dir="/tmp/ile-oyo-jb-$id"

if [ "$step" = open ]; then
  if pgrep -f "$dir" >/dev/null; then echo "Already open; run: $0 capture $id" >&2; exit 1; fi
  rm -rf "$dir"
  look="Islands Dark"; [ "$id" = osan ] && look="Islands Light"
  mkdir -p "$dir/config/options" "$dir/system" "$dir/plugins" "$dir/log" "$dir/loom"
  cp "$ROOT/scripts/screenshot/sample/src/loom.ts" "$dir/loom/loom.ts"
  printf 'idea.config.path=%s\nidea.system.path=%s\nidea.plugins.path=%s\nidea.log.path=%s\n' \
    "$dir/config" "$dir/system" "$dir/plugins" "$dir/log" > "$dir/idea.properties"
  cat > "$dir/config/options/laf.xml" <<XML
<application>
  <component name="LafManager" autodetect="false">
    <laf themeId="$look" />
  </component>
</application>
XML
  # Trust the scratch folder, so the IDE doesn't open it in safe mode.
  cat > "$dir/config/options/trusted-paths.xml" <<XML
<application>
  <component name="Trusted.Paths.Settings">
    <option name="TRUSTED_PATHS">
      <list>
        <option value="$dir" />
      </list>
    </option>
  </component>
</application>
XML
  nohup env "$PROPS_VAR=$dir/idea.properties" "$BIN" -e "$dir/loom/loom.ts" >"$dir/log/out.txt" 2>&1 &
  variant="Ale"; [ "$id" = osan ] && variant="Osan"
  echo "Opening $IDE ($look). In it: Settings → Editor → Color Scheme → ⚙ → Import Scheme… →"
  echo "  $ROOT/themes/jetbrains/Ile-Oyo-$variant.icls → OK; close Settings. Then: $0 capture $id"
  exit 0
fi

win="$(osascript -l JavaScript "$ROOT/scripts/lib/window-id.js" "$IDE" loom.ts)"
if [ -z "$win" ]; then echo "No $IDE window with loom.ts; run: $0 open $id" >&2; exit 1; fi
mkdir -p "$OUT"
osascript -e "tell application \"$IDE\" to activate" 2>/dev/null || true
sleep 1
screencapture -x -o -l "$win" "$OUT/jetbrains-$id.png"
sips -Z 2560 "$OUT/jetbrains-$id.png" >/dev/null
echo "wrote assets/screenshots/jetbrains-$id.png"
pkill -f "$dir" 2>/dev/null || true
sleep 3
rm -rf "$dir"
