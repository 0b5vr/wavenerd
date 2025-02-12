import styled from 'styled-components';
import { ThemeVars } from '../../themes/ThemeVars';
import IconCloseOctagon from '~icons/mdi/close-octagon';
import { headerIconStyle } from './headerIconStyle';
import { settingsCategoryAtom, settingsIsOpeningAtom } from '../../stores/atoms/settings';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';

const StyledIcon = styled(IconCloseOctagon)`
  ${headerIconStyle}
  color: ${ThemeVars.error};
`;

export function HeaderIconUnknown({ name }: { name: string }) {
  const handleClick = useAtomCallback(useCallback((_, set) => {
    set(settingsIsOpeningAtom, true);
    set(settingsCategoryAtom, 'appearance');
  }, []));

  return (
    <StyledIcon
      onClick={handleClick}
      data-stalker={`Unknown header icon: ${name}. Check the settings to make sure it's a valid icon.`}
    />
  );
}
