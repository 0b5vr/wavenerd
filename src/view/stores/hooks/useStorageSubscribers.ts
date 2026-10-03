import { useSetAtom } from 'jotai';
import { type StorageManager } from '../../../StorageManager';
import { storageFileListAddAtom, storageFileListDeleteAtom, storageFileListSetAtom } from '../atoms/storage';
import { useEffect } from 'react';

function useStorageListSubscriber(storageManager: StorageManager) {
  const addList = useSetAtom(storageFileListAddAtom);
  const setList = useSetAtom(storageFileListSetAtom);
  const deleteList = useSetAtom(storageFileListDeleteAtom);

  useEffect(() => {
    // Initialize the storage file list with existing items
    storageManager.listFilesRecursive('').then((list) => {
      setList(list || []);
    });

    const unsubscribeInit = storageManager.onInit.subscribe(async () => {
      // Re-fetch the file list after initialization
      const list = await storageManager.listFilesRecursive('');
      setList(list || []);
    });

    const unsubscribeSave = storageManager.onSave.subscribe(({ path }) => {
      addList(path);
    });

    const unsubscribeDelete = storageManager.onDelete.subscribe(({ path }) => {
      deleteList(path);
    });

    return () => {
      unsubscribeInit();
      unsubscribeSave();
      unsubscribeDelete();
    };
  }, [storageManager, addList, deleteList, setList]);
}

export function useStorageSubscribers(storageManager: StorageManager) {
  useStorageListSubscriber(storageManager);
}
