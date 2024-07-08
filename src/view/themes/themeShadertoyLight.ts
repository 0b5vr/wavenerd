import { Theme } from './Theme';

const black = '#000';
const gray2 = '#222';
const gray5 = '#555';
const gray8 = '#888';
const white = '#fff';
const red = '#f00';
const blue = '#00f';
const green = '#0b0';
const highlightYellow = '#f8b030';

const pageBackground = '#d0d0d0';
const barBg = '#f0f0f0';
const headerBg = '#404040';

const text = '#000';
const background = '#fff';
const processors = '#555';
const keywords = '#708';
const constants = '#164';
const strings = '#a11';
const comments = '#a50';
const gutterText = '#999';
const gutterBackground = '#f7f7f7';

const invalidred = '#ff0000';
const redDark = '#920000';
const blueBright = '#67b9ff';

export const themeShadertoyLight: Theme = {
  ui: {
    black,
    white,

    back1: pageBackground,
    back2: barBg,
    back3: headerBg,

    barBg,
    headerBg,
    headerFg: white,

    inputBack: pageBackground,
    inputFore: black,
    inputBackInvalid: redDark,

    fore: black,
    foresub: gray2,
    foredark: gray5,

    gray: gray8,

    knobColor: `linear-gradient(to bottom, ${ gray2 }, ${ black })`,
    knobGutter: headerBg,
    knobShadow: '#0004',

    accent: blue,
    accentBright: blueBright,
    green: green,
    error: red,

    levelMeter: `linear-gradient(
      to bottom,
      #f00 20%,
      #ff0 20%,
      #0f0 100%
    )`,
  },
  code: {
    text,
    background,
    keywords,
    processors,
    operators: text,
    types: keywords,
    constants,
    strings,
    comments,
    invalid: invalidred,
    panels: highlightYellow,
    tooltips: highlightYellow,
    gutterText,
    gutterBackground,
    foldPlaceholders: blue,
    searchMatch: '#ff06',
    searchSelected: '#ff06',
    backlayer: 'none',
    dark: false,
  },
};
