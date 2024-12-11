import React, { useCallback, useState } from 'react';
import { AssetListBar } from './AssetListBar';
import { AssetListEntry } from './AssetListEntry';
import SimpleBar from 'simplebar-react';
import { ThemeVars } from '../themes/ThemeVars';
import { sanitizeAssetName } from './utils/sanitizeAssetName';
import styled from 'styled-components';

// == styles =======================================================================================
const StyledEntry = styled(AssetListEntry)`
  width: calc( 100% - 4px );
  height: 16px;
  margin: 2px;
`;

const Body = styled(SimpleBar)`
  height: 0;
  flex-basis: 0;
  flex-grow: 1;
`;

const StyledAssetListBar = styled(AssetListBar)`
  height: 24px;
`;

const DraggingOverlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: ${ThemeVars.fore};
  opacity: 0.125;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  background: ${ThemeVars.back1};
`;

// == components ===================================================================================
export const AssetListCategory: React.FC<{
  title: string;
  assets: string[];
  onLoadAsset: (name: string, file: File) => Promise<void>;
  onDeleteAsset: (name: string) => void;
  className?: string;
}> = ({ title, assets, onLoadAsset, onDeleteAsset, className }) => {
  const [expand, setExpand] = useState(true);
  const handleChangeExpand = useCallback(
    () => {
      setExpand(!expand);
    },
    [expand],
  );

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging(true);
    },
    [],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging(false);
    },
    [],
  );

  const handleLoadFile = useCallback(
    async (files: FileList) => {
      Array.from(files).forEach(async (file) => {
        const name = sanitizeAssetName(file.name.split('.')[0]);
        if (name == null) {
          throw new Error('The name of given sample file is not valid');
        }

        onLoadAsset(name, file);
      });
    },
    [onLoadAsset],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging(false);

      const files = event.dataTransfer.files;
      handleLoadFile(files);
    },
    [handleLoadFile],
  );

  return (
    <Root
      className={className}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ flexGrow: expand ? 1 : undefined }}
    >
      <StyledAssetListBar
        title={title}
        onFile={handleLoadFile}
        expand={expand}
        onChangeExpand={handleChangeExpand}
      />
      { expand && (
        <Body>
          {
            assets.map((name) => (
              <StyledEntry
                key={name}
                name={name}
                onDeleteAsset={onDeleteAsset}
              />
            ))
          }
        </Body>
      ) }
      {isDragging && <DraggingOverlay />}
    </Root>
  );
};
