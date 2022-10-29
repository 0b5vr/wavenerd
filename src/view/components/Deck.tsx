import React, { useCallback } from 'react';
import { RecoilState, useRecoilCallback } from 'recoil';
import { AnalyserResult } from '../../Analyser';
import { DeckEditor } from './DeckEditor';
import { DeckStatusBar } from './DeckStatusBar';
import { DeckVectorscope } from './DeckVectorscope';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
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

const Root = styled.div`
  position: relative;
`;

// == components ===================================================================================
export const Deck: React.FC<{
  deck: WavenerdDeck;
  cueStatusState: RecoilState<'none' | 'ready' | 'applying' | 'compiling'>;
  errorState: RecoilState<string | null>;
  codeState: RecoilState<string>;
  analyserState: RecoilState<AnalyserResult>;
  className?: string;
}> = ( { className, cueStatusState, errorState, codeState, analyserState, deck } ) => {
  const handleCompile = useRecoilCallback(
    ( { snapshot } ) => async () => {
      const code = await snapshot.getPromise( codeState );
      await deck.compile( code );
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

  return (
    <Root
      className={ className }
    >
      <StyledEditor
        codeState={ codeState }
        onCompile={ handleCompile }
        onApply={ handleApply }
      />
      <StyledStatusBar
        errorState={ errorState }
        cueStatusState={ cueStatusState }
        onCompile={ handleCompile }
        onApply={ handleApply }
      />
      <StyledVectorscope
        analyserState={ analyserState }
      />
    </Root>
  );
};
