import { useAtomValue } from 'jotai';
import { useCallback, useContext } from 'react';
import { recorderIsRecordingAtom } from '../../stores/atoms/recorder';
import { ThemeVars } from '../../themes/ThemeVars';
import { headerIconStyle } from './headerIconStyle';
import styled from 'styled-components';
import IconCasette from '~icons/mdi/cassette';
import { StuffContext } from '../../StuffContext';

const StyledIcon = styled(IconCasette)`
  ${headerIconStyle}
`;

export function HeaderIconRecorder() {
  const { recorder } = useContext(StuffContext)!;

  const isRecording = useAtomValue(recorderIsRecordingAtom);

  const handleClick = useCallback(() => {
    if (recorder.isRecording) {
      recorder.stop();
    } else {
      recorder.start();
    }
  }, [recorder]);

  return (
    <StyledIcon
      onClick={handleClick}
      style={{ color: isRecording ? ThemeVars.error : 'inherit' }}
      data-stalker={isRecording ? 'Recording... Click to stop' : 'Record'}
    />
  );
}
