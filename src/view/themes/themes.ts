import { Theme } from './Theme';
import { themeChromaCoderGreen } from './themeChromaCoderGreen';
import { themeMonokaiSharp } from './themeMonokaiSharp';
import { themeShadertoyDark } from './themeShadertoyDark';
import { themeShadertoyLight } from './themeShadertoyLight';
import { themeSolarizedDark } from './themeSolarizedDark';
import { themeSolarizedLight } from './themeSolarizedLight';
import { themeSwedishBox } from './themeSwedishBox';
import { themeSwedishMachine } from './themeSwedishMachine';
import { createThemeFlush } from './createThemeFlush';
import { themeChromaCoderBlue } from './themeChromaCoderBlue';

export const themes: Record<string, {
  displayName: string;
  theme: Theme;
}> = {
  'monokaiSharp': {
    displayName: 'Monokai Sharp',
    theme: themeMonokaiSharp,
  },
  'chromaCoderGreen': {
    displayName: 'ChromaCoder Green',
    theme: themeChromaCoderGreen,
  },
  'chromaCoderBlue': {
    displayName: 'ChromaCoder Blue',
    theme: themeChromaCoderBlue,
  },
  'shadertoyDark': {
    displayName: 'Shadertoy Dark',
    theme: themeShadertoyDark,
  },
  'shadertoyLight': {
    displayName: 'Shadertoy Light',
    theme: themeShadertoyLight,
  },
  'solarizedDark': {
    displayName: 'Solarized Dark',
    theme: themeSolarizedDark,
  },
  'solarizedLight': {
    displayName: 'Solarized Light',
    theme: themeSolarizedLight,
  },
  'swedishBox': {
    displayName: 'Swedish Box',
    theme: themeSwedishBox,
  },
  'swedishMachine': {
    displayName: 'Swedish Machine',
    theme: themeSwedishMachine,
  },
  'flushRed': {
    displayName: 'Flush Red',
    theme: createThemeFlush('#f01841'),
  },
  'flushGreen': {
    displayName: 'Flush Green',
    theme: createThemeFlush('#aaf725'),
  },
  'flushPurple': {
    displayName: 'Flush Purple',
    theme: createThemeFlush('#8553eb'),
  },
};
