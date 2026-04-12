import styled, { css, keyframes } from 'styled-components';
import { ThemeVars } from '../themes/ThemeVars';
import { type PrimitiveAtom, useAtomValue } from 'jotai';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { findAllBracePairs } from '../../utils/findAllBracePairs';
import { useSettings } from '../stores/hooks/useSettings';
import { arraySerial } from '@0b5vr/experimental';

// == styles =======================================================================================
const fadeOut = keyframes`
  0% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
`;

const SpanCommentHighlight = styled.span<{
  isCommentLine: boolean;
}>`
  color: ${ThemeVars.accent};

  ${({ isCommentLine }) => isCommentLine && css`
    color: ${ThemeVars.accentGray};
  `}
`;

const SpanLine = styled.span<{
  isCommentLine: boolean;
}>`
  color: ${ThemeVars.fore};

  ${({ isCommentLine }) => isCommentLine && css`
    color: ${ThemeVars.gray};
  `}
`;

const BracePairStyle = styled.div<{
  fontStyle: string;
  fontVariantLigatures: string;
  distanceFromCenter: number;
}>`
  padding-left: 4px;
  white-space: pre;
  font: ${({ fontStyle }) => fontStyle};
  font-variant-ligatures: ${({ fontVariantLigatures }) => fontVariantLigatures};

  ${({ distanceFromCenter }) => distanceFromCenter === 0 && css`
    border: 1px solid ${ThemeVars.fore};
  `}
`;

const Box = styled.div<{ isActive: boolean }>`
  margin-right: 16px;
  width: 50%;
  max-width: 320px;
  background: ${ThemeVars.overlayBack};
  color: ${ThemeVars.fore};
  border-radius: 8px;
  box-shadow: 0 4px 8px 2px ${ThemeVars.uiShadow};
  overflow: hidden;
  transform-origin: center right;
  opacity: 0;

  ${({ isActive }) => isActive && css`
    animation: ease-in-out ${fadeOut} 2s forwards;
  `}
`;

const Root = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: end;
  align-items: center;
  pointer-events: none;
`;

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
function BracePair({ str, distanceFromCenter }: {
  str: string | undefined;
  distanceFromCenter: number;
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
  }, [str]);

  if (str === undefined) {
    return (
      <BracePairStyle
        distanceFromCenter={distanceFromCenter}
        fontStyle={font}
        fontVariantLigatures={fontVariantLigatures}
      >
        <SpanLine isCommentLine={false}>&nbsp;</SpanLine>
      </BracePairStyle>
    );
  }

  return (
    <BracePairStyle
      distanceFromCenter={distanceFromCenter}
      fontStyle={font}
      fontVariantLigatures={fontVariantLigatures}
    >
      <SpanLine isCommentLine={isCommentLine}>{str.substring(0, commentHighlightPos)}</SpanLine>
      <SpanCommentHighlight isCommentLine={isCommentLine}>{str.substring(commentHighlightPos)}</SpanCommentHighlight>
    </BracePairStyle>
  );
}

// == component ====================================================================================
interface Props {
  codeAtom: PrimitiveAtom<string>;
  className?: string;
}

const DeckBraceJumpMapInside = forwardRef(({
  codeAtom,
  className,
}: Props, ref: React.Ref<{ update: (index: number) => void }>) => {
  const scale = useSettings('editorBraceJumpMapScale');

  const [centerIndex, setCenterIndex] = useState(0);
  const [key, setKey] = useState(0);

  const code = useAtomValue(codeAtom);
  const bracePairs = useMemo(() => findAllBracePairs(code), [code]);

  const update = useCallback((index: number) => {
    setCenterIndex(index);
    setKey((key) => key + 1);
  }, [centerIndex]);
  useImperativeHandle(ref, () => ({ update }), [update]);

  return (
    <Root className={className}>
      <Box
        key={key}
        isActive={key !== 0}
        style={{ transform: `scale(${scale})` }}
      >
        {arraySerial(21).map((i) => (
          <BracePair
            key={i}
            distanceFromCenter={i - 10}
            str={bracePairs[centerIndex + i - 10]?.firstLine}
          />
        ))}
      </Box>
    </Root>
  );
});
DeckBraceJumpMapInside.displayName = 'DeckBraceJumpMapInside';

export const DeckBraceJumpMap = forwardRef((props: Props, ref: React.Ref<{ update: (index: number) => void }>) => {
  const enabled = useSettings('editorBraceJumpMapEnabled');
  if (!enabled) {
    return null;
  }

  return <DeckBraceJumpMapInside {...props} ref={ref} />;
});
DeckBraceJumpMap.displayName = 'DeckBraceJumpMap';
