import { useCallback } from 'react';
import { type Settings, SETTINGSMAN } from '../../../SettingsManager';
import { useSettings } from '../../stores/hooks/useSettings';
import { SettingsItemBase, type SettingsItemBaseProps } from './SettingsItemBase';
import styled from 'styled-components';
import { ThemeVars } from '../../themes/ThemeVars';

const StyledSelect = styled.select`
  display: inline-block;
  color: ${ThemeVars.inputFore};
  background: ${ThemeVars.inputBack};
  height: 16px;
  border: none;
  border-radius: 4px;
  font: 12px 'Inter', sans-serif;
`;

export function SettingsItemSelect(props: {
  settingsKey: keyof Settings;
  children: React.ReactNode;
} & SettingsItemBaseProps) {
  const { settingsKey, children } = props;
  const value = useSettings(settingsKey) as string;

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value;
    SETTINGSMAN.set(settingsKey, value);
  }, []);

  return (
    <SettingsItemBase {...props}>
      <StyledSelect
        value={value}
        onChange={handleChange}
      >
        {children}
      </StyledSelect>
    </SettingsItemBase>
  );
}
