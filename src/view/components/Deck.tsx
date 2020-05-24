import React, { useCallback } from 'react';
import { DeckEditor } from './DeckEditor';
import { DeckStatusBar } from './DeckStatusBar';
import { RecoilState } from '../utils/RecoilState';
import WavenerdDeck from '@fms-cat/wavenerd-deck';
import styled from 'styled-components';
import { useRecoilCallback } from 'recoil';

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
function Deck( { className, cueStatusState, errorState, codeState, deck }: {
  deck: WavenerdDeck;
  cueStatusState: RecoilState<'none' | 'ready' | 'applying'>;
  errorState: RecoilState<string | null>;
  codeState: RecoilState<string>;
  className?: string;
} ): JSX.Element {
  const handleCompile = useRecoilCallback(
    async ( { getPromise } ) => {
      const code = await getPromise( codeState );
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
}

export { Deck };
