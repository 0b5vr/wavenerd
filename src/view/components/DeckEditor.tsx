import { EditorView, KeyBinding, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { cpp } from '@codemirror/lang-cpp';
import ReactCodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
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
import { deckMemoryStorage } from '../../deckMemoryStorage';

// == styles =======================================================================================
const StyledReactCodeMirror = styled(ReactCodeMirror)`
  height: 100%;
`;

const StyledSimpleBar = styled(SimpleBar)`
  width: 100%;
  height: 100%;

  .simplebar-content {
    min-height: 100%;
  }
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
  memoryUpdateAtom: PrimitiveAtom<{ key: string; status: 'loaded' | 'loadfailed' | 'saved' } | null>;
  className?: string;
}> = ({
  codeAtom,
  logsAtom,
  hasEditAtom,
  onCompile,
  onApply,
  onApplyImmediately,
  memoryUpdateAtom,
  className,
}) => {
  const refCodeMirror = React.useRef<ReactCodeMirrorRef>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [code, setCode] = useAtom(codeAtom);
  const setMemoryUpdate = useSetAtom(memoryUpdateAtom);
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

  const handleLoadMemory = useCallback((key: string) => {
    const obj = deckMemoryStorage.get(key);
    if (obj == null) {
      setMemoryUpdate({ key, status: 'loadfailed' });
      return;
    }

    const code = obj.code ?? '';
    const head = obj.head ?? 0;

    const scrollEffect = EditorView.scrollIntoView(head, { y: 'center' });
    refCodeMirror.current?.view?.dispatch(
      { changes: { from: 0, to: refCodeMirror.current?.state?.doc.length, insert: code } },
      { selection: { anchor: head, head } },
      { effects: scrollEffect },
    );

    setMemoryUpdate({ key, status: 'loaded' });
  }, [setCode, setHasEdit, setMemoryUpdate]);

  const handleSaveMemory = useCallback((key: string) => {
    const head = refCodeMirror.current?.view?.state.selection.main.head ?? 0;
    deckMemoryStorage.set(key, { code, head });

    setMemoryUpdate({ key, status: 'saved' });
  }, [code, setMemoryUpdate]);

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
    ...[...Array(10)].flatMap((_, i) => [
      {
        key: `Mod-${i}`,
        preventDefault: true,
        run: () => {
          handleLoadMemory(i.toString());
          return false;
        },
      },
      {
        key: `Shift-Mod-${i}`,
        preventDefault: true,
        run: () => {
          handleSaveMemory(i.toString());
          return false;
        },
      },
    ]),
  ], [onCompile, onApply, onApplyImmediately, handleLoadMemory, handleSaveMemory]);

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
          ref={refCodeMirror}
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
