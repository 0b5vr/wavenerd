import { useCallback, useContext, useMemo, useState } from 'react';
import { AssetListBar } from './AssetListBar';
import { AssetListEntry } from './AssetListEntry';
import SimpleBar from 'simplebar-react';
import { ThemeVars } from '../themes/ThemeVars';
import styled from 'styled-components';
import IconNull from '~icons/mdi/circle-off-outline';
import { atom, useAtomValue } from 'jotai';
import { storageFileListAtom } from '../stores/atoms/storage';
import { StuffContext } from '../StuffContext';

// == styles =======================================================================================
const NoAssetsIcon = styled(IconNull)`
  font-size: 24px;
  transform: rotate(-90deg);
`;

const NoAssetsContainer = styled.div`
  position: absolute;
  left: 0;
  top: 24px;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${ThemeVars.gray};
`;

const StyledEntry = styled(AssetListEntry)`
  width: calc( 100% - 4px );
  height: 16px;
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
  pointer-events: none;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  background: ${ThemeVars.back1};
`;

// == microcomponent ===============================================================================
function NoAssets({ text }: { text: string }) {
  return (
    <NoAssetsContainer>
      <NoAssetsIcon />
      {text}
    </NoAssetsContainer>
  );
}

// == components ===================================================================================
export function AssetListCategory({
  title,
  dir,
  className,
}: {
  title: string;
  dir: string;
  className?: string;
}) {
  const { storageManager } = useContext(StuffContext)!;

  const assetsAtom = useMemo(() => atom((get) => {
    const fileList = get(storageFileListAtom);
    const array = Array.from(fileList).filter((name) => name.startsWith(`${dir}/`));
    array.sort();
    return array.map((name) => name.substring(dir.length + 1));
  }), [dir]);
  const assets = useAtomValue(assetsAtom);

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
        storageManager.save(`${dir}/${file.name}`, file);
      });
    },
    [dir, storageManager],
  );

  const handleDeleteAsset = useCallback((name: string) => {
    storageManager.delete(`${dir}/${name}`);
  }, [dir, storageManager]);

  const handleWipeAssets = useCallback(() => {
    const sure = confirm(`Are you sure you want to delete all ${title.toLowerCase()}?`);
    if (sure) {
      for (const name of assets) {
        storageManager.delete(`${dir}/${name}`);
      }
    }
  }, [assets, dir, storageManager, title]);

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
        onWipeAssets={handleWipeAssets}
        onChangeExpand={handleChangeExpand}
      />
      {expand && (
        <>
          <Body>
            {
              assets.map((name) => (
                <StyledEntry
                  key={name}
                  name={name}
                  onDeleteAsset={handleDeleteAsset}
                />
              ))
            }
          </Body>
          {
            (assets.length === 0) && (
              <NoAssets text={`No ${title}`} />
            )
          }
        </>
      )}
      {isDragging && <DraggingOverlay />}
    </Root>
  );
}
