import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { type Analyser } from '../../audio/Analyser';
import { DeckEditor } from './DeckEditor';
import { DeckStatusBar } from './DeckStatusBar';
import { atom, type PrimitiveAtom } from 'jotai';
import { ThemeVars } from '../themes/ThemeVars';
import { type WavenerdDeck } from '@0b5vr/wavenerd-deck';
import styled, { keyframes } from 'styled-components';
import { useAtomCallback } from 'jotai/utils';
import { DeckLog } from './DeckLog';
import { DeckMemoryUpdateBalloon } from './DeckMemoryUpdateBalloon';
import { DeckVisualizer } from './DeckVisualizer/DeckVisualizer';
import { DeckLibrary } from './DeckLibrary';
import { DeckBraceJumpMap } from './DeckBraceJumpMap';
import { StuffContext } from '../StuffContext';

// == styles =======================================================================================
const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const DeckFocusHighlight = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  border: 4px solid ${ThemeVars.fore};
  animation: step-end ${fadeOut} 0.2s forwards;
  pointer-events: none;
`;

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

const StyledVisualizer = styled(DeckVisualizer)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: calc( 100% - 24px );
  pointer-events: none;
`;

const StyledDeckBraceJumpMap = styled(DeckBraceJumpMap)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: calc( 100% - 24px );
`;

const Root = styled.div`
  position: relative;
  background: ${ThemeVars.codeBackground};
`;

// == components ===================================================================================
export const Deck = forwardRef(({
  className,
  cueStatusAtom,
  errorAtom,
  codeAtom,
  hasEditAtom,
  compileTimeAtom,
  analyser,
  deck,
  gainParamName,
  filterParamName,
  storagePath,
}: {
  deck: WavenerdDeck;
  gainParamName: string;
  filterParamName: string;
  storagePath: string;
  cueStatusAtom: PrimitiveAtom<'none' | 'ready' | 'applying' | 'compiling'>;
  errorAtom: PrimitiveAtom<string | null>;
  codeAtom: PrimitiveAtom<string>;
  hasEditAtom: PrimitiveAtom<boolean>;
  compileTimeAtom: PrimitiveAtom<number>;
  analyser: Analyser;
  className?: string;
}, ref: React.Ref<{ focusEditor: (highlight: boolean) => void }>) => {
  const { storageManager } = useContext(StuffContext)!;

  // -- atoms and state ----------------------------------------------------------------------------
  const libraryOpeningAtom = useMemo(() => atom(false), []);
  const logsAtom = useMemo(() => atom<[ id: number, text: string ][]>([]), []);
  const memoryUpdateAtom = useMemo(() => atom<{
    renderKey: number;
    memoryKey: string;
    status: 'loaded' | 'loadfailed' | 'saved';
  } | null>(null), []);

  const [focusHighlightKey, setFocusHighlightKey] = useState(0);

  // -- refs ---------------------------------------------------------------------------------------
  const refEditor = useRef<{ focusEditor: () => void; jumpToLine: (line: number) => void }>(null);

  // -- beforeunload -------------------------------------------------------------------------------
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

  // -- handlers -----------------------------------------------------------------------------------
  const focusEditor = useCallback((highlight: boolean) => {
    refEditor.current?.focusEditor?.();
    if (highlight) {
      setFocusHighlightKey((key) => key + 1);
    }
  }, [refEditor, setFocusHighlightKey]);

  const jumpToLine = useCallback((line: number) => {
    focusEditor(false);
    refEditor.current?.jumpToLine(line);
  }, [focusEditor]);

  const handleLoad = useAtomCallback(useCallback(async (_get, set, code: string) => {
    set(codeAtom, code);
    set(hasEditAtom, true);
    jumpToLine(1);
  }, [codeAtom, hasEditAtom, jumpToLine]));

  const handleCompile = useAtomCallback(useCallback(async (get, set) => {
    const code = get(codeAtom);

    const compileBegin = performance.now();
    await deck.compile(code);
    const compileTime = performance.now() - compileBegin;

    storageManager.save(storagePath, code);
    set(hasEditAtom, false);
    set(compileTimeAtom, compileTime);
  }, [codeAtom, hasEditAtom, deck, storagePath, compileTimeAtom, storageManager]));

  const handleApply = useCallback(
    async () => {
      if (deck.cueStatus === 'none') {
        await handleCompile();
      }
      deck.applyCue();
    },
    [deck, handleCompile],
  );

  const handleApplyImmediately = useCallback(
    async () => {
      if (deck.cueStatus === 'none') {
        await handleCompile();
      }
      deck.applyCueImmediately();
    },
    [deck, handleCompile],
  );

  const refBraceJumpMap = useRef<{ update: (index: number) => void }>(null);
  const handleBraceJump = useCallback((index: number) => {
    refBraceJumpMap.current?.update(index);
  }, []);

  // -- init ---------------------------------------------------------------------------------------
  useEffect(() => {
    const initCode = async () => {
      const file = await storageManager.getFile(storagePath);
      if (file != null) {
        const code = await file.text();
        handleLoad(code);
      }

      handleApplyImmediately();
    };
    initCode();

    const handleInit = storageManager.on('init', initCode);

    return () => {
      storageManager.off('init', handleInit);
    };
  }, [storageManager, storagePath, handleLoad, handleApplyImmediately]);

  // -- imperative handle --------------------------------------------------------------------------
  useImperativeHandle(ref, () => ({ focusEditor }), [focusEditor]);

  // -- render -------------------------------------------------------------------------------------
  return (
    <Root
      className={className}
    >
      <StyledVisualizer analyser={analyser} />
      <StyledEditor
        ref={refEditor}
        codeAtom={codeAtom}
        logsAtom={logsAtom}
        errorAtom={errorAtom}
        hasEditAtom={hasEditAtom}
        onCompile={handleCompile}
        onApply={handleApply}
        onApplyImmediately={handleApplyImmediately}
        onBraceJump={handleBraceJump}
        memoryUpdateAtom={memoryUpdateAtom}
        libraryOpeningAtom={libraryOpeningAtom}
      />
      <DeckLog logsAtom={logsAtom} />
      <StyledStatusBar
        errorAtom={errorAtom}
        cueStatusAtom={cueStatusAtom}
        hasEditAtom={hasEditAtom}
        compileTimeAtom={compileTimeAtom}
        onCompile={handleCompile}
        onApply={handleApply}
        onApplyImmediately={handleApplyImmediately}
        onJumpToLine={jumpToLine}
        gainParamName={gainParamName}
        filterParamName={filterParamName}
      />

      <DeckLibrary
        libraryOpeningAtom={libraryOpeningAtom}
        onLoad={handleLoad}
        focusEditor={focusEditor}
      />
      <StyledDeckBraceJumpMap
        ref={refBraceJumpMap}
        codeAtom={codeAtom}
      />
      <DeckMemoryUpdateBalloon memoryUpdateAtom={memoryUpdateAtom} />
      {focusHighlightKey > 0 && (
        <DeckFocusHighlight key={focusHighlightKey} />
      )}
    </Root>
  );
});
Deck.displayName = 'Deck';
