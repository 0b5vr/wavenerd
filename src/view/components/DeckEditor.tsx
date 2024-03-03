/* eslint-disable sort-imports */

import { KeyBinding, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { cpp } from '@codemirror/lang-cpp';
import ReactCodeMirror from '@uiw/react-codemirror';
import React, { useCallback, useState } from 'react';
import { RecoilState, useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { Colors } from '../constants/Colors';
import { monokaiSharp } from '../codemirror/monokai-sharp';
import SimpleBar from 'simplebar-react';

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

  // -- keymap -------------------------------------------------------------------------------------
  const customKeymap: KeyBinding[] = [
    ...defaultKeymap,
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
    >
      <StyledSimpleBar>
        <StyledReactCodeMirror
          value={ code }
          extensions={[
            cpp(),
            keymap.of( customKeymap ),
          ]}
          theme={ monokaiSharp }
          onChange={ handleChange }
          onDragOver={ handleDragOver }
          onDragLeave={ handleDragLeave }
          onDrop={ handleDrop }
        />
      </StyledSimpleBar>
      <Overlay
        isDragging={ isDragging }
      />
    </Root>
  );
};
