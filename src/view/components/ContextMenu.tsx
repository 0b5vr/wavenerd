import { useCallback, useMemo } from 'react';
import { contextMenuCommandsAtom, contextMenuIsOpeningAtom, contextMenuPositionAtom, resetContextMenuAtom } from '../stores/atoms/contextMenu';
import { ContextMenuEntry } from './ContextMenuEntry';
import { ContextMenuHr } from './ContextMenuHr';
import { useAtomCallback } from 'jotai/utils';
import { useAtomValue } from 'jotai';

export function ContextMenu() {
  const isOpening = useAtomValue(contextMenuIsOpeningAtom);
  const [x, y] = useAtomValue(contextMenuPositionAtom);
  const commands = useAtomValue(contextMenuCommandsAtom);

  const handleClickBG = useAtomCallback(useCallback(
    (_, set) => {
      set(resetContextMenuAtom);
    },
    [],
  ));

  const handleContextMenuBG = useAtomCallback(useCallback(
    (_, set) => {
      set(resetContextMenuAtom);
    },
    [],
  ));

  const style: React.CSSProperties = useMemo(
    () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;

      const ret: React.CSSProperties = {};

      if (x < width - 240) {
        ret.left = x;
      } else {
        ret.right = width - x;
      }

      if (y < height - 120) {
        ret.top = y;
      } else {
        ret.bottom = height - y;
      }

      return ret;
    },
    [x, y],
  );

  if (!isOpening) {
    return null;
  }

  return (
    <div className="fixed inset-0">
      <div
        className="absolute inset-0"
        onClick={handleClickBG}
        onContextMenu={handleContextMenuBG}
      />
      <div
        className="absolute overflow-hidden p-1 rounded text-[0.8rem] bg-context-menu-bg text-context-menu-fg filter-[drop-shadow(0_0_2px_var(--color-black))]"
        style={style}
      >
        {commands.map((command, iCommand) => (
          command === 'hr'
            ? <ContextMenuHr key={iCommand} />
            : (
                <ContextMenuEntry
                  key={iCommand}
                  command={command}
                />
              )
        ))}
      </div>
    </div>
  );
}
