import { headerIconCls } from './headerIconCls';
import IconCloseOctagon from '~icons/mdi/close-octagon';
import { settingsCategoryAtom, settingsIsOpeningAtom } from '../../stores/atoms/settings';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';

export function HeaderIconUnknown({ name }: { name: string }) {
  const handleClick = useAtomCallback(useCallback((_, set) => {
    set(settingsIsOpeningAtom, true);
    set(settingsCategoryAtom, 'appearance');
  }, []));

  return (
    <IconCloseOctagon
      className={`${headerIconCls} text-error`}
      onClick={handleClick}
      data-stalker={`Unknown header icon: ${name}. Check the settings to make sure it's a valid icon.`}
    />
  );
}
