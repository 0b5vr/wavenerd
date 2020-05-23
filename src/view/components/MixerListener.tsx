import { useEffect, useState } from 'react';
import { Mixer } from '../../Mixer';
import { RateLimitedExecutor } from '../utils/RateLimitedExecutor';
import { useSetRecoilState } from 'recoil';
import { xFaderState } from '../states/xFader';

function MixerListener( { mixer }: {
  mixer: Mixer;
} ): null {
  const setXFaderValue = useSetRecoilState( xFaderState );

  const [ executorXFaderValue ] = useState( new RateLimitedExecutor( 50 ) );
  useEffect(
    () => {
      const handleChangeXFader = mixer.on( 'changeXFader', ( { value } ) => {
        executorXFaderValue.cue( () => {
          setXFaderValue( value );
        } );
      } );

      return () => {
        mixer.off( 'changeXFader', handleChangeXFader );
      };
    },
    [ executorXFaderValue ]
  );

  return null;
}

export { MixerListener };
