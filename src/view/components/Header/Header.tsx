import { useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { HeaderBPM } from './HeaderBPM';
import { HeaderBeatNumber } from './HeaderBeatNumber';
import { HeaderNudge } from './HeaderNudge';
import { HeaderTime } from './HeaderTime';
import { HeaderTransport } from './HeaderTransport';
import IconCasette from '~icons/mdi/cassette';
import IconHelp from '~icons/mdi/help-circle';
import IconMidiPort from '~icons/mdi/midi-port';
import IconSettings from '~icons/mdi/cog';
import { ThemeVars } from '../../themes/ThemeVars';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { helpIsOpeningAtom } from '../../stores/atoms/help';
import { midiIndicatorAtom } from '../../stores/atoms/midi';
import { useAtomCallback } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { Recorder } from '../../../audio/Recorder';
import { recorderIsRecordingAtom } from '../../stores/atoms/recorder';
import { settingsCategoryAtom, settingsIsOpeningAtom } from '../../stores/atoms/settings';
import { useSettings } from '../../stores/hooks/useSettings';
import { HeaderLogo } from './HeaderLogo';
import { HeaderUnknown } from './HeaderUnknown';
import { HeaderBeatHex } from './HeaderBeatHex';
import { HeaderBeatDots } from './HeaderBeatDots';

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

const StyledIconCasette = styled(IconCasette)`
  ${StyleIcon};
`;

const StyledIconSettings = styled(IconSettings)`
  ${StyleIcon};
`;

const StyledIconMIDI = styled(IconMidiPort)`
  ${StyleIcon};
`;

const StyledIconHelp = styled(IconHelp)`
  ${StyleIcon};
`;

const Margin = styled.div`
  flex-grow: 1 !important;
`;

const Left = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 8px;
  gap: 16px;
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

  const handleClickRecord = useCallback(() => {
    if (recorder.isRecording) {
      recorder.stop();
    } else {
      recorder.start();
    }
  }, [recorder]);

  const handleClickMIDI = useAtomCallback(useCallback((_, set) => {
    set(settingsIsOpeningAtom, true);
    set(settingsCategoryAtom, 'midi');
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
          } else if (item === 'beat-hex') {
            return <HeaderBeatHex key={i} />;
          } else if (item === 'beat-dots') {
            return <HeaderBeatDots key={i} />;
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
    </Root>
  );
}
