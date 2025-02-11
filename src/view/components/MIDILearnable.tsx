import { MIDIMAN } from '../../MIDIManager';
import { ThemeVars } from '../themes/ThemeVars';
import { openContextMenuAtom } from '../stores/atoms/contextMenu';
import styled from 'styled-components';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';
import { useMidiLearning } from '../stores/hooks/useMidiLearning';

// == styles =======================================================================================
const LearningBorder = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 0 2px ${ThemeVars.accent};
`;

const Root = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
`;

// == component ====================================================================================
interface Props {
  paramName: string;
  className?: string;
}

export function MIDILearnable(props: Props) {
  const { paramName, className } = props;

  const isLearning = useMidiLearning(paramName);

  const handleContextMenu = useAtomCallback(useCallback(
    (_, set, event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();

      set(openContextMenuAtom, {
        position: [event.clientX, event.clientY],
        commands: [
          {
            name: 'Learn MIDI',
            callback: () => {
              MIDIMAN.learn(paramName);
            },
          },
        ],
      });
    },
    [paramName],
  ));

  return (
    <Root
      className={className}
      onContextMenu={handleContextMenu}
    >
      { isLearning && <LearningBorder /> }
    </Root>
  );
}
