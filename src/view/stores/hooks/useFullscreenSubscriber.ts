import { useSetAtom } from 'jotai';
import { isFullscreenAtom } from '../atoms/fullscreen';
import { useContext, useEffect } from 'react';
import { StuffContext } from '../../StuffContext';

export function useFullscreenSubscriber() {
  const { fullscreenManager } = useContext(StuffContext)!;

  const setIsFullscreen = useSetAtom(isFullscreenAtom);

  useEffect(() => {
    const handleFullscreenChange = fullscreenManager.on('fullscreenChange', ({ isFullscreen }) => {
      setIsFullscreen(isFullscreen);
    });

    return () => fullscreenManager.off('fullscreenChange', handleFullscreenChange);
  }, [fullscreenManager, setIsFullscreen]);
}
