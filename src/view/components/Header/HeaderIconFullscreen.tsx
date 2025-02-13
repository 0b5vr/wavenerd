import { useCallback, useContext } from 'react';
import { headerIconStyle } from './headerIconStyle';
import styled from 'styled-components';
import IconFullscreen from '~icons/mdi/fullscreen';
import IconFullscreenExit from '~icons/mdi/fullscreen-exit';
import { isFullscreenAtom } from '../../stores/atoms/fullscreen';
import { useAtomValue } from 'jotai';
import { StuffContext } from '../../StuffContext';

const StyledIconEnter = styled(IconFullscreen)`
  ${headerIconStyle}
`;

const StyledIconExit = styled(IconFullscreenExit)`
  ${headerIconStyle}
`;

export function HeaderIconFullscreen() {
  const { fullscreenManager } = useContext(StuffContext)!;
  const isFullscreen = useAtomValue(isFullscreenAtom);

  const handleClickEnter = useCallback(() => {
    fullscreenManager.requestFullscreen();
  }, [fullscreenManager]);

  const handleClickExit = useCallback(() => {
    fullscreenManager.exitFullscreen();
  }, [fullscreenManager]);

  if (isFullscreen) {
    return (
      <StyledIconExit
        onClick={handleClickExit}
        data-stalker="Exit fullscreen"
      />
    );
  } else {
    return (
      <StyledIconEnter
        onClick={handleClickEnter}
        data-stalker="Enter fullscreen"
      />
    );
  }
}
