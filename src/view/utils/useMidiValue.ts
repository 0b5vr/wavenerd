import { useEffect, useState } from 'react';
import { MIDIMAN } from '../../MIDIManager';

export function useMidiValue( paramName: string, handler?: ( value: number ) => void ): number {
  const [ value, setValue ] = useState( 0.0 );

  useEffect(
    () => {
      const initValue = MIDIMAN.midi( paramName );
      setValue( initValue );
      handler?.( initValue );

      const handleParamChange = MIDIMAN.on( 'paramChange', ( event ) => {
        if ( event.key === paramName ) {
          setValue( event.value );
          handler?.( event.value );
        }
      } );

      return () => {
        MIDIMAN.off( 'paramChange', handleParamChange );
      };
    },
    [ paramName, handler ]
  );

  return value;
}
