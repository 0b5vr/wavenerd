import { useContext, useEffect } from 'react';
import { StuffContext } from '../StuffContext';

export function useFrame(callback: () => void) {
  const { frameEmitter } = useContext(StuffContext)!;

  useEffect(() => {
    const handleUpdate = frameEmitter.on('update', callback);

    return () => {
      frameEmitter.off('update', handleUpdate);
    };
  }, [callback, frameEmitter]);
}
