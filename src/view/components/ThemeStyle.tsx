import { useSettings } from '../stores/hooks/useSettings';
import { themes } from '../themes/themes';

function themeVarsCss(themeString: string): string {
  const theme = (themes[themeString] ?? themes['monokaiSharp']).theme;
  const map = Object.entries(theme.ui)
    .map(([key, value]) => {
      // camelCase to kebab-case
      const colorName = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      const cssKey = `--rawcolor-${colorName}`;

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
      ${isChromaCoder ? 'filter: brightness(1.0);' : ''}
    }
  }`;

  return <style>{styleThemeVars}</style>;
}
