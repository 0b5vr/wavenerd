import React, { useCallback, useMemo } from 'react';
import { Colors } from '../constants/Colors';
import { Knob } from './Knob';
import { Mixer } from '../../Mixer';
import styled from 'styled-components';
import { useMidiValue } from '../utils/useMidiValue';

// == styles =======================================================================================
const StyledKnob = styled( Knob )`
  width: 48px;
  height: 48px;
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
function GainKnob( { paramName, mixer, channel, className }: {
  paramName: string;
  mixer: Mixer;
  channel: 'A' | 'B';
  className?: string;
} ): JSX.Element {
  const value = useMidiValue( paramName );

  const handleChange = useCallback(
    ( v ) => {
      if ( channel === 'A' ) {
        mixer.volumeL = 4.0 * v * v;
      } else {
        mixer.volumeR = 4.0 * v * v;
      }
    },
    [ mixer, channel ]
  );

  const valueStr = useMemo(
    () => {
      if ( value === 0.0 ) {
        return '-INF dB';
      } else {
        const db = 10.0 * Math.log10( 4.0 * value * value );
        return db.toFixed( 2 ) + ' dB';
      }
    },
    [ value ],
  );

  return (
    <Root
      isLearning={ false }
      className={ className }
    >
      <Label>Gain</Label>
      <StyledKnob
        midiParamName={ paramName }
        deltaValuePerPixel={ 1.0 / 256.0 }
        onChange={ handleChange }
        data-stalker={ paramName }
      />
      <Value>{ valueStr }</Value>
    </Root>
  );
}

export { GainKnob };
