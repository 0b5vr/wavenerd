import { useSettings } from '../stores/hooks/useSettings';
import { themes } from '../themes/themes';
import { ThemeVars } from '../themes/ThemeVars';

function themeVarsCss(themeString: string): string {
  const theme = (themes[themeString] ?? themes['monokaiSharp']).theme;
  const map = Object.entries(theme.ui)
    .map(([key, value]) => {
      const cssVar = ThemeVars[key as keyof typeof ThemeVars];
      if (cssVar == null) { return ''; }

      const cssKey = cssVar.match(/^var\(([a-z0-9-]+)/)?.[1];
      if (cssKey == null) { return ''; }

      return `${cssKey}: ${value};`;
    });
  return map.join('');
}

export function ThemeStyle() {
  const themeString = useSettings('theme');

  const isChromaCoder = themeString.startsWith('chromaCoder');

  const styleThemeVars = `@layer theme {
    :root {
      ${themeVarsCss(themeString)}
      ${isChromaCoder && 'filter: brightness(1.0);'}
    }
  }`;

  return <style>{styleThemeVars}</style>;
}
