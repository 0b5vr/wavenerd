import { Theme } from './Theme';

const back1 = '#000000';
const back2 = '#090909';
const back3 = '#181818';
const back4 = '#282828';

const gray = '#999999';

const fore = '#ffffff';
const foresub = '#bbbbbb';
const foredark = '#999999';

const background = '#00ff00';

const invalidred = '#ff0000';
const red = '#ff2255';
const redDark = '#990011';
const orange = '#ff5a1f';
const yellow = '#f7f025';
const blue = '#5599ff';
const blueBright = '#82beff';
const cyan = '#00ccff';
const constblue = '#ae78ff';

export const themeChromaCoder: Theme = {
  ui: {
    black: '#000000',
    white: '#ffffff',

    back1,
    back2,
    back3,

    codeBackground: background,

    inputBack: back4,
    inputFore: fore,
    inputBackInvalid: redDark,

    fore,
    foresub,
    foredark,

    gray,

    knobColor: `linear-gradient(to bottom, ${ fore }, ${ foresub })`,
    knobShadow: '#0008',

    accent: blue,
    accentBright: blueBright,
    green: cyan,
    error: red,

    levelMeter: `linear-gradient(
      to bottom,
      ${ red } 20%,
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
    invalid: invalidred,
    panels: back3,
    tooltips: back3,
    gutterText: gray,
    gutterBackground: back1,
    foldPlaceholders: gray,
    searchMatch: yellow + '22',
    searchSelected: orange + '88',
    backlayer: '#000000',
    dark: true,
  },
};
