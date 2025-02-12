import { useCallback } from 'react';
import { Settings, SETTINGSMAN } from '../../../SettingsManager';
import { useSettings } from '../../stores/hooks/useSettings';
import { SettingsItemBase, SettingsItemBaseProps } from './SettingsItemBase';
import styled from 'styled-components';

const StyledRange = styled.input`
  margin: 0 4px;
  height: 16px;
`;

export function SettingsItemRange(props: {
  settingsKey: keyof Settings;
  min: number;
  max: number;
  step: number;
} & SettingsItemBaseProps) {
  const { settingsKey, min, max, step } = props;
  const value = useSettings(settingsKey) as number;

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value;
    SETTINGSMAN.set(settingsKey, parseFloat(value));
  }, []);

  return (
    <SettingsItemBase {...props}>
      <StyledRange
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
    </SettingsItemBase>
  );
}
