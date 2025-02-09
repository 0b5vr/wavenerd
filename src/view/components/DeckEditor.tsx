import { EditorView, KeyBinding, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { cpp } from '@codemirror/lang-cpp';
import ReactCodeMirror, { Prec, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
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
import { createCMTheme } from '../codemirror/createCMTheme';

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

const DraggingOverlay = styled.div`
  display: 'block';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: ${ThemeVars.fore};
  opacity: 0.125;
  pointer-events: 'auto';
`;

const Root = styled.div`
  transform: translateZ(0);
`;

// == utils ========================================================================================
/** Ref: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values */
const codeToKeyNameMap = new Map([
  ['Escape', 'Esc'],
  ['Minus', '-'],
  ['Equal', '='],
  ['BracketLeft', '['],
  ['BracketRight', ']'],
  ['Semicolon', ';'],
  ['Quote', '\''],
  ['Backquote', '`'],
  ['Backslash', '\\'],
  ['Comma', ','],
  ['Period', '.'],
  ['Slash', '/'],
  ['NumpadMultiply', '*'],
  ['NumpadSubtract', '-'],
  ['NumpadAdd', '+'],
  ['NumpadDecimal', '.'],
  ['IntlBackslash', '\\'],
  ['NumpadEqual', '='],
  ['NumpadComma', ','],
  ['NumpadEnter', 'Enter'],
  ['NumpadDivide', '/'],
  ['ArrowUp', '↑'],
  ['ArrowLeft', '←'],
  ['ArrowRight', '→'],
  ['ArrowDown', '↓'],
]);

const keysIgnoreSet = new Set([
  'Control',
  'Shift',
  'Alt',
  'Meta',
]);

function getKeyName(event: KeyboardEvent): string {
  if (codeToKeyNameMap.has(event.code)) {
    return codeToKeyNameMap.get(event.code)!;
  }

  if (event.code.startsWith('Key') || event.code.startsWith('Digit') || event.code.startsWith('Numpad')) {
    return event.code.slice(-1);
  }

  return event.code;
}

function keyToLog(event: KeyboardEvent): string | null {
  if (keysIgnoreSet.has(event.key)) {
    return null;
  }

  let log = getKeyName(event);

  if (event.shiftKey) { log = 'Shift-' + log; }
  if (event.ctrlKey) { log = 'Ctrl-' + log; }
  if (event.metaKey) { log = 'Cmd-' + log; }
  if (event.altKey) { log = 'Alt-' + log; }

  return log;
}

// == component ====================================================================================
export const DeckEditor = forwardRef(({
  codeAtom,
  logsAtom,
  hasEditAtom,
  onCompile,
  onApply,
  onApplyImmediately,
  memoryUpdateAtom,
  libraryOpeningAtom,
  focusPrevEditor,
  focusNextEditor,
  className,
}: {
  codeAtom: PrimitiveAtom<string>;
  logsAtom: PrimitiveAtom<[ id: number, text: string ][]>;
  hasEditAtom: PrimitiveAtom<boolean>;
  onCompile: () => void;
  onApply: () => void;
  onApplyImmediately: () => void;
  memoryUpdateAtom: PrimitiveAtom<{ key: string; status: 'loaded' | 'loadfailed' | 'saved' } | null>;
  libraryOpeningAtom: PrimitiveAtom<boolean>;
  focusPrevEditor?: () => void;
  focusNextEditor?: () => void;
  className?: string;
}, ref: React.Ref<{ focusEditor: () => void }>) => {
  const refCodeMirror = React.useRef<ReactCodeMirrorRef>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [code, setCode] = useAtom(codeAtom);
  const setMemoryUpdate = useSetAtom(memoryUpdateAtom);
  const setLibraryOpening = useSetAtom(libraryOpeningAtom);
  const setHasEdit = useSetAtom(hasEditAtom);
  const themeString = useSettings('theme');
  const font = useSettings('editorFont');
  const fontVariantLigatures = useSettings('editorFontVariantLigatures');

  const theme = useMemo(() => {
    const theme = (themes[themeString] ?? themes['monokaiSharp']).theme;
    return createCMTheme(theme);
  }, [themeString]);

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
    const to = refCodeMirror.current?.view?.state?.doc.length;
    refCodeMirror.current?.view?.dispatch(
      { changes: [
        { from: 0, to, insert: code },
      ] },
    );

    const head = obj.head ?? 0;
    const scrollEffect = EditorView.scrollIntoView(head, { y: 'center' });
    refCodeMirror.current?.view?.dispatch(
      { selection: { anchor: head, head } },
      { effects: scrollEffect },
    );

    setMemoryUpdate({ key, status: 'loaded' });
  }, [setMemoryUpdate]);

  const handleSaveMemory = useCallback((key: string) => {
    const head = refCodeMirror.current?.view?.state.selection.main.head ?? 0;
    deckMemoryStorage.set(key, { code, head });

    setMemoryUpdate({ key, status: 'saved' });
  }, [code, setMemoryUpdate]);

  // -- keymap -------------------------------------------------------------------------------------
  const customKeymap: KeyBinding[] = useMemo(() => [
    {
      key: 'Mod-j',
      preventDefault: true,
      run: () => {
        focusPrevEditor?.();
        return true;
      },
    },
    {
      key: 'Mod-k',
      preventDefault: true,
      run: () => {
        focusNextEditor?.();
        return true;
      },
    },
    {
      key: 'Mod-p',
      preventDefault: true,
      run: () => {
        setLibraryOpening(true);
        return false;
      },
    },
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
      shift: () => {
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
          return true;
        },
        shift: () => {
          handleSaveMemory(i.toString());
          return false;
        },
      },
    ]),
    ...braceJumpKeymap,
    ...defaultKeymap,
  ], [focusPrevEditor, focusNextEditor, onCompile, onApply, onApplyImmediately, setLibraryOpening, handleLoadMemory, handleSaveMemory]);

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

  // -- imperative handle --------------------------------------------------------------------------
  const focusEditor = useCallback(() => {
    refCodeMirror.current?.view?.focus();
  }, []);
  useImperativeHandle(ref, () => ({ focusEditor }), [focusEditor]);

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
            Prec.highest(keymap.of(customKeymap)),
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
      {isDragging && <DraggingOverlay />}
    </Root>
  );
});
DeckEditor.displayName = 'DeckEditor';
