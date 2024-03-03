import React, { useMemo } from 'react';
import { saturate } from '@0b5vr/experimental';
import { settingsThemeState } from '../states/settings';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

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

const Fg = styled.div<{ theme: string }>`
  position: absolute;
  width: 100%;
  height: 100%;

  ${ ( { theme } ) => theme === 'monokaiSharp' && `
    background: linear-gradient(
      #ff0066 20%,
      #faffb8 20%,
      #c5f0a4 47%,
      #35b0ab 73%,
      #226b80 100%
    );
  ` }

  ${ ( { theme } ) => theme === 'chromaCoder' && `
    background: linear-gradient(
      #ff0066 20%,
      #d0edff 20%,
      #aec5d5 47%,
      #8b9eab 73%,
      #697681 100%
    );
  ` }
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
  const theme = useRecoilValue( settingsThemeState );

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
      <Fg theme={ theme }>
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
