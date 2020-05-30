/* eslint-disable sort-imports */

import CodeMirror from 'codemirror';
import { UnControlled as ReactCodeMirror } from 'react-codemirror2';
import React, { useCallback, useState } from 'react';
import { RecoilState } from '../utils/RecoilState';
import { useSetRecoilState } from 'recoil';
import { defineGLSLMode, defineGLSLMime } from '../codemirror-modes/glsl';
import styled from 'styled-components';
import 'codemirror/keymap/sublime';
import '../codemirror-themes/monokai-sharp.css';
import '../codemirror-themes/chromacoder-green.css';
import 'codemirror/lib/codemirror.css';
import { defaultCode } from '../../defaultCode';
import { Colors } from '../constants/Colors';

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

const Overlay = styled.div<{ isDragging: boolean }>`
  display: ${ ( { isDragging } ) => isDragging ? 'block' : 'none' };
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: ${ Colors.fore };
  opacity: 0.125;
  pointer-events: none;
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
  const [ isDragging, setIsDragging ] = useState( false );
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

  const handleFile = useCallback(
    ( files: FileList, editor: CodeMirror.Editor ) => {
      const file = files && files[ 0 ];
      if ( file ) {
        const reader = new FileReader();
        reader.onload = () => {
          const code = reader.result as string;
          setCode( code );
          editor.setValue( code );
        };
        reader.readAsText( file );
      }
    },
    []
  );

  const handleDragOver = useCallback(
    ( editor: CodeMirror.Editor, event?: any ) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging( true );
    },
    []
  );

  const handleDragLeave = useCallback(
    ( editor: CodeMirror.Editor, event?: any ) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging( false );
    },
    []
  );

  const handleDrop = useCallback(
    ( editor: CodeMirror.Editor, event?: any ) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging( false );

      const files = event.dataTransfer.files;
      handleFile( files, editor );
    },
    [ handleFile ]
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
        onDragOver={ handleDragOver }
        onDragLeave={ handleDragLeave }
        onDrop={ handleDrop }
      />
      <Overlay
        isDragging={ isDragging }
      />
    </Root>
  );
}

export { DeckEditor };
