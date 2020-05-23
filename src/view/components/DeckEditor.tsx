/* eslint-disable sort-imports */

import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-glsl';
import 'ace-builds/src-noconflict/theme-monokai';
import React, { useEffect, useRef, useState } from 'react';
import { RecoilState } from '../utils/RecoilState';
import { useSetRecoilState } from 'recoil';
import { defaultCode } from '../../defaultCode';

// == component ====================================================================================
function DeckEditor( { codeState, onCompile, onApply, className }: {
  codeState: RecoilState<string>;
  onCompile: () => void;
  onApply: () => void;
  className?: string;
} ): JSX.Element {
  const setCode = useSetRecoilState( codeState );
  const [ editor, setEditor ] = useState<ace.Ace.Editor | null>( null );
  const refRoot = useRef<HTMLDivElement>( null );

  // -- initialize editor --------------------------------------------------------------------------
  useEffect(
    () => {
      const root = refRoot.current;
      if ( !root ) { return; }

      setEditor( ace.edit( root ) );
    },
    [ refRoot.current ]
  );

  useEffect(
    () => {
      if ( !editor ) { return; }

      editor.setTheme( 'ace/theme/monokai' );
      editor.session.setMode( 'ace/mode/glsl' );

      const commandCompile: ace.Ace.Command = {
        name: 'Compile Shader',
        bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
        exec: () => { onCompile(); }
      };
      editor.commands.addCommand( commandCompile );

      const commandApply: ace.Ace.Command = {
        name: 'Apply Shader',
        bindKey: { win: 'Ctrl-R', mac: 'Command-R' },
        exec: () => { onApply(); }
      };
      editor.commands.addCommand( commandApply );

      const handleChange = editor.on( 'change', () => {
        setCode( editor.getValue() );
      } );

      return () => {
        editor.off( 'change', handleChange );
        editor.commands.removeCommand( commandCompile );
        editor.commands.removeCommand( commandApply );
      };
    },
    [ editor, onCompile ]
  );

  // -- component ----------------------------------------------------------------------------------
  return (
    <div
      ref={ refRoot }
      className={ className }
    >{ defaultCode }</div>
  );
}

export { DeckEditor };
