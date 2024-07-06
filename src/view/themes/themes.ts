import { Theme } from './Theme';
import { themeChromaCoder } from './themeChromaCoder';
import { themeMonokaiSharp } from './themeMonokaiSharp';
import { themeSolarizedDark } from './themeSolarizedDark';

export const themes: Record<string, Theme | undefined> = {
  'chromaCoder': themeChromaCoder,
  'monokaiSharp': themeMonokaiSharp,
  'solarizedDark': themeSolarizedDark,
};
