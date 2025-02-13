import { useCallback, useContext } from 'react';
import { StuffContext } from '../../StuffContext';
import { SettingsItemButton } from './SettingsItemButton';
import { isFullscreenAtom } from '../../stores/atoms/fullscreen';
import { useAtomValue } from 'jotai';

export function SettingsItemButtonFullscreen() {
  const { fullscreenManager } = useContext(StuffContext)!;
  const isFullscreen = useAtomValue(isFullscreenAtom);

  const handleClick = useCallback(() => {
    if (isFullscreen) {
      fullscreenManager.exitFullscreen();
    } else {
      fullscreenManager.requestFullscreen();
    }
  }, [isFullscreen, fullscreenManager]);

  return (
    <SettingsItemButton
      name="Fullscreen"
      label={isFullscreen ? 'Exit' : 'Enter'}
      onClick={handleClick}
      stalkerText="Toggle fullscreen mode.&#10;This will also lock the keyboard using the Keyboard Lock API,&#10;which protects you from opening sexy websites while jamming in front of your crowd.&#10;To exit fullscreen, press the Esc key for 2 seconds or come back to this screen and click the button again."
    />
  );
}
