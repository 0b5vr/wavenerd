import { useCallback } from 'react';
import IconBin from '~icons/mdi/delete';
import { ThemeVars } from '../themes/ThemeVars';
import styled from 'styled-components';
import { useIsTruncated } from '../utils/useIsTruncated';

// == styles =======================================================================================
const Name = styled.div`
  margin-left: 4px;
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ButtonDelete = styled(IconBin)`
  display: none;
  width: 16px;
  height: 16px;
  flex-shrink: 0;

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
  const [nameRef, isTruncated] = useIsTruncated<HTMLDivElement>();

  const handleClickDelete = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      onDeleteAsset(name);
    },
    [name, onDeleteAsset],
  );

  return (
    <Root
      className={className}
    >
      <Name
        ref={nameRef}
        data-stalker={isTruncated ? name : undefined}
      >
        { name }
      </Name>
      <ButtonDelete
        onClick={handleClickDelete}
      />
    </Root>
  );
}
