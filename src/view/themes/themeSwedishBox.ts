import { Theme } from './Theme';

const black = '#000000';
const white = '#ffffff';

const back1 = '#0f0f0f';
const back2 = '#191919';
const back3 = '#282828';
const back4 = '#363636';

const gray = '#6f6f6f';

const fore = '#d5d5d5';
const foresub = '#a9a9a9';
const foredark = '#888888';

const red = '#f71122';
const redDark = '#a30a4a';
const redBright = '#ff4f4f';
const redGray = '#a54950';
const green = '#62f74f';

export const themeSwedishBox: Theme = {
  ui: {
    black,
    white,

    back1,
    back2,
    back3,

    listBg: back2,
    listHoverBg: back3,
    listFocusedBg: back4,

    codeBackground: black,

    inputBack: back4,
    inputFore: fore,
    inputBackInvalid: redDark,

    fore,
    foresub,
    foredark,

    gray,

    knobColor: `linear-gradient(to bottom, ${back3}, ${back2})`,
    knobGuide: gray,
    knobNotch: fore,

    accent: red,
    accentBright: redBright,
    accentGray: redGray,
    green: green,
    error: red,

    levelMeter: `linear-gradient(
      to bottom,
      ${red} 20%,
      ${white} 20%,
      ${white} 100%
    )`,
  },
  code: {
    text: white,
    background: black,
    keywords: red,
    processors: red,
    operators: red,
    types: green,
    constants: white,
    strings: white,
    comments: gray,
    invalid: red,
    panels: black,
    tooltips: black,
    gutterText: white,
    gutterBackground: black,
    foldPlaceholders: white,
    searchMatch: white + '22',
    searchSelected: white + '44',
    backlayer: 'none',
    dark: true,
  },
};
