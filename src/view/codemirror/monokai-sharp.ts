import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';

// -- colors ---------------------------------------------------------------------------------------
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

// -- editor theme ---------------------------------------------------------------------------------
const monokaiSharpTheme = EditorView.theme( {
  '&': {
    color: white,
    backgroundColor: black,
  },
  '.cm-content': {
    caretColor: white,
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: white,
  },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: white + '44',
  },
  '.cm-panels': {
    backgroundColor: gray2,
    color: white,
  },
  '.cm-panels.cm-panels-top': {
    borderBottom: `2px solid ${ black }`,
  },
  '.cm-panels.cm-panels-bottom': {
    borderTop: `2px solid ${ black }`,
  },
  '.cm-searchMatch': {
    backgroundColor: yellow + '44',
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: orange + '88',
  },
  '.cm-activeLine': {
    backgroundColor: white + '11',
  },
  '.cm-selectionMatch': {
    backgroundColor: white + '22',
  },
  '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
    backgroundColor: white + '44',
  },
  '.cm-gutters': {
    backgroundColor: black,
    color: gray8,
    border: 'none'
  },
  '.cm-activeLineGutter': {
    backgroundColor: white + '11',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'transparent',
    border: 'none',
    color: gray8,
  },
  '.cm-tooltip': {
    border: 'none',
    backgroundColor: gray2
  },
  '.cm-tooltip .cm-tooltip-arrow:before': {
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent'
  },
  '.cm-tooltip .cm-tooltip-arrow:after': {
    borderTopColor: gray2,
    borderBottomColor: gray2
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: gray2,
      color: white,
    }
  }
}, { dark: true } );

// -- syntax highlighting --------------------------------------------------------------------------
const monokaiSharpHighlightStyle =  HighlightStyle.define( [
  {
    tag: [
      tags.keyword,
      tags.modifier,
      tags.processingInstruction,
      tags.operator,
      tags.operatorKeyword,
    ],
    color: red,
  },
  {
    tag: [
      tags.color,
      tags.typeName,
      tags.constant( tags.name ),
      tags.standard( tags.name ),
    ],
    color: blue,
  },
  {
    tag: [
      tags.number,
      tags.bool,
    ],
    color: constblue,
  },
  {
    tag: [
      tags.meta,
      tags.comment,
    ],
    color: gray8,
  },
  {
    tag: [
      tags.string,
    ],
    color: yellow,
  },
  {
    tag: tags.invalid,
    color: invalidred,
  },
] );

const monokaiSharp = [ monokaiSharpTheme, syntaxHighlighting( monokaiSharpHighlightStyle ) ];

export { monokaiSharp, monokaiSharpHighlightStyle, monokaiSharpTheme };
