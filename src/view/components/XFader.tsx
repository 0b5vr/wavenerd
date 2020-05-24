import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import React, { useCallback, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Colors } from '../constants/Colors';
import { MIDIMAN } from '../../MIDIManager';
import { MIDIParams } from '../../MIDIParams';
import { Mixer } from '../../Mixer';
import { midiIsLearningXFaderState } from '../states/midi';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import styled from 'styled-components';
import { useOpenContextMenuAction } from '../states/contextMenu';
import { useRect } from '../utils/useRect';
import { xFaderState } from '../states/xFader';

// == styles =======================================================================================
const Gutter = styled.div`
  position: absolute;
  left: 0;
  top: calc( 50% - 4px );
  width: 100%;
  height: 8px;
  background: ${ Colors.back1 };
  pointer-events: none;
`;

const Ruler = styled.div`
  position: absolute;
  top: 0px;
  width: 2px;
  height: 100%;
  background: ${ Colors.gray };
  pointer-events: none;
`;

const Knob = styled.div`
  position: absolute;
  top: 4px;
  width: 16px;
  height: calc( 100% - 8px );
  background: ${ Colors.fore };
  pointer-events: none;
`;

const Root = styled.div<{ isLearning: boolean | undefined }>`
  cursor: pointer;

  box-shadow: ${ ( { isLearning } ) => (
    isLearning
      ? `0 0 0 2px ${ Colors.accent }`
      : 'none'
  ) };
`;

// == components ===================================================================================
function XFader( { mixer, className }: {
  mixer: Mixer;
  className?: string;
} ): JSX.Element {
  const [ xFaderStateValue, setXFaderStateValue ] = useRecoilState( xFaderState );
  const isLearning = useRecoilValue( midiIsLearningXFaderState );
  const openContextMenu = useOpenContextMenuAction();
  const refRoot = useRef<HTMLDivElement>( null );
  const rectRoot = useRect( refRoot );

  const changeXFaderValue = useCallback(
    ( v ) => {
      mixer.xFaderPos = v;
      setXFaderStateValue( v );
    },
    [ mixer ]
  );

  const handleClick = useCallback(
    ( event: React.MouseEvent<HTMLDivElement> ) => {
      mouseCombo( {
        [ MouseComboBit.LMB ]: () => {
          const left = event.clientX - event.nativeEvent.offsetX;
          const x = ( event.nativeEvent.offsetX );
          const v = x / rectRoot.width;
          changeXFaderValue( v );

          registerMouseEvent(
            ( event ) => {
              const x = ( event.clientX - left );
              const v = x / rectRoot.width;
              changeXFaderValue( v );
            }
          );
        }
      } )( event );
    },
    [ rectRoot.width, changeXFaderValue ]
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
              MIDIMAN.learn( MIDIParams.XFader );
            }
          }
        ]
      } );
    },
    [ openContextMenu ]
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
          left: `calc( ${ 100.0 * xFaderStateValue }% - 8px )`
        } }
      />
    </Root>
  );
}

export { XFader };
