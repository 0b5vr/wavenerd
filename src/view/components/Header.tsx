import styled, { css } from 'styled-components';
import { Colors } from '../constants/Colors';
import { HeaderBPM } from './HeaderBPM';
import { HeaderBeatIndicators } from './HeaderBeatIndicators';
import { HeaderTime } from './HeaderTime';
import IconGit from '../assets/git.svg';
import IconHelp from '../assets/help.svg';
import React from 'react';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { helpIsOpeningState } from '../states/help';
import { useRecoilCallback } from 'recoil';

// == styles =======================================================================================
const Logo = styled.div`
  font: 500 24px monospace;
  line-height: 1.0;
  margin-left: 8px;
`;

const StyledHeaderTime = styled( HeaderTime )`
  margin-left: 8px;
`;

const StyledHeaderBeatIndicators = styled( HeaderBeatIndicators )`
  margin-left: 8px;
`;

const StyledHeaderBPM = styled( HeaderBPM )`
  margin-left: 8px;
`;

const StyleIcon = css`
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

const StyledIconHelp = styled( IconHelp )`
  ${ StyleIcon };
`;

const StyledIconGit = styled( IconGit )`
  ${ StyleIcon };
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
    flex-grow: 0;
    flex-shrink: 0;
  }
`;

// == components ===================================================================================
function Header( { hostDeck, className }: {
  hostDeck: WavenerdDeck;
  className?: string;
} ): JSX.Element {
  const handleClickHelp = useRecoilCallback(
    ( { set } ) => () => {
      set( helpIsOpeningState, true );
    },
    []
  );

  return (
    <Root
      className={ className }
    >
      <Logo>Wavenerd</Logo>
      <StyledHeaderTime />
      <StyledHeaderBeatIndicators />
      <StyledHeaderBPM
        hostDeck={ hostDeck }
      />
      <Margin />
      <StyledIconHelp
        onClick={ handleClickHelp }
        data-stalker="Show help"
      />
      <AnchorGit
        href="https://github.com/0b5vr/wavenerd/"
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
