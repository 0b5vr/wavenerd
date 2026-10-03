import { useContext, useEffect } from 'react';
import { StuffContext } from '../StuffContext';

export function useFrame(callback: () => void) {
  const { frameEmitter } = useContext(StuffContext)!;

  useEffect(() => {
    const unsubscribeUpdate = frameEmitter.onUpdate.subscribe(callback);

    return unsubscribeUpdate;
  }, [callback, frameEmitter]);
}
