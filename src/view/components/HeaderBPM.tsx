import { NumberParam } from './NumberParam';
import React from 'react';
import { ThemeVars } from '../themes/ThemeVars';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { deckBPMState } from '../states/deck';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

// == styles =======================================================================================
const Label = styled.div`
  font: 500 8px 'Roboto', sans-serif;
  color: ${ ThemeVars.foresub };
  line-height: 1;
`;

const Value = styled( NumberParam )`
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
export const HeaderBPM: React.FC<{
  hostDeck: WavenerdDeck;
  className?: string;
}> = ( { hostDeck, className } ) => {
  const bpm = useRecoilValue( deckBPMState );

  return (
    <Root
      className={ className }
      data-stalker="Beat Per Minute&#10;Drag up/down to change BPM, Double click to edit"
    >
      <Label>BPM</Label>
      <Value
        type="float"
        value={ bpm }
        onChange={ ( value ) => {
          hostDeck.bpm = Math.max( 40.0, value );
        } }
        fixedDigits={ 2 }
        deltaCoarse={ 1.0 }
        deltaFine={ 0.1 }
      />
    </Root>
  );
};
