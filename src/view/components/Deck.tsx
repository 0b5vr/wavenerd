import React, { useCallback, useEffect } from 'react';
import { RecoilState, useRecoilCallback, useRecoilState } from 'recoil';
import { AnalyserResult } from '../../Analyser';
import { DeckEditor } from './DeckEditor';
import { DeckSpectrum } from './DeckSpectrum';
import { DeckStatusBar } from './DeckStatusBar';
import { DeckVectorscope } from './DeckVectorscope';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { deckCodeStorage } from '../../deckCodeStorage';
import styled from 'styled-components';

// == styles =======================================================================================
const StyledEditor = styled( DeckEditor )`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: calc( 100% - 24px );
`;

const StyledStatusBar = styled( DeckStatusBar )`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 24px;
`;

const StyledVectorscope = styled( DeckVectorscope )`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: calc( 100% - 24px );
  pointer-events: none;
`;

const StyledSpectrogram = styled( DeckSpectrum )`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: calc( 100% - 24px );
  pointer-events: none;
`;

const Root = styled.div`
  position: relative;
`;

// == components ===================================================================================
export const Deck: React.FC<{
  deck: WavenerdDeck;
  gainParamName: string;
  storageKeyName: 'a' | 'b';
  cueStatusState: RecoilState<'none' | 'ready' | 'applying' | 'compiling'>;
  errorState: RecoilState<string | null>;
  codeState: RecoilState<string>;
  hasEditState: RecoilState<boolean>;
  analyserState: RecoilState<AnalyserResult>;
  className?: string;
}> = ( {
  className,
  cueStatusState,
  errorState,
  codeState,
  hasEditState,
  analyserState,
  deck,
  gainParamName,
  storageKeyName,
} ) => {
  const [ hasEdit, setHasEdit ] = useRecoilState( hasEditState );

  // prevent terrible consequence
  useEffect( () => {
    const callback = ( event: BeforeUnloadEvent ) => {
      if ( hasEdit ) {
        const confirmationMessage = 'You will lose all of your changes on the editor!';
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener( 'beforeunload', callback );
    return () => window.removeEventListener( 'beforeunload', callback );
  }, [ hasEdit ] );

  const handleCompile = useRecoilCallback(
    ( { snapshot } ) => async () => {
      const code = await snapshot.getPromise( codeState );
      await deck.compile( code );
      deckCodeStorage.set( storageKeyName, code );
      setHasEdit( false );
    },
    [ deck ]
  );

  const handleApply = useCallback(
    async () => {
      if ( deck.cueStatus === 'none' ) {
        await handleCompile();
      }
      deck.applyCue();
    },
    [ handleCompile ]
  );

  const handleApplyImmediately = useCallback(
    async () => {
      if ( deck.cueStatus === 'none' ) {
        await handleCompile();
      }
      deck.applyCueImmediately();
    },
    [ handleCompile ]
  );

  // apply once on init
  useEffect( () => {
    handleApplyImmediately();
  }, [ handleApplyImmediately ] );

  return (
    <Root
      className={ className }
    >
      <StyledEditor
        codeState={ codeState }
        hasEditState={ hasEditState }
        onCompile={ handleCompile }
        onApply={ handleApply }
        onApplyImmediately={ handleApplyImmediately }
      />
      <StyledStatusBar
        errorState={ errorState }
        cueStatusState={ cueStatusState }
        hasEditState={ hasEditState }
        onCompile={ handleCompile }
        onApply={ handleApply }
        onApplyImmediately={ handleApplyImmediately }
        gainParamName={ gainParamName }
      />
      <StyledVectorscope
        analyserState={ analyserState }
      />
      <StyledSpectrogram
        analyserState={ analyserState }
      />
    </Root>
  );
};
