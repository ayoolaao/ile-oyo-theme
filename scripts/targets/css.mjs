// CSS target: custom properties, Sass variables, JS/TS tokens, and syntax
// highlighting for Prism, highlight.js and Shiki. Everything is generated from
// the palette; the highlighting rules only reference CSS variables, so code
// blocks follow whichever variant (Alẹ́ / Ọ̀sán) is active.
const OUT = 'themes/css';
const ATTR = 'data-ile-theme';

// Syntax roles → palette token. Shared reference for every target (see notes/spec.md).
export const SYNTAX = {
  keyword: 'pink',      // if, return, const, import, operators
  function: 'green',    // function and method names
  string: 'yellow',     // strings, template literals
  number: 'purple',     // numbers, booleans, null, constants
  type: 'cyan',         // classes, types, built-ins
  parameter: 'orange',  // function parameters
  property: 'green',    // object keys, attribute names
  tag: 'pink',          // HTML/XML tags
  regex: 'red',
  comment: 'comment',
  variable: 'fg',
  punctuation: 'fg',
  link: 'cyan',
  deleted: 'red',
  inserted: 'green',
  changed: 'orange',
  heading: 'purple',    // markdown headings
  emphasis: 'yellow',
  strong: 'orange',
};

const header = (palette, what) =>
  `/* ${palette.name} ${what} v${palette.version}\n` +
  ` * Generated from palette/ile-oyo.json by \`npm run build\`. Do not edit by hand. */\n`;

// Every variable a variant defines: --ile-<name>.
function tokens(v) {
  const t = {};
  for (const [k, hex] of Object.entries(v.palette)) t[k] = hex;
  for (const [k, hex] of Object.entries(v.ui)) t[`ui-${k.replace(/_/g, '-')}`] = hex;
  for (const [k, hex] of Object.entries(v.other)) t[k.replace(/_/g, '-')] = hex;
  for (let i = 0; i < 16; i++) t[`ansi-${i}`] = v.ansi[`color${i}`];
  return t;
}

const block = (selector, v) => {
  const lines = Object.entries(tokens(v)).map(([k, hex]) => `  --ile-${k}: ${hex};`);
  return `${selector} {\n  color-scheme: ${v.mode};\n${lines.join('\n')}\n}\n`;
};

function variablesCss(palette) {
  const { ale, osan } = palette.variants;
  return [
    header(palette, 'CSS variables'),
    '/* Usage',
    ` *   Follows the system setting: Ọ̀sán when light, Alẹ́ when dark.`,
    ` *   Force a variant on any element (and its children) with`,
    ` *   ${ATTR}="ale" (Alẹ́, dark) or ${ATTR}="osan" (Ọ̀sán, light). */`,
    '',
    block(`:root,\n[${ATTR}="osan"]`, osan),
    `@media (prefers-color-scheme: dark) {\n${block(`:root:not([${ATTR}="osan"])`, ale)
      .split('\n').map((l) => (l ? `  ${l}` : l)).join('\n')}}\n`,
    block(`[${ATTR}="ale"]`, ale),
  ].join('\n');
}

