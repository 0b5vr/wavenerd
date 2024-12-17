import { useSetAtom } from 'jotai';
import { Recorder } from '../../../audio/Recorder';
import { recorderIsRecordingAtom } from '../atoms/recorder';
import { useEffect } from 'react';

export function useRecorderSubscribers(recorder: Recorder) {
  const setIsRecording = useSetAtom(recorderIsRecordingAtom);

  useEffect(() => {
    setIsRecording(recorder.isRecording);

    const start = () => setIsRecording(true);
    const stop = () => setIsRecording(false);

    recorder.on('start', start);
    recorder.on('stop', stop);

    return () => {
      recorder.off('start', start);
      recorder.off('stop', stop);
    };
  }, [recorder]);
}
