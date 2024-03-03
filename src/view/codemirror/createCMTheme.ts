import { EditorView, Extension } from '@uiw/react-codemirror';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

export function createCMTheme( {
  text,
  background,
  keywords,
  types,
  constants,
  strings,
  comments,
  invalid,
  panels,
  tooltips,
  gutterText,
  gutterBackground,
  foldPlaceholders,
  searchMatch,
  searchSelected,
  backlayer,
}: {
  text: string,
  background: string,
  keywords: string,
  types: string,
  constants: string,
  strings: string,
  comments: string,
  invalid: string,
  panels: string,
  tooltips: string,
  gutterText: string,
  gutterBackground: string,
  foldPlaceholders: string,
  searchMatch: string,
  searchSelected: string,
  backlayer: string,
} ): {
  extensions: Extension[],
  highlightStyle: HighlightStyle,
  theme: Extension,
  } {
  const theme = EditorView.theme( {
    '&': {
      width: 'fit-content',
      color: text,
      backgroundColor: background,
    },
    '.cm-content': {
      caretColor: text,
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: text,
    },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: text + '44',
    },
    '.cm-scroller': {
      overflow: 'visible',
    },
    '.cm-panels': {
      backgroundColor: panels,
      color: text,
    },
    '.cm-panels.cm-panels-top': {
      borderBottom: `2px solid ${ background }`,
    },
    '.cm-panels.cm-panels-bottom': {
      borderTop: `2px solid ${ background }`,
    },
    '.cm-searchMatch': {
      backgroundColor: searchMatch,
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: searchSelected,
    },
    '.cm-activeLine': {
      backgroundColor: text + '11',
    },
    '.cm-selectionMatch': {
      backgroundColor: text + '22',
    },
    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      backgroundColor: text + '44',
    },
    '.cm-gutters': {
      backgroundColor: gutterBackground,
      color: gutterText,
      border: 'none'
    },
    '.cm-activeLineGutter': {
      backgroundColor: text + '11',
    },
    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: foldPlaceholders,
    },
    '.cm-tooltip': {
      border: 'none',
      backgroundColor: tooltips,
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent'
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: tooltips,
      borderBottomColor: tooltips,
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: tooltips,
        color: text,
      }
    },
    '.cm-backlayer': {
      backgroundColor: backlayer,
    },
  }, { dark: true } );

  // -- syntax highlighting --------------------------------------------------------------------------
  const highlightStyle =  HighlightStyle.define( [
    {
      tag: [
        tags.keyword,
        tags.modifier,
        tags.processingInstruction,
        tags.operator,
        tags.operatorKeyword,
      ],
      color: keywords,
    },
    {
      tag: [
        tags.color,
        tags.typeName,
        tags.constant( tags.name ),
        tags.standard( tags.name ),
      ],
      color: types,
    },
    {
      tag: [
        tags.number,
        tags.bool,
      ],
      color: constants,
    },
    {
      tag: [
        tags.meta,
        tags.comment,
      ],
      color: comments,
    },
    {
      tag: [
        tags.string,
      ],
      color: strings,
    },
    {
      tag: tags.invalid,
      color: invalid,
    },
  ] );

  const extensions = [ theme, syntaxHighlighting( highlightStyle ) ];

  return { extensions, highlightStyle, theme };
}
