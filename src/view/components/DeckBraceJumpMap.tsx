import styled, { css, keyframes } from 'styled-components';
import { ThemeVars } from '../themes/ThemeVars';
import { PrimitiveAtom, useAtomValue } from 'jotai';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { findAllBracePairs } from '../../utils/findAllBracePairs';
import { useSettings } from '../stores/hooks/useSettings';
import { arraySerial } from '@0b5vr/experimental';

// == styles =======================================================================================
const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const BracePair = styled.div<{ fontStyle: string; fontVariantLigatures: string; distanceFromCenter: number }>`
  padding-left: 4px;
  white-space: pre;
  font: ${({ fontStyle }) => fontStyle};
  font-variant-ligatures: ${({ fontVariantLigatures }) => fontVariantLigatures};

  ${({ distanceFromCenter }) => distanceFromCenter === 0 && css`
    background: ${ThemeVars.fore};
    color: ${ThemeVars.overlayBack};
    border: 1px solid ${ThemeVars.fore};
  `}
`;

const Box = styled.div<{ isActive: boolean }>`
  margin-right: 8px;
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
    animation: step-end ${fadeOut} 1s forwards;
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
  const bracePairsStr = useMemo(() => {
    return arraySerial(11).map((i) => bracePairs[centerIndex + i - 5]?.firstLine ?? ' ');
  }, [bracePairs, centerIndex]);

  const update = useCallback((index: number) => {
    setCenterIndex(index);
    setKey((key) => key + 1);
  }, [centerIndex]);
  useImperativeHandle(ref, () => ({ update }), [update]);

  const font = useSettings('editorFont');
  const fontVariantLigatures = useSettings('editorFontVariantLigatures');

  return (
    <Root className={className}>
      <Box
        key={key}
        isActive={key !== 0}
        style={{ transform: `scale(${scale})` }}
      >
        {bracePairsStr.map((str, i) => (
          <BracePair
            key={i}
            distanceFromCenter={i - 5}
            fontStyle={font}
            fontVariantLigatures={fontVariantLigatures}
          >
            {str}
          </BracePair>
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
