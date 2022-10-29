import React, { useMemo } from 'react';
import { RecoilState, useRecoilValue } from 'recoil';
import { settingsVectorscopeColorState, settingsVectorscopeModeState, settingsVectorscopeOpacityState } from '../states/settings';
import { AnalyserResult } from '../../Analyser';
import styled from 'styled-components';

// == styles =======================================================================================
const Polyline = styled.polyline`
  fill: none;
  stroke-width: 0.005;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const Circle = styled.circle`
  stroke: none;
`;

const Svg = styled.svg`
  width: 100%;
  height: 100%;
`;

const Root = styled.div``;

// == components ===================================================================================
// TODO: expensive. replace this in WebGL
export const DeckVectorscope: React.FC<{
  analyserState: RecoilState<AnalyserResult>;
  className?: string;
}> = ( { analyserState, className } ) => {
  const { timeDomainL, timeDomainR } = useRecoilValue( analyserState );
  const vectorscopeMode = useRecoilValue( settingsVectorscopeModeState );
  const vectorscopeOpacity = useRecoilValue( settingsVectorscopeOpacityState );
  const vectorscopeColor = useRecoilValue( settingsVectorscopeColorState );

  const [ pointsArray, pointsStr ] = useMemo( () => {
    const array: [ number, number ][] = [];
    let str = '';

    timeDomainL.forEach( ( vl, i ) => {
      const vr = timeDomainR[ i ];

      array.push( [ vl, vr ] );
      str += `${vl},${vr} `;
    } );

    return [ array, str ];
  }, [ timeDomainL, timeDomainR ] );

  return (
    <Root className={ className }>
      <Svg width="4" height="4" viewBox="0 0 4 4">
        <g transform="translate(2 2) rotate(45 0 0)">
          { vectorscopeMode === 'line' && (
            <Polyline
              points={ pointsStr }
              style={{ stroke: vectorscopeColor, opacity: vectorscopeOpacity }}
            />
          ) }

          { vectorscopeMode === 'points' && (
            <g style={{ fill: vectorscopeColor, opacity: vectorscopeOpacity }}>
              { pointsArray.map( ( [ x, y ], i ) => (
                <Circle key={ i } cx={ x } cy={ y } r="0.01" />
              ) ) }
            </g>
          ) }
        </g>
      </Svg>
    </Root>
  );
};
