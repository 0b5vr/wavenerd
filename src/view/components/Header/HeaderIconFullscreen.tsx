import { useCallback, useContext } from 'react';
import { headerIconCls } from './headerIconCls';
import IconFullscreen from '~icons/mdi/fullscreen';
import IconFullscreenExit from '~icons/mdi/fullscreen-exit';
import { isFullscreenAtom } from '../../stores/atoms/fullscreen';
import { useAtomValue } from 'jotai';
import { StuffContext } from '../../StuffContext';

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
      <IconFullscreenExit
        className={headerIconCls}
        onClick={handleClickExit}
        data-stalker="Exit fullscreen"
      />
    );
  } else {
    return (
      <IconFullscreen
        className={headerIconCls}
        onClick={handleClickEnter}
        data-stalker="Enter fullscreen"
      />
    );
  }
}
