import React, { useCallback, useMemo } from 'react';
import { contextMenuCommandsAtom, contextMenuIsOpeningAtom, contextMenuPositionAtom, resetContextMenuAtom } from '../stores/atoms/contextMenu';
import { ContextMenuEntry } from './ContextMenuEntry';
import { ContextMenuHr } from './ContextMenuHr';
import { ThemeVars } from '../themes/ThemeVars';
import styled from 'styled-components';
import { useAtomCallback } from 'jotai/utils';
import { useAtomValue } from 'jotai';

// == styles =======================================================================================
const Container = styled.div`
  position: absolute;
  overflow: hidden;
  padding: 0.25rem;
  border-radius: 0.25rem;
  background: ${ThemeVars.contextMenuBg};
  color: ${ThemeVars.contextMenuFg};
  filter: drop-shadow( 0 0 2px ${ThemeVars.black} );
  font-size: 0.8rem;
`;

const OverlayBG = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba( 0, 0, 0, 0 );
`;

const Root = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba( 0, 0, 0, 0 );
`;

// == component ====================================================================================
export const ContextMenu: React.FC = () => {
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

  // -- component ----------------------------------------------------------------------------------
  if (!isOpening) {
    return null;
  }

  return (
    <Root>
      <OverlayBG
        onClick={handleClickBG}
        onContextMenu={handleContextMenuBG}
      />
      <Container
        style={style}
      >
        { commands.map((command, iCommand) => (
          command === 'hr'
            ? <ContextMenuHr key={iCommand} />
            : (
                <ContextMenuEntry
                  key={iCommand}
                  command={command}
                />
              )
        )) }
      </Container>
    </Root>
  );
};
