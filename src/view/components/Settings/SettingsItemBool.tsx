import { useCallback } from 'react';
import { Settings, SETTINGSMAN } from '../../../SettingsManager';
import { useSettings } from '../../stores/hooks/useSettings';
import { SettingsItemBase, SettingsItemBaseProps } from './SettingsItemBase';

export function SettingsItemBool(props: {
  settingsKey: keyof Settings;
} & SettingsItemBaseProps) {
  const { settingsKey } = props;
  const value = useSettings(settingsKey) as boolean;

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const checked = (event.target as HTMLInputElement).checked;
    SETTINGSMAN.set(settingsKey, checked);
  }, []);

  return (
    <SettingsItemBase {...props}>
      <input
        type="checkbox"
        checked={value}
        onChange={handleChange}
      />
    </SettingsItemBase>
  );
}
