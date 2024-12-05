import { Theme } from './Theme';

const black = '#000000';
const white = '#ffffff';

const back1 = '#c9c5c1';
const back2 = '#e4ded9';
const back3 = '#e4ded9';
const back4 = '#ffffff';

const gray = '#6f6f6f';

const fore = '#652f17';
const foresub = '#251f17';
const foredark = '#181411';

const red = '#f71122';
const redDark = '#a30a4a';
const redBright = '#ff4f4f';
const green = '#66990f';

const lcdbg = '#f5482f';
const lcdfg = '#251205';

export const themeSwedishMachine: Theme = {
  ui: {
    black,
    white,

    back1,
    back2,
    back3,

    codeBackground: lcdbg,

    inputBack: back4,
    inputFore: fore,
    inputBackInvalid: redDark,

    fore,
    foresub,
    foredark,

    gray,

    knobColor: 'linear-gradient(to bottom, #222833, #181922)',
    knobGuide: gray,
    knobNotch: back1,
    knobBorder: 'transparent',
    knobGutter: black,

    accent: red,
    accentBright: redBright,
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
    text: lcdfg,
    background: black,
    keywords: lcdfg,
    processors: lcdfg,
    operators: lcdfg,
    types: lcdfg,
    constants: lcdfg,
    strings: lcdfg,
    comments: lcdfg,
    invalid: lcdfg,
    panels: lcdbg,
    tooltips: lcdbg,
    gutterText: lcdfg,
    gutterBackground: lcdbg,
    foldPlaceholders: lcdfg,
    searchMatch: white + '22',
    searchSelected: white + '44',
    backlayer: 'none',
    dark: false,
  },
};
