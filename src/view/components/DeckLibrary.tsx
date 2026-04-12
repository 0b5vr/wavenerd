import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { atom, type PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import styled from 'styled-components';
import { ThemeVars } from '../themes/ThemeVars';
import { mod } from '@0b5vr/experimental';
import { StuffContext } from '../StuffContext';
import SimpleBar from 'simplebar-react';
import { storageFileListAtom } from '../stores/atoms/storage';

// == styles =======================================================================================
const StyledInput = styled.input`
  width: 100%;
  padding: 4px;
  margin-bottom: 4px;
  font-size: 14px;
  border: none;
  outline: none;
  background: ${ThemeVars.inputBack};
  border-radius: 4px;
  color: ${ThemeVars.inputFore};
`;

const ListItem = styled.div<{ isSelected: boolean }>`
  padding: 2px 8px;
  margin: 0 -4px;
  font-size: 12px;
  background: ${({ isSelected }) => (isSelected ? ThemeVars.listFocusedBg : 'transparent')};
  color: ${({ isSelected }) => (isSelected ? ThemeVars.listFocusedFg : ThemeVars.listFg)};
  cursor: pointer;

  &:hover {
    background: ${({ isSelected }) => (isSelected ? ThemeVars.listFocusedBg : ThemeVars.listHoverBg)};
    color: ${({ isSelected }) => (isSelected ? ThemeVars.listFocusedFg : ThemeVars.listHoverFg)};
  }
`;

const Result = styled(SimpleBar)`
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Box = styled.div`
  margin-top: 8px;
  padding: 4px;
  width: 80%;
  max-width: 480px;
  background: ${ThemeVars.listBg};
  pointer-events: auto;
  border-radius: 4px;
  box-shadow: 0 0 8px 0 ${ThemeVars.black};
`;

const Root = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: start;
  pointer-events: none;
`;

// == atoms ========================================================================================
const storageFileListShadersAtom = atom((get) => {
  const fileList = get(storageFileListAtom);
  const array = Array.from(fileList).filter((name) => name.startsWith('shaders/'));
  array.sort();
  return array.map((name) => name.substring(8));
});

// == children =====================================================================================
const DeckLibraryItem = ({ name, isSelected, onSelect, itemRef }: {
  name: string;
  isSelected: boolean;
  onSelect?: (name: string) => void;
  itemRef?: React.RefObject<HTMLDivElement>;
}): JSX.Element => {
  const handlePointerDown = useCallback(() => {
    onSelect?.(name);
  }, [onSelect, name]);

  return (
    <ListItem
      ref={itemRef}
      isSelected={isSelected}
      onPointerDown={handlePointerDown}
    >
      {name}
    </ListItem>
  );
};

function TextInput({
  value,
  libraryOpeningAtom,
  onCursor,
  onEnter,
  onChange,
  focusEditor,
}: {
  value: string;
  libraryOpeningAtom: PrimitiveAtom<boolean>;
  onCursor: (inc: number) => void;
  onEnter: () => void;
  onChange: (event: React.ChangeEvent) => void;
  focusEditor: (highlight: boolean) => void;
}) {
  const refTextInputFocusOnOpen = useCallback((input: HTMLInputElement | null) => {
    input?.focus();
    input?.select();
  }, []);

  const setLibraryOpening = useSetAtom(libraryOpeningAtom);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setLibraryOpening(false);
      focusEditor(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      onCursor(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      onCursor(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      onEnter();
    }
  }, [onCursor, onEnter, setLibraryOpening, focusEditor]);

  const handleBlur = useCallback(() => {
    setLibraryOpening(false);
    focusEditor(false);
  }, [setLibraryOpening, focusEditor]);

  return (
    <StyledInput
      ref={refTextInputFocusOnOpen}
      value={value}
      placeholder="Search library by name"
      onChange={onChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    />
  );
}

// == main =========================================================================================
export function DeckLibrary({
  libraryOpeningAtom,
  onLoad,
  focusEditor,
}: {
  libraryOpeningAtom: PrimitiveAtom<boolean>;
  onLoad: (code: string) => void;
  focusEditor: (highlight: boolean) => void;
}) {
  const { storageManager } = useContext(StuffContext)!;
  const [isLibraryOpening, setLibraryOpening] = useAtom(libraryOpeningAtom);

  const [textInputValue, setTextInputValue] = useState('');

  const shadersList = useAtomValue(storageFileListShadersAtom);
  const shadersListFiltered = useMemo(
    () => shadersList.filter((name) => name.includes(textInputValue)),
    [shadersList, textInputValue],
  );

  const [selectedIndexRaw, setSelectedIndexRaw] = useState(0);
  const selectedIndex = useMemo(
    () => mod(selectedIndexRaw, shadersListFiltered.length),
    [selectedIndexRaw, shadersListFiltered.length],
  );

  const selectedItemRef = useRef<HTMLDivElement>(null);

  const selectedName = useMemo(
    () => shadersListFiltered[selectedIndex] as (string | undefined),
    [shadersListFiltered, selectedIndex],
  );

  useEffect(() => {
    if (isLibraryOpening && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'instant',
        block: 'center',
      });
    }
  }, [isLibraryOpening, selectedIndex]);

  const load = useCallback(async (name: string) => {
    const file = await storageManager.getFile(`shaders/${name}`);
    const code = await file?.text();
    if (code == null) {
      throw new Error('Unreachable. library.getCode returns undefined');
    }

    onLoad(code);
    setLibraryOpening(false);
    focusEditor(false);
  }, [onLoad, storageManager, setLibraryOpening, focusEditor]);

  const handleCursor = useCallback((inc: number) => {
    setSelectedIndexRaw((prev) => prev + inc);
  }, []);

  const handleEnter = useCallback(async () => {
    if (selectedName == null) {
      return;
    }

    load(selectedName);
  }, [selectedName, load]);

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value;
    setTextInputValue(value);
    setSelectedIndexRaw(0);
  }, []);

  const handleSelect = useCallback(async (name: string) => {
    setSelectedIndexRaw(shadersListFiltered.indexOf(name));
    load(name);
  }, [load]);

  if (!isLibraryOpening) {
    return null;
  }

  return (
    <Root>
      <Box>
        <TextInput
          value={textInputValue}
          libraryOpeningAtom={libraryOpeningAtom}
          onCursor={handleCursor}
          onEnter={handleEnter}
          onChange={handleChange}
          focusEditor={focusEditor}
        />
        <Result>
          {shadersListFiltered.map((name, i) => (
            <DeckLibraryItem
              key={name}
              name={name}
              isSelected={i === selectedIndex}
              onSelect={handleSelect}
              itemRef={i === selectedIndex ? selectedItemRef : undefined}
            />
          ))}
          {shadersListFiltered.length === 0 && (
            <DeckLibraryItem
              name={shadersList.length === 0 ? 'Library is empty' : 'No matching results'}
              isSelected={false}
            />
          )}
        </Result>
      </Box>
    </Root>
  );
}
