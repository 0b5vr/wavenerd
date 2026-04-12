import { useCallback } from 'react';
import { type Settings, SETTINGSMAN } from '../../../SettingsManager';
import { useSettings } from '../../stores/hooks/useSettings';
import { SettingsItemBase, type SettingsItemBaseProps } from './SettingsItemBase';
import styled from 'styled-components';

const StyledCheckbox = styled.input`
  margin: 2px 4px;
  width: 12px;
  height: 12px;
`;

export function SettingsItemBool(props: {
  settingsKey: keyof Settings;
} & SettingsItemBaseProps) {
  const { settingsKey } = props;
  const value = useSettings(settingsKey) as boolean;

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const checked = (event.target as HTMLInputElement).checked;
    SETTINGSMAN.set(settingsKey, checked);
  }, [settingsKey]);

  return (
    <SettingsItemBase {...props}>
      <StyledCheckbox
        type="checkbox"
        checked={value}
        onChange={handleChange}
      />
    </SettingsItemBase>
  );
}
