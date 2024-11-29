import { ContextMenuCommand } from '../../types/ContextMenuCommand';
import { atom } from 'jotai';

// == atoms ========================================================================================
export const contextMenuIsOpeningAtom = atom( false );
export const contextMenuPositionAtom = atom( [ 0, 0 ] );
export const contextMenuCommandsAtom = atom<( ContextMenuCommand | 'hr' )[]>( [] );

// == actions ======================================================================================
export const openContextMenuAtom = atom( null, ( get, set, params: {
  position: [ number, number ];
  commands: ContextMenuCommand[];
} ) => {
  const { position, commands: addCommands } = params;
  const commands = get( contextMenuCommandsAtom );

  const newCommands: typeof commands = [];
  if ( commands.length !== 0 ) {
    newCommands.push( ...commands );
    newCommands.push( 'hr' );
  }
  newCommands.push( ...addCommands );

  set( contextMenuIsOpeningAtom, true );
  set( contextMenuPositionAtom, position );
  set( contextMenuCommandsAtom, newCommands );
} );

export const resetContextMenuAtom = atom( null, ( _, set ) => {
  set( contextMenuIsOpeningAtom, false );
  set( contextMenuPositionAtom, [ 0, 0 ] );
  set( contextMenuCommandsAtom, [] );
} );
