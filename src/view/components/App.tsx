import 'simplebar-react/dist/simplebar.min.css';

import { deckACodeAtom, deckACompileTimeAtom, deckACueStatusAtom, deckAErrorAtom, deckAHasEditAtom, deckBCodeAtom, deckBCompileTimeAtom, deckBCueStatusAtom, deckBErrorAtom, deckBHasEditAtom } from '../stores/atoms/deck';
import styled, { createGlobalStyle } from 'styled-components';
import { AssetList } from './AssetList';
import { ContextMenu } from './ContextMenu';
import { Deck } from './Deck';
import { DeckKnobs } from './DeckKnobs';
import { Header } from './Header/Header';
import { MIDIMAN } from '../../MIDIManager';
import { Metrics } from '../constants/Metrics';
import { MixerView } from './MixerView';
import { PlayOverlay } from './PlayOverlay';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { SETTINGSMAN } from '../../SettingsManager';
import { SettingsModal } from './Settings/SettingsModal';
import { Stalker } from './Stalker';
import { ThemeVars } from '../themes/ThemeVars';
import { XFader } from './XFader';
import { useAnalyserSubscribers } from '../stores/hooks/useAnalyserSubscribers';
import { useDeckSubscribers } from '../stores/hooks/useDeckSubscribers';
import { useMidiSubscribers } from '../stores/hooks/useMidiSubscribers';
import { useSettings } from '../stores/hooks/useSettings';
import { useSettingsSubscribers } from '../stores/hooks/useSettingsSubscribers';
import { useRecorderSubscribers } from '../stores/hooks/useRecorderSubscribers';
import { type Stuff, StuffContext } from '../StuffContext';
import { useFullscreenSubscriber } from '../stores/hooks/useFullscreenSubscriber';
import { useStorageSubscribers } from '../stores/hooks/useStorageSubscribers';
import { ThemeStyle } from './ThemeStyle';

// == styles =======================================================================================
const StyledHeader = styled(Header)`
  height: ${Metrics.headerHeight}px;
`;

const DeckRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-grow: 1;
  gap: 2px;
`;

const StyledDeck = styled(Deck)`
  flex-grow: 1;
`;

const DeckColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const CenterColumn = styled.div`
  display: flex;
  justify-content: end;
  flex-direction: column;
  width: ${Metrics.sampleListWidth}px;
`;

const StyledAssetList = styled(AssetList)`
  flex-grow: 1;
`;

const StyledMixerView = styled(MixerView)`
  padding: 8px 0;
`;

const StyledDeckKnobs = styled(DeckKnobs)`
  height: ${Metrics.deckKnobsHeight}px;
`;

const StyledXFader = styled(XFader)`
  width: ${Metrics.xFaderWidth}px;
  height: ${Metrics.xFaderHeight}px;
  margin: 8px 16px;
`;

const Root = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${ThemeVars.fore};
  background: ${ThemeVars.back2};
  font-family: 'Inter', monospace;

  * {
    box-sizing: border-box;
  }
`;

const GlobalStyleDisableSwipeNavi = createGlobalStyle`
  // Disable two finger swipe navigation
  // Ref: https://stackoverflow.com/questions/17474930/disable-chrome-two-fingers-back-forward-swipe
  html {
    overscroll-behavior-x: none;
  }

  body {
    overscroll-behavior-x: none;
  }
`;

// == hooks ========================================================================================
function useFocusDeckShortcuts({
  focusDeckAEditor,
  focusDeckBEditor,
}: {
  focusDeckAEditor: () => void;
  focusDeckBEditor: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'j' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        focusDeckAEditor();
      } else if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        focusDeckBEditor();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusDeckAEditor, focusDeckBEditor]);
}

// == component ====================================================================================
export function OutOfContextApp() {
  const { deckA, deckB, mixer, recorder, storageManager } = useContext(StuffContext)!;

  const deckBShow = useSettings('deckBShow');
  const libraryShow = useSettings('libraryShow');
  const mixerShow = useSettings('mixerShow');
  const showCenterColumn = libraryShow || mixerShow;

  useAnalyserSubscribers(mixer);
  useMidiSubscribers(MIDIMAN);
  useSettingsSubscribers(SETTINGSMAN);
  useDeckSubscribers(deckA, deckA, deckB);
  useRecorderSubscribers(recorder);
  useStorageSubscribers(storageManager);
  useFullscreenSubscriber();

  const refDeckA = useRef<{ focusEditor: (highlight: boolean) => void }>(null);
  const focusDeckAEditor = useCallback(() => {
    refDeckA.current?.focusEditor?.(true);
  }, [refDeckA]);

  const refDeckB = useRef<{ focusEditor: (highlight: boolean) => void }>(null);
  const focusDeckBEditor = useCallback(() => {
    refDeckB.current?.focusEditor?.(true);
  }, [refDeckB]);

  useFocusDeckShortcuts({
    focusDeckAEditor,
    focusDeckBEditor,
  });

  return (
    <>
      <GlobalStyleDisableSwipeNavi />
      <ThemeStyle />

      <Root>
        <StyledHeader />
        <DeckRow>
          <DeckColumn>
            <StyledDeck
              ref={refDeckA}
              codeAtom={deckACodeAtom}
              hasEditAtom={deckAHasEditAtom}
              errorAtom={deckAErrorAtom}
              cueStatusAtom={deckACueStatusAtom}
              compileTimeAtom={deckACompileTimeAtom}
              analyser={mixer.analyserInA}
              deck={deckA}
              storagePath="decks/a.glsl"
              gainParamName="/mixer/channel_a/gain"
              filterParamName="/mixer/channel_a/filter"
            />
            <StyledDeckKnobs paramPrefix="/deck_a" />
          </DeckColumn>
          {showCenterColumn && (
            <CenterColumn>
              {libraryShow && (
                <StyledAssetList />
              )}
              {mixerShow && (
                <>
                  <StyledMixerView />
                  <StyledXFader />
                </>
              )}
            </CenterColumn>
          )}
          {deckBShow && (
            <DeckColumn>
              <StyledDeck
                ref={refDeckB}
                codeAtom={deckBCodeAtom}
                hasEditAtom={deckBHasEditAtom}
                errorAtom={deckBErrorAtom}
                analyser={mixer.analyserInB}
                cueStatusAtom={deckBCueStatusAtom}
                compileTimeAtom={deckBCompileTimeAtom}
                deck={deckB}
                storagePath="decks/b.glsl"
                gainParamName="/mixer/channel_b/gain"
                filterParamName="/mixer/channel_b/filter"
              />
              <StyledDeckKnobs paramPrefix="/deck_b" />
            </DeckColumn>
          )}
        </DeckRow>

        <SettingsModal />

        <PlayOverlay />
        <ContextMenu />
        <Stalker />
      </Root>
    </>
  );
}

export function App({ stuff }: { stuff: Stuff }) {
  return (
    <StuffContext.Provider value={stuff}>
      <OutOfContextApp />
    </StuffContext.Provider>
  );
}
