import { Theme } from './Theme';

export function createThemeFlush(accent: string): Theme {
  const black = '#000000';
  const white = '#ffffff';

  const gray1 = '#121212';
  const gray2 = '#232323';
  const gray3 = '#2d2d2d';
  const gray8 = '#555555';

  const back = '#070707';
  const codeBg = back;

  const fore = '#cccccc';
  const foresub = '#aaaaaa';
  const foredark = '#999999';

  const redDark = '#500';

  return {
    ui: {
      black,
      white,

      back1: back,
      back2: back,
      back3: back,

      listBg: gray1,
      listHoverBg: gray2,
      listFocusedBg: gray3,

      overlayBack: gray1,

      codeBackground: codeBg,

      inputBack: gray3,
      inputFore: fore,
      inputBackInvalid: redDark,

      fore,
      foresub,
      foredark,

      gray: gray8,

      knobColor: accent,
      knobNotch: back,
      knobBorder: back,
      knobGuide: gray8,
      knobShadow: 'transparent',

      accent: accent,
      accentBright: accent,
      green: accent,
      error: accent,

      levelMeter: `linear-gradient(
        to bottom,
        ${accent} 20%,
        ${fore} 20%
      )`,
    },
    code: {
      text: fore,
      background: codeBg,
      keywords: accent,
      processors: accent,
      operators: accent,
      types: accent,
      constants: foredark,
      strings: accent,
      comments: gray8,
      invalid: redDark,
      panels: gray2,
      tooltips: gray2,
      gutterText: gray8,
      gutterBackground: codeBg,
      foldPlaceholders: gray8,
      searchMatch: accent + '22',
      searchSelected: accent + '88',
      backlayer: 'none',
      dark: true,
    },
  };
}
