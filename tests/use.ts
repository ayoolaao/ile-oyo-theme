// Type-checks only if themes/css/ile-oyo-tokens.d.ts matches the documented API.
import tokens, { ale, osan, syntax, status, type IleOyoVariant, type SyntaxRole, type StatusRole } from '../themes/css/ile-oyo-tokens.js';

const variants: IleOyoVariant[] = [ale, osan, tokens.ale, tokens.osan];
const role: SyntaxRole = 'keyword';
const keyword: string = ale.colors[syntax[role]];
const ansiRed: string = osan.ansi[1];
const darker: string = ale.ui.bgDarker;
const highlight: string = osan.other.lineHighlight;
const mode: 'dark' | 'light' = ale.mode;
const state: StatusRole = 'warning';
const warning: string = ale.colors[status[state]];
const errorBanner: string = osan.status.errorBg;
const success: string = tokens.ale.status.success;

// @ts-expect-error: not a palette color
ale.colors.magenta;
// @ts-expect-error: not a syntax role
const bad: SyntaxRole = 'banana';
// @ts-expect-error: not a status role
const badStatus: StatusRole = 'danger';

export { variants, keyword, ansiRed, darker, highlight, mode, bad, warning, errorBanner, success, badStatus };
