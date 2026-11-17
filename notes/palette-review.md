# Palette review: draft v1

Source: `/Users/ayoolaao/WorkSpace/dev/ile-oyo-themes/palette/palette.json`
(outside this repo). Reviewed 2026-11-16.

Contrast is measured as WCAG ratio against the variant's `bg`. Target: 4.5.

## What works

- **Structure.** palette / ui / ansi / other mirrors Dracula and maps directly
  onto VS Code, iTerm2, and CSS. Keep it.
- **Identity.** Navy, cream (`#F5F5DC`), brick red (`#A52A2A`), goldenrod
  (`#DAA520`), saddle brown, olive: the same hues as the ayoola.io firefly
  colors. Keep them as the anchor hues.
- **fg on bg:** 12.7 in both variants.
- **Ọ̀sán (light) is mostly usable.** Most accents pass.

## Alẹ́ (dark): needs rework

The dark variant reuses the light-mode accents, which are all dark colors.
On a navy background almost nothing is readable:

| Token     | Hex       | Contrast | |
| --------- | --------- | -------- | - |
| fg        | `#F5F5DC` | 12.70 | ✅ |
| yellow    | `#DAA520` | 6.28  | ✅ |
| red       | `#A52A2A` | 1.98  | ❌ |
| orange    | `#8B4513` | 1.98  | ❌ |
| cyan      | `#2A5B5C` | 1.84  | ❌ |
| green     | `#4B5320` | 1.71  | ❌ |
| comment   | `#3A4B6C` | 1.61  | ❌ |
| purple    | `#6B3A5A` | 1.59  | ❌ |
| **blue**  | `#1A2B4C` | **1.00** | ❌ same as bg, invisible |

ANSI: only color3, 7, 11, 15 pass. color4 (blue) is the bg color, and
color12 is 1.3.

**Fix:** keep the hues, raise lightness. Dark-mode accents should sit around
OKLCH L 0.72–0.85 (e.g. brick red → a light coral-terracotta, olive → a
sage/leaf green, brown → a warm amber-orange). Blue must differ from bg; an
ẹtù-indigo hue at high lightness works. Comment needs to be a muted
light color (≈ 4.5:1), not a slightly lighter navy.

## Ọ̀sán (light): small fixes

| Token     | Hex       | Contrast | |
| --------- | --------- | -------- | - |
| blue      | `#1A2B4C` | 12.70 | ⚠️ identical to fg, so blue tokens look like plain text |
| purple    | `#6B3A5A` | 7.98  | ✅ |
| green     | `#4B5320` | 7.42  | ✅ |
| cyan      | `#2A5B5C` | 6.90  | ✅ |
| orange    | `#8B4513` | 6.41  | ✅ |
| red       | `#A52A2A` | 6.40  | ✅ |
| comment   | `#5A6B8C` | 4.85  | ✅ |
| **yellow**| `#B8860B` | **2.94** | ❌ |

ANSI: color3 (2.9) and color11 (2.0) fail.

**Fix:** darken yellow to a deep ochre/bronze (~4.5+). Make blue a real
mid-indigo, distinct from fg.

## Both variants

- **red == pink** (`#A52A2A`), and ANSI color1 == color5, color9 == color13.
  Pink needs its own hue: a coral-bead coral.
- **Accents are close in brightness and saturation**, so even where they pass
  contrast they're hard to tell apart. Spread them out in hue.
- **Selection** is 1.16–1.26 against bg: too faint to see. Aim for a clearly
  visible tint (Dracula's is ~1.6).
- **Bright ANSI (9–15)** should be visibly brighter than 1–7 in Alẹ́ and
  visibly darker/stronger in Ọ̀sán.

## Verdict

Keep the schema and the anchor hues. Rebuild the Alẹ́ accents, fix three
Ọ̀sán colors, and give pink its own hue. Then lock it in with the build's
contrast check.

## Revision v0.1.0 (2026-11-16)

Now in `palette/ile-oyo.json`; `npm run check` passes. Compare with the draft
locally: `npm run preview -- --compare <draft palette.json>`.

A first attempt redesigned the colors from scratch in OKLCH. It passed, but
drifted from the draft's look, so it was replaced with a minimal-change pass
over the draft:

- **Alẹ́ fg:** warmer sányán `#F4E6CE` (11.4:1) instead of the draft's
  `#F5F5DC`, by preference; ANSI 7 matches it.
- **Kept exactly:** bg, fg (Ọ̀sán), selection, UI scale and overlays in both variants;
  Alẹ́ yellow; in Ọ̀sán, comment, red, orange, green, cyan and purple.
- **Lightened (Alẹ́), same hue and chroma:** comment `#8994AA` (greyer, to stay
  apart from blue), red `#EC6C64`, orange `#CE8154`, green `#8F9964`, cyan
  `#6B9D9D`, purple `#BA83A5`. All land at 4.6:1.
- **Darkened (Ọ̀sán):** yellow `#B8860B` → `#8F6705` (2.94 → 4.62).
- **Blue** no longer equals bg (Alẹ́ `#6E9DF5`, 5.2) or fg (Ọ̀sán `#35589D`, 6.3).
- **Pink** no longer equals red: red's hue turned halfway toward the draft's
  plum purple (Alẹ́ `#E86A8F`, Ọ̀sán `#A12854`).
- **ANSI:** Alẹ́ brights are derived from their normal colors so they read as
  brighter. Ọ̀sán black/white swapped so black (color0 `#1A2B4C`) is text.

Open points:
- Selection stays at the draft's 1.26 (Alẹ́) and 1.16 (Ọ̀sán). Not a contrast
  requirement, but it's faint; consider strengthening.
- Closest accent pairs: Alẹ́ comment/cyan 0.052, red/pink 0.061 (OKLab).
