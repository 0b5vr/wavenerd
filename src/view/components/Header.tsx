import styled, { css } from 'styled-components';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { Colors } from '../constants/Colors';
import { HeaderBPM } from './HeaderBPM';
import { HeaderBeatIndicators } from './HeaderBeatIndicators';
import { HeaderNudge } from './HeaderNudge';
import { HeaderTime } from './HeaderTime';
import { HeaderTransport } from './HeaderTransport';
import IconBBox from '~icons/mdi/alpha-b-box';
import IconGitHub from '~icons/mdi/github';
import IconHelp from '~icons/mdi/help-circle';
import IconSettings from '~icons/mdi/cog';
import React from 'react';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { deckShowBState } from '../states/deck';
import { helpIsOpeningState } from '../states/help';
import { settingsIsOpeningState } from '../states/settings';

// == styles =======================================================================================
const Logo = styled.div`
  font: 400 24px 'Poppins', sans-serif;
  line-height: 1;
  margin-left: 8px;
`;

const StyledHeaderTransport = styled( HeaderTransport )`
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

const StyledHeaderNudge = styled( HeaderNudge )`
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

const StyledIconSettings = styled( IconSettings )`
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

  const handleClickSettings = useRecoilCallback(
    ( { set } ) => () => {
      set( settingsIsOpeningState, true );
    },
    [],
  );

  return (
    <Root
      className={ className }
    >
      <Logo>Wavenerd</Logo>
      <StyledHeaderTransport
        hostDeck={ hostDeck }
      />
      <StyledHeaderTime />
      <StyledHeaderBeatIndicators />
      <StyledHeaderBPM
        hostDeck={ hostDeck }
      />
      <StyledHeaderNudge
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
      <StyledIconSettings
        onClick={ handleClickSettings }
        data-stalker="Settings"
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
