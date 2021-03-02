import { useEffect, useState } from 'react';
import { MIDIMAN } from '../../MIDIManager';

export function useMidiLearning( paramName: string ): boolean {
  const [ isLearning, setLearning ] = useState( false );

  useEffect(
    () => {
      const handler = MIDIMAN.on( 'learn', ( event ) => {
        setLearning( event.key === paramName );
      } );

      return () => {
        MIDIMAN.off( 'paramChange', handler );
      };
    },
    [ paramName ]
  );

  return isLearning;
}
