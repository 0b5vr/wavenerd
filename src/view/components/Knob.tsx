import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import React, { useCallback, useMemo, useRef, useState } from 'react';
// import { useRecoilState, useRecoilValue } from 'recoil';
import { Colors } from '../constants/Colors';
// import { MIDIMAN } from '../../MIDIManager';
// import { MIDIParams } from '../../MIDIParams';
// import { Mixer } from '../../Mixer';
// import { midiIsLearningXFaderState } from '../states/midi';
import WavenerdDeck from '@fms-cat/wavenerd-deck';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import styled from 'styled-components';
// import { useOpenContextMenuAction } from '../states/contextMenu';
import { useRect } from '../utils/useRect';
// import { xFaderState } from '../states/xFader';

// == styles =======================================================================================
const Head = styled.div`
  position: absolute;
  top: 4px;
  left: 14px;
  width: 4px;
  height: 12px;
  background: ${ Colors.back1 };
  pointer-events: none;
`;

const Body = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: ${ Colors.fore };
`;

const Label = styled.div`
  font-size: 10px;
  color: ${ Colors.fore };
`;

const Value = styled.div`
  font-size: 10px;
  color: ${ Colors.fore };
`;

const Root = styled.div<{ isLearning: boolean }>`
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
function Knob( { paramName, deck, className }: {
  paramName: string;
  deck: WavenerdDeck;
  className?: string;
} ): JSX.Element {
  const [ value, setValue ] = useState( 0 );
  const refRoot = useRef<HTMLDivElement>( null );
  const rectRoot = useRect( refRoot );

  const changeKnobValue = useCallback(
    ( v ) => {
      deck.setParam( paramName, v );
      setValue( v );
    },
    [ deck, paramName ]
  );

  const handleClick = useCallback(
    ( event: React.MouseEvent<HTMLDivElement> ) => {
      mouseCombo( {
        [ MouseComboBit.LMB ]: () => {
          const y0 = event.clientY;
          const v0 = value;

          registerMouseEvent(
            ( event ) => {
              const y = ( y0 - event.clientY );
              const v = Math.min( Math.max( v0 + y / rectRoot.height, 0.0 ), 1.0 );
              changeKnobValue( v );
            }
          );
        }
      } )( event );
    },
    [ value, rectRoot.width, changeKnobValue ]
  );

  const valueStr = useMemo(
    () => value.toFixed( 3 ),
    [ value ],
  );

  // const handleContextMenu = useCallback(
  //   ( event: React.MouseEvent<HTMLDivElement> ) => {
  //     event.preventDefault();

  //     openContextMenu( {
  //       x: event.clientX,
  //       y: event.clientY,
  //       commands: [
  //         {
  //           name: 'Learn MIDI',
  //           callback: () => {
  //             MIDIMAN.learn( MIDIParams.XFader );
  //           }
  //         }
  //       ]
  //     } );
  //   },
  //   [ openContextMenu ]
  // );

  return (
    <Root
      ref={ refRoot }
      isLearning={ false }
      onMouseDown={ handleClick }
      // onContextMenu={ handleContextMenu }
      className={ className }
      data-stalker={ paramName }
    >
      <Label>{ paramName }</Label>
      <Body
        style={ {
          transform: `rotate( ${ 210 + 300.0 * value }deg )`
        } }
      >
        <Head />
      </Body>
      <Value>{ valueStr }</Value>
    </Root>
  );
}

export { Knob };
