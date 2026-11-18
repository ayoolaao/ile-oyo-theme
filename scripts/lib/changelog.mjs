// Reads one version's entry from CHANGELOG.md.

/** The body of the dated "## <version> (YYYY-MM-DD)" entry, without its heading. */
export function changelogSection(changelog, version) {
  const lines = changelog.split('\n');
  const start = lines.findIndex((l) => l.startsWith(`## ${version} (`));
  if (start === -1) throw new Error(`CHANGELOG.md has no dated "## ${version} (YYYY-MM-DD)" entry`);
  const end = lines.findIndex((l, i) => i > start && l.startsWith('## '));
  return lines.slice(start + 1, end === -1 ? undefined : end).join('\n').trim();
}
