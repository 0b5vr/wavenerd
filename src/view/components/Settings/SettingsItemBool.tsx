import { useCallback } from 'react';
import { type Settings, SETTINGSMAN } from '../../../SettingsManager';
import { useSettings } from '../../stores/hooks/useSettings';
import { SettingsItemBase, type SettingsItemBaseProps } from './SettingsItemBase';

export function SettingsItemBool(props: {
  settingsKey: keyof Settings;
} & SettingsItemBaseProps) {
  const { settingsKey } = props;
  const value = useSettings(settingsKey) as boolean;

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const checked = (event.target as HTMLInputElement).checked;
    SETTINGSMAN.set(settingsKey, checked);
  }, [settingsKey]);

  return (
    <SettingsItemBase {...props}>
      <input
        type="checkbox"
        className="my-0.5 mx-1 w-3 h-3"
        checked={value}
        onChange={handleChange}
      />
    </SettingsItemBase>
  );
}
