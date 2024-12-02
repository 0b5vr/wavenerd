import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { HeaderBPM } from './HeaderBPM';
import { HeaderBeatIndicators } from './HeaderBeatIndicators';
import { HeaderNudge } from './HeaderNudge';
import { HeaderTime } from './HeaderTime';
import { HeaderTransport } from './HeaderTransport';
import IconBBox from '~icons/mdi/alpha-b-box';
import IconGitHub from '~icons/mdi/github';
import IconHelp from '~icons/mdi/help-circle';
import IconMIDI from '~icons/mdi/midi-port';
import IconSettings from '~icons/mdi/cog';
import { ThemeVars } from '../themes/ThemeVars';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { deckShowBAtom } from '../stores/atoms/deck';
import { helpIsOpeningAtom } from '../stores/atoms/help';
import { midiModalIsOpeningAtom } from '../stores/atoms/midi';
import { settingsIsOpeningAtom } from '../stores/atoms/settings';
import { useAtomCallback } from 'jotai/utils';
import { useAtomValue } from 'jotai';

// == styles =======================================================================================
const Logo = styled.div`
  font: 400 24px 'Poppins', sans-serif;
  line-height: 1;
  margin-left: 8px;
`;

const StyledHeaderTransport = styled(HeaderTransport)`
  margin-left: 8px;
`;

const StyledHeaderTime = styled(HeaderTime)`
  margin-left: 8px;
`;

const StyledHeaderBeatIndicators = styled(HeaderBeatIndicators)`
  margin-left: 8px;
`;

const StyledHeaderBPM = styled(HeaderBPM)`
  margin-left: 8px;
`;

const StyledHeaderNudge = styled(HeaderNudge)`
  margin-left: 8px;
`;

const StyleIcon = css`
  width: 24px;
  height: 24px;
  margin: 4px 4px 4px 0;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;

const StyledIconBBox = styled(IconBBox)`
  ${StyleIcon};
`;

const StyledIconSettings = styled(IconSettings)`
  ${StyleIcon};
`;

const StyledIconMIDI = styled(IconMIDI)`
  ${StyleIcon};
`;

const StyledIconHelp = styled(IconHelp)`
  ${StyleIcon};
`;

const StyledIconGitHub = styled(IconGitHub)`
  ${StyleIcon};
`;

const AnchorGit = styled.a`
  display: block;
  height: 32px;
  color: ${ThemeVars.headerFg};
`;

const Margin = styled.div`
  flex-grow: 1 !important;
`;

const Root = styled.div`
  display: flex;
  align-items: center;
  background: ${ThemeVars.headerBg};
  color: ${ThemeVars.headerFg};
  border-bottom: solid 2px ${ThemeVars.back1};
  box-sizing: content-box;

  & > * {
    flex-grow: 0;
    flex-shrink: 0;
  }
`;

// == components ===================================================================================
export const Header: React.FC<{
  hostDeck: WavenerdDeck;
  className?: string;
}> = ({ hostDeck, className }) => {
  const showB = useAtomValue(deckShowBAtom);

  const handleClickToggleB = useAtomCallback(useCallback((get, set) => {
    set(deckShowBAtom, !get(deckShowBAtom));
  }, []));

  const handleClickMIDI = useAtomCallback(useCallback((_, set) => {
    set(midiModalIsOpeningAtom, true);
  }, []));

  const handleClickHelp = useAtomCallback(useCallback((_, set) => {
    set(helpIsOpeningAtom, true);
  }, []));

  const handleClickSettings = useAtomCallback(useCallback((_, set) => {
    set(settingsIsOpeningAtom, true);
  }, []));

  return (
    <Root
      className={className}
    >
      <Logo>Wavenerd</Logo>
      <StyledHeaderTransport
        hostDeck={hostDeck}
      />
      <StyledHeaderTime />
      <StyledHeaderBeatIndicators />
      <StyledHeaderBPM
        hostDeck={hostDeck}
      />
      <StyledHeaderNudge
        hostDeck={hostDeck}
      />
      <Margin />
      <StyledIconBBox
        onClick={handleClickToggleB}
        style={{ opacity: showB ? 1.0 : 0.5 }}
        data-stalker="Toggle Deck B"
      />
      <StyledIconMIDI
        onClick={handleClickMIDI}
        data-stalker="MIDI"
      />
      <StyledIconSettings
        onClick={handleClickSettings}
        data-stalker="Settings"
      />
      <StyledIconHelp
        onClick={handleClickHelp}
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
