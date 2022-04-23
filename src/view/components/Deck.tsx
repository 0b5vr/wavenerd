import React, { useCallback } from 'react';
import { RecoilState, useRecoilCallback } from 'recoil';
import { DeckEditor } from './DeckEditor';
import { DeckStatusBar } from './DeckStatusBar';
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

const Root = styled.div`
`;

// == components ===================================================================================
export const Deck: React.FC<{
  deck: WavenerdDeck;
  cueStatusState: RecoilState<'none' | 'ready' | 'applying' | 'compiling'>;
  errorState: RecoilState<string | null>;
  codeState: RecoilState<string>;
  className?: string;
}> = ( { className, cueStatusState, errorState, codeState, deck } ) => {
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
    </Root>
  );
};
