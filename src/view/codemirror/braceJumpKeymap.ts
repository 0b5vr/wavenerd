import { EditorView, type KeyBinding } from '@codemirror/view';
import { findAllBracePairs } from '../../utils/findAllBracePairs';
import { binarySearch, clamp } from '@0b5vr/experimental';

const braceJump = (view: EditorView, dir: -1 | 1, onBraceJump?: (index: number) => void) => {
  const value = view.state.doc.toString();
  const bracePairs = findAllBracePairs(value);

  const selection = view.state.selection.main;

  // find the nearest brace pair
  const currentIndex = binarySearch(bracePairs, (pair) => {
    return pair.from < selection.head;
  });
  const leftBracePair = bracePairs[currentIndex - 1];
  const rightBracePair = bracePairs[currentIndex];

  let newIndex = currentIndex;

  if (rightBracePair?.from === selection.from && rightBracePair?.to === selection.to) {
    // if the right brace pair is the same as the selection, move to the next or previous brace pair
    newIndex = clamp(currentIndex + dir, 0, bracePairs.length - 1);
  } else {
    // otherwise, move to the nearest brace pair
    if (leftBracePair?.to > selection.head) {
      // if the cursor is inside the left brace pair, choose the left brace pair
      newIndex = currentIndex - 1;
    } else if (dir === -1) {
      // if the cursor is outside the left brace pair and moving up, choose the left brace pair
      newIndex = currentIndex - 1;
      if (newIndex < 0) {
        return true;
      }
    } else {
      // if the cursor is outside the current brace pair and moving down, choose the next brace pair
      newIndex = currentIndex;
      if (newIndex >= bracePairs.length) {
        return true;
      }
    }
  }

  const newBracePair = bracePairs[newIndex];

  const head = newBracePair.from;
  const anchor = newBracePair.to;
  const scrollEffect = EditorView.scrollIntoView(head, { y: 'center' });
  view.dispatch(
    { selection: { head, anchor } },
    { effects: scrollEffect },
  );

  onBraceJump?.(newIndex);

  return true;
};

const braceExtend = (view: EditorView, dir: -1 | 1, onBraceJump?: (index: number) => void): boolean => {
  const value = view.state.doc.toString();
  const bracePairs = findAllBracePairs(value);

  const selection = view.state.selection.main;

  // find the indices of the brace pairs that are inside the selection
  // also get the shallowest depth of the selected brace pairs
  const selectedIndices: number[] = [];
  let selectedDepth = 2147483647;
  for (let i = 0; i < bracePairs.length; i++) {
    if (bracePairs[i].from >= selection.from && bracePairs[i].to <= selection.to) {
      selectedIndices.push(i);
      selectedDepth = Math.min(selectedDepth, bracePairs[i].depth);
    }
  }

  // if there are no selected brace pairs, perform the brace jump instead
  if (selectedIndices.length === 0) {
    return braceJump(view, dir);
  }

  // make sure the selected brace pairs are siblings
  let parentIndex = -1;
  const selectedSibIndices: number[] = [];
  for (let i = 0; i < selectedIndices.length; i++) {
    const index = selectedIndices[i];
    const bracePair = bracePairs[index];

    if (bracePair.depth !== selectedDepth) {
      continue;
    }
    selectedSibIndices.push(index);

    const parentIndexCand = bracePairs.slice(0, index).findLastIndex((pair) => pair.depth < bracePair.depth);

    if (i === 0) { // first selected brace pair
      parentIndex = parentIndexCand;
    } else { // subsequent selected brace pairs
      if (parentIndexCand !== parentIndex) {
        // oh no they are not siblings
        return true;
      }
    }
  }

  // list the children of the parent
  const sibIndices: number[] = [];
  for (let i = parentIndex + 1; i < bracePairs.length; i++) {
    if (bracePairs[i].depth === selectedDepth) {
      sibIndices.push(i);
    } else if (bracePairs[i].depth < selectedDepth) {
      break;
    }
  }

  // list the selected children
  let sibIndicesIndexFrom = sibIndices.indexOf(selectedSibIndices[0]);
  let sibIndicesIndexTo = sibIndices.indexOf(selectedSibIndices[selectedSibIndices.length - 1]);

  // let's shrink or extend the selection
  let isCursorLeft = selection.head < selection.anchor;

  if (dir === -1) {
    if (isCursorLeft) {
      // extend the left side backward
      sibIndicesIndexFrom = Math.max(sibIndicesIndexFrom - 1, 0);
    } else {
      if (selectedSibIndices.length === 1) {
        // swap the cursor
        isCursorLeft = !isCursorLeft;
      } else {
        // shrink the right side backward
        sibIndicesIndexTo = sibIndicesIndexTo - 1;
      }
    }
  } else {
    if (!isCursorLeft) {
      // extend the right side forward
      sibIndicesIndexTo = Math.min(sibIndicesIndexTo + 1, sibIndices.length - 1);
    } else {
      if (selectedSibIndices.length === 1) {
        // swap the cursor
        isCursorLeft = !isCursorLeft;
      } else {
        // shrink the left side forward
        sibIndicesIndexFrom = sibIndicesIndexFrom + 1;
      }
    }
  }

  const from = bracePairs[sibIndices[sibIndicesIndexFrom]].from;
  const to = bracePairs[sibIndices[sibIndicesIndexTo]].to;
  const head = isCursorLeft ? from : to;
  const anchor = isCursorLeft ? to : from;

  const scrollEffect = EditorView.scrollIntoView(head, { y: 'center' });
  view.dispatch(
    { selection: { anchor, head } },
    { effects: scrollEffect },
  );

  const indexToFocus = isCursorLeft ? sibIndices[sibIndicesIndexFrom] : sibIndices[sibIndicesIndexTo];
  onBraceJump?.(indexToFocus);

  return true;
};

/**
 * Provides 0mix style bracket jumping.
 * `Mod-ArrowUp` jumps to the previous bracket.
 * `Mod-ArrowDown` jumps to the next bracket.
 * `Mod-Shift-ArrowUp` extends the selection to the previous bracket.
 * `Mod-Shift-ArrowDown` extends the selection to the next bracket.
 */
export function braceJumpKeymap({ onBraceJump }: {
  onBraceJump?: (index: number) => void;
}): readonly KeyBinding[] {
  return [
    {
      key: 'Mod-,',
      run: (target) => {
        const result = braceJump(target, -1, onBraceJump);
        return result;
      },
      shift: (target) => {
        const result = braceExtend(target, -1, onBraceJump);
        return result;
      },
    },
    {
      key: 'Mod-.',
      run: (target) => {
        const result = braceJump(target, 1, onBraceJump);
        return result;
      },
      shift: (target) => {
        const result = braceExtend(target, 1, onBraceJump);
        return result;
      },
    },
  ];
}
