import { midiParamsAtom } from '../atoms/midi';
import { useAtomValue } from 'jotai';
import { useThrottle } from '../../utils/useThrottle';

export function useMidiValue( paramName: string ): number {
  const midiParams = useAtomValue( midiParamsAtom );
  const value = useThrottle( midiParams[ paramName ] ?? 0, 1000.0 / 60.0 );
  return value;
}
