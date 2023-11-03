/* eslint-disable sort-imports */

import CodeMirror from 'codemirror';
import { Controlled as ReactCodeMirror } from 'react-codemirror2';
import React, { useCallback, useState } from 'react';
import { RecoilState, useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import 'codemirror/addon/comment/comment';
import 'codemirror/mode/clike/clike';
import 'codemirror/keymap/sublime';
import '../codemirror-themes/monokai-sharp.css';
import '../codemirror-themes/chromacoder-green.css';
import 'codemirror/lib/codemirror.css';
import { Colors } from '../constants/Colors';

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
export const DeckEditor: React.FC<{
  codeState: RecoilState<string>;
  hasEditState: RecoilState<boolean>;
  onCompile: () => void;
  onApply: () => void;
  onApplyImmediately: () => void;
  className?: string;
}> = ( {
  codeState,
  hasEditState,
  onCompile,
  onApply,
  onApplyImmediately,
  className,
} ) => {
  const [ isDragging, setIsDragging ] = useState( false );
  const [ code, setCode ] = useRecoilState( codeState );
  const setHasEdit = useSetRecoilState( hasEditState );

  // -- event handlers -----------------------------------------------------------------------------
  const handleEditorDidMount = useCallback(
    ( editor: CodeMirror.Editor ) => {
      editor.addKeyMap( {
        'Ctrl-S': () => {
          onCompile();
        },
        'Ctrl-R': () => {
          onApply();
        },
        'Shift-Ctrl-R': () => {
          onApplyImmediately();
        },
        'Ctrl-B': () => {
          editor.execCommand( 'selectBetweenBrackets' );
          editor.execCommand( 'toggleCommentIndented' );
        },
      } );
    },
    [ onCompile, onApply ]
  );

  const handleChange = useCallback(
    ( editor: CodeMirror.Editor, data: CodeMirror.EditorChange, value: string ) => {
      setCode( value );
      setHasEdit( true );
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
        value={ code }
        options={ {
          mode: 'x-shader/x-fragment',
          keyMap: 'sublime',
          theme: 'monokai-sharp',
          lineNumbers: true
        } }
        editorDidMount={ handleEditorDidMount }
        onBeforeChange={ handleChange }
        onDragOver={ handleDragOver }
        onDragLeave={ handleDragLeave }
        onDrop={ handleDrop }
      />
      <Overlay
        isDragging={ isDragging }
      />
    </Root>
  );
};
