import { Theme } from './Theme';
import { createCMTheme } from '../codemirror/createCMTheme';
import { themeChromaCoder } from './themeChromaCoder';
import { themeMonokaiSharp } from './themeMonokaiSharp';
import { themeShadertoyDark } from './themeShadertoyDark';
import { themeShadertoyLight } from './themeShadertoyLight';
import { themeSolarizedDark } from './themeSolarizedDark';
import { themeSolarizedLight } from './themeSolarizedLight';
import { themeSwedishBox } from './themeSwedishBox';
import { themeSwedishMachine } from './themeSwedishMachine';

export const themes: Record<string, {
  displayName: string;
  theme: Theme;
  cmTheme: ReturnType<typeof createCMTheme>;
}> = {
  'monokaiSharp': {
    displayName: 'Monokai Sharp',
    theme: themeMonokaiSharp,
    cmTheme: createCMTheme(themeMonokaiSharp),
  },
  'chromaCoder': {
    displayName: 'ChromaCoder',
    theme: themeChromaCoder,
    cmTheme: createCMTheme(themeChromaCoder),
  },
  'shadertoyDark': {
    displayName: 'Shadertoy Dark',
    theme: themeShadertoyDark,
    cmTheme: createCMTheme(themeShadertoyDark),
  },
  'shadertoyLight': {
    displayName: 'Shadertoy Light',
    theme: themeShadertoyLight,
    cmTheme: createCMTheme(themeShadertoyLight),
  },
  'solarizedDark': {
    displayName: 'Solarized Dark',
    theme: themeSolarizedDark,
    cmTheme: createCMTheme(themeSolarizedDark),
  },
  'solarizedLight': {
    displayName: 'Solarized Light',
    theme: themeSolarizedLight,
    cmTheme: createCMTheme(themeSolarizedLight),
  },
  'swedishBox': {
    displayName: 'Swedish Box',
    theme: themeSwedishBox,
    cmTheme: createCMTheme(themeSwedishBox),
  },
  'swedishMachine': {
    displayName: 'Swedish Machine',
    theme: themeSwedishMachine,
    cmTheme: createCMTheme(themeSwedishMachine),
  },
};
