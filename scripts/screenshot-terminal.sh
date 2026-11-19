#!/usr/bin/env bash
# Takes real Terminal.app screenshots of both profiles for the README.
#
#   npm run screenshot:terminal      (quit Terminal first)
#
# Saves your Terminal preferences, then for each variant imports a copy of
# the profile the way a user would (opening the .terminal file). The copy also
# runs scripts/terminal-demo.sh instead of a shell (so no prompt with your
# user and host names appears), at 84×23, with only "aṣọ-òkè — loom" in the
# title. The window is captured, then Terminal quits and the saved
# preferences are restored, so the profiles and any changes are gone again.
# Writes assets/screenshots/terminal-{ale,osan}.png. macOS only; needs Screen
# Recording permission, and Terminal asks once for Automation.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/assets/screenshots"
TMP="$(mktemp -d)"
DOMAIN=com.apple.Terminal

if pgrep -x Terminal >/dev/null; then
  echo "Quit Terminal first; its preferences are restored afterwards." >&2
  exit 1
fi

had_prefs=0
if defaults export "$DOMAIN" "$TMP/prefs.plist" 2>/dev/null; then had_prefs=1; fi

restore() {
  osascript -e 'tell application "Terminal" to quit' 2>/dev/null || true
  # Wait until Terminal has fully exited, so it can't write its preferences
  # after they're restored.
  for _ in $(seq 1 20); do pgrep -x Terminal >/dev/null || break; sleep 0.5; done
  if pgrep -x Terminal >/dev/null; then
    pkill -x Terminal 2>/dev/null || true
    for _ in $(seq 1 20); do pgrep -x Terminal >/dev/null || break; sleep 0.5; done
  fi
  # Replace the whole domain with the saved copy (import alone merges).
  defaults delete "$DOMAIN" 2>/dev/null || true
  if [ "$had_prefs" = 1 ]; then defaults import "$DOMAIN" "$TMP/prefs.plist"; fi
  rm -rf "$TMP"
}
trap restore EXIT

mkdir -p "$OUT"
# Terminal runs CommandString as one program, so wrap the demo; read keeps
# the window open with the output on screen.
printf '#!/bin/bash\nbash %q\nread -r\n' "$ROOT/scripts/terminal-demo.sh" > "$TMP/loom"
chmod +x "$TMP/loom"

for v in Ale Osan; do
  id="$(echo "$v" | tr '[:upper:]' '[:lower:]')"
  name="Ile-Oyo-$v" # Terminal names an imported profile after its file
  copy="$TMP/$name.terminal"
  cp "$ROOT/themes/terminal/$name.terminal" "$copy"
  pb() { /usr/libexec/PlistBuddy -c "$1" "$copy"; }
  pb "Add :CommandString string $TMP/loom"
  pb "Add :RunCommandAsShell bool true"
  pb "Add :WindowTitle string aṣọ-òkè — loom"
  pb "Add :columnCount integer 84"
  pb "Add :rowCount integer 23"
  for k in ShowActiveProcessInTitle ShowActiveProcessArgumentsInTitle ShowCommandKeyInTitle \
    ShowDimensionsInTitle ShowRepresentedURLInTitle ShowRepresentedURLPathInTitle \
    ShowShellCommandInTitle ShowTTYNameInTitle ShowWindowSettingsNameInTitle; do
    pb "Add :$k bool false"
  done

  # Opening the file imports the profile and opens a window with it.
  open -a Terminal "$copy"
  sleep 3
  osascript - "$name" >/dev/null <<'APPLESCRIPT'
on run argv
  tell application "Terminal"
    activate
    set s to settings set (item 1 of argv)
    set font name of s to "Menlo-Regular"
    set font size of s to 15
  end tell
end run
APPLESCRIPT
  sleep 2
  win="$(osascript -l JavaScript "$ROOT/scripts/lib/window-id.js" Terminal "loom")"
  if [ -z "$win" ]; then echo "Terminal window not found" >&2; exit 1; fi
  screencapture -x -o -l "$win" "$OUT/terminal-$id.png"
  osascript -e 'tell application "Terminal" to close (every window)' 2>/dev/null || true
  sleep 1
  echo "wrote assets/screenshots/terminal-$id.png"
done
