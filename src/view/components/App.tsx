import { deckACodeState, deckACueStatusState, deckAErrorState, deckBCodeState, deckBCueStatusState, deckBErrorState } from '../states/deck';
import { Colors } from '../constants/Colors';
import { ContextMenu } from './ContextMenu';
import { Deck } from './Deck';
import { DeckKnobs } from './DeckKnobs';
import { DeckListener } from './DeckListener';
import { GainKnob } from './GainKnob';
import { Header } from './Header';
import { Help } from './Help';
import { MIDIListener } from './MIDIListener';
import { Metrics } from '../constants/Metrics';
import { Mixer } from '../../Mixer';
import { MixerListener } from './MixerListener';
import { PlayOverlay } from './PlayOverlay';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { SampleList } from './SampleList';
import { Stalker } from './Stalker';
import WavenerdDeck from '@fms-cat/wavenerd-deck';
import { XFader } from './XFader';
import styled from 'styled-components';

// == styles =======================================================================================
const StyledHeader = styled( Header )`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: ${ Metrics.headerHeight }px;
`;

const StyledDeckA = styled( Deck )`
  position: absolute;
  left: 0;
  top: ${ Metrics.headerHeight }px;
  width: calc( 50% - ${ 0.5 * Metrics.sampleListWidth + 2 }px );
  height: calc( 100% - 96px );
`;

const StyledDeckB = styled( Deck )`
  position: absolute;
  right: 0;
  top: ${ Metrics.headerHeight }px;
  width: calc( 50% - ${ 0.5 * Metrics.sampleListWidth + 2 }px );
  height: calc( 100% - 96px );
`;

const StyledSampleList = styled( SampleList )`
  position: absolute;
  left: calc( 50% - ${ 0.5 * Metrics.sampleListWidth }px );
  top: ${ Metrics.headerHeight }px;
  width: ${ Metrics.sampleListWidth }px;
  height: calc( 100% - 96px - 322px );
`;

const StyledGainKnobA = styled( GainKnob )`
  position: absolute;
  left: calc( 50% - ${ 0.5 * Metrics.sampleListWidth }px );
  bottom: ${ 64 }px;
  width: ${ 0.5 * Metrics.sampleListWidth }px;
  height: ${ 0.5 * Metrics.sampleListWidth }px;
`;

const StyledGainKnobB = styled( GainKnob )`
  position: absolute;
  right: calc( 50% - ${ 0.5 * Metrics.sampleListWidth }px );
  bottom: ${ 64 }px;
  width: ${ 0.5 * Metrics.sampleListWidth }px;
  height: ${ 0.5 * Metrics.sampleListWidth }px;
`;

const StyledDeckAKnobs = styled( DeckKnobs )`
  position: absolute;
  left: 0;
  bottom: 0;
  width: calc( 50% - ${ 0.5 * Metrics.xFaderWidth }px );
  height: 64px;
`;

const StyledDeckBKnobs = styled( DeckKnobs )`
  position: absolute;
  right: 0;
  bottom: 0;
  width: calc( 50% - ${ 0.5 * Metrics.xFaderWidth }px );
  height: 64px;
`;

const StyledXFader = styled( XFader )`
  position: absolute;
  left: calc( 50% - ${ 0.5 * Metrics.xFaderWidth }px );
  bottom: 4px;
  width: ${ Metrics.xFaderWidth }px;
  height: 56px;
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
        <StyledDeckA
          codeState={ deckACodeState }
          errorState={ deckAErrorState }
          cueStatusState={ deckACueStatusState }
          deck={ deckA }
        />
        <StyledDeckB
          codeState={ deckBCodeState }
          errorState={ deckBErrorState }
          cueStatusState={ deckBCueStatusState }
          deck={ deckB }
        />
        <StyledSampleList
          hostDeck={ deckA }
        />
        <StyledDeckAKnobs
          deck={ deckA }
          midiParamNamePrefix={ 'deckA-' }
        />
        <StyledDeckBKnobs
          deck={ deckB }
          midiParamNamePrefix={ 'deckB-' }
        />
        <StyledGainKnobA
          paramName="gainA"
          mixer={ mixer }
          channel="A"
        />
        <StyledGainKnobB
          paramName="gainB"
          mixer={ mixer }
          channel="B"
        />
        <StyledXFader
          mixer={ mixer }
        />
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
