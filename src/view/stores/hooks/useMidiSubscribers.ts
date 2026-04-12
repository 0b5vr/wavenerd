import { midiDevicesAtom, midiIndicatorAtom, midiLearningAtom, midiMappingsAtom, midiParamsAtom } from '../atoms/midi';
import { type MidiManager } from '../../../MIDIManager';
import { useCallback, useEffect, useMemo } from 'react';
import { useSetAtom } from 'jotai';
import { debounce } from 'throttle-debounce';

function useMidiParamsSubscriber(midiManager: MidiManager) {
  const setMidiParams = useSetAtom(midiParamsAtom);

  useEffect(() => {
    setMidiParams(midiManager.values);

    const handleParamChange = midiManager.on('paramChange', ({ paramKey, value }) => {
      setMidiParams((prev) => ({
        ...prev,
        [paramKey]: value,
      }));
    });

    return () => midiManager.off('paramChange', handleParamChange);
  }, [midiManager, setMidiParams]);
}

function useMidiLearningSubscriber(midiManager: MidiManager) {
  const setMidiLearning = useSetAtom(midiLearningAtom);

  useEffect(() => {
    const handleLearn = midiManager.on('learn', ({ paramKey }) => {
      setMidiLearning(paramKey);
    });

    return () => midiManager.off('learn', handleLearn);
  }, [midiManager, setMidiLearning]);
}

function useMidiIndicatorSubscriber(midiManager: MidiManager) {
  const setMidiIndicator = useSetAtom(midiIndicatorAtom);

  const debouncedOff = useMemo(
    () => debounce(200, () => {
      setMidiIndicator(false);
    }),
    [setMidiIndicator],
  );

  const indicate = useCallback(() => {
    setMidiIndicator(true);
    debouncedOff();
  }, [debouncedOff, setMidiIndicator]);

  useEffect(() => {
    const handleNoteOn = midiManager.on('noteOn', () => indicate());
    const handleNoteOff = midiManager.on('noteOff', () => indicate());
    const handleCC = midiManager.on('cc', () => indicate());

    return () => {
      midiManager.off('noteOn', handleNoteOn);
      midiManager.off('noteOff', handleNoteOff);
      midiManager.off('cc', handleCC);
    };
  }, [indicate, midiManager]);
}

function useMidiDevicesSubscriber(midiManager: MidiManager) {
  const setMidiDevices = useSetAtom(midiDevicesAtom);

  useEffect(() => {
    const update = () => setMidiDevices(Array.from(midiManager.deviceSet));
    update();

    const handleDeviceDetect = midiManager.on('deviceDetect', update);

    return () => midiManager.off('deviceDetect', handleDeviceDetect);
  }, [midiManager, setMidiDevices]);
}

function useMidiMappingsSubscriber(midiManager: MidiManager) {
  const setMidiMappings = useSetAtom(midiMappingsAtom);

  useEffect(() => {
    const update = () => setMidiMappings(structuredClone(midiManager.mappings));
    update();

    const handleMappingAssign = midiManager.on('mappingAssign', update);
    const handleMappingUnassign = midiManager.on('mappingUnassign', update);

    return () => {
      midiManager.off('mappingAssign', handleMappingAssign);
      midiManager.off('mappingUnassign', handleMappingUnassign);
    };
  }, [midiManager, setMidiMappings]);
}

export function useMidiSubscribers(midiManager: MidiManager) {
  useMidiParamsSubscriber(midiManager);
  useMidiLearningSubscriber(midiManager);
  useMidiIndicatorSubscriber(midiManager);
  useMidiDevicesSubscriber(midiManager);
  useMidiMappingsSubscriber(midiManager);
}
