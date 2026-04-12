import { atom, useAtomValue } from 'jotai';
import { type Settings } from '../../../SettingsManager';
import { settingsAtom } from '../atoms/settings';
import { useMemo } from 'react';

export function useSettings<T extends keyof Settings>(key: T): Settings[T] {
  const settingAtom = useMemo(
    () => atom((get) => get(settingsAtom)[key]),
    [key],
  );
  return useAtomValue(settingAtom);
}
