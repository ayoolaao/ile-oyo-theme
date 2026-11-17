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
