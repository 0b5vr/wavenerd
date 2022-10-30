import React, { useCallback, useRef, useState } from 'react';
import { Colors } from '../constants/Colors';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import styled from 'styled-components';

// == styles =======================================================================================
const Label = styled.div`
  font: 500 10px monospace;
  line-height: 1.0;
  user-select: none;
  color: ${ Colors.foredark };
`;

const Rect = styled.div`
  position: absolute;
  height: 100%;
  background: ${ Colors.fore };
  mix-blend-mode: difference;
`;

const CenterLine = styled.div`
  position: absolute;
  left: calc( 50% - 0.5px );
  width: 1px;
  height: 100%;
  background: ${ Colors.fore };
`;

const Root = styled.div`
  position: relative;
  width: 48px;
  height: calc( 100% - 8px );
  background: ${ Colors.back2 };
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  * {
    pointer-events: none;
  }
`;

// == components ===================================================================================
export const HeaderNudge: React.FC<{
  hostDeck: WavenerdDeck;
  className?: string;
}> = ( { hostDeck, className } ) => {
  const [ nudgeAmount, setNudgeAmount ] = useState( 0.0 );
  const refRoot = useRef<HTMLDivElement>( null );

  const handleMouseDown = useCallback( ( event: React.MouseEvent<HTMLDivElement> ) => {
    event.preventDefault();

    const initBPM = hostDeck.bpm;

    const rect = refRoot.current!.getBoundingClientRect();
    const center = rect.left + rect.width / 2.0;

    const nudgeAmount = ( event.clientX - center );
    setNudgeAmount( nudgeAmount );
    hostDeck.bpm = Math.max( 40.0, initBPM + nudgeAmount * 0.1 );

    registerMouseEvent( ( event ) => {
      const nudgeAmount = ( event.clientX - center );
      setNudgeAmount( nudgeAmount );
      hostDeck.bpm = Math.max( 40.0, initBPM + nudgeAmount * 0.1 );
    }, () => {
      setNudgeAmount( 0.0 );
      hostDeck.bpm = initBPM;
    } );
  }, [] );

  return (
    <Root
      className={ className }
      ref={ refRoot }
      onMouseDown={ handleMouseDown }
    >
      <Label>Nudge</Label>
      <CenterLine />
      <Rect
        style={{
          width: `${ Math.abs( nudgeAmount ) }px`,
          left: nudgeAmount < 0 ? `calc( 50% - ${ -nudgeAmount }px )` : '50%',
        }}
      />
    </Root>
  );
};
