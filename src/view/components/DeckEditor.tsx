/* eslint-disable sort-imports */

import { EditorView, KeyBinding, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { cpp } from '@codemirror/lang-cpp';
import ReactCodeMirror from '@uiw/react-codemirror';
import React, { useCallback, useMemo, useState } from 'react';
import { RecoilState, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import SimpleBar from 'simplebar-react';
import { backlayer } from '../codemirror/backlayer';
import { settingsEditorFontState, settingsThemeState } from '../states/settings';
import { braceJumpKeymap } from '../codemirror/braceJumpKeymap';
import { cmThemes } from '../codemirror/cmThemes';
import { ThemeVars } from '../themes/ThemeVars';

// == styles =======================================================================================
const StyledReactCodeMirror = styled( ReactCodeMirror )`
  height: 100%;

  .cm-editor {
    min-height: 100%;
  }

  .cm-scroller {
    line-height: 1.2;
  }
`;

const StyledSimpleBar = styled( SimpleBar )`
  width: 100%;
  height: 100%;
`;

const Overlay = styled.div<{ isDragging: boolean }>`
  display: ${ ( { isDragging } ) => isDragging ? 'block' : 'none' };
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: ${ ThemeVars.fore };
  opacity: 0.125;
  pointer-events: ${ ( { isDragging } ) => isDragging ? 'auto' : 'none' };
`;

const Root = styled.div<{ background: string }>`
  transform: translateZ(0);

  background: ${ ( { background } ) => background };
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

  const themeString = useRecoilValue( settingsThemeState );
  const theme = cmThemes[ themeString ] ?? cmThemes[ 'monokaiSharp' ]!;

  const editorFont = useRecoilValue( settingsEditorFontState );
  const fontExtension = useMemo( () => {
    const theme = EditorView.theme( {
      '.cm-scroller': {
        font: editorFont,
      },
    } );
    return [ theme ];
  }, [ editorFont ] );

  // -- keymap -------------------------------------------------------------------------------------
  const customKeymap: KeyBinding[] = [
    ...defaultKeymap,
    ...braceJumpKeymap,
    {
      key: 'Mod-s',
      preventDefault: true,
      run: () => {
        onCompile();
        return false;
      },
    },
    {
      key: 'Mod-r',
      preventDefault: true,
      run: () => {
        onApply();
        return false;
      },
    },
    {
      key: 'Shift-Mod-r',
      preventDefault: true,
      run: () => {
        onApplyImmediately();
        return false;
      },
    },
  ];

  // -- event handlers -----------------------------------------------------------------------------
  const handleChange = useCallback(
    ( value: string ) => {
      setCode( value );
      setHasEdit( true );
    },
    []
  );

  const handleFile = useCallback(
    ( files: FileList ) => {
      const file = files && files[ 0 ];
      if ( file ) {
        const reader = new FileReader();
        reader.onload = () => {
          const code = reader.result as string;
          setCode( code );
        };
        reader.readAsText( file );
      }
    },
    []
  );

  const handleDragOver = useCallback(
    ( event: React.DragEvent ) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging( true );
    },
    []
  );

  const handleDragLeave = useCallback(
    ( event: React.DragEvent ) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging( false );
    },
    []
  );

  const handleDrop = useCallback(
    ( event: React.DragEvent ) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging( false );

      const files = event.dataTransfer.files;
      handleFile( files );
    },
    [ handleFile ]
  );

  // -- component ----------------------------------------------------------------------------------
  return (
    <Root
      background={ theme.background }
      className={ className }
      onDragOver={ handleDragOver }
      onDragLeave={ handleDragLeave }
      onDrop={ handleDrop }
    >
      <StyledSimpleBar>
        <StyledReactCodeMirror
          value={ code }
          extensions={ [
            cpp(),
            keymap.of( customKeymap ),
            backlayer,
          ] }
          theme={ [
            theme.extensions,
            fontExtension,
          ] }
          onChange={ handleChange }
        />
      </StyledSimpleBar>
      <Overlay
        isDragging={ isDragging }
      />
    </Root>
  );
};
