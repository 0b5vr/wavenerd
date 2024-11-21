import React, { useCallback, useMemo } from 'react';
import { Knob } from './Knob';
import { ThemeVars } from '../themes/ThemeVars';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import styled from 'styled-components';
import { useMidiValue } from '../utils/useMidiValue';

// == styles =======================================================================================
const StyledKnob = styled( Knob )`
  width: 28px;
  height: 28px;
`;

const Label = styled.div`
  font: 500 8px 'Roboto', sans-serif;
  color: ${ ThemeVars.foresub };
  line-height: 1;
`;

const Root = styled.div<{ isLearning: boolean }>`
  display: flex;
  gap: 4px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  box-shadow: ${ ( { isLearning } ) => (
    isLearning
      ? `0 0 0 2px ${ ThemeVars.accent }`
      : 'none'
  ) };
`;

// == components ===================================================================================
export const DeckKnob: React.FC<{
  paramName: string;
  midiParamNamePrefix: string;
  deck: WavenerdDeck;
  stalker?: string;
  className?: string;
}> = ( { paramName, midiParamNamePrefix, deck, stalker, className } ) => {
  const value = useMidiValue( midiParamNamePrefix + paramName );

  const handleChange = useCallback(
    ( v: number ) => {
      deck.setParam( paramName, v );
    },
    [ deck, paramName ]
  );

  const stalkerWithValue = useMemo( () => {
    return `${ stalker }: ${ value.toFixed( 3 ) }`;
  }, [ stalker, value ] );

  return (
    <Root
      isLearning={ false }
      className={ className }
      data-stalker={ stalkerWithValue }
    >
      <StyledKnob
        midiParamName={ midiParamNamePrefix + paramName }
        deltaValuePerPixel={ 1.0 / 64.0 }
        onChange={ handleChange }
      />
      <Label>{ paramName }</Label>
    </Root>
  );
};
