import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { atom, type PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { mod } from '@0b5vr/experimental';
import { StuffContext } from '../StuffContext';
import SimpleBar from 'simplebar-react';
import { storageFileListAtom } from '../stores/atoms/storage';
import clsx from 'clsx';

// == atoms ========================================================================================
const storageFileListShadersAtom = atom((get) => {
  const fileList = get(storageFileListAtom);
  const array = Array.from(fileList).filter((name) => name.startsWith('shaders/'));
  array.sort();
  return array.map((name) => name.substring(8));
});

// == children =====================================================================================
function DeckLibraryItem({ name, isSelected, onSelect, itemRef }: {
  name: string;
  isSelected: boolean;
  onSelect?: (name: string) => void;
  itemRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const handlePointerDown = useCallback(() => {
    onSelect?.(name);
  }, [onSelect, name]);

  return (
    <div
      ref={itemRef}
      className={clsx(
        'py-0.5 px-2 -mx-1 text-xs cursor-pointer',
        isSelected
          ? 'bg-list-focused-bg text-list-focused-fg hover:bg-list-focused-bg hover:text-list-focused-fg'
          : 'bg-transparent text-list-fg hover:bg-list-hover-bg hover:text-list-hover-fg',
      )}
      onPointerDown={handlePointerDown}
    >
      {name}
    </div>
  );
}

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
    <input
      ref={refTextInputFocusOnOpen}
      className="w-full p-1 mb-1 text-sm border-0 outline-none bg-input-back rounded text-input-fore"
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
  }, [load, shadersListFiltered]);

  if (!isLibraryOpening) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex justify-center items-start pointer-events-none">
      <div className="mt-2 p-1 w-4/5 max-w-120 bg-list-bg pointer-events-auto rounded shadow-[0_0_8px_0_var(--color-black)]">
        <TextInput
          value={textInputValue}
          libraryOpeningAtom={libraryOpeningAtom}
          onCursor={handleCursor}
          onEnter={handleEnter}
          onChange={handleChange}
          focusEditor={focusEditor}
        />
        <SimpleBar className="max-h-75 overflow-y-auto overflow-x-hidden">
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
        </SimpleBar>
      </div>
    </div>
  );
}
