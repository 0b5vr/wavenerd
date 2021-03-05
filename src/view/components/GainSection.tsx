import { GainKnob } from './GainKnob';
import { LevelMeters } from './LevelMeters';
import { Mixer } from '../../Mixer';
import React from 'react';
import styled from 'styled-components';

// == styles =======================================================================================
const StyledLevelMeters = styled( LevelMeters )`
  flex-grow: 3;
  margin: 4px 0;
`;

const StyledGainKnobA = styled( GainKnob )`
  flex-grow: 3;
`;

const StyledGainKnobB = styled( GainKnob )`
  flex-grow: 3;
`;

const Root = styled.div`
  display: flex;
`;

// == components ===================================================================================
function GainSection( { mixer, className }: {
  mixer: Mixer;
  className?: string;
} ): JSX.Element {
  return (
    <Root
      className={ className }
    >
      <StyledGainKnobA
        paramName="gainA"
        mixer={ mixer }
        channel="A"
      />
      <StyledLevelMeters />
      <StyledGainKnobB
        paramName="gainB"
        mixer={ mixer }
        channel="B"
      />
    </Root>
  );
}

export { GainSection };
