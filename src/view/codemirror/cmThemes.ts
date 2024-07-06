import { createCMTheme } from './createCMTheme';
import { themeChromaCoder } from '../themes/themeChromaCoder';
import { themeMonokaiSharp } from '../themes/themeMonokaiSharp';
import { themeSolarizedDark } from '../themes/themeSolarizedDark';

export const cmThemes: Record<string, ReturnType<typeof createCMTheme> | undefined> = {
  'chromaCoder': createCMTheme( themeChromaCoder ),
  'monokaiSharp': createCMTheme( themeMonokaiSharp ),
  'solarizedDark': createCMTheme( themeSolarizedDark ),
};
