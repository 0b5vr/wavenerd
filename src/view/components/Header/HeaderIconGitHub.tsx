import { headerIconStyle } from './headerIconStyle';
import styled from 'styled-components';
import IconGitHub from '~icons/mdi/github';
import { ThemeVars } from '../../themes/ThemeVars';

const StyledIcon = styled(IconGitHub)`
  ${headerIconStyle}
`;

const AnchorGitHub = styled.a`
  display: block;
  height: 32px;
  color: ${ThemeVars.headerFg};
`;

export function HeaderIconGitHub() {
  return (
    <AnchorGitHub
      href="https://github.com/0b5vr/wavenerd/"
      target="_blank"
      rel="noreferrer"
      data-stalker="See the source @ GitHub"
    >
      <StyledIcon />
    </AnchorGitHub>
  );
}
