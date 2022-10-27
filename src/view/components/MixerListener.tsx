import { useEffect, useState } from 'react';
import { xFaderModeState, xFaderState } from '../states/xFader';
import { Mixer } from '../../Mixer';
import { RateLimitedExecutor } from '../utils/RateLimitedExecutor';
import { levelMeterState } from '../states/levelMeter';
import { useSetRecoilState } from 'recoil';

function MixerListener( { mixer }: {
  mixer: Mixer;
} ): null {
  const setXFaderValue = useSetRecoilState( xFaderState );
  const setXFaderMode = useSetRecoilState( xFaderModeState );
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

      const handleChangeXFaderMode = mixer.on( 'changeXFaderMode', ( { mode } ) => {
        setXFaderMode( mode );
      } );
      setXFaderMode( mixer.xfaderMode );

      const handleUpdateLevelMeters = mixer.on( 'updateLevelMeters', ( event ) => {
        setLevelMeter( event );
      } );

      return () => {
        mixer.off( 'changeXFader', handleChangeXFader );
        mixer.off( 'changeXFaderMode', handleChangeXFaderMode );
        mixer.off( 'updateLevelMeters', handleUpdateLevelMeters );
      };
    },
    [ mixer, executorXFaderValue ]
  );

  return null;
}

export { MixerListener };
