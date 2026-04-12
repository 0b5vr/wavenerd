import { Theme } from './Theme';

const black = '#000000';

const back1 = '#111111';
const back2 = '#222222';
const back3 = '#333333';

const gray = '#999999';

const fore = '#ffffff';
const foresub = '#dddddd';
const foredark = '#aaaaaa';

const background = '#00ff00';

const red = '#ff0066';
const orange = '#ff5a1f';
const yellow = '#f7f025';
const cyan = '#00ccff';
const constblue = '#ae78ff';

export const themeChromaCoderGreen: Theme = {
  ui: {
    black: '#000000',
    white: '#ffffff',

    back1: background,
    back2: background,
    back3: background,

    listBg: back1,
    listHoverBg: back2,
    listFocusedBg: back3,

    overlayBack: '#111111',

    codeBackground: background,

    inputBack: back3,
    inputFore: fore,
    inputBackInvalid: `color-mix(in oklab, ${red} 60%, ${back3} 40%)`,

    fore,
    foresub,
    foredark,

    gray,

    knobColor: `linear-gradient(to bottom, ${fore}, ${foresub})`,
    knobGuide: gray,
    knobNotch: black,
    knobBorder: black,
    knobGutter: black,
    knobShadow: '#0000',

    accent: cyan,
    accentBright: `color-mix(in oklab, ${cyan} 50%, ${fore} 50%)`,
    accentGray: `color-mix(in oklab, ${cyan} 50%, ${gray} 50%)`,
    green: cyan,
    error: red,

    levelMeter: `linear-gradient(
      to bottom,
      ${red} 20%,
      #d0edff 20%,
      #aec5d5 47%,
      #8b9eab 73%,
      #697681 100%
    )`,
  },
  code: {
    text: fore,
    background,
    keywords: red,
    processors: red,
    operators: red,
    types: cyan,
    constants: constblue,
    strings: yellow,
    comments: gray,
    invalid: red,
    panels: background,
    tooltips: background,
    gutterText: gray,
    gutterBackground: background,
    foldPlaceholders: gray,
    searchMatch: yellow + '22',
    searchSelected: orange + '88',
    backlayer: '#000000',
    dark: true,
  },
};
