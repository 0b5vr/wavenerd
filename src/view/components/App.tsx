import 'simplebar-react/dist/simplebar.min.css';

import { deckACodeAtom, deckACompileTimeAtom, deckACueStatusAtom, deckAErrorAtom, deckAHasEditAtom, deckBCodeAtom, deckBCompileTimeAtom, deckBCueStatusAtom, deckBErrorAtom, deckBHasEditAtom } from '../stores/atoms/deck';
import styled, { createGlobalStyle, css } from 'styled-components';
import { AssetList } from './AssetList';
import { ContextMenu } from './ContextMenu';
import { Deck } from './Deck';
import { DeckKnobs } from './DeckKnobs';
import { Header } from './Header/Header';
import { HelpModal } from './HelpModal';
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
import { themes } from '../themes/themes';
import { useAnalyserSubscribers } from '../stores/hooks/useAnalyserSubscribers';
import { useDeckSubscribers } from '../stores/hooks/useDeckSubscribers';
import { useMidiSubscribers } from '../stores/hooks/useMidiSubscribers';
import { useSettings } from '../stores/hooks/useSettings';
import { useSettingsSubscribers } from '../stores/hooks/useSettingsSubscribers';
import { useRecorderSubscribers } from '../stores/hooks/useRecorderSubscribers';
import { type Stuff, StuffContext } from '../StuffContext';
import { useFullscreenSubscriber } from '../stores/hooks/useFullscreenSubscriber';
import { useStorageSubscribers } from '../stores/hooks/useStorageSubscribers';

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

function themeVarsCss(themeString: string): ReturnType<typeof css> {
  const theme = (themes[themeString] ?? themes['monokaiSharp']).theme;
  const map = Object.entries(theme.ui)
    .map(([key, value]) => {
      const cssVar = ThemeVars[key as keyof typeof ThemeVars];
      if (cssVar == null) { return ''; }

      const cssKey = cssVar.match(/^var\(([a-z0-9-]+)/)?.[1];
      if (cssKey == null) { return ''; }

      return `${cssKey}: ${value};`;
    });
  return css`${map.join('')}`;
}

const Root = styled.div<{ themeString: string }>`
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

  ${({ themeString }) => themeVarsCss(themeString)}

  ${({ themeString }) => (themeString.startsWith('chromaCoder')) && css`
    filter: brightness(1.0);
  `}
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

  const themeString = useSettings('theme');
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

      <Root themeString={themeString}>
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
              />
              <StyledDeckKnobs paramPrefix="/deck_b" />
            </DeckColumn>
          )}
        </DeckRow>

        <SettingsModal />
        <HelpModal />

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
