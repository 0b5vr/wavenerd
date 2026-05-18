import { useCallback } from 'react';
import { type Settings, SETTINGSMAN } from '../../../SettingsManager';
import { useSettings } from '../../stores/hooks/useSettings';
import { SettingsItemBase, type SettingsItemBaseProps } from './SettingsItemBase';

export function SettingsItemText(props: {
  settingsKey: keyof Settings;
} & SettingsItemBaseProps) {
  const { settingsKey } = props;
  const value = useSettings(settingsKey) as string;

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value;
    SETTINGSMAN.set(settingsKey, value);
  }, [settingsKey]);

  return (
    <SettingsItemBase {...props}>
      <input
        className="inline-block text-input-fore bg-input-back px-1 w-[12em] h-4 border-0 rounded text-xs font-sans"
        value={value}
        onChange={handleChange}
      />
    </SettingsItemBase>
  );
}
