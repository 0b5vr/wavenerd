import React, { useCallback, useEffect, useMemo } from 'react';
import { Analyser } from '../../Analyser';
import { DeckEditor } from './DeckEditor';
import { DeckSpectrum } from './DeckSpectrum';
import { DeckStatusBar } from './DeckStatusBar';
import { DeckVectorscope } from './DeckVectorscope';
import { atom, PrimitiveAtom } from 'jotai';
import { ThemeVars } from '../themes/ThemeVars';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { deckCodeStorage } from '../../deckCodeStorage';
import styled from 'styled-components';
import { useAtomCallback } from 'jotai/utils';
import { DeckLog } from './DeckLog';
import { useSettings } from '../stores/hooks/useSettings';

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

const StyledVectorscope = styled(DeckVectorscope)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: calc( 100% - 24px );
  pointer-events: none;
`;

const StyledSpectrogram = styled(DeckSpectrum)`
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
  className?: string;
}> = ({
  className,
  cueStatusAtom,
  errorAtom,
  codeAtom,
  hasEditAtom,
  analyser,
  deck,
  gainParamName,
  storageKeyName,
}) => {
  const logEnabled = useSettings('editorLogEnabled');

  const logsAtom = useMemo(() => atom<[ id: number, text: string ][]>([]), []);

  // prevent terrible consequence
  const handleBeforeUnload = useAtomCallback(useCallback((get) => {
    const hasEdit = get(hasEditAtom);
    if (hasEdit) {
      return 'You will lose all of your changes on the editor!';
    }
  }, [hasEditAtom]));

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [handleBeforeUnload]);

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
      <StyledVectorscope analyser={analyser} />
      <StyledSpectrogram analyser={analyser} />
      <StyledEditor
        codeAtom={codeAtom}
        logsAtom={logsAtom}
        hasEditAtom={hasEditAtom}
        onCompile={handleCompile}
        onApply={handleApply}
        onApplyImmediately={handleApplyImmediately}
      />
      <StyledStatusBar
        errorAtom={errorAtom}
        cueStatusAtom={cueStatusAtom}
        hasEditAtom={hasEditAtom}
        onCompile={handleCompile}
        onApply={handleApply}
        onApplyImmediately={handleApplyImmediately}
        gainParamName={gainParamName}
      />
      {logEnabled && <DeckLog logsAtom={logsAtom} />}
    </Root>
  );
};
