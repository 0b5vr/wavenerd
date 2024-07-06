import React, { useMemo } from 'react';
import { ThemeVars } from '../themes/ThemeVars';
import { saturate } from '@0b5vr/experimental';
import styled from 'styled-components';

// == styles =======================================================================================
const Bg = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.8;
`;

const Bg2 = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.8;
`;

const Fg = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  background: linear-gradient(
    ${ ThemeVars.levelMeterPeak } 20%,
    ${ ThemeVars.levelMeter3 } 20%,
    ${ ThemeVars.levelMeter2 } 47%,
    ${ ThemeVars.levelMeter1 } 73%,
    ${ ThemeVars.levelMeter0 } 100%
  );
`;

const Root = styled.div`
  position: relative;
`;

// == components ===================================================================================
export const LevelMeter: React.FC<{
  level: number;
  peak: number;
  className?: string;
}> = ( { level, peak, className } ) => {
  const p = useMemo(
    () => saturate( peak * 0.8 ),
    [ peak ]
  );

  const l = useMemo(
    () => saturate( level * 0.8 ),
    [ level ]
  );

  return (
    <Root
      className={ className }
    >
      <Fg>
        <Bg
          style={ {
            height: `${ 100.0 - 100.0 * p }%`
          } }
        />
        <Bg2
          style={ {
            top: `calc( ${ 100.0 - 100.0 * p }% + 2px )`,
            height: `calc( ${ 100.0 * ( p - l ) }% - 2px )`
          } }
        />
      </Fg>
    </Root>
  );
};
