#!/usr/bin/env bash
# Prints a fixed terminal scene for theme screenshots: a short session
# and the 16 ANSI colors. Uses only ANSI color numbers, so the terminal's
# own color preset decides how it looks.
#
#   bash scripts/terminal-demo.sh

e=$'\e'
r="${e}[0m"; b="${e}[1m"
fg() { printf '%s[%sm' "$e" "$1"; }

clear
p="$(fg 32)aṣọ-òkè$r $(fg 34)~/loom$r $(fg 35)(main)$r $(fg 33)❯$r"

echo "$p ls"
echo "$(fg 34)${b}patterns$r  $(fg 34)${b}strips$r  $(fg 32)${b}weave.sh$r  README.md  cloth.json"
echo
echo "$p git status --short"
echo " $(fg 31)M$r strips/etu.txt"
echo " $(fg 31)D$r strips/old.txt"
echo "$(fg 32)A$r  strips/alaari.txt"
echo "$(fg 31)??$r patterns/sanyan.txt"
echo
echo "$p ./weave.sh --width 4"
echo "$(fg 36)info$r  reading 3 threads: ẹtù, sányán, àlàárì"
echo "$(fg 33)warn$r  strip 7 is $(fg 33)short$r by 2 passes"
echo "$(fg 31)error$r strip 9 has a $(fg 31)broken thread$r"
echo "$(fg 32)done$r  wove $(fg 35)12$r strips in $(fg 35)3.4s$r"
echo
echo "$p colors"
for row in 0 1; do
  line=""
  for i in 0 1 2 3 4 5 6 7; do
    n=$((row * 8 + i))
    if [ $row -eq 0 ]; then code=$((40 + i)); else code=$((100 + i)); fi
    line+="$(printf '%s[%sm %2d  %s' "$e" "$code" "$n" "$r") "
  done
  echo "$line"
done
echo
printf '%s ' "$p"
