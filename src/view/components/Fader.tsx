import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import React, { useCallback, useRef } from 'react';
import { MIDIMAN } from '../../MIDIManager';
import { ThemeVars } from '../themes/ThemeVars';
import { openContextMenuAtom } from '../stores/atoms/contextMenu';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import { saturate } from '@0b5vr/experimental';
import styled from 'styled-components';
import { useAtomCallback } from 'jotai/utils';
import { useMidiLearning } from '../stores/hooks/useMidiLearning';
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
  className?: string;
}> = ( { midiParamName, className } ) => {
  const isLearning = useMidiLearning( midiParamName );
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

  const handleContextMenu = useAtomCallback( useCallback(
    ( _, set, event: React.MouseEvent<HTMLDivElement> ) => {
      event.preventDefault();

      set( openContextMenuAtom, {
        position: [ event.clientX, event.clientY ],
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
    [ midiParamName ],
  ) );

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
