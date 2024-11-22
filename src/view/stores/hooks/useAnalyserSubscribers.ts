import { analyserInAAtom, analyserInBAtom, levelMeterInAAtom, levelMeterInBAtom, levelMeterOutAtom } from '../atoms/analyser';
import { Mixer } from '../../../Mixer';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';

function useLevelMeterSubscribers( mixer: Mixer ) {
  const setLevelMeterInA = useSetAtom( levelMeterInAAtom );
  const setLevelMeterInB = useSetAtom( levelMeterInBAtom );
  const setLevelMeterOut = useSetAtom( levelMeterOutAtom );

  useEffect( () => {
    const handleUpdateLevelMeterInA = mixer.levelMeterInA.on( 'update', ( event ) => {
      setLevelMeterInA( event );
    } );

    const handleUpdateLevelMeterInB = mixer.levelMeterInB.on( 'update', ( event ) => {
      setLevelMeterInB( event );
    } );

    const handleUpdateLevelMeterOut = mixer.levelMeterOut.on( 'update', ( event ) => {
      setLevelMeterOut( event );
    } );

    return () => {
      mixer.levelMeterInA.off( 'update', handleUpdateLevelMeterInA );
      mixer.levelMeterInB.off( 'update', handleUpdateLevelMeterInB );
      mixer.levelMeterOut.off( 'update', handleUpdateLevelMeterOut );
    };
  }, [ mixer, setLevelMeterInA, setLevelMeterInB, setLevelMeterOut ] );
}

function useAnalSubscribers( mixer: Mixer ) {
  const setAnalyserInA = useSetAtom( analyserInAAtom );
  const setAnalyserInB = useSetAtom( analyserInBAtom );

  useEffect( () => {
    const handleUpdateAnalyserInA = mixer.analyserInA.on( 'update', ( event ) => {
      setAnalyserInA( structuredClone( event ) );
    } );

    const handleUpdateAnalyserInB = mixer.analyserInB.on( 'update', ( event ) => {
      setAnalyserInB( structuredClone( event ) );
    } );

    return () => {
      mixer.analyserInA.off( 'update', handleUpdateAnalyserInA );
      mixer.analyserInB.off( 'update', handleUpdateAnalyserInB );
    };
  }, [ mixer, setAnalyserInA, setAnalyserInB ] );
}

export function useAnalyserSubscribers( mixer: Mixer ) {
  useAnalSubscribers( mixer );
  useLevelMeterSubscribers( mixer );
}
