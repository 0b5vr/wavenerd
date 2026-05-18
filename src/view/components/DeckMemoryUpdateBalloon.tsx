import { type PrimitiveAtom, useAtomValue } from 'jotai';
import styles from './DeckMemoryUpdateBalloon.module.css';
import { useMemo } from 'react';
import IconLoad from '~icons/mdi/file-download';
import IconX from '~icons/mdi/close';
import IconSave from '~icons/mdi/content-save';
import clsx from 'clsx';

interface Props {
  memoryUpdateAtom: PrimitiveAtom<{
    renderKey: number;
    memoryKey: string;
    status: 'loaded' | 'loadfailed' | 'saved';
  } | null>;
}

export function DeckMemoryUpdateBalloon(props: Props) {
  const { memoryUpdateAtom } = props;

  const memoryUpdate = useAtomValue(memoryUpdateAtom);

  const icon = useMemo(() => {
    if (memoryUpdate == null) {
      return null;
    } else if (memoryUpdate.status === 'loaded') {
      return <IconLoad />;
    } else if (memoryUpdate.status === 'loadfailed') {
      return <IconX />;
    } else if (memoryUpdate.status === 'saved') {
      return <IconSave />;
    }
  }, [memoryUpdate]);

  const message = useMemo(() => {
    if (memoryUpdate == null) {
      return null;
    }

    let message = `Memory ${memoryUpdate.memoryKey}`;

    if (memoryUpdate.status === 'loaded') {
      message += ' loaded';
    } else if (memoryUpdate.status === 'loadfailed') {
      message += ' empty';
    } else if (memoryUpdate.status === 'saved') {
      message += ' saved';
    }

    return message;
  }, [memoryUpdate]);

  if (memoryUpdate == null) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
      <div
        key={memoryUpdate.renderKey}
        className={clsx('flex flex-col justify-center items-center gap-2 text-xs font-normal py-2 px-4 rounded-lg bg-overlay-back text-fore shadow-[0_4px_8px_2px_var(--color-ui-shadow)]', styles.balloon)}
      >
        <div className="text-[32px] font-bold flex justify-center items-center gap-2">
          <div className="flex justify-center items-center w-[1em] h-[1em]">
            {memoryUpdate.memoryKey}
          </div>
          {icon}
        </div>
        <div className="block w-[10em] text-center">{message}</div>
      </div>
    </div>
  );
}
