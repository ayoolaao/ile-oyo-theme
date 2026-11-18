/* Ilé-Ọ̀yọ́ JS token types v0.1.1
 * Generated from palette/ile-oyo.json by `npm run build`. Do not edit by hand. */

export interface IleOyoVariant {
  name: string;
  mode: 'dark' | 'light';
  colors: {
    bg: string;
    fg: string;
    selection: string;
    comment: string;
    red: string;
    orange: string;
    yellow: string;
    green: string;
    cyan: string;
    blue: string;
    purple: string;
    pink: string;
  };
  ui: {
    bgDarker: string;
    bgDark: string;
    bgLight: string;
    bgLighter: string;
    float: string;
    muted: string;
  };
  /** ANSI colors 0–15. */
  ansi: string[];
  other: {
    lineHighlight: string;
    nonText: string;
    tabDropBg: string;
  };
}

export type SyntaxRole = 'keyword' | 'function' | 'string' | 'number' | 'type' | 'parameter' | 'property' | 'tag' | 'regex' | 'comment' | 'variable' | 'punctuation' | 'link' | 'deleted' | 'inserted' | 'changed' | 'heading' | 'emphasis' | 'strong';

export declare const ale: IleOyoVariant;
export declare const osan: IleOyoVariant;
export declare const syntax: Record<SyntaxRole, keyof IleOyoVariant['colors']>;
declare const _default: { ale: IleOyoVariant; osan: IleOyoVariant; syntax: typeof syntax };
export default _default;
