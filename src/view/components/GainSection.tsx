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
export const GainSection: React.FC<{
  mixer: Mixer;
  className?: string;
}> = ( { mixer, className } ) => {
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
};
