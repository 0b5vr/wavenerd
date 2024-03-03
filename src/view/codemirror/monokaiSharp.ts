import { createCMTheme } from './createCMTheme';

const black = '#191a1f';
const gray2 = '#30343b';
const gray8 = '#75848f';
const white = '#d0edff';
const invalidred = '#ff0000';
const red = '#ff0066';
const orange = '#ff5a1f';
const yellow = '#f7f025';
const blue = '#00aaff';
const constblue = '#8a8aff';

const { extensions: monokaiSharp } = createCMTheme( {
  text: white,
  background: black,
  keywords: red,
  types: blue,
  constants: constblue,
  strings: yellow,
  comments: gray8,
  invalid: invalidred,
  panels: gray2,
  tooltips: gray2,
  gutterText: gray8,
  gutterBackground: black,
  foldPlaceholders: gray8,
  searchMatch: yellow + '22',
  searchSelected: orange + '88',
  backlayer: 'none',
} );

export { monokaiSharp };
