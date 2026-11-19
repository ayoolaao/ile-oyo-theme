#!/usr/bin/env bash
# Takes real screenshots of the Zsh highlighting in iTerm2, both variants.
#
#   npm run screenshot:zsh
#
# For each variant: a temporary iTerm2 profile with that variant's iTerm
# colors runs an interactive zsh from a temporary ZDOTDIR (your ~/.zshrc is
# not read), in a scratch folder, with fast-syntax-highlighting and
# themes/zsh/fast-syntax-highlighting/ile-oyo-<variant>.ini loaded. Its work
# dir is temporary too, so your active fast-syntax-highlighting theme isn't
# changed. A command is typed into the prompt (not run) and the window is
# captured: assets/screenshots/zsh-{ale,osan}.png.
#
# fast-syntax-highlighting is looked up in $FSH_DIR,
# ~/.zsh/plugins/fast-syntax-highlighting, then Homebrew. macOS only; needs
# Screen Recording permission, and iTerm2 asks once for Automation.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROFILES="$HOME/Library/Application Support/iTerm2/DynamicProfiles"
PROFILE_FILE="$PROFILES/ile-oyo-zsh-screenshot.json"
OUT="$ROOT/assets/screenshots"
TMP="$(mktemp -d /tmp/ile-oyo-zsh.XXXX)"
trap 'rm -rf "$TMP" "$PROFILE_FILE"' EXIT

FSH=""
for d in "${FSH_DIR:-}" "$HOME/.zsh/plugins/fast-syntax-highlighting" /opt/homebrew/share/zsh-fast-syntax-highlighting; do
  if [ -n "$d" ] && [ -f "$d/fast-syntax-highlighting.plugin.zsh" ]; then FSH="$d"; break; fi
done
if [ -z "$FSH" ]; then echo "fast-syntax-highlighting not found; set FSH_DIR" >&2; exit 1; fi

# A scratch folder so paths in the command exist (and are underlined).
mkdir -p "$TMP/loom/strips" "$OUT"
touch "$TMP/loom/strips/etu.txt" "$TMP/loom/strips/alaari.txt"
printf '#!/bin/sh\n' > "$TMP/loom/weave.sh" && chmod +x "$TMP/loom/weave.sh"

for v in Ale Osan; do
  plutil -convert json -o "$TMP/$v.json" "$ROOT/themes/iterm/Ile-Oyo-$v.itermcolors"
  id="$(echo "$v" | tr '[:upper:]' '[:lower:]')"
  mkdir -p "$TMP/zdot-$id"
  cat > "$TMP/zdot-$id/.zshrc" <<ZSHRC
export FAST_WORK_DIR="$TMP/fsh-$id"
mkdir -p "\$FAST_WORK_DIR"
HISTFILE=/dev/null
setopt interactive_comments
PROMPT='%F{green}aṣọ-òkè%f %F{blue}~/loom%f %F{magenta}(main)%f %F{yellow}❯%f '
cd "$TMP/loom"
source "$FSH/fast-syntax-highlighting.plugin.zsh"
fast-theme -q "$ROOT/themes/zsh/fast-syntax-highlighting/ile-oyo-$id.ini"
clear
print -z 'for f in strips/*.txt; do  # count ẹtù threads
  n=\$(grep -c --ignore-case '"'"'ẹtù'"'"' "\$f") && echo "\$f: \$n" >> tally.log
done
sudo ./weave.sh --width 4 | sort -n && wevae \$((n * 2))'
ZSHRC
done

node -e '
const fs = require("fs");
const [tmp, out] = process.argv.slice(1);
const Profiles = ["Ale", "Osan"].map((v) => ({
  Name: `ile-oyo-zsh-screenshot-${v}`,
  Guid: `ile-oyo-zsh-screenshot-${v}`,
  ...JSON.parse(fs.readFileSync(`${tmp}/${v}.json`, "utf8")),
  "Normal Font": "Menlo-Regular 15",
  Columns: 84,
  Rows: 10,
  "Use Bold Font": true,
  "Use Custom Window Title": true,
  "Custom Window Title": "aṣọ-òkè — zsh",
  "Title Components": 0,
  "Cursor Type": 2,
  "Blinking Cursor": false,
}));
fs.writeFileSync(out, JSON.stringify({ Profiles }, null, 1));
' "$TMP" "$PROFILE_FILE"
sleep 2 # iTerm2 picks up dynamic profiles on its own

for v in Ale Osan; do
  id="$(echo "$v" | tr '[:upper:]' '[:lower:]')"
  win="$(osascript <<EOF
tell application "iTerm"
  activate
  set w to (create window with profile "ile-oyo-zsh-screenshot-$v" command "/usr/bin/env ZDOTDIR=$TMP/zdot-$id /bin/zsh -i")
  delay 3
  -- Highlighting runs when the line is redrawn: type one space.
  tell current session of w to write text " " newline NO
  delay 1.5
  return id of w
end tell
EOF
)"
  screencapture -x -o -l "$win" "$OUT/zsh-$id.png"
  osascript -e "tell application \"iTerm\" to close window id $win"
  echo "wrote assets/screenshots/zsh-$id.png"
done
