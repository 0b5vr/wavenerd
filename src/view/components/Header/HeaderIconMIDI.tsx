import { useCallback } from 'react';
import { headerIconStyle } from './headerIconStyle';
import styled from 'styled-components';
import IconMidiPort from '~icons/mdi/midi-port';
import { useAtomCallback } from 'jotai/utils';
import { settingsCategoryAtom, settingsIsOpeningAtom } from '../../stores/atoms/settings';
import { useAtomValue } from 'jotai';
import { midiIndicatorAtom } from '../../stores/atoms/midi';

const StyledIcon = styled(IconMidiPort)`
  ${headerIconStyle}
`;

export function HeaderIconMIDI() {
  const midiIndicator = useAtomValue(midiIndicatorAtom);

  const handleClick = useAtomCallback(useCallback((_, set) => {
    set(settingsIsOpeningAtom, true);
    set(settingsCategoryAtom, 'midi');
  }, []));

  return (
    <StyledIcon
      onClick={handleClick}
      style={{ opacity: midiIndicator ? 1.0 : 0.5 }}
      data-stalker="MIDI"
    />
  );
}
