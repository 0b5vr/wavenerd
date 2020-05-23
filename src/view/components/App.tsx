import { deckACodeState, deckBCodeState } from '../states/deck';
import { Colors } from '../constants/Colors';
import { ContextMenu } from './ContextMenu';
import { Deck } from './Deck';
import { DeckListener } from './DeckListener';
import { Header } from './Header';
import { MIDIListener } from './MIDIListener';
import { Mixer } from '../../Mixer';
import { MixerListener } from './MixerListener';
import React from 'react';
import { RecoilRoot } from 'recoil';
import WavenerdDeck from '@fms-cat/wavenerd-deck';
import { XFader } from './XFader';
import styled from 'styled-components';

// == styles =======================================================================================
const StyledHeader = styled( Header )`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 32px;
`;

const StyledDeckA = styled( Deck )`
  position: absolute;
  left: 0;
  top: 32px;
  width: calc( 50% - 64px );
  height: calc( 100% - 96px );
`;

const StyledDeckB = styled( Deck )`
  position: absolute;
  right: 0;
  top: 32px;
  width: calc( 50% - 64px );
  height: calc( 100% - 96px );
`;

const StyledXFader = styled( XFader )`
  position: absolute;
  left: calc( 50% - 128px );
  bottom: 4px;
  width: 256px;
  height: 56px;
`;

const Root = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color: ${ Colors.fore };
  background: ${ Colors.back1 };

  * {
    box-sizing: border-box;
  }
`;

// == component ====================================================================================
function App( { deckA, deckB, mixer }: {
  deckA: WavenerdDeck;
  deckB: WavenerdDeck;
  mixer: Mixer;
} ) {
  return (
    <RecoilRoot>
      <MIDIListener />
      <MixerListener
        mixer={ mixer }
      />
      <DeckListener
        deck={ deckA }
      />
      <Root>
        <StyledHeader
          hostDeck={ deckA }
        />
        <StyledDeckA
          codeState={ deckACodeState }
          deck={ deckA }
        />
        <StyledDeckB
          codeState={ deckBCodeState }
          deck={ deckB }
        />
        <StyledXFader
          mixer={ mixer }
        />
        <ContextMenu />
      </Root>
    </RecoilRoot>
  );
}

export { App };
