import { useCallback, useEffect, useState } from 'react';
import { throttle } from 'throttle-debounce';

export function useThrottle<T>( value: T, interval: number ): T {
  const [ throttled, setThrottled ] = useState( value );

  const set = useCallback(
    throttle( interval, ( value: T ) => setThrottled( value ) ),
    [ interval ],
  );

  useEffect( () => set( value ), [ value, set ] );

  return throttled;
}
