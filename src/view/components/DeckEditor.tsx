/* eslint-disable sort-imports */

import CodeMirror from 'codemirror';
import { UnControlled as ReactCodeMirror } from 'react-codemirror2';
import React, { useCallback } from 'react';
import { RecoilState } from '../utils/RecoilState';
import { useSetRecoilState } from 'recoil';
import { defineGLSLMode, defineGLSLMime } from '../codemirror-modes/glsl';
import styled from 'styled-components';
import 'codemirror/keymap/sublime';
import '../codemirror-themes/monokai-sharp.css';
import 'codemirror/lib/codemirror.css';
import { defaultCode } from '../../defaultCode';

// == setup CodeMirror =============================================================================
defineGLSLMode();
defineGLSLMime();

// == styles =======================================================================================
const StyledReactCodeMirror = styled( ReactCodeMirror )`
  height: 100%;

  & .CodeMirror {
    height: 100%;
  }
`;

const Root = styled.div`
  transform: translateZ(0);
`;

// == component ====================================================================================
function DeckEditor( { codeState, onCompile, onApply, className }: {
  codeState: RecoilState<string>;
  onCompile: () => void;
  onApply: () => void;
  className?: string;
} ): JSX.Element {
  const setCode = useSetRecoilState( codeState );

  // -- event handlers -----------------------------------------------------------------------------
  const handleEditorDidMount = useCallback(
    ( editor: CodeMirror.Editor ) => {
      editor.addKeyMap( {
        'Ctrl-S': () => {
          onCompile();
        },
        'Ctrl-R': () => {
          onApply();
        }
      } );
    },
    [ onCompile, onApply ]
  );

  const handleChange = useCallback(
    ( editor: CodeMirror.Editor, data: CodeMirror.EditorChange, value: string ) => {
      setCode( value );
    },
    []
  );

  // -- component ----------------------------------------------------------------------------------
  return (
    <Root
      className={ className }
    >
      <StyledReactCodeMirror
        value={ defaultCode }
        options={ {
          mode: 'glsl',
          keyMap: 'sublime',
          theme: 'monokai-sharp',
          lineNumbers: true
        } }
        editorDidMount={ handleEditorDidMount }
        onChange={ handleChange }
      />
    </Root>
  );
}

export { DeckEditor };
