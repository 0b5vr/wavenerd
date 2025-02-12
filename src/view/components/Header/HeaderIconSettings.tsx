import { useCallback } from 'react';
import { headerIconStyle } from './headerIconStyle';
import styled, { css } from 'styled-components';
import IconCog from '~icons/mdi/cog';
import { useAtomCallback } from 'jotai/utils';
import { settingsIsOpeningAtom } from '../../stores/atoms/settings';

const StyledIcon = styled(IconCog)<{ isHidden?: boolean }>`
  ${headerIconStyle}

  ${({ isHidden }) => isHidden && css`
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
      isHidden={hidden}
      data-stalker="Settings"
    />
  );
}
