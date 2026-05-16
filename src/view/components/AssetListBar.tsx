import { useCallback } from 'react';
import IconBin from '~icons/mdi/delete';
import IconChevronDown from '~icons/mdi/chevron-down';
import IconChevronRight from '~icons/mdi/chevron-right';
import IconFolder from '~icons/mdi/folder';
import { clsx } from 'clsx';

// == styles =======================================================================================
const iconCls = 'w-4 h-4 m-0.5 shrink-0 cursor-pointer hover:opacity-80 active:opacity-60';

// == components ===================================================================================
export function AssetListBar({
  title,
  onFile,
  expand,
  onWipeAssets,
  onChangeExpand,
  className,
}: {
  title: string;
  onFile: (files: FileList) => void;
  expand: boolean;
  onWipeAssets: () => void;
  onChangeExpand: () => void;
  className?: string;
}) {
  const handleClickOpen = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.onchange = () => {
        if (input.files) {
          onFile?.(input.files);
        }
      };
      input.click();
    },
    [onFile],
  );

  const handleClickWipe = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      onWipeAssets();
    },
    [onWipeAssets],
  );

  const ChevronIcon = expand ? IconChevronDown : IconChevronRight;

  return (
    <div className={clsx('flex pr-1 items-center bg-bar-bg text-bar-fg leading-none', className)}>
      <ChevronIcon className={iconCls} onClick={onChangeExpand} />
      <div className="ml-1 grow shrink">{ title }</div>
      <IconFolder
        className={iconCls}
        onClick={handleClickOpen}
        data-stalker="Open local file... (you can also drag and drop)"
      />
      <IconBin
        className={iconCls}
        onClick={handleClickWipe}
        data-stalker="Delete all assets"
      />
    </div>
  );
}
