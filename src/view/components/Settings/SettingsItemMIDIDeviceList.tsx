import { useAtomValue } from 'jotai';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { MIDIMAN } from '../../../MIDIManager';
import { midiDevicesSortedAtom } from '../../stores/atoms/midi';
import { SettingsItemBase } from './SettingsItemBase';
import SimpleBar from 'simplebar-react';

// == components ===================================================================================
function MidiDeviceListItem({ deviceId, deviceName }: { deviceId: string; deviceName: string }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    MIDIMAN.on('message', (event) => {
      if (event.deviceId === deviceId) {
        setMessageIndex((i) => i + 1);
      }
    });
  }, [deviceId]);

  return (
    <div className="flex items-center gap-1 pl-1">
      <div
        key={messageIndex}
        className={clsx(
          'w-1.25 h-1.25 rounded-[2.5px] bg-modal-bg',
          messageIndex > 0 && 'animate-[step-end_indicator-blink_0.2s_forwards]',
        )}
      />
      {deviceName}
    </div>
  );
}

export function SettingsItemMIDIDeviceList() {
  const devices = useAtomValue(midiDevicesSortedAtom);

  return (
    <SettingsItemBase name="Detected Devices">
      <SimpleBar className="grow flex flex-col mr-2 h-30 py-1 px-2 rounded bg-input-back text-[10px] font-normal font-['Roboto_Mono']">
        {devices.map(({ deviceId, deviceName }) => (
          <MidiDeviceListItem
            key={deviceId}
            deviceId={deviceId}
            deviceName={deviceName}
          />
        ))}
      </SimpleBar>
    </SettingsItemBase>
  );
}
