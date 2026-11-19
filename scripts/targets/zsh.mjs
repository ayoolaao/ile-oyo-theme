// Zsh target: command-line highlighting colors, one file per variant, for
//   - zsh-syntax-highlighting (ZSH_HIGHLIGHT_STYLES) plus the
//     zsh-autosuggestions color: themes/zsh/ile-oyo-<variant>.zsh
//   - fast-syntax-highlighting (an .ini theme for `fast-theme`):
//     themes/zsh/fast-syntax-highlighting/ile-oyo-<variant>.ini
//
// Colors are #RRGGBB, which zsh draws in 24-bit color, or maps to the nearest
// 256-color entry with the zsh/nearcolor module (the .zsh file loads it when
// the terminal doesn't announce truecolor; fast-syntax-highlighting does the
// same). Plain text uses the terminal's own foreground ("none").
//
// Shell roles follow the shared syntax roles where they fit (keywords pink,
// commands green, strings yellow, numbers purple, comments italic) and the
// Kate theme for shell-only ones ($variables orange, escapes pink). Comments
// aren't italic here: fast-theme only takes bold and underline.

export const DIR = 'themes/zsh';
export const VARIANTS = ['ale', 'osan'];
export const zshFile = (id) => `${DIR}/ile-oyo-${id}.zsh`;
export const iniFile = (id) => `${DIR}/fast-syntax-highlighting/ile-oyo-${id}.ini`;

// Style specs: palette keys plus attributes, or 'none'.
// '<key>' = foreground; 'bg:<key>' = background; others are zsh attributes.
const S = {
  none: 'none',
  keyword: 'pink',
  command: 'green',
  builtin: 'cyan',
  string: 'yellow',
  number: 'purple',
  variable: 'orange',
  option: 'purple',
  escape: 'pink',
  comment: 'comment', // no italic: fast-theme rejects it, and zsh 5.9 can't draw it
  error: 'red,bold',
  path: 'underline',
  glob: 'purple',
  subtle: 'comment',
  match: 'bg:selection',
};

/** zsh-syntax-highlighting's main highlighter: every documented style. */
export const ZSH_STYLES = {
  default: S.none,
  'unknown-token': S.error,
  'reserved-word': S.keyword,
  alias: S.builtin,
  'suffix-alias': `${S.builtin},underline`,
  'global-alias': S.builtin,
  builtin: S.builtin,
  function: S.command,
  command: S.command,
  precommand: `${S.command},underline`,
  commandseparator: S.keyword,
  'hashed-command': S.command,
  autodirectory: `${S.command},underline`,
  path: S.path,
  path_pathseparator: S.path,
  path_prefix: S.path,
  path_prefix_pathseparator: S.path,
  globbing: S.glob,
  'history-expansion': S.glob,
  'command-substitution': S.none,
  'command-substitution-unquoted': S.none,
  'command-substitution-quoted': S.string,
  'command-substitution-delimiter': S.keyword,
  'command-substitution-delimiter-unquoted': S.keyword,
  'command-substitution-delimiter-quoted': S.keyword,
  'process-substitution': S.none,
  'process-substitution-delimiter': S.keyword,
  'arithmetic-expansion': S.number,
  'single-hyphen-option': S.option,
  'double-hyphen-option': S.option,
  'back-quoted-argument': S.none,
  'back-quoted-argument-unclosed': S.error,
  'back-quoted-argument-delimiter': S.keyword,
  'single-quoted-argument': S.string,
  'single-quoted-argument-unclosed': S.error,
  'double-quoted-argument': S.string,
  'double-quoted-argument-unclosed': S.error,
  'dollar-quoted-argument': S.string,
  'dollar-quoted-argument-unclosed': S.error,
  'rc-quote': S.escape,
  'dollar-double-quoted-argument': S.variable,
  'back-double-quoted-argument': S.escape,
  'back-dollar-quoted-argument': S.escape,
  assign: S.none,
  redirection: S.keyword,
  comment: S.comment,
  'named-fd': S.number,
  'numeric-fd': S.number,
  arg0: S.command,
};

