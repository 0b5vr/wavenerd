import { type PrimitiveAtom, useAtomValue } from 'jotai';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { findAllBracePairs } from '../../utils/findAllBracePairs';
import { useSettings } from '../stores/hooks/useSettings';
import { arraySerial } from '@0b5vr/experimental';
import styles from './DeckBraceJumpMap.module.css';
import clsx from 'clsx';

// == functions ====================================================================================
/**
 * Check if a given line is a comment line, starting with `//` after optional whitespace.
 */
function testCommentLine(str: string): boolean {
  const trimmed = str.trimStart();
  return trimmed.startsWith('//');
}

/**
 * Returns an array of position of inline comment `//`s in the given string.
 *
 * E.g., for the string `  // { // comment`, it returns `[2, 7]`.
 */
function getCommentPositions(str: string): number[] {
  const matches = str.matchAll(/\/\//g);
  return Array.from(matches).map((match) => match.index ?? 0);
}

// == microcomponents ==============================================================================
function BracePair({ str, distanceFromCenter, isSelected }: {
  str: string | undefined;
  distanceFromCenter: number;
  isSelected: boolean;
}) {
  const font = useSettings('editorFont');
  const fontVariantLigatures = useSettings('editorFontVariantLigatures');

  const isCommentLine = useMemo(() => {
    if (str == null) { return false; }
    return testCommentLine(str);
  }, [str]);

  const commentHighlightPos = useMemo(() => {
    if (str == null) { return 0; }

    const commentPositions = getCommentPositions(str);
    if (isCommentLine) {
      return commentPositions[1] ?? str.length;
    } else {
      return commentPositions[0] ?? str.length;
    }
  }, [isCommentLine, str]);

  const pairCls = clsx(
    'pl-1 whitespace-pre',
    distanceFromCenter === 0 && 'border border-fore',
    isSelected && 'bg-fore/25',
  );

  if (str === undefined) {
    return (
      <div
        className={pairCls}
        style={{ font }}
      >
        <span className="text-fore" style={{ fontVariantLigatures }}>&nbsp;</span>
      </div>
    );
  }

  return (
    <div
      className={pairCls}
      style={{ font }}
    >
      <span style={{ fontVariantLigatures }}>
        <span className={isCommentLine ? 'text-gray' : 'text-fore'}>
          {str.substring(0, commentHighlightPos)}
        </span>
        <span className={isCommentLine ? 'text-accent-gray' : 'text-accent'}>
          {str.substring(commentHighlightPos)}
        </span>
      </span>
    </div>
  );
}

// == constants ===================================================================================
/**
 * How long the map stays visible, in milliseconds.
 * Should match the animation of `.boxFadeOut` in `DeckBraceJumpMap.module.css`.
 */
const VISIBLE_DURATION = 2000;

// == component ====================================================================================
export interface DeckBraceJumpMapHandle {
  /**
   * Show the map centered at the given brace pair index.
   */
  update: (index: number) => void;

  /**
   * Extend the visible duration if the map is currently visible.
   * If the map is not currently visible, this does nothing.
   */
  extend: () => void;
}

interface Props {
  codeAtom: PrimitiveAtom<string>;
  editorSelectionAtom: PrimitiveAtom<{ from: number; to: number }>;
  className?: string;
}

const DeckBraceJumpMapInside = forwardRef(({
  codeAtom,
  editorSelectionAtom,
  className,
}: Props, ref: React.Ref<DeckBraceJumpMapHandle>) => {
  const scale = useSettings('editorBraceJumpMapScale');

  const [centerIndex, setCenterIndex] = useState(0);
  const [key, setKey] = useState(0);

  const code = useAtomValue(codeAtom);
  const selection = useAtomValue(editorSelectionAtom);
  const bracePairs = useMemo(() => findAllBracePairs(code), [code]);

  const refLastShown = useRef(-Infinity);

  /**
   * Show the map centered at the given brace pair index.
   */
  const update = useCallback((index: number) => {
    setCenterIndex(index);
    setKey((key) => key + 1);
    refLastShown.current = performance.now();
  }, []);

  /**
   * Extend the visible duration if the map is currently visible.
   * If the map is not currently visible, this does nothing.
   */
  const extend = useCallback(() => {
    if (performance.now() - refLastShown.current < VISIBLE_DURATION) {
      setKey((key) => key + 1);
      refLastShown.current = performance.now();
    }
  }, []);

  useImperativeHandle(ref, () => ({ update, extend }), [update, extend]);

  return (
    <div className={`absolute inset-0 flex justify-end items-center pointer-events-none ${className ?? ''}`}>
      <div
        key={key}
        className={clsx(
          'mr-4 w-1/2 max-w-80 bg-overlay-back text-fore rounded-lg shadow-[0_4px_8px_2px_var(--color-ui-shadow)] overflow-hidden origin-[center_right] opacity-0',
          key !== 0 && styles.boxFadeOut,
        )}
        style={{ transform: `scale(${scale})` }}
      >
        {arraySerial(21).map((i) => {
          const pair = bracePairs[centerIndex + i - 10];
          const isSelected = pair != null && selection.from <= pair.from && pair.to <= selection.to;

          return (
            <BracePair
              key={i}
              distanceFromCenter={i - 10}
              str={pair?.firstLine}
              isSelected={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
});
DeckBraceJumpMapInside.displayName = 'DeckBraceJumpMapInside';

export const DeckBraceJumpMap = forwardRef((props: Props, ref: React.Ref<DeckBraceJumpMapHandle>) => {
  const enabled = useSettings('editorBraceJumpMapEnabled');
  if (!enabled) {
    return null;
  }

  return <DeckBraceJumpMapInside {...props} ref={ref} />;
});
DeckBraceJumpMap.displayName = 'DeckBraceJumpMap';
