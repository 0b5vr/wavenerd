import { midiLearningAtom, midiParamsAtom } from '../atoms/midi';
import { MidiManager } from '../../../MIDIManager';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';

function useMidiParamsSubscriber( midiManager: MidiManager ) {
  const setMidiParams = useSetAtom( midiParamsAtom );

  useEffect( () => {
    setMidiParams( midiManager.values );

    const handleParamChange = midiManager.on( 'paramChange', ( { key, value } ) => {
      setMidiParams( ( prev ) => ( {
        ...prev,
        [ key ]: value,
      } ) );
    } );

    return () => midiManager.off( 'paramChange', handleParamChange );
  }, [ midiManager ] );
}

function useMidiLearningSubscriber( midiManager: MidiManager ) {
  const setMidiLearning = useSetAtom( midiLearningAtom );

  useEffect( () => {
    const handleLearn = midiManager.on( 'learn', ( { key } ) => {
      setMidiLearning( key );
    } );

    return () => midiManager.off( 'learn', handleLearn );
  }, [ midiManager ] );
}

export function useMidiSubscribers( midiManager: MidiManager ) {
  useMidiParamsSubscriber( midiManager );
  useMidiLearningSubscriber( midiManager );
}
