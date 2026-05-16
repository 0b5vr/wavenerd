import { useCallback } from 'react';
import IconRefresh from '~icons/mdi/refresh';
import { defaultSettings, type Settings, SETTINGSMAN } from '../../../SettingsManager';

export interface SettingsItemBaseProps {
  name: string;
  settingsKey?: keyof Settings;
  resettable?: boolean;
  stalkerText?: string;
}

export function SettingsItemBase(props: {
  children: React.ReactNode;
} & SettingsItemBaseProps) {
  const { settingsKey, name, children, resettable, stalkerText } = props;

  const handleReset = useCallback(() => {
    if (settingsKey) {
      SETTINGSMAN.set(settingsKey, defaultSettings[settingsKey]);
    }
  }, [settingsKey]);

  return (
    <div className="flex items-start text-xs [&+&]:mt-2" data-stalker={stalkerText}>
      <div className="w-[12em] h-4 shrink-0 text-right mr-2 text-foresub">{name}</div>
      {children}
      {resettable && (
        <IconRefresh
          className="w-4 h-4 ml-1 cursor-pointer text-gray hover:opacity-80"
          onClick={handleReset}
          data-stalker="Reset to default"
        />
      )}
    </div>
  );
}
