import { Command, EditorView, KeyBinding } from '@codemirror/view';

function findNearestChar(
  text: string,
  position: number,
  dir: -1 | 1,
  char: string,
): number {
  let result = -1;

  if (dir < 0) {
    const i = text.lastIndexOf(char, position - 1);
    if (i !== -1) {
      result = i;
    }
  } else {
    const i = text.indexOf(char, position);
    if (i !== -1) {
      result = i;
    }
  }

  return result;
}

function findMatchingCloseBracket(
  text: string,
  position: number,
): number {
  let current = position + 1;
  let result = -1;
  let nest = 1;

  while (current < text.length) {
    const posOpen = text.slice(current).indexOf('{');
    const posClose = text.slice(current).indexOf('}');

    if (posOpen === -1 && posClose === -1) {
      break;
    }

    let pos: number;
    if (posOpen === -1) {
      pos = posClose;
    } else if (posClose === -1) {
      pos = posOpen;
    } else {
      pos = Math.min(posOpen, posClose);
    }

    nest += pos === posOpen ? 1 : -1;

    if (nest === 0) {
      result = current + pos;
      break;
    } else {
      current += pos + 1;
    }
  }

  return result;
}

function findMatchingOpenBracket(
  text: string,
  position: number,
): number {
  let current = position;
  let result = -1;
  let nest = 1;

  while (current >= 0) {
    const posOpen = text.slice(0, current).lastIndexOf('{');
    const posClose = text.slice(0, current).lastIndexOf('}');

    if (posOpen === -1 && posClose === -1) {
      break;
    }

    const pos = Math.max(posOpen, posClose);
    nest += pos === posClose ? 1 : -1;

    if (nest === 0) {
      result = pos;
      break;
    } else {
      current = pos;
    }
  }

  return result;
}

const braceJump = (view: EditorView, dir: -1 | 1) => {
  const value = view.state.doc.toString();
  const selection = view.state.selection.main;

  const pos = selection.from;
  const bracketStart = dir === -1
    ? findNearestChar(value, pos, -1, '{')
    : findNearestChar(value, pos + 1, 1, '{');
  if (bracketStart === -1) {
    return true;
  }

  const bracketEnd = findMatchingCloseBracket(value, bracketStart);
  if (bracketEnd === -1) {
    return true;
  }

  const anchor = bracketStart;
  const head = bracketEnd + 1;
  const scrollEffect = EditorView.scrollIntoView(bracketStart, { y: 'center' });
  view.dispatch(
    { selection: { anchor, head } },
    { effects: scrollEffect },
  );

  return true;
};

const braceJumpPrev: Command = (view) => braceJump(view, -1);
const braceJumpNext: Command = (view) => braceJump(view, 1);

const braceExtend = (view: EditorView, dir: -1 | 1): boolean => {
  const value = view.state.doc.toString();
  let head = view.state.selection.main.head;
  let anchor = view.state.selection.main.anchor;

  const openPos = findNearestChar(value, head, dir, '{');
  const closePos = findNearestChar(value, head, dir, '}');

  if (openPos === -1 && closePos === -1) {
    return true;
  }

  // const siblingPos = dir === -1
  //   ? findNearestChar( value, selection.from, -1, '}' )
  //   : findNearestChar( value, selection.to, 1, '{' );
  // const parentPos = dir === -1
  //   ? findNearestChar( value, selection.from, -1, '{' )
  //   : findNearestChar( value, selection.to, 1, '}' );

  // if ( siblingPos === -1 && parentPos === -1 ) {
  //   return true;
  // }

  if (dir === -1) {
    if (closePos === -1 || closePos < openPos) {
      return true;
    }

    const matching = findMatchingOpenBracket(value, closePos);
    if (matching === -1) {
      return true;
    }

    if (matching === anchor) {
      anchor = head;
    }
    head = matching;

    if (anchor < head) {
      const headCand = findNearestChar(value, head, -1, '}');
      if (headCand !== -1) {
        head = headCand + 1;
      }
    }
  } else {
    if (openPos === -1 || (closePos !== -1 && closePos < openPos)) {
      return true;
    }

    const matching = findMatchingCloseBracket(value, openPos) + 1;
    if (matching === 0) {
      return true;
    }

    if (matching === anchor) {
      anchor = head;
    }
    head = matching;

    if (anchor > head) {
      const headCand = findNearestChar(value, head, 1, '{');
      if (headCand !== -1) {
        head = headCand;
      }
    }
  }

  const scrollEffect = EditorView.scrollIntoView(head, { y: 'center' });
  view.dispatch(
    { selection: { anchor, head } },
    { effects: scrollEffect },
  );

  return true;
};

const braceExtendPrev: Command = (view) => braceExtend(view, -1);
const braceExtendNext: Command = (view) => braceExtend(view, 1);

/**
 * Provides 0mix style bracket jumping.
 * `Mod-ArrowUp` jumps to the previous bracket.
 * `Mod-ArrowDown` jumps to the next bracket.
 * `Mod-Shift-ArrowUp` extends the selection to the previous bracket.
 * `Mod-Shift-ArrowDown` extends the selection to the next bracket.
 */
export const braceJumpKeymap: readonly KeyBinding[] = [
  { key: 'Mod-,', run: braceJumpPrev, shift: braceExtendPrev },
  { key: 'Mod-.', run: braceJumpNext, shift: braceExtendNext },
];
