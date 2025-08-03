import { useSetAtom } from 'jotai';
import { StorageManager } from '../../../StorageManager';
import { storageFileListAddAtom, storageFileListDeleteAtom, storageFileListSetAtom } from '../atoms/storage';
import { useEffect } from 'react';

function useStorageListSubscriber(storageManager: StorageManager) {
  const addList = useSetAtom(storageFileListAddAtom);
  const setList = useSetAtom(storageFileListSetAtom);
  const deleteList = useSetAtom(storageFileListDeleteAtom);

  useEffect(() => {
    // Initialize the storage file list with existing items
    storageManager.listFilesRecursive('/').then((list) => {
      for (const fileName of list || []) {
        addList(fileName);
      }
    });

    const handleSave = storageManager.on('save', ({ path }) => {
      addList(path);
    });

    const handleDelete = storageManager.on('delete', ({ path }) => {
      deleteList(path);
    });

    return () => {
      storageManager.off('save', handleSave);
      storageManager.off('delete', handleDelete);
    };
  }, [storageManager, addList, deleteList, setList]);
}

export function useStorageSubscribers(storageManager: StorageManager) {
  useStorageListSubscriber(storageManager);
}
