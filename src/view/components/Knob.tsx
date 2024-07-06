import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import React, { useCallback } from 'react';
import { Colors } from '../constants/Colors';
import { MIDIMAN } from '../../MIDIManager';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import { saturate } from '@0b5vr/experimental';
import styled from 'styled-components';
import { useMidiLearning } from '../utils/useMidiLearning';
import { useMidiValue } from '../utils/useMidiValue';
import { useOpenContextMenuAction } from '../states/contextMenu';

// == styles =======================================================================================
const Head = styled.div`
  position: absolute;
  top: 10%;
  left: 45%;
  width: 10%;
  height: 35%;
  background: ${ Colors.back1 };
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
  background: linear-gradient(to bottom, ${ Colors.fore }, ${ Colors.foresub });
  box-shadow: 0 0 0 2px ${ Colors.back1 }, 0 4px 8px 2px #0008;
`;

const Root = styled.div<{ isLearning: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  box-shadow: ${ ( { isLearning } ) => (
    isLearning
      ? `0 0 0 2px ${ Colors.accent }`
      : 'none'
  ) };
`;

// == components ===================================================================================
export const Knob: React.FC<{
  midiParamName: string;
  deltaValuePerPixel: number;
  onChange?: ( value: number ) => void;
  className?: string;
}> = ( { midiParamName, deltaValuePerPixel, onChange, className } ) => {
  const isLearning = useMidiLearning( midiParamName );
  const openContextMenu = useOpenContextMenuAction();

  const handleValueChange = useCallback(
    ( value: number ) => {
      onChange?.( value );
    },
    [ onChange ]
  );

  const value = useMidiValue( midiParamName, handleValueChange );

  const handleClick = useCallback(
    ( event: React.MouseEvent<HTMLDivElement> ) => {
      mouseCombo( {
        [ MouseComboBit.LMB ]: () => {
          const y0 = event.clientY;
          const v0 = MIDIMAN.midi( midiParamName );

          registerMouseEvent(
            ( event ) => {
              const y = ( y0 - event.clientY );
              const v = saturate( v0 + y * deltaValuePerPixel );
              MIDIMAN.setValue( midiParamName, v );
            }
          );
        }
      } )( event );
    },
    [ midiParamName, deltaValuePerPixel ]
  );

  const handleContextMenu = useCallback(
    ( event: React.MouseEvent<HTMLDivElement> ) => {
      event.preventDefault();

      openContextMenu( {
        x: event.clientX,
        y: event.clientY,
        commands: [
          {
            name: 'Learn MIDI',
            callback: () => {
              MIDIMAN.learn( midiParamName );
            }
          }
        ]
      } );
    },
    [ midiParamName, openContextMenu ]
  );

  return (
    <Root
      isLearning={ isLearning }
      onMouseDown={ handleClick }
      onContextMenu={ handleContextMenu }
      className={ className }
    >
      <Body />
      <HeadContainer
        style={ {
          transform: `rotate( ${ 210 + 300.0 * value }deg )`
        } }
      >
        <Head />
      </HeadContainer>
    </Root>
  );
};
