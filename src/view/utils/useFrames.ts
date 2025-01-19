import React, { useCallback, useEffect } from 'react';

export function useFrames(callback: () => void) {
  const fn = useCallback(() => {
    let dead = false;

    const update = () => {
      if (dead) { return; }

      requestAnimationFrame(update);
      callback();
    };
    requestAnimationFrame(update);

    return () => {
      dead = true;
    };
  }, [callback]);

  useEffect(fn, [fn]);
}
