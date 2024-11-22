import 'simplebar-react/dist/simplebar.min.css';

import { RecoilRoot, useRecoilValue } from 'recoil';
import { analyserInAAtom, analyserInBAtom } from '../stores/atoms/analyser';
import { deckACodeState, deckACueStatusState, deckAErrorState, deckAHasEditState, deckBCodeState, deckBCueStatusState, deckBErrorState, deckBHasEditState, deckShowBState } from '../states/deck';
import styled, { css } from 'styled-components';
import { AssetList } from './AssetList';
import { ContextMenu } from './ContextMenu';
import { Deck } from './Deck';
import { DeckKnobs } from './DeckKnobs';
import { DeckListener } from './DeckListener';
import { Header } from './Header';
import { HelpModal } from './HelpModal';
import { MIDIMAN } from '../../MIDIManager';
import { Metrics } from '../constants/Metrics';
import { Mixer } from '../../Mixer';
import { MixerView } from './MixerView';
import { PlayOverlay } from './PlayOverlay';
import React from 'react';
import { SETTINGSMAN } from '../../SettingsManager';
import { SettingsModal } from './SettingsModal';
import { Stalker } from './Stalker';
import { ThemeVars } from '../themes/ThemeVars';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { XFader } from './XFader';
import { settingsAtom } from '../stores/atoms/settings';
import { themes } from '../themes/themes';
import { useAnalyserSubscribers } from '../stores/hooks/useAnalyserSubscribers';
import { useAtomValue } from 'jotai';
import { useMidiSubscribers } from '../stores/hooks/useMidiSubscribers';
import { useSettingsSubscribers } from '../stores/hooks/useSettingsSubscribers';

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

const StyledMixerView = styled( MixerView )`
  height: 180px;
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

function themeVarsCss( themeString: string ): ReturnType<typeof css> {
  const theme = ( themes[ themeString ] ?? themes[ 'monokaiSharp' ] ).theme;
  const map = Object.entries( theme.ui )
  .map( ( [ key, value ] ) => {
    const cssVar = ThemeVars[ key as keyof typeof ThemeVars ];
    if ( cssVar == null ) { return ''; }

    const cssKey = cssVar.match( /^var\(([a-z0-9-]+)/ )?.[ 1 ];
    if ( cssKey == null ) { return ''; }

    return `${ cssKey }: ${ value };`;
  } );
  return css`${ map.join( '' ) }`;
}

const Root = styled.div<{ themeString: string }>`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${ ThemeVars.fore };
  background: ${ ThemeVars.back2 };
  font-family: 'Roboto Mono', monospace;

  * {
    box-sizing: border-box;
  }

  ${ ( { themeString } ) => themeVarsCss( themeString ) };
`;

// == component ====================================================================================
interface Props {
  deckA: WavenerdDeck;
  deckB: WavenerdDeck;
  mixer: Mixer;
}

const OutOfContextApp: React.FC<Props> = ( { deckA, deckB, mixer } ) => {
  const showB = useRecoilValue( deckShowBState );
  const themeString = useAtomValue( settingsAtom ).theme;

  useAnalyserSubscribers( mixer );
  useMidiSubscribers( MIDIMAN );
  useSettingsSubscribers( SETTINGSMAN );

  return <>
    <DeckListener
      hostDeck={ deckA }
      deckA={ deckA }
      deckB={ deckB }
    />
    <Root themeString={ themeString }>
      <StyledHeader
        hostDeck={ deckA }
      />
      <DeckRow>
        <StyledDeck
          codeState={ deckACodeState }
          hasEditState={ deckAHasEditState }
          errorState={ deckAErrorState }
          analyserState={ analyserInAAtom }
          cueStatusState={ deckACueStatusState }
          deck={ deckA }
          storageKeyName="a"
          gainParamName="/mixer/channel_a/gain"
        />
        <SamplesColumn>
          <StyledAssetList
            hostDeck={ deckA }
          />
          <StyledMixerView />
        </SamplesColumn>
        { showB && (
          <StyledDeck
            codeState={ deckBCodeState }
            hasEditState={ deckBHasEditState }
            errorState={ deckBErrorState }
            analyserState={ analyserInBAtom }
            cueStatusState={ deckBCueStatusState }
            deck={ deckB }
            storageKeyName="b"
            gainParamName="/mixer/channel_b/gain"
          />
        ) }
      </DeckRow>
      <FaderRow>
        <StyledDeckKnobs paramPrefix="/deck_a" />
        <StyledXFader />
        { showB && <StyledDeckKnobs paramPrefix="/deck_b" /> }
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
