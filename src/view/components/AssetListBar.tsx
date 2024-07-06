import React, { useCallback } from 'react';
import IconChevronDown from '~icons/mdi/chevron-down';
import IconChevronRight from '~icons/mdi/chevron-right';
import IconFolder from '~icons/mdi/folder';
import { ThemeVars } from '../themes/ThemeVars';
import styled from 'styled-components';

// == styles =======================================================================================
const Title = styled.div`
  margin-left: 4px;
  flex-grow: 1;
  flex-shrink: 1;
`;

const IconButton = styled.svg`
  width: 20px;
  height: 20px;
  margin: 2px;

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
  background: ${ ThemeVars.back3 };
  font: 400 16px 'Roboto', sans-serif;
  line-height: 1;

  * {
    flex-shrink: 0;
  }
`;

// == components ===================================================================================
export const AssetListBar: React.FC<{
  title: string;
  onFile: ( files: FileList ) => void;
  expand: boolean;
  onChangeExpand: () => void;
  className?: string;
}> = ( { title, onFile, expand, onChangeExpand, className } ) => {
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
      <IconButton
        as={ expand ? IconChevronDown : IconChevronRight }
        onClick={ onChangeExpand }
      />
      <Title>{ title }</Title>
      <IconButton
        as={ IconFolder }
        onClick={ handleClickOpen }
        data-stalker="Open local file... (you can also drag and drop)"
      />
    </Root>
  );
};
