import { type ThemeColorKey } from './ThemeColorKey';

export interface Theme {
  ui: Partial<Record<ThemeColorKey, string>>;
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
    dark: boolean;
  };
}
