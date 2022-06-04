import { deckACodeState, deckACueStatusState, deckAErrorState, deckBCodeState, deckBCueStatusState, deckBErrorState } from '../states/deck';
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
import { RecoilRoot } from 'recoil';
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

const StyledDeckA = styled( Deck )`
  flex-grow: 1;
`;

const StyledDeckB = styled( Deck )`
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

const StyledDeckAKnobs = styled( DeckKnobs )`
  flex-grow: 1;
`;

const StyledDeckBKnobs = styled( DeckKnobs )`
  flex-grow: 1;
`;

const StyledXFader = styled( XFader )`
  width: ${ Metrics.xFaderWidth }px;
  margin: 4px 0;
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
function App( { deckA, deckB, mixer }: {
  deckA: WavenerdDeck;
  deckB: WavenerdDeck;
  mixer: Mixer;
} ) {
  return <>
    <RecoilRoot>
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
          <StyledDeckA
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
          <StyledDeckB
            codeState={ deckBCodeState }
            errorState={ deckBErrorState }
            cueStatusState={ deckBCueStatusState }
            deck={ deckB }
          />
        </DeckRow>
        <FaderRow>
          <StyledDeckAKnobs
            deck={ deckA }
            midiParamNamePrefix={ 'deckA-' }
          />
          <StyledXFader
            mixer={ mixer }
          />
          <StyledDeckBKnobs
            deck={ deckB }
            midiParamNamePrefix={ 'deckB-' }
          />
        </FaderRow>
        <StyledHelp />
        <PlayOverlay
          audio={ deckA.audio }
        />
        <ContextMenu />
        <Stalker />
      </Root>
    </RecoilRoot>
  </>;
}

export { App };
