import React, { useCallback, useEffect, useMemo } from 'react';
import { Analyser } from '../../audio/Analyser';
import { DeckEditor } from './DeckEditor';
import { DeckStatusBar } from './DeckStatusBar';
import { atom, PrimitiveAtom } from 'jotai';
import { ThemeVars } from '../themes/ThemeVars';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { deckCodeStorage } from '../../deckCodeStorage';
import styled from 'styled-components';
import { useAtomCallback } from 'jotai/utils';
import { DeckLog } from './DeckLog';
import { useSettings } from '../stores/hooks/useSettings';
import { DeckMemoryUpdateBalloon } from './DeckMemoryUpdateBalloon';
import { DeckWaveRenderer } from './DeckWaveRenderer/DeckWaveRenderer';
import { DeckLibrary } from './DeckLibrary';
import { Library } from '../../Library';

// == styles =======================================================================================
const StyledEditor = styled(DeckEditor)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: calc( 100% - 24px );
`;

const StyledStatusBar = styled(DeckStatusBar)`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 24px;
`;

const StyledWaveRenderer = styled(DeckWaveRenderer)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: calc( 100% - 24px );
  pointer-events: none;
`;

const Root = styled.div`
  position: relative;
  background: ${ThemeVars.codeBackground};
`;

// == components ===================================================================================
export const Deck: React.FC<{
  deck: WavenerdDeck;
  gainParamName: string;
  storageKeyName: 'a' | 'b';
  cueStatusAtom: PrimitiveAtom<'none' | 'ready' | 'applying' | 'compiling'>;
  errorAtom: PrimitiveAtom<string | null>;
  codeAtom: PrimitiveAtom<string>;
  hasEditAtom: PrimitiveAtom<boolean>;
  analyser: Analyser;
  library: Library;
  className?: string;
}> = ({
  className,
  cueStatusAtom,
  errorAtom,
  codeAtom,
  hasEditAtom,
  analyser,
  library,
  deck,
  gainParamName,
  storageKeyName,
}) => {
  const logEnabled = useSettings('editorLogEnabled');

  const libraryOpeningAtom = useMemo(() => atom(false), []);

  const logsAtom = useMemo(() => atom<[ id: number, text: string ][]>([]), []);

  const memoryUpdateAtom = useMemo(() => atom<{
    key: string;
    status: 'loaded' | 'loadfailed' | 'saved';
  } | null>(null), []);

  // prevent terrible consequence
  const handleBeforeUnload = useAtomCallback(useCallback((get, _, event: BeforeUnloadEvent) => {
    const hasEdit = get(hasEditAtom);
    if (hasEdit) {
      event.preventDefault();
      event.returnValue = true;
    }
  }, [hasEditAtom]));

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [handleBeforeUnload]);

  const handleLoad = useAtomCallback(useCallback(async (get, set, code: string) => {
    set(codeAtom, code);
    set(hasEditAtom, true);
  }, [codeAtom, hasEditAtom]));

  const handleCompile = useAtomCallback(useCallback(async (get, set) => {
    const code = get(codeAtom);
    await deck.compile(code);
    deckCodeStorage.set(storageKeyName, code);
    set(hasEditAtom, false);
  }, [codeAtom, hasEditAtom, deck, storageKeyName]));

  const handleApply = useCallback(
    async () => {
      if (deck.cueStatus === 'none') {
        await handleCompile();
      }
      deck.applyCue();
    },
    [handleCompile],
  );

  const handleApplyImmediately = useCallback(
    async () => {
      if (deck.cueStatus === 'none') {
        await handleCompile();
      }
      deck.applyCueImmediately();
    },
    [handleCompile],
  );

  // apply once on init
  useEffect(() => {
    handleApplyImmediately();
  }, [handleApplyImmediately]);

  return (
    <Root
      className={className}
    >
      <StyledWaveRenderer analyser={analyser} />
      <StyledEditor
        codeAtom={codeAtom}
        logsAtom={logsAtom}
        hasEditAtom={hasEditAtom}
        onCompile={handleCompile}
        onApply={handleApply}
        onApplyImmediately={handleApplyImmediately}
        memoryUpdateAtom={memoryUpdateAtom}
        libraryOpeningAtom={libraryOpeningAtom}
      />
      {logEnabled && <DeckLog logsAtom={logsAtom} />}
      <StyledStatusBar
        errorAtom={errorAtom}
        cueStatusAtom={cueStatusAtom}
        hasEditAtom={hasEditAtom}
        onCompile={handleCompile}
        onApply={handleApply}
        onApplyImmediately={handleApplyImmediately}
        gainParamName={gainParamName}
      />
      <DeckLibrary
        library={library}
        libraryOpeningAtom={libraryOpeningAtom}
        onLoad={handleLoad}
      />
      <DeckMemoryUpdateBalloon memoryUpdateAtom={memoryUpdateAtom} />
    </Root>
  );
};
