#!/usr/bin/env bash
# Takes real iTerm2 screenshots of both presets for the READMEs.
#
#   npm run screenshot:iterm
#
# Adds a temporary iTerm2 dynamic profile per preset (colors read from
# themes/iterm/*.itermcolors), opens a window running terminal-demo.sh,
# captures that window, then closes it and removes the profiles. Writes
# assets/screenshots/iterm-{ale,osan}.png. macOS only; the app running this
# needs Screen Recording permission, and iTerm2 asks once for Automation.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROFILES="$HOME/Library/Application Support/iTerm2/DynamicProfiles"
PROFILE_FILE="$PROFILES/ile-oyo-screenshot.json"
OUT="$ROOT/assets/screenshots"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP" "$PROFILE_FILE"' EXIT

mkdir -p "$PROFILES" "$OUT"
for v in Ale Osan; do
  plutil -convert json -o "$TMP/$v.json" "$ROOT/themes/iterm/Ile-Oyo-$v.itermcolors"
done

node -e '
const fs = require("fs");
const [tmp, out] = process.argv.slice(1);
const Profiles = ["Ale", "Osan"].map((v) => ({
  Name: `ile-oyo-screenshot-${v}`,
  Guid: `ile-oyo-screenshot-${v}`,
  ...JSON.parse(fs.readFileSync(`${tmp}/${v}.json`, "utf8")),
  "Normal Font": "Menlo-Regular 15",
  Columns: 84,
  Rows: 23,
  "Use Bold Font": true,
  "Use Custom Window Title": true,
  "Custom Window Title": "aṣọ-òkè — loom",
  "Title Components": 0,
  "Cursor Type": 2,
  "Blinking Cursor": false,
}));
fs.writeFileSync(out, JSON.stringify({ Profiles }, null, 1));
' "$TMP" "$PROFILE_FILE"
sleep 2 # iTerm2 picks up dynamic profiles on its own

for v in Ale Osan; do
  id="$(osascript <<EOF
tell application "iTerm"
  activate
  set w to (create window with profile "ile-oyo-screenshot-$v" command "/bin/bash -c 'cd \"$ROOT\"; bash scripts/terminal-demo.sh; sleep 30'")
  delay 2.5
  return id of w
end tell
EOF
)"
  name="$(echo "$v" | tr '[:upper:]' '[:lower:]')"
  screencapture -x -o -l "$id" "$OUT/iterm-$name.png"
  osascript -e "tell application \"iTerm\" to close window id $id"
  echo "wrote assets/screenshots/iterm-$name.png"
done
