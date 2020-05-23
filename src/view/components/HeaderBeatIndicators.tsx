import { BeatIndicator } from './BeatIndicator';
import React from 'react';
import { deckBeatsState } from '../states/deck';
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
  const { beat, bar, sixteenBar } = useRecoilValue( deckBeatsState );

  return (
    <Root
      className={ className }
    >
      <BeatIndicator
        label="Beat"
        progress={ beat }
      />
      <BeatIndicator
        label="Bar"
        progress={ bar }
      />
      <BeatIndicator
        label="SixteenBar"
        progress={ sixteenBar }
      />
    </Root>
  );
}

export { HeaderBeatIndicators };
