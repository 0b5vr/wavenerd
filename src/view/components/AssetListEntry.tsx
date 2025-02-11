import { useCallback } from 'react';
import IconBin from '~icons/mdi/delete';
import { ThemeVars } from '../themes/ThemeVars';
import styled from 'styled-components';

// == styles =======================================================================================
const Name = styled.div`
  margin-left: 4px;
  flex-grow: 1;
  flex-shrink: 1;
`;

const ButtonDelete = styled(IconBin)`
  display: none;
  width: 16px;
  height: 16px;
  margin-right: 8px;

  fill: ${ThemeVars.fore};
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
  font-size: 12px;

  * {
    flex-shrink: 0;
  }

  &:hover ${ButtonDelete} {
    display: block;
  }
`;

// == components ===================================================================================
export function AssetListEntry({
  name,
  onDeleteAsset,
  className,
}: {
  name: string;
  onDeleteAsset: (name: string) => void;
  className?: string;
}) {
  const handleClickDelete = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      onDeleteAsset(name);
    },
    [name],
  );

  return (
    <Root
      className={className}
    >
      <Name>{ name }</Name>
      <ButtonDelete
        onClick={handleClickDelete}
      />
    </Root>
  );
}
