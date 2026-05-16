import { useCallback } from 'react';
import { type Settings, SETTINGSMAN } from '../../../SettingsManager';
import { useSettings } from '../../stores/hooks/useSettings';
import { SettingsItemBase, type SettingsItemBaseProps } from './SettingsItemBase';

export function SettingsItemColor(props: {
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
        className="inline-block bg-transparent border-0 rounded-lg w-8 h-4 p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch-wrapper]:m-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-[7px]"
        type="color"
        value={value}
        onChange={handleChange}
      />
    </SettingsItemBase>
  );
}
