import { useCallback, useContext } from 'react';
import { headerIconCls } from './headerIconCls';
import { openVisualizerWindow } from '../VisualizerWindow/openVisualizerWindow';
import { StuffContext } from '../../StuffContext';
import IconEye from '~icons/mdi/eye';

export function HeaderIconVisualizer() {
  const { mixer, frameEmitter } = useContext(StuffContext)!;

  const handleClick = useCallback(() => {
    openVisualizerWindow(mixer.analyserOut, frameEmitter);
  }, [frameEmitter, mixer.analyserOut]);

  return (
    <IconEye
      className={headerIconCls}
      onClick={handleClick}
      data-stalker="Open visualizer window"
    />
  );
}