/** fast-syntax-highlighting: every key `fast-theme` reads, by ini section. */
export const FSH_STYLES = {
  base: {
    default: S.none,
    'unknown-token': S.error,
    commandseparator: S.keyword,
    redirection: S.keyword,
    'here-string-tri': S.keyword,
    'here-string-text': S.string,
    'here-string-var': S.variable,
    'exec-descriptor': S.number,
    comment: S.comment,
    'correct-subtle': S.subtle,
    'incorrect-subtle': 'red',
    'subtle-separator': S.subtle,
    'subtle-bg': S.match,
    secondary: '',
    'recursive-base': S.none,
  },
  'command-point': {
    'reserved-word': S.keyword,
    subcommand: S.command,
    alias: S.builtin,
    'suffix-alias': `${S.builtin},underline`,
    'global-alias': S.builtin,
    builtin: S.builtin,
    function: S.command,
    command: S.command,
    precommand: `${S.command},underline`,
    'hashed-command': S.command,
    'single-sq-bracket': S.keyword,
    'double-sq-bracket': S.keyword,
    'double-paren': S.keyword,
  },
  paths: {
    path: S.path,
    pathseparator: S.path,
    'path-to-dir': S.path,
    globbing: S.glob,
    'globbing-ext': `${S.glob},bold`,
  },
  brackets: {
    'paired-bracket': S.match,
    'bracket-level-1': 'cyan,bold',
    'bracket-level-2': 'purple,bold',
    'bracket-level-3': 'orange,bold',
  },
  arguments: {
    'single-hyphen-option': S.option,
    'double-hyphen-option': S.option,
    'back-quoted-argument': S.none,
    'single-quoted-argument': S.string,
    'double-quoted-argument': S.string,
    'dollar-quoted-argument': S.string,
    'optarg-string': S.string,
    'optarg-number': S.number,
  },
  'in-string': {
    'back-dollar-quoted-argument': S.escape,
    'back-or-dollar-double-quoted-argument': S.variable,
  },
  other: {
    variable: S.variable,
    assign: S.none,
    'assign-array-bracket': S.keyword,
    'history-expansion': S.glob,
  },
  math: {
    mathvar: S.variable,
    mathnum: S.number,
    matherr: 'red',
  },
  'for-loop': {
    forvar: S.variable,
    fornum: S.number,
    foroper: S.keyword,
    forsep: S.keyword,
  },
  case: {
    'case-input': S.variable,
    'case-parentheses': S.keyword,
    'case-condition': S.match,
  },
};

const ATTRS = new Set(['none', 'bold', 'underline']);

/** A spec ('pink,bold', 'bg:selection', 'none') → zsh style ('fg=#E86A8F,bold'). */
export function zshStyle(spec, v) {
  if (spec === '') return '';
  return spec
    .split(',')
    .map((part) => {
      if (ATTRS.has(part)) return part;
      const [bg, key] = part.startsWith('bg:') ? [true, part.slice(3)] : [false, part];
      const hex = v.palette[key];
      if (!hex) throw new Error(`unknown palette key ${key}`);
      return `${bg ? 'bg' : 'fg'}=${hex}`;
    })
    .join(',');
}

/** The same in fast-theme's ini syntax ('#E86A8F,bold', 'bg:#37496B'). */
export const iniStyle = (spec, v) => zshStyle(spec, v).replace(/fg=/g, '').replace(/bg=/g, 'bg:');

const header = (palette, v, what) =>
  `${palette.name} ${v.name} (${v.meaning}, ${v.mode}) for ${what}.\n` +
  `Generated from palette/ile-oyo.json (v${palette.version}) by npm run build; don't edit by hand.\n` +
  'https://github.com/ayoolaao/ile-oyo-theme';

export function zsh(palette, id) {
  const v = palette.variants[id];
  // No spaces around '=': zsh assignments don't allow them.
  const lines = Object.entries(ZSH_STYLES).map(([k, spec]) => `ZSH_HIGHLIGHT_STYLES[${k}]='${zshStyle(spec, v)}'`);
  return `${header(palette, v, 'zsh-syntax-highlighting and zsh-autosuggestions').replace(/^/gm, '# ')}
#
# Source this after zsh-syntax-highlighting (and zsh-autosuggestions) in ~/.zshrc.

# 24-bit color, or the nearest 256-color entry when the terminal can't.
[[ \${COLORTERM-} == (24bit|truecolor) ]] || zmodload zsh/nearcolor 2>/dev/null

typeset -gA ZSH_HIGHLIGHT_STYLES
${lines.join('\n')}

typeset -g ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='${zshStyle(S.subtle, v)}'
`;
}

export function ini(palette, id) {
  const v = palette.variants[id];
  const sections = Object.entries(FSH_STYLES).map(([section, styles]) => {
    const width = Math.max(...Object.keys(styles).map((k) => k.length));
    const rows = Object.entries(styles).map(([k, spec]) => `${k}${' '.repeat(width - k.length)} = ${iniStyle(spec, v)}`);
    return `[${section}]\n${rows.join('\n')}`;
  });
  return `${header(palette, v, 'fast-syntax-highlighting').replace(/^/gm, '; ')}
;
; Load once with: fast-theme /path/to/ile-oyo-${id}.ini

${sections.join('\n\n')}
`;
}

export default function zshTarget(palette) {
  return VARIANTS.flatMap((id) => [
    { path: zshFile(id), contents: zsh(palette, id) },
    { path: iniFile(id), contents: ini(palette, id) },
  ]);
}
