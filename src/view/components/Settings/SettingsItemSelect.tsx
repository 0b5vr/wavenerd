import { useCallback } from 'react';
import { type Settings, SETTINGSMAN } from '../../../SettingsManager';
import { useSettings } from '../../stores/hooks/useSettings';
import { SettingsItemBase, type SettingsItemBaseProps } from './SettingsItemBase';

export function SettingsItemSelect(props: {
  settingsKey: keyof Settings;
  disabled?: boolean;
  children: React.ReactNode;
} & SettingsItemBaseProps) {
  const { settingsKey, children } = props;
  const value = useSettings(settingsKey) as string;

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value;
    SETTINGSMAN.set(settingsKey, value);
  }, [settingsKey]);

  return (
    <SettingsItemBase {...props}>
      <select
        className="inline-block text-input-fore bg-input-back h-4 border-0 rounded text-xs font-sans"
        value={value}
        disabled={props.disabled}
        onChange={handleChange}
      >
        {children}
      </select>
    </SettingsItemBase>
  );
}
