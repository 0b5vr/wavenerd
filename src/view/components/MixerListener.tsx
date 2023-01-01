import { analyserInAState, analyserInBState, levelMeterInAState, levelMeterInBState, levelMeterOutState } from '../states/mixer';
import { useEffect, useState } from 'react';
import { AnalyserResult } from '../../Analyser';
import { Mixer } from '../../Mixer';
import { RateLimitedExecutor } from '../utils/RateLimitedExecutor';
import { useSetRecoilState } from 'recoil';
import { xFaderState } from '../states/xFader';

function copyAnalyserResult( result: AnalyserResult ): AnalyserResult {
  return {
    deltaTime: result.deltaTime,
    timeDomainL: result.timeDomainL.slice(),
    timeDomainR: result.timeDomainR.slice(),
    frequencyL: result.frequencyL.slice(),
    frequencyR: result.frequencyR.slice(),
  };
}

function MixerListener( { mixer }: {
  mixer: Mixer;
} ): null {
  const setXFaderValue = useSetRecoilState( xFaderState );
  const setAnalyserInA = useSetRecoilState( analyserInAState );
  const setAnalyserInB = useSetRecoilState( analyserInBState );
  const setLevelMeterInA = useSetRecoilState( levelMeterInAState );
  const setLevelMeterInB = useSetRecoilState( levelMeterInBState );
  const setLevelMeterOut = useSetRecoilState( levelMeterOutState );

  // TODO: rename me to debounce
  const [ executorXFaderValue ] = useState( new RateLimitedExecutor( 50 ) );
  useEffect(
    () => {
      const handleChangeXFader = mixer.on( 'changeXFader', ( { value } ) => {
        executorXFaderValue.cue( () => {
          setXFaderValue( value );
        } );
      } );

      const handleUpdateAnalyserInA = mixer.analyserInA.on( 'update', ( event ) => {
        setAnalyserInA( copyAnalyserResult( event ) );
      } );

      const handleUpdateAnalyserInB = mixer.analyserInB.on( 'update', ( event ) => {
        setAnalyserInB( copyAnalyserResult( event ) );
      } );

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
        mixer.off( 'changeXFader', handleChangeXFader );
        mixer.analyserInA.off( 'update', handleUpdateAnalyserInA );
        mixer.analyserInB.off( 'update', handleUpdateAnalyserInB );
        mixer.levelMeterInA.off( 'update', handleUpdateLevelMeterInA );
        mixer.levelMeterInB.off( 'update', handleUpdateLevelMeterInB );
        mixer.levelMeterOut.off( 'update', handleUpdateLevelMeterOut );
      };
    },
    [ mixer, executorXFaderValue ]
  );

  return null;
}

export { MixerListener };
