import React, { useCallback } from 'react';
import { Colors } from '../constants/Colors';
import IconBin from '../assets/bin.svg';
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
function SampleListEntry( { name, className }: {
  name: string;
  className?: string;
} ): JSX.Element {
  const deleteSample = useDeleteSampleAction();

  const handleClickDelete = useCallback(
    ( event: React.DragEvent<HTMLDivElement> ) => {
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
}

export { SampleListEntry };