function highlightCss(palette) {
  const v = (role) => `var(--ile-${SYNTAX[role]})`;
  return `${header(palette, 'syntax highlighting')}
/* Requires ile-oyo.css. Colors come from its variables, so highlighted code
 * switches with the active variant. Covers Prism, highlight.js and Shiki's
 * css-variables theme. */

/* Code block container ---------------------------------------------------- */
pre[class*="language-"],
pre.hljs,
pre:has(> code.hljs),
pre.shiki {
  background: var(--ile-bg);
  color: var(--ile-fg);
  tab-size: 2;
}
pre[class*="language-"] ::selection,
pre.hljs ::selection,
pre:has(> code.hljs) ::selection,
pre.shiki ::selection {
  background: var(--ile-selection);
}
code.hljs {
  background: transparent;
  color: var(--ile-fg);
}

/* Prism -------------------------------------------------------------------- */
.token.comment, .token.prolog, .token.doctype, .token.cdata { color: ${v('comment')}; font-style: italic; }
.token.punctuation { color: ${v('punctuation')}; }
.token.keyword, .token.operator, .token.important, .token.atrule .token.rule { color: ${v('keyword')}; }
.token.tag, .token.selector { color: ${v('tag')}; }
.token.function, .token.method { color: ${v('function')}; }
.token.property, .token.attr-name { color: ${v('property')}; }
.token.string, .token.char, .token.attr-value, .token.template-string { color: ${v('string')}; }
.token.number, .token.boolean, .token.constant, .token.symbol { color: ${v('number')}; }
.token.class-name, .token.builtin, .token.namespace { color: ${v('type')}; }
.token.parameter { color: ${v('parameter')}; font-style: italic; }
.token.variable { color: ${v('variable')}; }
.token.regex { color: ${v('regex')}; }
.token.url { color: ${v('link')}; }
.token.deleted { color: ${v('deleted')}; }
.token.inserted { color: ${v('inserted')}; }
.token.title { color: ${v('heading')}; font-weight: bold; }
.token.italic { color: ${v('emphasis')}; font-style: italic; }
.token.bold { color: ${v('strong')}; font-weight: bold; }
.token.interpolation-punctuation { color: ${v('keyword')}; }

/* highlight.js --------------------------------------------------------------- */
.hljs-comment, .hljs-quote, .hljs-meta { color: ${v('comment')}; font-style: italic; }
.hljs-punctuation, .hljs-subst { color: ${v('punctuation')}; }
.hljs-keyword, .hljs-operator, .hljs-selector-tag { color: ${v('keyword')}; }
.hljs-name, .hljs-tag { color: ${v('tag')}; }
.hljs-title.function_, .hljs-title { color: ${v('function')}; }
.hljs-attr, .hljs-attribute, .hljs-property { color: ${v('property')}; }
.hljs-string, .hljs-template-tag, .hljs-template-variable { color: ${v('string')}; }
.hljs-number, .hljs-literal, .hljs-symbol { color: ${v('number')}; }
.hljs-type, .hljs-built_in, .hljs-title.class_, .hljs-class .hljs-title { color: ${v('type')}; }
.hljs-params { color: ${v('parameter')}; font-style: italic; }
.hljs-variable, .hljs-variable.language_ { color: ${v('variable')}; }
.hljs-regexp { color: ${v('regex')}; }
.hljs-link { color: ${v('link')}; text-decoration: underline; }
.hljs-deletion { color: ${v('deleted')}; }
.hljs-addition { color: ${v('inserted')}; }
.hljs-section { color: ${v('heading')}; font-weight: bold; }
.hljs-emphasis { color: ${v('emphasis')}; font-style: italic; }
.hljs-strong { color: ${v('strong')}; font-weight: bold; }

/* Shiki: use createCssVariablesTheme() and these variables ------------------ */
:root,
[${ATTR}] {
  --shiki-foreground: var(--ile-fg);
  --shiki-background: var(--ile-bg);
  --shiki-token-keyword: ${v('keyword')};
  --shiki-token-function: ${v('function')};
  --shiki-token-string: ${v('string')};
  --shiki-token-string-expression: ${v('string')};
  --shiki-token-constant: ${v('number')};
  --shiki-token-parameter: ${v('parameter')};
  --shiki-token-comment: ${v('comment')};
  --shiki-token-punctuation: ${v('punctuation')};
  --shiki-token-link: ${v('link')};
${['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
  .flatMap((c, i) => [`  --shiki-ansi-${c}: var(--ile-ansi-${i});`, `  --shiki-ansi-bright-${c}: var(--ile-ansi-${i + 8});`])
  .join('\n')}
}
`;
}

