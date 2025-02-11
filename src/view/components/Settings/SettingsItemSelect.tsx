import { useCallback } from 'react';
import { SETTINGSMAN } from '../../../SettingsManager';
import { useSettings } from '../../stores/hooks/useSettings';
import { SettingsItemBase, SettingsItemBaseProps } from './SettingsItemBase';
import styled from 'styled-components';
import { ThemeVars } from '../../themes/ThemeVars';

const StyledSelect = styled.select`
  display: inline-block;
  color: ${ThemeVars.inputFore};
  background: ${ThemeVars.inputBack};
  padding: 2px;
  border: none;
  border-radius: 4px;
`;

export function SettingsItemSelect(props: {
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
