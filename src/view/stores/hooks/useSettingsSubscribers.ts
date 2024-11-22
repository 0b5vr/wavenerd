import { SettingsManager } from '../../../SettingsManager';
import { settingsAtom } from '../atoms/settings';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';

export function useSettingsSubscribers( settingsManager: SettingsManager ) {
  const setSettings = useSetAtom( settingsAtom );

  useEffect( () => {
    setSettings( settingsManager.values );

    const handleChange = settingsManager.on( 'change', ( settings ) => {
      setSettings( ( prev ) => ( {
        ...prev,
        ...settings,
      } ) );
    } );

    return () => settingsManager.off( 'change', handleChange );
  } );
}
