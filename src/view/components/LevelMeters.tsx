import { LevelMeter } from './LevelMeter';
import React from 'react';
import { levelMeterState } from '../states/levelMeter';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';

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
  const [ levelMeters ] = useRecoilState( levelMeterState );

  return (
    <Root
      className={ className }
    >
      <StyledLevelMeterA
        level={ levelMeters.inputL.level }
        peak={ levelMeters.inputL.peak }
      />
      <StyledLevelMeterL
        level={ levelMeters.output.levelL }
        peak={ levelMeters.output.peakL }
      />
      <StyledLevelMeterR
        level={ levelMeters.output.levelR }
        peak={ levelMeters.output.peakR }
      />
      <StyledLevelMeterB
        level={ levelMeters.inputR.level }
        peak={ levelMeters.inputR.peak }
      />
    </Root>
  );
};
