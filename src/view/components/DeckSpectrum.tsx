import React, { useMemo } from 'react';
import { RecoilState, useRecoilValue } from 'recoil';
import { lerp, linearstep } from '@0b5vr/experimental';
import { settingsSpectrumColorState, settingsSpectrumModeState, settingsSpectrumOpacityState } from '../states/settings';
import { AnalyserResult } from '../../Analyser';
import styled from 'styled-components';

// == styles =======================================================================================
const Polyline = styled.polyline`
  fill: none;
  stroke: #fff;
  stroke-width: 0.005;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const Svg = styled.svg`
  width: 100%;
  height: auto;
`;

const Root = styled.div`
  display: flex;
  align-items: flex-end;
`;

// == param ========================================================================================
interface Param {
  analyserState: RecoilState<AnalyserResult>;
  className?: string;
}

// == component ====================================================================================
export const DeckSpectrum: React.FC<Param> = ( { analyserState, className } ) => {
  const { frequencyL } = useRecoilValue( analyserState );
  const spectrumMode = useRecoilValue( settingsSpectrumModeState );
  const spectrumOpacity = useRecoilValue( settingsSpectrumOpacityState );
  const spectrumColor = useRecoilValue( settingsSpectrumColorState );

  const pointsStr = useMemo( () => {
    let str = '';

    for ( let i = 0; i < 512; i ++ ) {
      const t = i / 511.0;
      const logJ = lerp( 2.0, Math.log2( frequencyL.length ), t );
      const j = Math.pow( 2.0, logJ ) - 1.0;

      const jf = j % 1.0;
      const ji = Math.floor( j );
      const db0 = frequencyL[ ji ];
      const db1 = ji === frequencyL.length - 1 ? 0.0 : frequencyL[ ji + 1.0 ];
      const db = lerp( db0, db1, jf );

      const x = 4.0 * i / 512;
      const y = linearstep( 0.0, -100.0, db );
      str += `${ x },${ y } `;
    }

    return str;
  }, [ frequencyL ] );

  if ( spectrumMode === 'none' ) {
    return null;
  }

  return (
    <Root className={ className }>
      <Svg width="4" height="1" viewBox="0 0 4 1">
        <Polyline
          points={ pointsStr }
          style={{ stroke: spectrumColor, opacity: spectrumOpacity }}
        />
      </Svg>
    </Root>
  );
};
