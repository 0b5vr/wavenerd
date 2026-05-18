import { useCallback } from 'react';
import IconBin from '~icons/mdi/delete';
import clsx from 'clsx';
import { useIsTruncated } from '../utils/useIsTruncated';

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
    <div className={clsx('group flex items-center text-xs', className)}>
      <div
        ref={nameRef}
        className="ml-1 grow shrink min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
        data-stalker={isTruncated ? name : undefined}
      >
        { name }
      </div>
      <IconBin
        className="hidden group-hover:block w-4 h-4 shrink-0 fill-fore cursor-pointer hover:opacity-80 active:opacity-60"
        onClick={handleClickDelete}
      />
    </div>
  );
}
