import { midiDevicesAtom, midiIndicatorAtom, midiLearningAtom, midiMappingsAtom, midiParamsAtom } from '../atoms/midi';
import { type MidiManager } from '../../../MIDIManager';
import { useCallback, useEffect, useMemo } from 'react';
import { useSetAtom } from 'jotai';
import { debounce } from 'throttle-debounce';

function useMidiParamsSubscriber(midiManager: MidiManager) {
  const setMidiParams = useSetAtom(midiParamsAtom);

  useEffect(() => {
    setMidiParams(midiManager.values);

    const unsubscribeParamChange = midiManager.onParamChange.subscribe(({ paramKey, value }) => {
      setMidiParams((prev) => ({
        ...prev,
        [paramKey]: value,
      }));
    });

    return unsubscribeParamChange;
  }, [midiManager, setMidiParams]);
}

function useMidiLearningSubscriber(midiManager: MidiManager) {
  const setMidiLearning = useSetAtom(midiLearningAtom);

  useEffect(() => {
    const unsubscribeLearn = midiManager.onLearn.subscribe(({ paramKey }) => {
      setMidiLearning(paramKey);
    });

    return unsubscribeLearn;
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
    const unsubscribeNoteOn = midiManager.onNoteOn.subscribe(indicate);
    const unsubscribeNoteOff = midiManager.onNoteOff.subscribe(indicate);
    const unsubscribeCC = midiManager.onCC.subscribe(indicate);

    return () => {
      unsubscribeNoteOn();
      unsubscribeNoteOff();
      unsubscribeCC();
    };
  }, [indicate, midiManager]);
}

function useMidiDevicesSubscriber(midiManager: MidiManager) {
  const setMidiDevices = useSetAtom(midiDevicesAtom);

  useEffect(() => {
    const update = () => setMidiDevices(Array.from(midiManager.deviceSet));
    update();

    const unsubscribeDeviceDetect = midiManager.onDeviceDetect.subscribe(update);

    return unsubscribeDeviceDetect;
  }, [midiManager, setMidiDevices]);
}

function useMidiMappingsSubscriber(midiManager: MidiManager) {
  const setMidiMappings = useSetAtom(midiMappingsAtom);

  useEffect(() => {
    const update = () => setMidiMappings(structuredClone(midiManager.mappings));
    update();

    const unsubscribeMappingAssign = midiManager.onMappingAssign.subscribe(update);
    const unsubscribeMappingUnassign = midiManager.onMappingUnassign.subscribe(update);

    return () => {
      unsubscribeMappingAssign();
      unsubscribeMappingUnassign();
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
