import { useCallback } from 'react';
import { Settings, SETTINGSMAN } from '../../../SettingsManager';
import { useSettings } from '../../stores/hooks/useSettings';
import { SettingsItemBase, SettingsItemBaseProps } from './SettingsItemBase';
import styled from 'styled-components';
import { ThemeVars } from '../../themes/ThemeVars';

const StyledColorInput = styled.input`
  display: inline-block;
  color: ${ThemeVars.inputFore};
  background: ${ThemeVars.inputBack};
  padding: 2px;
  border: none;
  border-radius: 4px;
  width: 3em;
`;

export function SettingsItemColor(props: {
  settingsKey: keyof Settings;
} & SettingsItemBaseProps) {
  const { settingsKey } = props;
  const value = useSettings(settingsKey) as string;

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value;
    SETTINGSMAN.set(settingsKey, value);
  }, []);

  return (
    <SettingsItemBase {...props}>
      <StyledColorInput
        type="color"
        value={value}
        onChange={handleChange}
      />
    </SettingsItemBase>
  );
}
