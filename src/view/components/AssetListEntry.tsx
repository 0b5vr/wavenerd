import React, { useCallback } from 'react';
import { Colors } from '../constants/Colors';
import IconBin from '~icons/mdi/delete';
import styled from 'styled-components';

// == styles =======================================================================================
const Name = styled.div`
  margin-left: 4px;
  flex-grow: 1;
  flex-shrink: 1;
`;

const ButtonDelete = styled( IconBin )`
  display: none;
  width: 16px;
  height: 16px;

  fill: ${ Colors.fore };
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;

const Root = styled.div`
  display: flex;
  align-items: center;
  background: ${ Colors.back3 };
  font: 500 12px monospace;

  * {
    flex-shrink: 0;
  }

  &:hover ${ ButtonDelete } {
    display: block;
  }
`;

// == components ===================================================================================
export const AssetListEntry: React.FC<{
  name: string;
  onDeleteAsset: ( name: string ) => void;
  className?: string;
}> = ( { name, onDeleteAsset, className } ) => {
  const handleClickDelete = useCallback(
    ( event: React.MouseEvent ) => {
      event.preventDefault();
      event.stopPropagation();

      onDeleteAsset( name );
    },
    [ name ]
  );

  return (
    <Root
      className={ className }
    >
      <Name>{ name }</Name>
      <ButtonDelete
        onClick={ handleClickDelete }
      />
    </Root>
  );
};
