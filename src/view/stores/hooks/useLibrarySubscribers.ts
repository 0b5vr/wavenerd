import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { Library } from '../../../Library';
import { libraryListAddAtom, libraryListDeleteAtom } from '../atoms/library';

function useLibraryListSubscriber(library: Library) {
  const addList = useSetAtom(libraryListAddAtom);
  const deleteList = useSetAtom(libraryListDeleteAtom);

  useEffect(() => {
    const handleAdd = library.on('add', ({ name }) => {
      addList(name);
    });

    const handleDelete = library.on('delete', ({ name }) => {
      deleteList(name);
    });

    return () => {
      library.off('add', handleAdd);
      library.off('delete', handleDelete);
    };
  });
}

export function useLibrarySubscribers(library: Library) {
  useLibraryListSubscriber(library);
}
