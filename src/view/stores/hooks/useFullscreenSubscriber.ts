import { useSetAtom } from 'jotai';
import { isFullscreenAtom } from '../atoms/fullscreen';
import { useContext, useEffect } from 'react';
import { StuffContext } from '../../StuffContext';

export function useFullscreenSubscriber() {
  const { fullscreenManager } = useContext(StuffContext)!;

  const setIsFullscreen = useSetAtom(isFullscreenAtom);

  useEffect(() => {
    const unsubscribeFullscreenChange = fullscreenManager.onFullscreenChange.subscribe(({ isFullscreen }) => {
      setIsFullscreen(isFullscreen);
    });

    return unsubscribeFullscreenChange;
  }, [fullscreenManager, setIsFullscreen]);
}
