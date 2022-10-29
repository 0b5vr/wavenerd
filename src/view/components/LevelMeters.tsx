import { levelMeterInAState, levelMeterInBState, levelMeterOutState } from '../states/mixer';
import { LevelMeter } from './LevelMeter';
import React from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

// == styles =======================================================================================
const StyledLevelMeterA = styled( LevelMeter )`
  flex-grow: 1;
  margin-right: 4px;
`;

const StyledLevelMeterB = styled( LevelMeter )`
  flex-grow: 1;
  margin-left: 4px;
`;

const StyledLevelMeterL = styled( LevelMeter )`
  flex-grow: 2;
  margin-right: 2px;
`;

const StyledLevelMeterR = styled( LevelMeter )`
  flex-grow: 2;
`;

const Root = styled.div`
  display: flex;
`;

// == components ===================================================================================
export const LevelMeters: React.FC<{
  className?: string;
}> = ( { className } ) => {
  const levelMeterInA = useRecoilValue( levelMeterInAState );
  const levelMeterInB = useRecoilValue( levelMeterInBState );
  const levelMeterOut = useRecoilValue( levelMeterOutState );

  return (
    <Root
      className={ className }
    >
      <StyledLevelMeterA
        level={ levelMeterInA.level }
        peak={ levelMeterInA.peak }
      />
      <StyledLevelMeterL
        level={ levelMeterOut.levelL }
        peak={ levelMeterOut.peakL }
      />
      <StyledLevelMeterR
        level={ levelMeterOut.levelR }
        peak={ levelMeterOut.peakR }
      />
      <StyledLevelMeterB
        level={ levelMeterInB.level }
        peak={ levelMeterInB.peak }
      />
    </Root>
  );
};
