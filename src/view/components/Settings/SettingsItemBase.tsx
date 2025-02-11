import styled from 'styled-components';
import { defaultSettings, Settings, SETTINGSMAN } from '../../../SettingsManager';
import { useCallback } from 'react';
import IconRefresh from '~icons/mdi/refresh';
import { ThemeVars } from '../../themes/ThemeVars';

const StyledResetButton = styled(IconRefresh)`
  width: 16px;
  height: 16px;
  margin-left: 4px;
  cursor: pointer;
  color: ${ThemeVars.gray};

  &:hover {
    opacity: 0.8;
  }
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  height: 20px;

  & + & {
    margin-top: 4px;
  }
`;

const Name = styled.div`
  width: 12em;
  text-align: right;
  margin-right: 8px;
  color: ${ThemeVars.foresub};
`;

export interface SettingsItemBaseProps {
  settingsKey: keyof Settings;
  name: string;
  resettable?: boolean;
  stalkerText?: string;
}

export function SettingsItemBase(props: {
  children: React.ReactNode;
} & SettingsItemBaseProps) {
  const { settingsKey, name, children, resettable, stalkerText } = props;

  const handleReset = useCallback(() => {
    SETTINGSMAN.set(settingsKey, defaultSettings[settingsKey]);
  }, [settingsKey]);

  return (
    <Line data-stalker={stalkerText}>
      <Name>{name}</Name>
      {children}
      {resettable && <StyledResetButton onClick={handleReset} />}
    </Line>
  );
}
