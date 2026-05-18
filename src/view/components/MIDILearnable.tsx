import { MIDIMAN } from '../../MIDIManager';
import { openContextMenuAtom } from '../stores/atoms/contextMenu';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';
import { useMidiLearning } from '../stores/hooks/useMidiLearning';
import clsx from 'clsx';

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
    <div
      className={clsx('absolute inset-0', className)}
      onContextMenu={handleContextMenu}
    >
      {isLearning && (
        <div className="absolute inset-0 shadow-[0_0_0_2px_var(--color-accent)]" />
      )}
    </div>
  );
}
