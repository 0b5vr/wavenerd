import { midiIndicatorAtom, midiLearningAtom, midiParamsAtom } from '../atoms/midi';
import { MidiManager } from '../../../MIDIManager';
import { useCallback, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { debounce } from 'throttle-debounce';

function useMidiParamsSubscriber(midiManager: MidiManager) {
  const setMidiParams = useSetAtom(midiParamsAtom);

  useEffect(() => {
    setMidiParams(midiManager.values);

    const handleParamChange = midiManager.on('paramChange', ({ key, value }) => {
      setMidiParams((prev) => ({
        ...prev,
        [key]: value,
      }));
    });

    return () => midiManager.off('paramChange', handleParamChange);
  }, [midiManager]);
}

function useMidiLearningSubscriber(midiManager: MidiManager) {
  const setMidiLearning = useSetAtom(midiLearningAtom);

  useEffect(() => {
    const handleLearn = midiManager.on('learn', ({ key }) => {
      setMidiLearning(key);
    });

    return () => midiManager.off('learn', handleLearn);
  }, [midiManager]);
}

function useMidiIndicatorSubscriber(midiManager: MidiManager) {
  const setMidiIndicator = useSetAtom(midiIndicatorAtom);

  const debouncedOff = useCallback(debounce(200, () => {
    setMidiIndicator(false);
  }), []);

  const indicate = useCallback(() => {
    setMidiIndicator(true);
    debouncedOff();
  }, []);

  useEffect(() => {
    const handleNoteOn = midiManager.on('noteOn', () => indicate());
    const handleNoteOff = midiManager.on('noteOff', () => indicate());
    const handleCC = midiManager.on('cc', () => indicate());

    return () => {
      midiManager.off('noteOn', handleNoteOn);
      midiManager.off('noteOff', handleNoteOff);
      midiManager.off('cc', handleCC);
    };
  }, [midiManager]);
}

export function useMidiSubscribers(midiManager: MidiManager) {
  useMidiParamsSubscriber(midiManager);
  useMidiLearningSubscriber(midiManager);
  useMidiIndicatorSubscriber(midiManager);
}
