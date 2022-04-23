import React, { useCallback } from 'react';
import { Colors } from '../constants/Colors';
import { ReactComponent as IconFolder } from '../assets/folder.svg';
import styled from 'styled-components';

// == utils ========================================================================================
export function sanitizeSampleName( raw: string ): string | null {
  if ( raw.match( /^[0-9a-zA-Z_]+$/ ) ) {
    return raw;
  }

  return null;
}

// == styles =======================================================================================
const Title = styled.div`
  margin-left: 4px;
  flex-grow: 1;
  flex-shrink: 1;
`;

const ButtonOpen = styled( IconFolder )`
  width: 24px;
  height: 24px;

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
  background: ${ Colors.back4 };
  font: 500 16px monospace;

  * {
    flex-shrink: 0;
  }
`;

// == components ===================================================================================
export const SampleListBar: React.FC<{
  onFile?: ( files: FileList ) => void;
  className?: string;
}> = ( { onFile, className } ) => {
  const handleClickOpen = useCallback(
    ( event: React.MouseEvent ) => {
      event.preventDefault();
      event.stopPropagation();

      const input = document.createElement( 'input' );
      input.type = 'file';
      input.multiple = true;
      input.onchange = () => {
        if ( input.files ) {
          onFile && onFile( input.files );
        }
      };
      input.click();
    },
    []
  );

  return (
    <Root
      className={ className }
    >
      <Title>Samples</Title>
      <ButtonOpen
        onClick={ handleClickOpen }
      />
    </Root>
  );
};
