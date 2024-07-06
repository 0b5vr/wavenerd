import { deckBPMState, deckBeatsState } from '../states/deck';
import { BeatManager } from '@0b5vr/wavenerd-deck';
import { Colors } from '../constants/Colors';
import React from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

// == styles =======================================================================================
const Label = styled.div`
  font: 500 8px 'Roboto', sans-serif;
  color: ${ Colors.foresub };
  line-height: 1;
`;

const ValueRow = styled.div`
  font-size: 14px;
  line-height: 1.0;
  min-width: 64px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// == components ===================================================================================
export const HeaderBeatIndicators: React.FC<{
  className?: string;
}> = ( { className } ) => {
  const bpm = useRecoilValue( deckBPMState );
  const { beat, bar, sixteenBar } = useRecoilValue( deckBeatsState );

  const beatSeconds = BeatManager.CalcBeatSeconds( bpm );
  const barSeconds = BeatManager.CalcBarSeconds( bpm );
  const sixteenBarSeconds = BeatManager.CalcSixteenBarSeconds( bpm );

  const stepCount = 1 + Math.floor( 4.0 * beat / beatSeconds );
  const beatCount = 1 + Math.floor( 4.0 * bar / barSeconds );
  const barCount = 1 + Math.floor( 16.0 * sixteenBar / sixteenBarSeconds );

  return (
    <Root
      className={ className }
      data-stalker="Bars, Beats, Steps"
    >
      <Label>BARS</Label>
      <ValueRow>
        { `${ ( '0' + barCount ).slice( -2 ) }.${ beatCount }.${ stepCount }` }
      </ValueRow>
    </Root>
  );
};
