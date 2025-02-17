import { Theme } from './Theme';

const back1 = '#191a1f';
const back2 = '#24272d';
const back3 = '#30343b';
const back4 = '#3b4249';

const gray2 = '#30343b';
const gray8 = '#75848f';

const fore = '#d0edff';
const foresub = '#b9d3e3';
const foredark = '#97abb9';

const red = '#ff0066';
const redDark = '#a30a4a';
const orange = '#ff5a1f';
const yellow = '#f7f025';
const green = '#00ff91';
const blue = '#00aaff';
const blueBright = '53c5ff';
const constblue = '#8a8aff';

export const themeMonokaiSharp: Theme = {
  ui: {
    black: '#000000',
    white: '#ffffff',

    back1,
    back2,
    back3,

    listBg: back2,
    listHoverBg: back3,
    listFocusedBg: back4,

    codeBackground: back1,

    inputBack: back4,
    inputFore: fore,
    inputBackInvalid: redDark,

    fore,
    foresub,
    foredark,

    gray: '#697681',

    knobColor: `linear-gradient(to bottom, ${fore}, ${foresub})`,
    knobShadow: '#0008',

    accent: blue,
    accentBright: blueBright,
    green: green,
    error: red,

    levelMeter: `linear-gradient(
      to bottom,
      ${red} 20%,
      #faffb8 20%,
      #c5f0a4 47%,
      #35b0ab 73%,
      #226b80 100%
    )`,
  },
  code: {
    text: fore,
    background: back1,
    keywords: red,
    processors: red,
    operators: red,
    types: blue,
    constants: constblue,
    strings: yellow,
    comments: gray8,
    invalid: red,
    panels: gray2,
    tooltips: gray2,
    gutterText: gray8,
    gutterBackground: back1,
    foldPlaceholders: gray8,
    searchMatch: yellow + '22',
    searchSelected: orange + '88',
    backlayer: 'none',
    dark: true,
  },
};
