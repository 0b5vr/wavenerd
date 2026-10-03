import { useSetAtom } from 'jotai';
import { type Recorder } from '../../../audio/Recorder';
import { recorderIsRecordingAtom } from '../atoms/recorder';
import { useEffect } from 'react';

export function useRecorderSubscribers(recorder: Recorder) {
  const setIsRecording = useSetAtom(recorderIsRecordingAtom);

  useEffect(() => {
    setIsRecording(recorder.isRecording);

    const unsubscribeStart = recorder.onStart.subscribe(() => setIsRecording(true));
    const unsubscribeStop = recorder.onStop.subscribe(() => setIsRecording(false));

    return () => {
      unsubscribeStart();
      unsubscribeStop();
    };
  }, [recorder, setIsRecording]);
}
