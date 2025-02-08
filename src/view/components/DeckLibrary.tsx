import React, { useCallback, useMemo, useReducer, useState } from 'react';
import { PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { libraryListSortedAtom } from '../stores/atoms/library';
import styled from 'styled-components';
import { ThemeVars } from '../themes/ThemeVars';
import { mod } from '@0b5vr/experimental';
import { Library } from '../../Library';

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

// == reducers =====================================================================================
function indexReducer(state: number, action: 'inc' | 'dec' | 'reset'): number {
  if (action === 'inc') {
    return state + 1;
  } else if (action === 'dec') {
    return state - 1;
  } else {
    return 0;
  }
}

// == children =====================================================================================
const DeckLibraryItem = ({ name, isSelected, onSelect }: {
  name: string;
  isSelected: boolean;
  onSelect?: (name: string) => void;
}): JSX.Element => {
  const handlePointerDown = useCallback(() => {
    onSelect?.(name);
  }, [onSelect, name]);

  return (
    <ListItem
      isSelected={isSelected}
      onPointerDown={handlePointerDown}
    >
      {name}
    </ListItem>
  );
};

const TextInput = (props: {
  value: string;
  libraryOpeningAtom: PrimitiveAtom<boolean>;
  onCursor: (type: 'inc' | 'dec') => void;
  onEnter: () => void;
  onChange: (event: React.ChangeEvent) => void;
}): JSX.Element => {
  const { value, onCursor, onEnter, onChange } = props;

  const refTextInputFocusOnOpen = useCallback((input: HTMLInputElement | null) => {
    input?.focus();
  }, []);

  const setLibraryOpening = useSetAtom(props.libraryOpeningAtom);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setLibraryOpening(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      onCursor('inc');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      onCursor('dec');
    } else if (event.key === 'Enter') {
      event.preventDefault();
      onEnter();
    }
  }, [onCursor, onEnter, setLibraryOpening]);

  const handleBlur = useCallback(() => {
    setLibraryOpening(false);
  }, [setLibraryOpening]);

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
};

// == main =========================================================================================
export const DeckLibrary = (props: {
  library: Library;
  libraryOpeningAtom: PrimitiveAtom<boolean>;
  onLoad: (code: string) => void;
  focusDeck: () => void;
}): JSX.Element | null => {
  const { library, libraryOpeningAtom, onLoad, focusDeck } = props;

  const [isLibraryOpening, setLibraryOpening] = useAtom(libraryOpeningAtom);

  const [textInputValue, setTextInputValue] = useState('');

  const libraryListSorted = useAtomValue(libraryListSortedAtom);
  const libraryListFiltered = useMemo(
    () => libraryListSorted.filter((name) => name.includes(textInputValue)),
    [libraryListSorted, textInputValue],
  );

  const [selectedIndexRaw, dispatchSelectedIndex] = useReducer(indexReducer, 0);
  const selectedIndex = useMemo(
    () => mod(selectedIndexRaw, libraryListFiltered.length),
    [selectedIndexRaw, libraryListFiltered.length],
  );

  const selectedName = useMemo(
    () => libraryListFiltered[selectedIndex] as (string | undefined),
    [libraryListFiltered, selectedIndex],
  );

  const handleCursor = useCallback((type: 'inc' | 'dec') => {
    dispatchSelectedIndex(type);
  }, []);

  const handleEnter = useCallback(() => {
    if (selectedName == null) {
      return;
    }

    const code = library.getCode(selectedName);
    if (code == null) {
      throw new Error('Unreachable. library.getCode returns undefined');
    }

    onLoad(code);
    setLibraryOpening(false);
    focusDeck();
  }, [onLoad, library, selectedName, focusDeck]);

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value;
    setTextInputValue(value);
    dispatchSelectedIndex('reset');
  }, []);

  const handleSelect = useCallback((name: string) => {
    const code = library.getCode(name);
    if (code == null) {
      throw new Error('Unreachable. library.getCode returns undefined');
    }

    onLoad(code);
    setLibraryOpening(false);
    focusDeck();
  }, [onLoad, library, focusDeck]);

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
        />
        {libraryListFiltered.map((name, i) => (
          <DeckLibraryItem
            key={name}
            name={name}
            isSelected={i === selectedIndex}
            onSelect={handleSelect}
          />
        ))}
        {libraryListFiltered.length === 0 && (
          <DeckLibraryItem
            name={libraryListSorted.length === 0 ? 'Library is empty' : 'No matching results'}
            isSelected={false}
          />
        )}
      </Box>
    </Root>
  );
};
