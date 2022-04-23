import React, { useCallback, useMemo } from 'react';
import { contextMenuCommandsState, contextMenuIsOpeningState, contextMenuPositionState, useResetContextMenuAction } from '../states/contextMenu';
import { Colors } from '../constants/Colors';
import { ContextMenuEntry } from './ContextMenuEntry';
import { ContextMenuHr } from './ContextMenuHr';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

// == styles =======================================================================================
const Container = styled.div`
  position: absolute;
  overflow: hidden;
  padding: 0.25rem;
  border-radius: 0.25rem;
  background: ${ Colors.back2 };
  filter: drop-shadow( 0 0 2px ${ Colors.black } );
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
  const isOpening = useRecoilValue( contextMenuIsOpeningState );
  const position = useRecoilValue( contextMenuPositionState );
  const commands = useRecoilValue( contextMenuCommandsState );
  const resetContextMenu = useResetContextMenuAction();

  const handleClickBG = useCallback(
    () => {
      resetContextMenu();
    },
    []
  );

  const handleContextMenuBG = useCallback(
    () => {
      resetContextMenu();
    },
    []
  );

  const style: React.CSSProperties = useMemo(
    () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;

      const ret: React.CSSProperties = {};
      ( position.x < width - 240 )
        ? ( ret.left = position.x )
        : ( ret.right = width - position.x );
      ( position.y < height - 120 )
        ? ( ret.top = position.y )
        : ( ret.bottom = height - position.y );
      return ret;
    },
    [ position ]
  );

  // -- component ----------------------------------------------------------------------------------
  if ( !isOpening ) {
    return null;
  }

  return (
    <Root>
      <OverlayBG
        onClick={ handleClickBG }
        onContextMenu={ handleContextMenuBG }
      />
      <Container
        style={ style }
      >
        { commands.map( ( command, iCommand ) => (
          command === 'hr'
            ? <ContextMenuHr key={ iCommand } />
            : (
              <ContextMenuEntry
                key={ iCommand }
                name={ command.name }
                onClick={ () => {
                  command.callback();
                  resetContextMenu();
                } }
              />
            )
        ) ) }
      </Container>
    </Root>
  );
};
