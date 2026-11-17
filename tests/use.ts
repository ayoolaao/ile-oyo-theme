// Type-checks only if themes/css/ile-oyo-tokens.d.ts matches the documented API.
import tokens, { ale, osan, syntax, type IleOyoVariant, type SyntaxRole } from '../themes/css/ile-oyo-tokens.js';

const variants: IleOyoVariant[] = [ale, osan, tokens.ale, tokens.osan];
const role: SyntaxRole = 'keyword';
const keyword: string = ale.colors[syntax[role]];
const ansiRed: string = osan.ansi[1];
const darker: string = ale.ui.bgDarker;
const highlight: string = osan.other.lineHighlight;
const mode: 'dark' | 'light' = ale.mode;

// @ts-expect-error: not a palette color
ale.colors.magenta;
// @ts-expect-error: not a syntax role
const bad: SyntaxRole = 'banana';

export { variants, keyword, ansiRed, darker, highlight, mode, bad };
