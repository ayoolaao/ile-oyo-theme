/* Ilé-Ọ̀yọ́ JS token types v0.2.0
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
  /** Status colors (aliases of `colors`) and their tinted surfaces. Put fg
   * text on a *Bg surface; the status color is for its border or icon. */
  status: {
    error: string;
    errorBg: string;
    warning: string;
    warningBg: string;
    info: string;
    infoBg: string;
    success: string;
    successBg: string;
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
export type StatusRole = 'error' | 'warning' | 'info' | 'success';

export declare const ale: IleOyoVariant;
export declare const osan: IleOyoVariant;
export declare const syntax: Record<SyntaxRole, keyof IleOyoVariant['colors']>;
export declare const status: Record<StatusRole, keyof IleOyoVariant['colors']>;
declare const _default: { ale: IleOyoVariant; osan: IleOyoVariant; syntax: typeof syntax; status: typeof status };
export default _default;
