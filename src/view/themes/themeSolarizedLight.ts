import { Theme } from './Theme';

const base03 = '#002b36';
const base02 = '#073642';
const base01 = '#586e75';
const base00 = '#657b83';
const base0 = '#839496';
const base1 = '#93a1a1';
const base2 = '#eee8d5';
const base3 = '#fdf6e3';
const yellow = '#b58900';
const orange = '#cb4b16';
const red = '#dc322f';
const magenta = '#d33682';
// const violet = '#6c71c4';
const blue = '#268bd2';
const cyan = '#2aa198';
const green = '#859900';

const invalidred = '#ff0000';
const redDark = '#920000';
const blueBright = '#67b9ff';

export const themeSolarizedLight: Theme = {
  ui: {
    black: '#000000',
    white: '#ffffff',

    back1: base3,
    back2: base2,
    back3: base2,

    codeBackground: base3,

    inputBack: base1,
    inputFore: base03,
    inputBackInvalid: redDark,

    fore: base01,
    foresub: base00,
    foredark: base00,

    gray: base0,

    knobColor: `linear-gradient(to bottom, ${base02}, ${base03})`,
    knobShadow: base1,

    accent: blue,
    accentBright: blueBright,
    green: green,
    error: red,

    levelMeter: `linear-gradient(
      to bottom,
      ${red} 20%,
      ${yellow} 20%,
      ${cyan} 100%
    )`,
  },
  code: {
    text: base00,
    background: base3,
    keywords: green,
    processors: red,
    operators: green,
    types: blue,
    constants: magenta,
    strings: yellow,
    comments: base1,
    invalid: invalidred,
    panels: base2,
    tooltips: base2,
    gutterText: base1,
    gutterBackground: base2,
    foldPlaceholders: base1,
    searchMatch: yellow + '22',
    searchSelected: orange + '88',
    backlayer: 'none',
    dark: false,
  },
};
