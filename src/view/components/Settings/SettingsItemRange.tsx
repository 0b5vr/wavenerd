import { useCallback } from 'react';
import { type Settings, SETTINGSMAN } from '../../../SettingsManager';
import { useSettings } from '../../stores/hooks/useSettings';
import { SettingsItemBase, type SettingsItemBaseProps } from './SettingsItemBase';

export function SettingsItemRange(props: {
  settingsKey: keyof Settings;
  min: number;
  max: number;
  step: number;
  suffixFn?: (value: number) => React.ReactNode;
} & SettingsItemBaseProps) {
  const { settingsKey, min, max, step, suffixFn } = props;
  const value = useSettings(settingsKey) as number;

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value;
    SETTINGSMAN.set(settingsKey, parseFloat(value));
  }, [settingsKey]);

  return (
    <SettingsItemBase {...props}>
      <input
        className="mx-1 h-4"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
      {suffixFn && suffixFn(value)}
    </SettingsItemBase>
  );
}
