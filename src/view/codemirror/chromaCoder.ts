import { createCMTheme } from './createCMTheme';

const black = '#191a1f';
const background = '#00ff00';
const gray2 = '#30343b';
const gray8 = '#75848f';
const white = '#ffffff';
const invalidred = '#ff0000';
const red = '#ff0066';
const orange = '#ff5a1f';
const yellow = '#f7f025';
const blue = '#00aaff';
const constblue = '#8a8aff';

const { extensions: chromaCoder } = createCMTheme( {
  text: white,
  background,
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
  backlayer: '#000000',
} );

export { chromaCoder };
