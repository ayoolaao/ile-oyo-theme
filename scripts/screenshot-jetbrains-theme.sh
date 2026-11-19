#!/usr/bin/env bash
# Takes real WebStorm screenshots of the Ilé-Ọ̀yọ́ IDE theme (both variants).
#
#   npm run screenshot:jetbrains-theme
#
# For each variant: zips themes/jetbrains/plugin into a plugin jar, starts
# WebStorm (or IDE=…) with a throwaway config folder that has the plugin
# installed and the theme selected, opens a copy of scripts/screenshot/sample
# as a project, captures the window and quits that IDE:
# assets/screenshots/jetbrains-theme-{ale,osan}.png.
#
# Your own IDE settings aren't read or changed. JetBrains IDEs also write to
# shared folders (~/Library/{Application Support,Logs,Caches}/JetBrains, a
# background helper, a preferences file) whatever the config folder; the
# script removes those afterwards if they didn't exist before. The first
# run asks JetBrains' Data Sharing question in a dialog: answer it (your
# choice; it's stored in the shared folder, which is removed at the end), and
# the script carries on. LOGS=<folder> keeps the IDE logs. macOS only; needs
# Screen Recording permission.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/assets/screenshots"
IDE="${IDE:-WebStorm}"
APP="/Applications/$IDE.app"
BIN="$APP/Contents/MacOS/$(echo "$IDE" | tr '[:upper:]' '[:lower:]' | tr -d ' ')"
if [ ! -x "$BIN" ]; then echo "$IDE not found at $APP (set IDE=…)" >&2; exit 1; fi
# The launcher reads <envVarBaseName>_PROPERTIES (e.g. WEBIDE_PROPERTIES for
# WebStorm); without it the IDE would use your own config folder.
INFO="$APP/Contents/Resources/product-info.json"
PROPS_VAR="$(python3 -c 'import json, sys; print(json.load(open(sys.argv[1]))["envVarBaseName"])' "$INFO")_PROPERTIES"
BUNDLE_ID="$(defaults read "$APP/Contents/Info.plist" CFBundleIdentifier)"

SHARED=("$HOME/Library/Application Support/JetBrains" "$HOME/Library/Logs/JetBrains" "$HOME/Library/Caches/JetBrains")
PREFS="$HOME/Library/Preferences/$BUNDLE_ID.plist"
existed=()
for d in "${SHARED[@]}" "$PREFS"; do [ -e "$d" ] && existed+=("$d"); done
had() { local x; for x in "${existed[@]+"${existed[@]}"}"; do [ "$x" = "$1" ] && return 0; done; return 1; }

TMP="$(mktemp -d /tmp/ile-oyo-jbt.XXXX)"
cleanup() {
  pkill -f "$TMP" 2>/dev/null || true
  sleep 3
  # LOGS=<folder> keeps each run's idea.log, for when the theme doesn't apply.
  if [ -n "${LOGS:-}" ]; then
    mkdir -p "$LOGS"
    for id in ale osan; do [ -f "$TMP/$id/log/idea.log" ] && cp "$TMP/$id/log/idea.log" "$LOGS/idea-$id.log"; done
  fi
  # Remove what this run created in the shared locations, if they weren't there before.
  if ! had "${SHARED[0]}"; then pkill -f 'JetBrains/Daemon/bundles/current/jetbrainsd.app' 2>/dev/null || true; sleep 1; fi
  for d in "${SHARED[@]}"; do had "$d" || rm -rf "$d"; done
  if ! had "$PREFS"; then defaults delete "$BUNDLE_ID" 2>/dev/null || true; rm -f "$PREFS"; fi
  rm -rf "$TMP"
}
trap cleanup EXIT
mkdir -p "$OUT"

for id in ale osan; do
  dir="$TMP/$id"
  mkdir -p "$dir/config/options" "$dir/system" "$dir/plugins" "$dir/log"
  cp -R "$ROOT/scripts/screenshot/sample" "$dir/loom"
  rm -f "$dir/loom/README.md" # the IDE would open it in front of loom.ts
  (cd "$ROOT/themes/jetbrains/plugin" && zip -q -X -r "$dir/plugins/ile-oyo-theme.jar" META-INF themes)
  printf 'idea.config.path=%s\nidea.system.path=%s\nidea.plugins.path=%s\nidea.log.path=%s\n' \
    "$dir/config" "$dir/system" "$dir/plugins" "$dir/log" > "$dir/idea.properties"
  cat > "$dir/config/options/laf.xml" <<XML
<application>
  <component name="LafManager" autodetect="false">
    <laf themeId="ile-oyo-$id" />
  </component>
</application>
XML
  # Record that this config already uses the new UI (early-access registry:
  # key and value on alternate lines). A fresh config otherwise counts as a
  # switch from the classic UI, which resets the theme to the default.
  printf 'ide.experimental.ui\ntrue\n' > "$dir/config/early-access-registry.txt"
  # No notification popups (e.g. "Cannot update plugin" for a plugin
  # installed from a file).
  cat > "$dir/config/options/notifications.xml" <<XML
<application>
  <component name="NotificationConfiguration" showBalloons="false" />
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
  env "$PROPS_VAR=$dir/idea.properties" "$BIN" "$dir/loom" "$dir/loom/src/loom.ts" >"$dir/log/out.txt" 2>&1 &
  win=""
  [ "$id" = ale ] && echo "If $IDE asks about Data Sharing, answer it; waiting for the project window…"
  for _ in $(seq 1 300); do
    win="$(osascript -l JavaScript "$ROOT/scripts/lib/window-id.js" "$IDE" loom)"
    [ -n "$win" ] && break
    sleep 1
  done
  if [ -z "$win" ]; then echo "$IDE project window not found (a dialog may be open)" >&2; exit 1; fi
  sleep 20 # indexing and highlighting
  osascript -e "tell application id \"$BUNDLE_ID\" to activate" 2>/dev/null || true
  sleep 1
  screencapture -x -o -l "$win" "$OUT/jetbrains-theme-$id.png"
  sips -Z 2560 "$OUT/jetbrains-theme-$id.png" >/dev/null
  echo "wrote assets/screenshots/jetbrains-theme-$id.png"
  pkill -f "$dir" 2>/dev/null || true
  sleep 3
done
