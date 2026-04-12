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

export const themeSolarizedDark: Theme = {
  ui: {
    black: '#000000',
    white: '#ffffff',

    back1: base03,
    back2: base02,
    back3: base02,

    listBg: base03,
    listHoverBg: base02,
    listFocusedBg: base01,
    listFocusedFg: base3,

    codeBackground: base03,

    inputBack: base01,
    inputFore: base3,
    inputBackInvalid: `color-mix(in oklab, ${red} 60%, ${base01} 40%)`,

    fore: base1,
    foresub: base0,
    foredark: base0,

    gray: base00,

    knobColor: `linear-gradient(to bottom, ${base3}, ${base2})`,
    knobGutter: base03,
    knobShadow: 'transparent',

    accent: blue,
    accentBright: `color-mix(in oklab, ${blue} 50%, ${base1} 50%)`,
    accentGray: `color-mix(in oklab, ${blue} 50%, ${base00} 50%)`,
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
    text: base0,
    background: base03,
    keywords: green,
    processors: red,
    operators: green,
    types: blue,
    constants: magenta,
    strings: yellow,
    comments: base01,
    invalid: red,
    panels: base02,
    tooltips: base02,
    gutterText: base01,
    gutterBackground: base02,
    foldPlaceholders: base01,
    searchMatch: yellow + '22',
    searchSelected: orange + '88',
    backlayer: 'none',
    dark: true,
  },
};
