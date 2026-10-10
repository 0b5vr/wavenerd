import { useContext, useState, useEffect } from 'react';
import { StuffContext } from '../StuffContext';

/**
 * Returns `true` for a brief moment whenever an underrun occurs
 * @returns boolean indicating if an underrun just occurred
 */
export function useUnderrun() {
  const { deckA, deckB } = useContext(StuffContext)!;
  const [underrun, setUnderrun] = useState(false);

  useEffect(() => {
    let id: number | undefined;

    const handleUnderrun = () => {
      // clear previous timeout if exists
      if (id != null) {
        clearTimeout(id);
      }

      // set underrun state and reset after a short delay
      setUnderrun(true);
      id = setTimeout(() => setUnderrun(false), 100);
    };

    const unsubscribeUnderrunA = deckA.onUnderrun.subscribe(handleUnderrun);
    const unsubscribeUnderrunB = deckB.onUnderrun.subscribe(handleUnderrun);

    return () => {
      // unsubscribe on unmount
      unsubscribeUnderrunA();
      unsubscribeUnderrunB();

      // clear timeout on unmount
      if (id != null) {
        clearTimeout(id);
      }
    };
  }, [deckA, deckB]);

  return underrun;
}
