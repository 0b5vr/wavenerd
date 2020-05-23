import { NumberParam } from './NumberParam';
import React from 'react';
import WavenerdDeck from '@fms-cat/wavenerd-deck';
import { deckBPMState } from '../states/deck';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

// == styles =======================================================================================
const Label = styled.div`
  font: 500 10px monospace;
  line-height: 1.0;
`;

const Value = styled( NumberParam )`
  font: 500 16px monospace;
  line-height: 1.0;
  min-width: 64px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
`;

// == components ===================================================================================
function HeaderBPM( { hostDeck, className }: {
  hostDeck: WavenerdDeck;
  className?: string;
} ): JSX.Element {
  const bpm = useRecoilValue( deckBPMState );

  return (
    <Root
      className={ className }
    >
      <Label>BPM</Label>
      <Value
        type="float"
        value={ bpm }
        onChange={ ( value ) => {
          hostDeck.bpm = value;
        } }
        fixedDigits={ 2 }
        deltaCoarse={ 1.0 }
        deltaFine={ 0.1 }
      />
    </Root>
  );
}

export { HeaderBPM };
