import { useEffect } from 'react';

export function useFrame(callback: (timestamp?: number) => void) {
  useEffect(() => {
    let rAFId = requestAnimationFrame(function update(timestamp) {
      callback(timestamp);
      rAFId = requestAnimationFrame(update);
    });

    return () => {
      cancelAnimationFrame(rAFId);
    };
  }, [callback]);
}
