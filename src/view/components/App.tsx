import 'simplebar-react/dist/simplebar.min.css';

import { deckACodeAtom, deckACompileTimeAtom, deckACueStatusAtom, deckAErrorAtom, deckAHasEditAtom, deckBCodeAtom, deckBCompileTimeAtom, deckBCueStatusAtom, deckBErrorAtom, deckBHasEditAtom } from '../stores/atoms/deck';
import { AssetList } from './AssetList';
import { ContextMenu } from './ContextMenu';
import { Deck } from './Deck';
import { DeckKnobs } from './DeckKnobs';
import { Header } from './Header/Header';
import { MIDIMAN } from '../../MIDIManager';
import { MixerView } from './MixerView';
import { PlayOverlay } from './PlayOverlay';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { SETTINGSMAN } from '../../SettingsManager';
import { SettingsModal } from './Settings/SettingsModal';
import { Stalker } from './Stalker';
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
      <ThemeStyle />

      <div className="fixed inset-0 flex flex-col text-fore bg-back2 font-[Inter,monospace]">
        <Header className="h-8" />
        <div className="flex justify-between flex-row grow gap-0.5">
          <div className="flex flex-col grow">
            <Deck
              ref={refDeckA}
              className="grow"
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
            <DeckKnobs className="h-16" paramPrefix="/deck_a" />
          </div>
          {showCenterColumn && (
            <div className="flex justify-end flex-col w-48">
              {libraryShow && (
                <AssetList className="grow" />
              )}
              {mixerShow && (
                <>
                  <MixerView className="py-2" />
                  <XFader className="w-40 h-10 my-2 mx-4" />
                </>
              )}
            </div>
          )}
          {deckBShow && (
            <div className="flex flex-col grow">
              <Deck
                ref={refDeckB}
                className="grow"
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
              <DeckKnobs className="h-16" paramPrefix="/deck_b" />
            </div>
          )}
        </div>

        <SettingsModal />

        <PlayOverlay />
        <ContextMenu />
        <Stalker />
      </div>
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
