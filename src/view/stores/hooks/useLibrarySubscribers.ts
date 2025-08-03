import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { Library } from '../../../Library';
import { libraryListAddAtom, libraryListDeleteAtom, libraryListSetAtom } from '../atoms/library';

function useLibraryListSubscriber(library: Library) {
  const addList = useSetAtom(libraryListAddAtom);
  const setList = useSetAtom(libraryListSetAtom);
  const deleteList = useSetAtom(libraryListDeleteAtom);

  useEffect(() => {
    // Initialize the library list with existing items
    setList(library.getList());

    const handleAdd = library.on('add', ({ name }) => {
      addList(name);
    });

    const handleDelete = library.on('delete', ({ name }) => {
      deleteList(name);
    });

    const handleInitStorage = library.on('initStorage', () => {
      setList(library.getList());
    });

    return () => {
      library.off('add', handleAdd);
      library.off('delete', handleDelete);
      library.off('initStorage', handleInitStorage);
    };
  });
}

export function useLibrarySubscribers(library: Library) {
  useLibraryListSubscriber(library);
}
