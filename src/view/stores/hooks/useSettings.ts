import { Settings } from '../../../SettingsManager';
import { selectAtom } from 'jotai/utils';
import { settingsAtom } from '../atoms/settings';
import { useAtomValue } from 'jotai';
import { useCallback } from 'react';

export function useSettings<T extends keyof Settings>( key: T ): Settings[ T ] {
  const selector = useCallback( ( v: Settings ) => v[ key ], [ key ] );
  const atom = selectAtom( settingsAtom, selector );
  return useAtomValue( atom );
}
