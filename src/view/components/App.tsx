import { RecoilRoot, useRecoilValue } from 'recoil';
import { deckACodeState, deckACueStatusState, deckAErrorState, deckBCodeState, deckBCueStatusState, deckBErrorState, deckShowBState } from '../states/deck';
import { Colors } from '../constants/Colors';
import { ContextMenu } from './ContextMenu';
import { Deck } from './Deck';
import { DeckKnobs } from './DeckKnobs';
import { DeckListener } from './DeckListener';
import { GainSection } from './GainSection';
import { Header } from './Header';
import { Help } from './Help';
import { MIDIListener } from './MIDIListener';
import { Metrics } from '../constants/Metrics';
import { Mixer } from '../../Mixer';
import { MixerListener } from './MixerListener';
import { PlayOverlay } from './PlayOverlay';
import React from 'react';
import { SampleList } from './SampleList';
import { Stalker } from './Stalker';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { XFader } from './XFader';
import styled from 'styled-components';

// == styles =======================================================================================
const StyledHeader = styled( Header )`
  height: ${ Metrics.headerHeight }px;
`;

const DeckRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-grow: 1;
  gap: 2px;
`;

const StyledDeck = styled( Deck )`
  flex-grow: 1;
`;

const SamplesColumn = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: ${ Metrics.sampleListWidth }px;
`;

const StyledSampleList = styled( SampleList )`
  flex-grow: 1;
`;

const StyledGainSection = styled( GainSection )`
  height: 96px;
`;

const FaderRow = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  height: 64px;
`;

const StyledDeckKnobs = styled( DeckKnobs )`
  flex-grow: 1;
`;

const StyledXFader = styled( XFader )`
  width: ${ Metrics.xFaderWidth }px;
  margin: 4px 16px;
`;

const StyledHelp = styled( Help )`
  position: absolute;
  margin: 16px;
  width: calc( 100% - 32px );
  height: calc( 100% - 32px );
`;

const Root = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${ Colors.fore };
  background: ${ Colors.back2 };
  font-family: monospace;

  * {
    box-sizing: border-box;
  }
`;

// == component ====================================================================================
interface Props {
  deckA: WavenerdDeck;
  deckB: WavenerdDeck;
  mixer: Mixer;
}

const OutOfContextApp: React.FC<Props> = ( { deckA, deckB, mixer } ) => {
  const showB = useRecoilValue( deckShowBState );

  return <>
    <MIDIListener />
    <MixerListener
      mixer={ mixer }
    />
    <DeckListener
      hostDeck={ deckA }
      deckA={ deckA }
      deckB={ deckB }
    />
    <Root>
      <StyledHeader
        hostDeck={ deckA }
      />
      <DeckRow x-data="haha">
        <StyledDeck
          codeState={ deckACodeState }
          errorState={ deckAErrorState }
          cueStatusState={ deckACueStatusState }
          deck={ deckA }
        />
        <SamplesColumn>
          <StyledSampleList
            hostDeck={ deckA }
          />
          <StyledGainSection
            mixer={ mixer }
          />
        </SamplesColumn>
        { showB && (
          <StyledDeck
            codeState={ deckBCodeState }
            errorState={ deckBErrorState }
            cueStatusState={ deckBCueStatusState }
            deck={ deckB }
          />
        ) }
      </DeckRow>
      <FaderRow>
        <StyledDeckKnobs
          deck={ deckA }
          midiParamNamePrefix={ 'deckA-' }
        />
        <StyledXFader
          mixer={ mixer }
        />
        { showB && (
          <StyledDeckKnobs
            deck={ deckB }
            midiParamNamePrefix={ 'deckB-' }
          />
        ) }
      </FaderRow>
      <StyledHelp />
      <PlayOverlay
        audio={ deckA.audio }
      />
      <ContextMenu />
      <Stalker />
    </Root>
  </>;
};

const App: React.FC<Props> = ( { deckA, deckB, mixer } ) => (
  <RecoilRoot>
    <OutOfContextApp
      deckA={ deckA }
      deckB={ deckB }
      mixer={ mixer }
    />
  </RecoilRoot>
);

export { App };
