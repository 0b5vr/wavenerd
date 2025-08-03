import { atom } from 'jotai';

export const libraryListAtom = atom(new Set<string>());

export const libraryListSortedAtom = atom((get) => {
  const library = get(libraryListAtom);
  const array = Array.from(library);
  array.sort();
  return array;
});

export const libraryListAddAtom = atom(null, (get, set, name: string) => {
  const library = new Set(get(libraryListAtom));
  library.add(name);
  set(libraryListAtom, library);
});

export const libraryListSetAtom = atom(null, (_get, set, list: string[]) => {
  const library = new Set<string>(list);
  set(libraryListAtom, library);
});

export const libraryListDeleteAtom = atom(null, (get, set, name: string) => {
  const library = new Set(get(libraryListAtom));
  library.delete(name);
  set(libraryListAtom, library);
});
