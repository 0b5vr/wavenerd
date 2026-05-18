import { useCallback } from 'react';
import { headerIconCls } from './headerIconCls';
import IconMidiPort from '~icons/mdi/midi-port';
import { useAtomCallback } from 'jotai/utils';
import { settingsCategoryAtom, settingsIsOpeningAtom } from '../../stores/atoms/settings';
import { useAtomValue } from 'jotai';
import { midiIndicatorAtom } from '../../stores/atoms/midi';

export function HeaderIconMIDI() {
  const midiIndicator = useAtomValue(midiIndicatorAtom);

  const handleClick = useAtomCallback(useCallback((_, set) => {
    set(settingsIsOpeningAtom, true);
    set(settingsCategoryAtom, 'midi');
  }, []));

  return (
    <IconMidiPort
      className={headerIconCls}
      onClick={handleClick}
      style={{ opacity: midiIndicator ? 1.0 : 0.5 }}
      data-stalker="MIDI"
    />
  );
}
