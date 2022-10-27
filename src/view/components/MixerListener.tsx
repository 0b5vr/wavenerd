import { useEffect, useState } from 'react';
import { Mixer } from '../../Mixer';
import { RateLimitedExecutor } from '../utils/RateLimitedExecutor';
import { levelMeterState } from '../states/levelMeter';
import { useSetRecoilState } from 'recoil';
import { xFaderState } from '../states/xFader';

function MixerListener( { mixer }: {
  mixer: Mixer;
} ): null {
  const setXFaderValue = useSetRecoilState( xFaderState );
  const setLevelMeter = useSetRecoilState( levelMeterState );

  // TODO: rename me to debounce
  const [ executorXFaderValue ] = useState( new RateLimitedExecutor( 50 ) );
  useEffect(
    () => {
      const handleChangeXFader = mixer.on( 'changeXFader', ( { value } ) => {
        executorXFaderValue.cue( () => {
          setXFaderValue( value );
        } );
      } );

      const handleUpdateLevelMeters = mixer.on( 'updateLevelMeters', ( event ) => {
        setLevelMeter( event );
      } );

      return () => {
        mixer.off( 'changeXFader', handleChangeXFader );
        mixer.off( 'updateLevelMeters', handleUpdateLevelMeters );
      };
    },
    [ mixer, executorXFaderValue ]
  );

  return null;
}

export { MixerListener };
