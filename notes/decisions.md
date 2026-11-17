# Decisions

Append new entries at the bottom. Don't rewrite old ones; add a new entry that
supersedes them.

## 2026-11-16: Variant names
Dark is **Alẹ́** (evening), light is **Ọ̀sán** (afternoon). Mirrors Dracula /
Alucard pairing, but with Yoruba names.

## 2026-11-16: One repo, generated targets
Dracula keeps ~400 submodules, each with hand-copied hex values. With three
targets and one maintainer, a single palette file plus generators is simpler and
keeps the ports from drifting apart.

## 2026-11-16: Node.js for the build
VS Code packaging (`vsce`) and the CSS npm package both expect Node, so the
build scripts are JS too.

## 2026-11-16: Accessibility floor
WCAG 2.1 AA (4.5:1) for all text colors against bg, enforced by the build. See
[spec.md](spec.md#rules).

## 2026-11-16: Meaning of the name
Ilé-Ọ̀yọ́ means "home of Ọ̀yọ́" (the historic Yoruba city and empire). The
"House of Beauty" gloss from the draft palette is retired. The README
description names the palette's sources: adire indigo, cotton cream, camwood
and coral reds, aṣọ-òkè gold, and clay.

## 2026-11-16: Palette sources are Ọ̀yọ́-specific
Supersedes the source list in "Meaning of the name". Adire is associated with
Abẹ́òkúta, not Ọ̀yọ́, so it is dropped. The palette is grounded in aṣọ-òkè
(aṣọ òfì), the cloth of Ọ̀yọ́'s agbádá and ìró àti bùbá: ẹtù (indigo), sányán
(beige), àlàárì (crimson), plus coral beads, gold thread, and clay.

## 2026-11-16: Spelling of the name
The name is **Ilé-Ọ̀yọ́**, with the low tone on the first Ọ, matching the city
(Ọ̀yọ́, Ọ̀yọ́ State). Earlier text spelled it "Ilé-Ọyọ́"; all files were
updated. ASCII identifiers (repo, package and file names) stay `ile-oyo`.
