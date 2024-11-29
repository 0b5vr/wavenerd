import React, { useCallback } from 'react';
import { ContextMenuCommand } from '../types/ContextMenuCommand';
import { ThemeVars } from '../themes/ThemeVars';
import { resetContextMenuAtom } from '../stores/atoms/contextMenu';
import styled from 'styled-components';
import { useAtomCallback } from 'jotai/utils';

// == styles =======================================================================================
const Name = styled.div`
  padding: 0.1rem 0.2rem;
  font-size: 0.8rem;
  line-height: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${ ThemeVars.fore };
`;

const Root = styled.div<{ isSelected?: boolean }>`
  display: flex;
  width: 100%;
  height: 1rem;
  border-radius: 0.25rem;
  justify-content: space-between;
  background: ${ ( { isSelected } ) => (
    isSelected ? ThemeVars.back3 : 'none'
  ) };
  cursor: pointer;

  &:hover {
    background: ${ ThemeVars.back3 };
  }

  &:active {
    opacity: 0.5;
  }
`;

// == components ===================================================================================
interface ContextMenuEntryProps {
  className?: string;
  command: ContextMenuCommand;
}

export const ContextMenuEntry: React.FC<ContextMenuEntryProps> = ( props ) => {
  const { className, command } = props;

  const name = command.name;

  const handleClick = useAtomCallback( useCallback(
    ( _, set ) => {
      command.callback();
      set( resetContextMenuAtom );
    },
    [ command ],
  ) );

  return (
    <Root
      className={ className }
      onClick={ handleClick }
    >
      <Name>{ name }</Name>
    </Root>
  );
};
