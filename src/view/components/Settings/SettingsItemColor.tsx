import { useCallback } from 'react';
import { type Settings, SETTINGSMAN } from '../../../SettingsManager';
import { useSettings } from '../../stores/hooks/useSettings';
import { SettingsItemBase, type SettingsItemBaseProps } from './SettingsItemBase';
import styled from 'styled-components';

const StyledColorInput = styled.input`
  display: inline-block;
  background: transparent;
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 16px;
  padding: 0;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
    margin: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 7px;
  }
`;

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
      <StyledColorInput
        type="color"
        value={value}
        onChange={handleChange}
      />
    </SettingsItemBase>
  );
}
