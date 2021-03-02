import { DeckKnob } from './DeckKnob';
import React from 'react';
import WavenerdDeck from '@fms-cat/wavenerd-deck';
import styled from 'styled-components';

// == styles =======================================================================================
const StyledDeckKnob = styled( DeckKnob )`
`;

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  & > * {
    padding: 4px;
  }
`;

// == components ===================================================================================
function DeckKnobs( { deck, midiParamNamePrefix, className }: {
  deck: WavenerdDeck;
  midiParamNamePrefix: string;
  className?: string;
} ): JSX.Element {
  const paramNames = [
    'knob0',
    'knob1',
    'knob2',
    'knob3',
    'knob4',
    'knob5',
    'knob6',
    'knob7',
  ];

  return (
    <Root className={ className }>
      { paramNames.map( ( paramName ) => (
        <StyledDeckKnob
          key={ paramName }
          deck={ deck }
          midiParamNamePrefix={ midiParamNamePrefix }
          paramName={ paramName }
        />
      ) ) }
    </Root>
  );
}

export { DeckKnobs };
