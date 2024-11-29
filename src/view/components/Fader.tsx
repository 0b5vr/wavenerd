import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import React, { useCallback, useRef } from 'react';
import { MIDILearnable } from './MIDILearnable';
import { MIDIMAN } from '../../MIDIManager';
import { ThemeVars } from '../themes/ThemeVars';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import { saturate } from '@0b5vr/experimental';
import styled from 'styled-components';
import { useMidiValue } from '../stores/hooks/useMidiValue';
import { useRect } from '../utils/useRect';

// == styles =======================================================================================
const Gutter = styled.div`
  position: absolute;
  left: 0;
  top: calc( 50% - 3px );
  width: 100%;
  height: 6px;
  background: ${ ThemeVars.knobGutter };
  pointer-events: none;
`;

const Ruler = styled.div`
  position: absolute;
  top: 0px;
  width: 2px;
  height: 100%;
  background: ${ ThemeVars.knobGuide };
  pointer-events: none;
`;

const KnobLine = styled.div`
  position: absolute;
  top: 2px;
  left: 7px;
  width: 2px;
  height: calc( 100% - 4px );
  background: ${ ThemeVars.knobNotch };
  border-radius: 1px;
  pointer-events: none;
`;

const Knob = styled.div`
  position: absolute;
  top: 4px;
  width: 16px;
  height: calc( 100% - 8px );
  background: ${ ThemeVars.knobColor };
  pointer-events: none;
  box-shadow: 0 0 0 2px ${ ThemeVars.back1 }, 0 4px 8px 2px ${ ThemeVars.knobShadow };
`;

const Root = styled.div`
  position: relative;
  cursor: pointer;
`;

// == components ===================================================================================
export const Fader: React.FC<{
  midiParamName: string;
  className?: string;
}> = ( { midiParamName, className } ) => {
  const refRoot = useRef<HTMLDivElement>( null );
  const rectRoot = useRect( refRoot );

  const value = useMidiValue( midiParamName );

  const handleClick = useCallback(
    ( event: React.MouseEvent<HTMLDivElement> ) => {
      mouseCombo( {
        [ MouseComboBit.LMB ]: () => {
          const left = event.clientX - event.nativeEvent.offsetX;
          const x0 = ( event.nativeEvent.offsetX );
          const v0 = saturate( x0 / rectRoot.width );
          MIDIMAN.setValue( midiParamName, v0 );

          registerMouseEvent(
            ( event ) => {
              const x = ( event.clientX - left );
              const v = saturate( x / rectRoot.width );
              MIDIMAN.setValue( midiParamName, v );
            }
          );
        }
      } )( event );
    },
    [ midiParamName, rectRoot.width ]
  );

  return (
    <Root
      ref={ refRoot }
      onMouseDown={ handleClick }
      className={ className }
      data-stalker="X Fader"
    >
      <Ruler style={ { left: 'calc( 5% - 1px )' } } />
      <Ruler style={ { left: 'calc( 50% - 1px )' } } />
      <Ruler style={ { left: 'calc( 95% - 1px )' } } />
      <Gutter />
      <Knob
        style={ {
          left: `calc( ${ 100.0 * value }% - 8px )`
        } }
      >
        <KnobLine />
      </Knob>
      <MIDILearnable paramName={ midiParamName } />
    </Root>
  );
};
