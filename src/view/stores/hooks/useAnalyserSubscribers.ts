import { levelMeterInAAtom, levelMeterInBAtom, levelMeterOutAtom } from '../atoms/analyser';
import { Mixer } from '../../../audio/Mixer';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';

function useLevelMeterSubscribers(mixer: Mixer) {
  const setLevelMeterInA = useSetAtom(levelMeterInAAtom);
  const setLevelMeterInB = useSetAtom(levelMeterInBAtom);
  const setLevelMeterOut = useSetAtom(levelMeterOutAtom);

  useEffect(() => {
    const handleUpdateLevelMeterInA = mixer.levelMeterInA.on('update', (event) => {
      setLevelMeterInA(event);
    });

    const handleUpdateLevelMeterInB = mixer.levelMeterInB.on('update', (event) => {
      setLevelMeterInB(event);
    });

    const handleUpdateLevelMeterOut = mixer.levelMeterOut.on('update', (event) => {
      setLevelMeterOut(event);
    });

    return () => {
      mixer.levelMeterInA.off('update', handleUpdateLevelMeterInA);
      mixer.levelMeterInB.off('update', handleUpdateLevelMeterInB);
      mixer.levelMeterOut.off('update', handleUpdateLevelMeterOut);
    };
  }, [mixer, setLevelMeterInA, setLevelMeterInB, setLevelMeterOut]);
}

export function useAnalyserSubscribers(mixer: Mixer) {
  useLevelMeterSubscribers(mixer);
}
