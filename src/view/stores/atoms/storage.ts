import { atom } from 'jotai';

export const storageFileListAtom = atom(new Set<string>());

export const storageFileListAddAtom = atom(null, (get, set, name: string) => {
  const fileList = new Set(get(storageFileListAtom));
  fileList.add(name);
  set(storageFileListAtom, fileList);
});

export const storageFileListSetAtom = atom(null, (_get, set, list: string[]) => {
  const fileList = new Set<string>(list);
  set(storageFileListAtom, fileList);
});

export const storageFileListDeleteAtom = atom(null, (get, set, name: string) => {
  const fileList = new Set(get(storageFileListAtom));
  fileList.delete(name);
  set(storageFileListAtom, fileList);
});
