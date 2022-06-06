import styled, { css } from 'styled-components';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { Colors } from '../constants/Colors';
import { HeaderBPM } from './HeaderBPM';
import { HeaderBeatIndicators } from './HeaderBeatIndicators';
import { HeaderTime } from './HeaderTime';
import IconBBox from '~icons/mdi/alpha-b-box';
import IconGitHub from '~icons/mdi/github';
import IconHelp from '~icons/mdi/help-circle';
import React from 'react';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { deckShowBState } from '../states/deck';
import { helpIsOpeningState } from '../states/help';

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
  width: 24px;
  height: 24px;
  margin: 4px 4px 4px 0;
  color: ${ Colors.fore };
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;

const StyledIconBBox = styled( IconBBox )`
  ${ StyleIcon };
`;

const StyledIconHelp = styled( IconHelp )`
  ${ StyleIcon };
`;

const StyledIconGitHub = styled( IconGitHub )`
  ${ StyleIcon };
`;

const AnchorGit = styled.a`
  display: block;
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
export const Header: React.FC<{
  hostDeck: WavenerdDeck;
  className?: string;
}> = ( { hostDeck, className } ) => {
  const showB = useRecoilValue( deckShowBState );

  const handleClickToggleB = useRecoilCallback(
    ( { set, snapshot } ) => async () => {
      const current = await snapshot.getPromise( deckShowBState );
      set( deckShowBState, !current );
    },
    [],
  );

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
      <StyledIconBBox
        onClick={ handleClickToggleB }
        style={ { color: showB ? Colors.fore : Colors.gray } }
        data-stalker="Toggle Deck B"
      />
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
        <StyledIconGitHub />
      </AnchorGit>
    </Root>
  );
};
