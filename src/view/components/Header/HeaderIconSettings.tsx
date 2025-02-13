import { useCallback } from 'react';
import { headerIconStyle } from './headerIconStyle';
import styled, { css } from 'styled-components';
import IconCog from '~icons/mdi/cog';
import { useAtomCallback } from 'jotai/utils';
import { settingsIsOpeningAtom } from '../../stores/atoms/settings';

const StyledIcon = styled(IconCog)<{ hidden?: boolean }>`
  ${headerIconStyle}

  ${({ hidden }) => hidden && css`
    opacity: 0.0;
  `}
`;

export function HeaderIconSettings({ hidden }: { hidden?: boolean }) {
  const handleClick = useAtomCallback(useCallback((_, set) => {
    set(settingsIsOpeningAtom, true);
  }, []));

  return (
    <StyledIcon
      onClick={handleClick}
      hidden={hidden}
      data-stalker="Settings"
    />
  );
}
