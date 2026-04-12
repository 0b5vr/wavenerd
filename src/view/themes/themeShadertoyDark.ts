import { Theme } from './Theme';

const black = '#000';
const gray8 = '#888';
const grayB = '#bbb';
const grayD = '#ddd';
const white = '#fff';
const red = '#f00';
const blue = '#00f';
const green = '#0b0';
const highlightYellow = '#b05010';

const pageBackground = '#202020';
const barBg = '#404040';
const headerBg = '#383838';

const text = '#b0b0b0';
const background = '#000';
const processors = '#888';
const keywords = '#689';
const constants = '#968';
const strings = '#a11';
const comments = '#794';
const gutterText = '#999';
const gutterBackground = '#000';

export const themeShadertoyDark: Theme = {
  ui: {
    black,
    white,

    back1: pageBackground,
    back2: barBg,
    back3: headerBg,

    codeBackground: background,

    barBg,
    headerBg,
    headerFg: white,

    inputBack: pageBackground,
    inputFore: white,
    inputBackInvalid: `color-mix(in oklab, ${red} 60%, ${pageBackground} 40%)`,

    fore: white,
    foresub: grayD,
    foredark: grayB,

    gray: gray8,

    knobColor: `linear-gradient(to bottom, ${white}, ${grayD})`,
    knobGutter: pageBackground,
    knobShadow: '#0004',

    accent: blue,
    accentBright: `color-mix(in oklab, ${blue} 50%, ${white} 50%)`,
    accentGray: `color-mix(in oklab, ${blue} 50%, ${gray8} 50%)`,
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
    invalid: red,
    panels: highlightYellow,
    tooltips: highlightYellow,
    gutterText,
    gutterBackground,
    foldPlaceholders: blue,
    searchMatch: '#ff02',
    searchSelected: '#ff06',
    backlayer: 'none',
    dark: true,
  },
};