function scss(palette) {
  const out = [header(palette, 'Sass variables').replace(/^\/\*/, '//').replace(/\n \*/g, '\n//').replace(/ \*\/\n$/, '\n'), ''];
  for (const [id, v] of Object.entries(palette.variants)) {
    const t = tokens(v);
    out.push(`// ${v.name} (${v.meaning}, ${v.mode})`);
    for (const [k, hex] of Object.entries(t)) out.push(`$ile-${id}-${k}: ${hex} !default;`);
    out.push(`$ile-${id}: (`);
    out.push(...Object.keys(t).map((k) => `  '${k}': $ile-${id}-${k},`));
    out.push(') !default;', '');
  }
  out.push('$ile-oyo: (', ...Object.keys(palette.variants).map((id) => `  '${id}': $ile-${id},`), ') !default;', '');
  return out.join('\n');
}

const camel = (k) => k.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());

function jsTokens(palette) {
  const body = Object.entries(palette.variants).map(([id, v]) => {
    const groups = {
      name: JSON.stringify(v.name),
      mode: JSON.stringify(v.mode),
      colors: v.palette,
      ui: Object.fromEntries(Object.entries(v.ui).map(([k, x]) => [camel(k), x])),
      ansi: Array.from({ length: 16 }, (_, i) => v.ansi[`color${i}`]),
      other: Object.fromEntries(Object.entries(v.other).map(([k, x]) => [camel(k), x])),
    };
    const fmt = (x) => (typeof x === 'string' ? x : JSON.stringify(x, null, 2).replace(/\n/g, '\n  '));
    return `export const ${id} = {\n${Object.entries(groups).map(([k, x]) => `  ${k}: ${fmt(x)},`).join('\n')}\n};`;
  });
  return [
    header(palette, 'JS tokens'),
    ...body,
    '',
    `/** Syntax role → key in \`colors\`. */`,
    `export const syntax = ${JSON.stringify(SYNTAX, null, 2)};`,
    '',
    `export default { ${Object.keys(palette.variants).join(', ')}, syntax };`,
    '',
  ].join('\n\n').replace(/\n\n\n+/g, '\n\n');
}

function dts(palette) {
  const v = palette.variants.ale;
  const keys = (o, f = (k) => k) => Object.keys(o).map((k) => `    ${f(k)}: string;`).join('\n');
  return `${header(palette, 'JS token types')}
export interface IleOyoVariant {
  name: string;
  mode: 'dark' | 'light';
  colors: {
${keys(v.palette)}
  };
  ui: {
${keys(v.ui, camel)}
  };
  /** ANSI colors 0–15. */
  ansi: string[];
  other: {
${keys(v.other, camel)}
  };
}

export type SyntaxRole = ${Object.keys(SYNTAX).map((k) => `'${k}'`).join(' | ')};

${Object.keys(palette.variants).map((id) => `export declare const ${id}: IleOyoVariant;`).join('\n')}
export declare const syntax: Record<SyntaxRole, keyof IleOyoVariant['colors']>;
declare const _default: { ${Object.keys(palette.variants).map((id) => `${id}: IleOyoVariant`).join('; ')}; syntax: typeof syntax };
export default _default;
`;
}

export default function css(palette) {
  // Every syntax role must point at a real palette key.
  for (const [role, key] of Object.entries(SYNTAX)) {
    if (!(key in palette.variants.ale.palette)) throw new Error(`css: syntax role "${role}" uses unknown token "${key}"`);
  }
  return [
    { path: `${OUT}/ile-oyo.css`, contents: variablesCss(palette) },
    { path: `${OUT}/ile-oyo-highlight.css`, contents: highlightCss(palette) },
    { path: `${OUT}/_ile-oyo.scss`, contents: scss(palette) },
    { path: `${OUT}/ile-oyo-tokens.js`, contents: jsTokens(palette) },
    { path: `${OUT}/ile-oyo-tokens.d.ts`, contents: dts(palette) },
  ];
}
