import { useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { HeaderBPM } from './HeaderBPM';
import { HeaderBeatNumber } from './HeaderBeatNumber';
import { HeaderNudge } from './HeaderNudge';
import { HeaderTime } from './HeaderTime';
import { HeaderTransport } from './HeaderTransport';
import IconCasette from '~icons/mdi/cassette';
import IconBBox from '~icons/mdi/alpha-b-box';
import IconGitHub from '~icons/mdi/github';
import IconHelp from '~icons/mdi/help-circle';
import IconMIDI from '~icons/mdi/midi-port';
import IconSettings from '~icons/mdi/cog';
import { ThemeVars } from '../../themes/ThemeVars';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { helpIsOpeningAtom } from '../../stores/atoms/help';
import { midiIndicatorAtom, midiModalIsOpeningAtom } from '../../stores/atoms/midi';
import { useAtomCallback } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { Recorder } from '../../../audio/Recorder';
import { recorderIsRecordingAtom } from '../../stores/atoms/recorder';
import { settingsIsOpeningAtom } from '../../stores/atoms/settings';
import { useSettings } from '../../stores/hooks/useSettings';
import { SETTINGSMAN } from '../../../SettingsManager';
import { HeaderLogo } from './HeaderLogo';
import { HeaderUnknown } from './HeaderUnknown';

// == styles =======================================================================================
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

const StyledIconCasette = styled(IconCasette)`
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

const Left = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 8px;
  gap: 8px;
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
export function Header({
  hostDeck,
  recorder,
  className,
}: {
  hostDeck: WavenerdDeck;
  recorder: Recorder;
  className?: string;
}) {
  const headerItems = useSettings('headerItems');
  const headerItemsArray = useMemo(() => headerItems.split(','), [headerItems]);

  const midiIndicator = useAtomValue(midiIndicatorAtom);
  const recorderIsRecording = useAtomValue(recorderIsRecordingAtom);

  const deckBShow = useSettings('deckBShow');

  const handleClickRecord = useCallback(() => {
    if (recorder.isRecording) {
      recorder.stop();
    } else {
      recorder.start();
    }
  }, [recorder]);

  const handleClickToggleB = useCallback(() => {
    SETTINGSMAN.set('deckBShow', !SETTINGSMAN.values.deckBShow);
  }, []);

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
      <Left>
        {headerItemsArray.map((item, i) => {
          if (item === 'logo') {
            return <HeaderLogo key={i} />;
          } else if (item === 'transport') {
            return <HeaderTransport key={i} hostDeck={hostDeck} />;
          } else if (item === 'time') {
            return <HeaderTime key={i} />;
          } else if (item === 'beat-number') {
            return <HeaderBeatNumber key={i} />;
          } else if (item === 'bpm') {
            return <HeaderBPM key={i} hostDeck={hostDeck} />;
          } else if (item === 'nudge') {
            return <HeaderNudge key={i} hostDeck={hostDeck} />;
          } else {
            return <HeaderUnknown key={i} name={item} />;
          }
        })}
      </Left>

      <Margin />

      <StyledIconBBox
        onClick={handleClickToggleB}
        style={{ opacity: deckBShow ? 1.0 : 0.5 }}
        data-stalker="Toggle Deck B"
      />
      <StyledIconCasette
        onClick={handleClickRecord}
        style={{ color: recorderIsRecording ? ThemeVars.error : 'inherit' }}
        data-stalker={recorderIsRecording ? 'Recording... Click to stop' : 'Record'}
      />
      <StyledIconMIDI
        onClick={handleClickMIDI}
        style={{ opacity: midiIndicator ? 1.0 : 0.5 }}
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
}
