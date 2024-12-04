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
import { useAtomCallback } from 'jotai/utils';

// == styles =======================================================================================
const StyledReactCodeMirror = styled(ReactCodeMirror)`
  height: 100%;

  .cm-editor {
    min-height: 100%;
  }

  .cm-scroller {
    line-height: 1.2;
  }
`;

const StyledSimpleBar = styled(SimpleBar)`
  width: 100%;
  height: 100%;
`;

const Overlay = styled.div<{ isDragging: boolean }>`
  display: ${({ isDragging }) => isDragging ? 'block' : 'none'};
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: ${ThemeVars.fore};
  opacity: 0.125;
  pointer-events: ${({ isDragging }) => isDragging ? 'auto' : 'none'};
`;

const Root = styled.div`
  transform: translateZ(0);
`;

// == utils ========================================================================================
const keyToLogSpecialMap = new Map([
  [' ', 'Space'],
  ['ArrowUp', '↑'],
  ['ArrowDown', '↓'],
  ['ArrowLeft', '←'],
  ['ArrowRight', '→'],
]);

const keysPutShiftSet = new Set([
  'Enter',
  'Tab',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Backspace',
  'Delete',
  'PageUp',
  'PageDown',
]);

const keysIgnoreSet = new Set([
  'Control',
  'Shift',
  'Alt',
  'Meta',
]);

function keyToLog(event: KeyboardEvent): string | null {
  if (keysIgnoreSet.has(event.key)) {
    return null;
  }

  let key = keyToLogSpecialMap.get(event.key) ?? event.key;

  if (event.shiftKey && keysPutShiftSet.has(event.key)) { key = 'Shift-' + key; }
  if (event.ctrlKey) { key = 'Ctrl-' + key; }
  if (event.metaKey) { key = 'Cmd-' + key; }
  if (event.altKey) { key = 'Alt-' + key; }

  return key;
}

// == component ====================================================================================
export const DeckEditor: React.FC<{
  codeAtom: PrimitiveAtom<string>;
  logsAtom: PrimitiveAtom<[ id: number, text: string ][]>;
  hasEditAtom: PrimitiveAtom<boolean>;
  onCompile: () => void;
  onApply: () => void;
  onApplyImmediately: () => void;
  className?: string;
}> = ({
  codeAtom,
  logsAtom,
  hasEditAtom,
  onCompile,
  onApply,
  onApplyImmediately,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [code, setCode] = useAtom(codeAtom);
  const setHasEdit = useSetAtom(hasEditAtom);
  const themeString = useSettings('theme');
  const font = useSettings('editorFont');
  const fontVariantLigatures = useSettings('editorFontVariantLigatures');

  const theme = (themes[themeString] ?? themes['monokaiSharp']).cmTheme;

  const fontExtension = useMemo(() => {
    const theme = EditorView.theme({
      '.cm-scroller': {
        font,
        fontVariantLigatures,
      },
    });
    return [theme];
  }, [font, fontVariantLigatures]);

  const addLog = useAtomCallback(useCallback((get, set, text: string) => {
    const logs = get(logsAtom);
    const id = (logs[0]?.[0] ?? 0) + 1;
    const log: [number, string] = [id, text];
    set(logsAtom, [log, ...logs].slice(0, 5));
  }, [logsAtom]));

  // -- keymap -------------------------------------------------------------------------------------
  const customKeymap: KeyBinding[] = useMemo(() => [
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
  ], [onCompile, onApply, onApplyImmediately, addLog]);

  // -- event handlers -----------------------------------------------------------------------------
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const log = keyToLog(event.nativeEvent);
      if (log) {
        addLog(log);
      }
    },
    [addLog],
  );

  const handleChange = useCallback(
    (value: string) => {
      setCode(value);
      setHasEdit(true);
    },
    [],
  );

  const handleFile = useCallback(
    (files: FileList) => {
      const file = files && files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const code = reader.result as string;
          setCode(code);
        };
        reader.readAsText(file);
      }
    },
    [],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging(true);
    },
    [],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging(false);
    },
    [],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging(false);

      const files = event.dataTransfer.files;
      handleFile(files);
    },
    [handleFile],
  );

  // -- component ----------------------------------------------------------------------------------
  return (
    <Root
      className={className}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <StyledSimpleBar>
        <StyledReactCodeMirror
          value={code}
          extensions={[
            cpp(),
            keymap.of(customKeymap),
            backlayer,
          ]}
          theme={[
            theme.extensions,
            fontExtension,
          ]}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
      </StyledSimpleBar>
      <Overlay
        isDragging={isDragging}
      />
    </Root>
  );
};
