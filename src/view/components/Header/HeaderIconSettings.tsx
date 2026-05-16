import { useCallback } from 'react';
import { headerIconCls } from './headerIconCls';
import { clsx } from 'clsx';
import IconCog from '~icons/mdi/cog';
import { useAtomCallback } from 'jotai/utils';
import { settingsIsOpeningAtom } from '../../stores/atoms/settings';

export function HeaderIconSettings({ hidden }: { hidden?: boolean }) {
  const handleClick = useAtomCallback(useCallback((_, set) => {
    set(settingsIsOpeningAtom, true);
  }, []));

  return (
    <IconCog
      className={clsx(headerIconCls, hidden && 'opacity-0')}
      onClick={handleClick}
      data-stalker="Settings"
    />
  );
}
