import React, { useEffect } from 'react';

export function useFrames( fn: () => void, deps?: React.DependencyList ) {
  useEffect( () => {
    let dead = false;

    const update = () => {
      if ( dead ) { return; }

      requestAnimationFrame( update );
      fn();
    };
    requestAnimationFrame( update );

    return () => {
      dead = true;
    };
  }, deps );
}
