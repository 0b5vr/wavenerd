import { Colors } from '../constants/Colors';
import { HeaderBPM } from './HeaderBPM';
import { HeaderBeatIndicators } from './HeaderBeatIndicators';
import { HeaderTime } from './HeaderTime';
import IconGit from '../assets/git.svg';
import React from 'react';
import WavenerdDeck from '@fms-cat/wavenerd-deck';
import styled from 'styled-components';

// == styles =======================================================================================
const Logo = styled.div`
  font: 500 24px monospace;
  line-height: 1.0;
`;

const StyledIconGit = styled( IconGit )`
  width: 32px;
  height: 32px;
  fill: ${ Colors.fore };
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;

const AnchorGit = styled.a`
  display: block;
  width: 32px;
  height: 32px;
`;

const Margin = styled.div`
  flex-grow: 1 !important;
`;

const Root = styled.div`
  display: flex;
  align-items: center;
  background: ${ Colors.back4 };

  & > * {
    margin: 0 8px;
    flex-grow: 0;
    flex-shrink: 0;
  }
`;

// == components ===================================================================================
function Header( { hostDeck, className }: {
  hostDeck: WavenerdDeck;
  className?: string;
} ): JSX.Element {
  return (
    <Root
      className={ className }
    >
      <Logo>Wavenerd</Logo>
      <HeaderTime />
      <HeaderBeatIndicators />
      <HeaderBPM
        hostDeck={ hostDeck }
      />
      <Margin />
      <AnchorGit
        href="https://github.com/FMS-Cat/wavenerd/"
        target="_blank"
        rel="noreferrer"
        data-stalker="See the source @ GitHub"
      >
        <StyledIconGit />
      </AnchorGit>
    </Root>
  );
}

export { Header };
