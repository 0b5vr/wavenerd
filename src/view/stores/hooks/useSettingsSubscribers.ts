import { type SettingsManager } from '../../../SettingsManager';
import { settingsAtom } from '../atoms/settings';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';

export function useSettingsSubscribers(settingsManager: SettingsManager) {
  const setSettings = useSetAtom(settingsAtom);

  useEffect(() => {
    setSettings(settingsManager.values);

    const unsubscribeChange = settingsManager.onChange.subscribe((settings) => {
      setSettings((prev) => ({
        ...prev,
        ...settings,
      }));
    });

    return unsubscribeChange;
  });
}
