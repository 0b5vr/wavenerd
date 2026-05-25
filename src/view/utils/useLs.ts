import { dequal } from 'dequal/lite';
import { useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useMemo } from 'react';
import { storageFileListAtom } from '../stores/atoms/storage';

/**
 * Provides a list of filenames in the specified directory, sorted alphabetically.
 *
 * @param dir - Directory to list files
 * @returns Array of filenames, without directory prefix
 */
export function useLs(dir: string): string[] {
  const filesAtom = useMemo(() => selectAtom(
    storageFileListAtom,
    (fileList) => {
      // filter files by directory using `startsWith`
      const array = Array.from(fileList).filter((name) => name.startsWith(`${dir}/`));

      // sort alphabetically
      array.sort();

      // remove directory prefix from filenames for display
      return array.map((name) => name.substring(dir.length + 1));
    },
    dequal,
  ), [dir]);

  return useAtomValue(filesAtom);
}
