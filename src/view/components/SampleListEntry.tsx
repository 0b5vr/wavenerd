import React, { useCallback } from 'react';
import { Colors } from '../constants/Colors';
import IconBin from '~icons/mdi/delete';
import styled from 'styled-components';
import { useDeleteSampleAction } from '../states/deck';

// == utils ========================================================================================
export function sanitizeSampleName( raw: string ): string | null {
  if ( raw.match( /^[0-9a-zA-Z_]+$/ ) ) {
    return raw;
  }

  return null;
}

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
export const SampleListEntry: React.FC<{
  name: string;
  className?: string;
}> = ( { name, className } ) => {
  const deleteSample = useDeleteSampleAction();

  const handleClickDelete = useCallback(
    ( event: React.MouseEvent ) => {
      event.preventDefault();
      event.stopPropagation();

      deleteSample( name );
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
