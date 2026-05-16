import { useCallback, useContext, useMemo, useState } from 'react';
import { AssetListBar } from './AssetListBar';
import { AssetListEntry } from './AssetListEntry';
import SimpleBar from 'simplebar-react';
import IconNull from '~icons/mdi/circle-off-outline';
import { clsx } from 'clsx';
import { atom, useAtomValue } from 'jotai';
import { storageFileListAtom } from '../stores/atoms/storage';
import { StuffContext } from '../StuffContext';

// == microcomponent ===============================================================================
function NoAssets({ text }: { text: string }) {
  return (
    <div className="absolute left-0 top-6 right-0 bottom-0 flex flex-col justify-center items-center gap-2 text-xs text-gray">
      <IconNull className="text-2xl -rotate-90" />
      {text}
    </div>
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
    <div
      className={clsx('flex flex-col relative bg-back1', className)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ flexGrow: expand ? 1 : undefined }}
    >
      <AssetListBar
        className="h-6"
        title={title}
        onFile={handleLoadFile}
        expand={expand}
        onWipeAssets={handleWipeAssets}
        onChangeExpand={handleChangeExpand}
      />
      {expand && (
        <>
          <SimpleBar className="h-0 basis-0 grow">
            {
              assets.map((name) => (
                <AssetListEntry
                  key={name}
                  className="w-[calc(100%-4px)] h-4"
                  name={name}
                  onDeleteAsset={handleDeleteAsset}
                />
              ))
            }
          </SimpleBar>
          {
            (assets.length === 0) && (
              <NoAssets text={`No ${title}`} />
            )
          }
        </>
      )}
      {isDragging && (
        <div className="absolute inset-0 bg-fore opacity-[0.125] pointer-events-none" />
      )}
    </div>
  );
}
