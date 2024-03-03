import 'simplebar-react/dist/simplebar.min.css';

import { RecoilRoot, useRecoilValue } from 'recoil';
import { analyserInAState, analyserInBState } from '../states/mixer';
import { deckACodeState, deckACueStatusState, deckAErrorState, deckAHasEditState, deckBCodeState, deckBCueStatusState, deckBErrorState, deckBHasEditState, deckShowBState } from '../states/deck';
import { AssetList } from './AssetList';
import { Colors } from '../constants/Colors';
import { ContextMenu } from './ContextMenu';
import { Deck } from './Deck';
import { DeckKnobs } from './DeckKnobs';
import { DeckListener } from './DeckListener';
import { GainSection } from './GainSection';
import { Header } from './Header';
import { HelpModal } from './HelpModal';
import { MIDIListener } from './MIDIListener';
import { Metrics } from '../constants/Metrics';
import { Mixer } from '../../Mixer';
import { MixerListener } from './MixerListener';
import { PlayOverlay } from './PlayOverlay';
import React from 'react';
import { SettingsListener } from './SettingsListener';
import { SettingsModal } from './SettingsModal';
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

const StyledAssetList = styled( AssetList )`
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
  font-family: 'Roboto Mono', monospace;

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
    <SettingsListener />
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
      <DeckRow>
        <StyledDeck
          codeState={ deckACodeState }
          hasEditState={ deckAHasEditState }
          errorState={ deckAErrorState }
          analyserState={ analyserInAState }
          cueStatusState={ deckACueStatusState }
          deck={ deckA }
          storageKeyName="a"
          gainParamName="gainA"
        />
        <SamplesColumn>
          <StyledAssetList
            hostDeck={ deckA }
          />
          <StyledGainSection
            mixer={ mixer }
          />
        </SamplesColumn>
        { showB && (
          <StyledDeck
            codeState={ deckBCodeState }
            hasEditState={ deckBHasEditState }
            errorState={ deckBErrorState }
            analyserState={ analyserInBState }
            cueStatusState={ deckBCueStatusState }
            deck={ deckB }
            storageKeyName="b"
            gainParamName="gainB"
          />
        ) }
      </DeckRow>
      <FaderRow>
        <StyledDeckKnobs
          deck={ deckA }
          midiParamNamePrefix="deckA-"
        />
        <StyledXFader
          mixer={ mixer }
        />
        { showB && (
          <StyledDeckKnobs
            deck={ deckB }
            midiParamNamePrefix="deckB-"
          />
        ) }
      </FaderRow>
      <SettingsModal mixer={ mixer } />
      <HelpModal />
      <PlayOverlay hostDeck={ deckA } />
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
