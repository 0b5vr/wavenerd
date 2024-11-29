import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import React, { useCallback } from 'react';
import { MIDILearnable } from './MIDILearnable';
import { MIDIMAN } from '../../MIDIManager';
import { ThemeVars } from '../themes/ThemeVars';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import { saturate } from '@0b5vr/experimental';
import styled from 'styled-components';
import { useDoubleTap } from '../utils/useDoubleTap';
import { useMidiValue } from '../stores/hooks/useMidiValue';

// == styles =======================================================================================
const Head = styled.div`
  position: absolute;
  top: 10%;
  left: 45%;
  width: 10%;
  height: 35%;
  background: ${ ThemeVars.knobNotch };
  border-radius: 10000px;
  pointer-events: none;
`;

const HeadContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Body = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10000px;
  background: ${ ThemeVars.knobColor };
  box-shadow: 0 0 0 2px ${ ThemeVars.back1 }, 0 4px 8px 2px ${ ThemeVars.knobShadow };
`;

const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

// == components ===================================================================================
interface Props {
  midiParamName: string;
  resetValue: number;
  deltaValuePerPixel: number;
  className?: string;
  stalkerText?: string;
}

export const Knob: React.FC<Props> = ( props ) => {
  const { midiParamName, deltaValuePerPixel, resetValue, className, stalkerText } = props;

  const value = useMidiValue( midiParamName );

  const checkDoubleClick = useDoubleTap();

  const handleClick = useCallback(
    ( event: React.MouseEvent<HTMLDivElement> ) => {
      mouseCombo( {
        [ MouseComboBit.LMB ]: () => {
          if ( checkDoubleClick() ) {
            MIDIMAN.setValue( midiParamName, resetValue );
            return;
          }

          const y0 = event.clientY;
          const v0 = MIDIMAN.midi( midiParamName );

          registerMouseEvent(
            ( event ) => {
              const y = ( y0 - event.clientY );
              const v = saturate( v0 + y * deltaValuePerPixel );
              MIDIMAN.setValue( midiParamName, v );
            }
          );
        },
      } )( event );
    },
    [ resetValue, midiParamName, deltaValuePerPixel ]
  );

  return (
    <Root
      onMouseDown={ handleClick }
      className={ className }
      data-stalker={ stalkerText }
    >
      <Body />
      <HeadContainer
        style={ {
          transform: `rotate( ${ 210 + 300.0 * value }deg )`
        } }
      >
        <Head />
      </HeadContainer>
      <MIDILearnable paramName={ midiParamName } />
    </Root>
  );
};
