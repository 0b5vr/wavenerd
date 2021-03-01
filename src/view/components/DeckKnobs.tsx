import { Knob } from './Knob';
import React from 'react';
import WavenerdDeck from '@fms-cat/wavenerd-deck';
import styled from 'styled-components';

// == styles =======================================================================================
const StyledKnob = styled( Knob )`
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
function DeckKnobs( { deck, className }: {
  deck: WavenerdDeck;
  className?: string;
} ): JSX.Element {
  return (
    <Root className={ className }>
      <StyledKnob deck={ deck } paramName="knob0" />
      <StyledKnob deck={ deck } paramName="knob1" />
      <StyledKnob deck={ deck } paramName="knob2" />
      <StyledKnob deck={ deck } paramName="knob3" />
      <StyledKnob deck={ deck } paramName="knob4" />
      <StyledKnob deck={ deck } paramName="knob5" />
      <StyledKnob deck={ deck } paramName="knob6" />
      <StyledKnob deck={ deck } paramName="knob7" />
    </Root>
  );
}

export { DeckKnobs };
