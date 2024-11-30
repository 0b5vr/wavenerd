/* eslint-disable sort-imports */

import { EditorView, KeyBinding, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { cpp } from '@codemirror/lang-cpp';
import ReactCodeMirror from '@uiw/react-codemirror';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import SimpleBar from 'simplebar-react';
import { backlayer } from '../codemirror/backlayer';
import { braceJumpKeymap } from '../codemirror/braceJumpKeymap';
import { ThemeVars } from '../themes/ThemeVars';
import { themes } from '../themes/themes';
import { useSettings } from '../stores/hooks/useSettings';
import { PrimitiveAtom, useAtom, useSetAtom } from 'jotai';

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

const Root = styled.div`
  transform: translateZ(0);
`;

// == component ====================================================================================
export const DeckEditor: React.FC<{
  codeAtom: PrimitiveAtom<string>;
  hasEditAtom: PrimitiveAtom<boolean>;
  onCompile: () => void;
  onApply: () => void;
  onApplyImmediately: () => void;
  className?: string;
}> = ( {
  codeAtom,
  hasEditAtom,
  onCompile,
  onApply,
  onApplyImmediately,
  className,
} ) => {
  const [ isDragging, setIsDragging ] = useState( false );
  const [ code, setCode ] = useAtom( codeAtom );
  const setHasEdit = useSetAtom( hasEditAtom );
  const themeString = useSettings( 'theme' );
  const font = useSettings( 'editorFont' );
  const fontVariantLigatures = useSettings( 'editorFontVariantLigatures' );

  const theme = ( themes[ themeString ] ?? themes[ 'monokaiSharp' ] ).cmTheme;

  const fontExtension = useMemo( () => {
    const theme = EditorView.theme( {
      '.cm-scroller': {
        font,
        fontVariantLigatures,
      },
    } );
    return [ theme ];
  }, [ font, fontVariantLigatures ] );

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
