import { useCallback, useContext } from 'react';
import { headerIconStyle } from './headerIconStyle';
import styled from 'styled-components';
import { openVisualizerWindow } from '../VisualizerWindow/openVisualizerWindow';
import { StuffContext } from '../../StuffContext';
import IconEye from '~icons/mdi/eye';

const StyledIcon = styled(IconEye)`
  ${headerIconStyle}
`;

export function HeaderIconVisualizer() {
  const { mixer, frameEmitter } = useContext(StuffContext)!;

  const handleClick = useCallback(() => {
    openVisualizerWindow(mixer.analyserOut, frameEmitter);
  }, [frameEmitter, mixer.analyserOut]);

  return (
    <StyledIcon
      onClick={handleClick}
      data-stalker="Open visualizer window"
    />
  );
}
