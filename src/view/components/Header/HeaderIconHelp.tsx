import { useCallback } from 'react';
import { headerIconStyle } from './headerIconStyle';
import styled from 'styled-components';
import IconHelpCircle from '~icons/mdi/help-circle';

const HELP_URL = 'https://github.com/0b5vr/wavenerd/blob/release/guides/help.md';

const StyledIcon = styled(IconHelpCircle)`
  ${headerIconStyle}
`;

export function HeaderIconHelp() {
  const handleClick = useCallback(() => {
    window.open(HELP_URL, '_blank', 'noreferrer');
  }, []);

  return (
    <StyledIcon
      onClick={handleClick}
      data-stalker="Show help"
    />
  );
}
