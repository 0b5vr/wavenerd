import { EditorView, type Extension } from '@uiw/react-codemirror';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { type Theme } from '../themes/Theme';
import { tags } from '@lezer/highlight';

export function createCMTheme(theme: Theme): {
  extensions: Extension[];
  highlightStyle: HighlightStyle;
  theme: Extension;
  background: string;
} {
  const {
    text,
    background,
    keywords,
    processors,
    operators,
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
    dark,
  } = theme.code;

  const cmTheme = EditorView.theme({
    '&': {
      width: 'fit-content',
      minWidth: '100%',
      color: text,
    },
    '&.cm-focused': {
      outline: 'none',
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
    '.cm-button': {
      background,
      color: text,
    },
    '.cm-panels.cm-panels-top': {
      borderBottom: `2px solid ${background}`,
    },
    '.cm-panels.cm-panels-bottom': {
      borderTop: `2px solid ${background}`,
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
      border: 'none',
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
      borderBottomColor: 'transparent',
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: tooltips,
      borderBottomColor: tooltips,
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: tooltips,
        color: text,
      },
    },
    '.cm-backlayer': {
      backgroundColor: backlayer,
    },
    '.cm-errorlayer': {
      borderBottom: '2px solid ' + invalid,
    },
  }, { dark });

  // -- syntax highlighting --------------------------------------------------------------------------
  const highlightStyle = HighlightStyle.define([
    {
      tag: [
        tags.keyword,
        tags.modifier,
      ],
      color: keywords,
    },
    {
      tag: [
        tags.processingInstruction,
      ],
      color: processors,
    },
    {
      tag: [
        tags.operator,
        tags.operatorKeyword,
      ],
      color: operators,
    },
    {
      tag: [
        tags.color,
        tags.typeName,
        tags.constant(tags.name),
        tags.standard(tags.name),
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
  ]);

  const extensions = [cmTheme, syntaxHighlighting(highlightStyle)];

  return { background, extensions, highlightStyle, theme: cmTheme };
}
