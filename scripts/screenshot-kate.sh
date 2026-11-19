#!/usr/bin/env bash
# Takes real Kate screenshots of both variants for the README.
#
#   npm run screenshot:kate
#
# Installs themes/kate/*.theme where Kate looks for user themes, switches
# Kate's editor theme in its settings file (katerc), opens
# scripts/screenshot/sample/src/loom.ts (the VS Code sample) and captures the
# window: assets/screenshots/kate-{ale,osan}.png. Afterwards katerc is
# restored and only the theme files this script added are removed.
# Quit Kate first. macOS only; needs Kate in /Applications and Screen
# Recording permission.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SAMPLE="$ROOT/scripts/screenshot/sample/src/loom.ts"
RC="$HOME/Library/Preferences/katerc"
DATA="$HOME/Library/Application Support/kate" # sessions
THEMES="$HOME/Library/Application Support/org.kde.syntax-highlighting/themes"
BACKUP="$(mktemp -d)"

if pgrep -x kate >/dev/null; then
  echo "Quit Kate first; this script changes its settings while it's closed." >&2
  exit 1
fi

# Remember what to put back.
[ -f "$RC" ] && cp "$RC" "$BACKUP/katerc"
# A saved session overrides the window size, so start without one.
[ -d "$DATA" ] && mv "$DATA" "$BACKUP/data"
mkdir -p "$THEMES"
added=()
for f in "$ROOT"/themes/kate/*.theme; do
  name="$(basename "$f")"
  if [ -e "$THEMES/$name" ]; then cp "$THEMES/$name" "$BACKUP/$name"; else added+=("$name"); fi
  cp "$f" "$THEMES/$name"
done

restore() {
  pkill -x kate 2>/dev/null || true
  sleep 1
  if [ -f "$BACKUP/katerc" ]; then cp "$BACKUP/katerc" "$RC"; else rm -f "$RC"; fi
  rm -rf "$DATA"
  [ -d "$BACKUP/data" ] && mv "$BACKUP/data" "$DATA"
  for name in "${added[@]}"; do rm -f "$THEMES/$name"; done
  for f in "$BACKUP"/*.theme; do [ -e "$f" ] && cp "$f" "$THEMES/"; done
  rm -rf "$BACKUP"
}
trap restore EXIT

# Main screen size in points, as Kate names it in window-size keys.
SCREEN="$(osascript -l JavaScript -e 'ObjC.import("AppKit"); const f = $.NSScreen.mainScreen.frame; f.size.width + "x" + f.size.height')"

# Writes the settings for one variant into katerc (other groups kept): the
# editor theme, a light or dark window color scheme, font and window size.
set_theme() {
  python3 - "$RC" "$1" "$2" "$SCREEN" <<'PY'
import configparser, sys
path, theme, scheme, main_screen = sys.argv[1:5]
rc = configparser.RawConfigParser(strict=False, interpolation=None, delimiters=('=',))
rc.optionxform = str
rc.read(path)
if not rc.has_section('KTextEditor Renderer'):
    rc.add_section('KTextEditor Renderer')
r = rc['KTextEditor Renderer']
r['Auto Color Theme Selection'] = 'false'
r['Color Theme'] = theme
r['Text Font'] = 'Menlo,14,-1,5,400,0,0,0,0,0,0,0,0,0,0,1,,0,0'
# Window size: Kate saves it per screen setup ("<screen> screen: Width").
if not rc.has_section('MainWindow'):
    rc.add_section('MainWindow')
w = rc['MainWindow']
screens = {k.split(' screen: ')[0] for k in w if ' screen: ' in k} | {main_screen}
for screen in screens:
    w[f'{screen} screen: Width'] = '1280'
    w[f'{screen} screen: Height'] = '800'
if not rc.has_section('UiSettings'):
    rc.add_section('UiSettings')
rc['UiSettings']['ColorScheme'] = scheme
with open(path, 'w') as f:
    rc.write(f, space_around_delimiters=False)
PY
}

mkdir -p "$ROOT/assets/screenshots"
for variant in ale osan; do
  name="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["metadata"]["name"])' "$ROOT/themes/kate/ile-oyo-$variant.theme")"
  scheme=BreezeDark; [ "$variant" = osan ] && scheme=BreezeLight
  set_theme "$name" "$scheme"
  open -a kate "$SAMPLE"
  sleep 6
  id="$(osascript -l JavaScript "$ROOT/scripts/lib/window-id.js" Kate loom.ts)"
  if [ -z "$id" ]; then echo "Kate window with loom.ts not found" >&2; exit 1; fi
  out="$ROOT/assets/screenshots/kate-$variant.png"
  screencapture -x -o -l "$id" "$out"
  sips -Z 2560 "$out" >/dev/null
  echo "wrote assets/screenshots/kate-$variant.png"
  pkill -x kate || true
  sleep 2
done
