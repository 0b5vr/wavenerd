import { atom, useRecoilCallback } from 'recoil';
import { ContextMenuCommand } from '../types/ContextMenuCommand';

// == atoms ========================================================================================
export const contextMenuIsOpeningState = atom( {
  key: 'contextMenuIsOpeningState',
  default: false
} );

export const contextMenuPositionState = atom( {
  key: 'contextMenuPositionState',
  default: { x: 0, y: 0 }
} );

export const contextMenuCommandsState = atom( {
  key: 'contextMenuCommandsState',
  default: [] as Array<ContextMenuCommand | 'hr'>
} );

// == hooks ========================================================================================
export function useOpenContextMenuAction(): ( params: {
  x: number;
  y: number;
  commands: ContextMenuCommand[];
} ) => Promise<void> {
  return useRecoilCallback(
    ( { snapshot, set } ) => async ( { x, y, commands: addCommands } ) => {
      const commands = await snapshot.getPromise( contextMenuCommandsState );

      const newCommands: typeof commands = [];
      if ( commands.length !== 0 ) {
        newCommands.push( ...commands );
        newCommands.push( 'hr' );
      }
      newCommands.push( ...addCommands );

      set( contextMenuIsOpeningState, true );
      set( contextMenuPositionState, { x, y } );
      set( contextMenuCommandsState, newCommands );
    },
    []
  );
}

export function useResetContextMenuAction(): () => Promise<void> {
  return useRecoilCallback(
    ( { reset } ) => async () => {
      reset( contextMenuIsOpeningState );
      reset( contextMenuPositionState );
      reset( contextMenuCommandsState );
    }
  );
}
