import { useAtomValue } from 'jotai';
import { useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { MIDIMAN } from '../../../MIDIManager';
import { midiMappingsSortedAtom } from '../../stores/atoms/midi';
import { SettingsItemBase } from './SettingsItemBase';
import IconClose from '~icons/mdi/close';
import SimpleBar from 'simplebar-react';

// == components ===================================================================================
function MappingItem({ midiKey, paramKey }: { midiKey: string; paramKey: string }) {
  const [eventIndex, setEventIndex] = useState(0);

  useEffect(() => {
    MIDIMAN.on('paramChange', ({ midiKey: eventMidiKey }) => {
      if (eventMidiKey === midiKey) {
        setEventIndex((i) => i + 1);
      }
    });
  }, [midiKey]);

  const handleClickRemove = useCallback(() => {
    MIDIMAN.unassignMapping(midiKey);
  }, [midiKey]);

  return (
    <div className="flex items-center gap-1 pl-1">
      <div
        key={eventIndex}
        className={clsx(
          'w-1.25 h-1.25 rounded-[2.5px] bg-modal-bg',
          eventIndex > 0 && 'animate-[step-end_indicator-blink_0.2s_forwards]',
        )}
      />
      <div className="w-14">{midiKey}</div>
      <IconClose
        className="w-3 h-3 cursor-pointer text-gray hover:opacity-80"
        onClick={handleClickRemove}
        data-stalker="Remove mapping"
      />
      {`${paramKey}`}
    </div>
  );
}

export function SettingsItemMIDIMappings() {
  const mappings = useAtomValue(midiMappingsSortedAtom);

  return (
    <SettingsItemBase name="MIDI Mappings">
      <SimpleBar className="grow flex flex-col mr-2 h-60 py-1 px-2 rounded bg-input-back text-[10px] font-normal font-['Roboto_Mono']">
        {mappings.map(([midiKey, paramKey]) => (
          <MappingItem key={midiKey} midiKey={midiKey} paramKey={paramKey} />
        ))}
      </SimpleBar>
    </SettingsItemBase>
  );
}
