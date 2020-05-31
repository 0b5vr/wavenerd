import { deckBPMState, deckBeatsState } from '../states/deck';
import { BeatIndicator } from './BeatIndicator';
import { BeatManager } from '@fms-cat/wavenerd-deck';
import React from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

// == styles =======================================================================================
const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

// == components ===================================================================================
function HeaderBeatIndicators( { className }: {
  className?: string;
} ): JSX.Element {
  const bpm = useRecoilValue( deckBPMState );
  const { beat, bar, sixteenBar } = useRecoilValue( deckBeatsState );

  const beatSeconds = BeatManager.CalcBeatSeconds( bpm );
  const barSeconds = BeatManager.CalcBarSeconds( bpm );
  const sixteenBarSeconds = BeatManager.CalcSixteenBarSeconds( bpm );

  return (
    <Root
      className={ className }
    >
      <BeatIndicator
        label="Beat"
        progress={ beat / beatSeconds }
      />
      <BeatIndicator
        label="Bar"
        progress={ bar / barSeconds }
      />
      <BeatIndicator
        label="16Bar"
        progress={ sixteenBar / sixteenBarSeconds }
      />
    </Root>
  );
}

export { HeaderBeatIndicators };
