import { MIDIMAN } from '../../MIDIManager';
import { midiLearningState } from '../states/midi';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

function MIDIListener(): null {
  const setMidiLearning = useSetRecoilState( midiLearningState );

  useEffect(
    () => {
      const handleLearn = MIDIMAN.on( 'learn', ( { key } ) => {
        setMidiLearning( key );
      } );

      return () => {
        MIDIMAN.off( 'learn', handleLearn );
      };
    },
    []
  );

  return null;
}

export { MIDIListener };
