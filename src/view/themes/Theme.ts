import { ThemeVars } from './fuck';

export interface Theme {
  ui: Record<keyof typeof ThemeVars, string>;
  code: {
    text: string;
    background: string;
    keywords: string;
    operators: string;
    processors: string;
    types: string;
    constants: string;
    strings: string;
    comments: string;
    invalid: string;
    panels: string;
    tooltips: string;
    gutterText: string;
    gutterBackground: string;
    foldPlaceholders: string;
    searchMatch: string;
    searchSelected: string;
    backlayer: string;
  };
}
