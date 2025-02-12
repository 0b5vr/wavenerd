import { useCallback } from 'react';
import { headerIconStyle } from './headerIconStyle';
import styled from 'styled-components';
import IconHelpCircle from '~icons/mdi/help-circle';
import { useAtomCallback } from 'jotai/utils';
import { helpIsOpeningAtom } from '../../stores/atoms/help';

const StyledIcon = styled(IconHelpCircle)`
  ${headerIconStyle}
`;

export function HeaderIconHelp() {
  const handleClick = useAtomCallback(useCallback((_, set) => {
    set(helpIsOpeningAtom, true);
  }, []));

  return (
    <StyledIcon
      onClick={handleClick}
      data-stalker="Show help"
    />
  );
}
