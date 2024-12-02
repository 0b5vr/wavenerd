import { atom, useAtomValue } from 'jotai';
import { midiParamsAtom } from '../atoms/midi';
import { useMemo } from 'react';
import { useThrottle } from '../../utils/useThrottle';

export function useMidiValue(paramName: string): number {
  const paramAtom = useMemo(
    () => atom((get) => get(midiParamsAtom)[paramName]),
    [paramName],
  );
  const rawValue = useAtomValue(paramAtom);
  const value = useThrottle(rawValue ?? 0, 1000.0 / 60.0);
  return value;
}
