import { midiParamsAtom } from '../atoms/midi';
import { selectAtom } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { useThrottle } from '../../utils/useThrottle';

export function useMidiValue( paramName: string ): number {
  const selector = useCallback( ( v: Record<string, number> ) => v[ paramName ], [ paramName ] );
  const atom = selectAtom( midiParamsAtom, selector );
  const rawValue = useAtomValue( atom );
  const value = useThrottle( rawValue ?? 0, 1000.0 / 60.0 );
  return value;
}
