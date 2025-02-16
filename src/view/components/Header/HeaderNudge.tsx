import { useCallback, useContext, useRef, useState } from 'react';
import { ThemeVars } from '../../themes/ThemeVars';
import { registerMouseEvent } from '../../utils/registerMouseEvent';
import styled from 'styled-components';
import { StuffContext } from '../../StuffContext';
import { UILabel } from '../UILabel';

// == styles =======================================================================================
const StyledLabel = styled(UILabel)`
  color: ${ThemeVars.headerBg};
`;

const Rect = styled.div`
  position: absolute;
  height: 100%;
  background: #fff;
  mix-blend-mode: difference;
`;

const CenterLine = styled.div`
  position: absolute;
  left: calc( 50% - 0.5px );
  width: 1px;
  height: 100%;
  background: ${ThemeVars.headerBg};
`;

const Root = styled.div`
  position: relative;
  width: 48px;
  height: calc( 100% - 8px );
  background: ${ThemeVars.headerFg};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  * {
    pointer-events: none;
  }
`;

// == components ===================================================================================
export function HeaderNudge({ className }: { className?: string }) {
  const { hostDeck } = useContext(StuffContext)!;

  const [nudgeAmount, setNudgeAmount] = useState(0.0);
  const refRoot = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    const initBPM = hostDeck.bpm;

    const rect = refRoot.current!.getBoundingClientRect();
    const center = rect.left + rect.width / 2.0;

    const nudgeAmount = (event.clientX - center);
    setNudgeAmount(nudgeAmount);
    hostDeck.bpm = Math.max(40.0, initBPM + nudgeAmount * 0.1);

    registerMouseEvent((event) => {
      const nudgeAmount = (event.clientX - center);
      setNudgeAmount(nudgeAmount);
      hostDeck.bpm = Math.max(40.0, initBPM + nudgeAmount * 0.1);
    }, () => {
      setNudgeAmount(0.0);
      hostDeck.bpm = initBPM;
    });
  }, []);

  return (
    <Root
      className={className}
      ref={refRoot}
      onMouseDown={handleMouseDown}
      data-stalker="Nudge the beat (drag left and right)"
    >
      <StyledLabel text="Nudge" />
      <CenterLine />
      <Rect
        style={{
          width: `${Math.abs(nudgeAmount)}px`,
          left: nudgeAmount < 0 ? `calc( 50% - ${-nudgeAmount}px )` : '50%',
        }}
      />
    </Root>
  );
}
