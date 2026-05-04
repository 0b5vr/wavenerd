import { useAtomValue } from 'jotai';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { recorderIsRecordingAtom } from '../../stores/atoms/recorder';
import { ThemeVars } from '../../themes/ThemeVars';
import { headerIconStyle } from './headerIconStyle';
import styled from 'styled-components';
import IconCasette from '~icons/mdi/cassette';
import { StuffContext } from '../../StuffContext';
import { useSettings } from '../../stores/hooks/useSettings';
import { Recorder } from '../../../audio/Recorder';

const StyledIcon = styled(IconCasette)`
  ${headerIconStyle}
`;

function zeropad(num: number, length: number): string {
  return num.toString().padStart(length, '0');
}

function formatTime(seconds: number): string {
  const second = Math.floor(seconds) % 60;
  const minute = Math.floor(seconds / 60) % 60;
  const hour = Math.floor(seconds / 3600);
  return `${hour}:${zeropad(minute, 2)}:${zeropad(second, 2)}`;
}

export function HeaderIconRecorder() {
  const { recorder } = useContext(StuffContext)!;
  const format = useSettings('recorderFormat');
  const [displayTime, setDisplayTime] = useState('');

  const isRecording = useAtomValue(recorderIsRecordingAtom);

  const handleClick = useCallback(() => {
    if (recorder.isRecording) {
      recorder.stop();
      setDisplayTime('');
    } else {
      recorder.start();
      setDisplayTime(formatTime(0));
    }
  }, [recorder]);

  // update display time
  useEffect(() => {
    if (!isRecording) {
      return;
    }

    const id = setInterval(() => {
      const time = recorder.recordingTime;
      setDisplayTime(formatTime(time));
    }, 1000);

    return () => clearInterval(id);
  }, [isRecording, recorder]);

  const displayFormat = useMemo(() => {
    const availableFormats = Recorder.getAvailableFormats();
    const fmt = availableFormats.find((f) => f.format === format);
    return fmt ? fmt.displayName : format;
  }, [format]);

  const stalkerText = useMemo(() => {
    if (isRecording) {
      return `Recording in ${displayFormat}\n${displayTime}\nClick to stop`;
    } else {
      return `Record in ${displayFormat}`;
    }
  }, [isRecording, displayFormat, displayTime]);

  return (
    <StyledIcon
      onClick={handleClick}
      style={{ color: isRecording ? ThemeVars.error : 'inherit' }}
      data-stalker={stalkerText}
    />
  );
}
