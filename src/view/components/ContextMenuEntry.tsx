import { useCallback } from 'react';
import { type ContextMenuCommand } from '../types/ContextMenuCommand';
import { resetContextMenuAtom } from '../stores/atoms/contextMenu';
import { useAtomCallback } from 'jotai/utils';
import { clsx } from 'clsx';

interface ContextMenuEntryProps {
  className?: string;
  command: ContextMenuCommand;
}

export function ContextMenuEntry({ className, command }: ContextMenuEntryProps) {
  const name = command.name;

  const handleClick = useAtomCallback(useCallback(
    (_, set) => {
      command.callback();
      set(resetContextMenuAtom);
    },
    [command],
  ));

  return (
    <div
      className={clsx(
        'flex w-full h-4 rounded justify-between cursor-pointer bg-none hover:bg-back3 active:opacity-50',
        className,
      )}
      onClick={handleClick}
    >
      <div className="px-[0.2rem] py-[0.1rem] text-[0.8rem] leading-none overflow-hidden text-ellipsis whitespace-nowrap text-fore">
        {name}
      </div>
    </div>
  );
}
