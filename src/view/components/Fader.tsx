import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import React, { useCallback, useRef } from 'react';
import { MIDIMAN } from '../../MIDIManager';
import { ThemeVars } from '../themes/fuck';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import { saturate } from '@0b5vr/experimental';
import styled from 'styled-components';
import { useMidiLearning } from '../utils/useMidiLearning';
import { useMidiValue } from '../utils/useMidiValue';
import { useOpenContextMenuAction } from '../states/contextMenu';
import { useRect } from '../utils/useRect';

// == styles =======================================================================================
const Gutter = styled.div`
  position: absolute;
  left: 0;
  top: calc( 50% - 3px );
  width: 100%;
  height: 6px;
  background: ${ ThemeVars.back1 };
  pointer-events: none;
`;

const Ruler = styled.div`
  position: absolute;
  top: 0px;
  width: 2px;
  height: 100%;
  background: ${ ThemeVars.gray };
  pointer-events: none;
`;

const KnobLine = styled.div`
  position: absolute;
  top: 2px;
  left: 7px;
  width: 2px;
  height: calc( 100% - 4px );
  background: ${ ThemeVars.back1 };
  border-radius: 1px;
  pointer-events: none;
`;

const Knob = styled.div`
  position: absolute;
  top: 4px;
  width: 16px;
  height: calc( 100% - 8px );
  background: linear-gradient(to bottom, ${ ThemeVars.fore }, ${ ThemeVars.foresub });
  pointer-events: none;
  box-shadow: 0 0 0 2px ${ ThemeVars.back1 }, 0 4px 8px 2px ${ ThemeVars.shadow };
`;

const Root = styled.div<{ isLearning: boolean | undefined }>`
  position: relative;
  cursor: pointer;

  box-shadow: ${ ( { isLearning } ) => (
    isLearning
      ? `0 0 0 2px ${ ThemeVars.accent }`
      : 'none'
  ) };
`;

// == components ===================================================================================
export const Fader: React.FC<{
  midiParamName: string;
  onChange?: ( value: number ) => void;
  className?: string;
}> = ( { midiParamName, onChange, className } ) => {
  const isLearning = useMidiLearning( midiParamName );
  const refRoot = useRef<HTMLDivElement>( null );
  const rectRoot = useRect( refRoot );
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
      ref={ refRoot }
      onMouseDown={ handleClick }
      onContextMenu={ handleContextMenu }
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
    </Root>
  );
};
