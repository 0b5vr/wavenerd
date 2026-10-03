import { useState, useCallback, useEffect } from 'react';
import { MIDIMAN } from '../../../MIDIManager';
import { SettingsItemBase } from './SettingsItemBase';

// == components ===================================================================================
const MONITOR_LOG_SIZE = 5;

export function SettingsItemMIDIMonitor() {
  const [log, setLog] = useState<string[]>([...Array(MONITOR_LOG_SIZE)].fill('...'));

  const appendLog = useCallback(
    (channel: number, event: string, value1: number, value2: number, paramKey: string | null) => {
      const chStr = (channel + 1).toString().padStart(2, '0');
      const eventStr = event.padEnd(8, ' ');
      const value1Str = value1.toString().padStart(3, ' ');
      const value2Str = (127.0 * value2).toFixed().padStart(3, ' ');
      const paramKeyStr = paramKey ? `${paramKey}` : '';

      const message = `Ch.${chStr} ${eventStr} ${value1Str} ${value2Str} ${paramKeyStr}`;

      setLog((prev) => [...prev, message].slice(-MONITOR_LOG_SIZE));
    },
    [],
  );

  useEffect(() => {
    const unsubscribeNoteOn = MIDIMAN.onNoteOn.subscribe((event) => {
      appendLog(event.channel, 'NoteOn', event.note, event.velocity, event.paramKey);
    });

    const unsubscribeNoteOff = MIDIMAN.onNoteOff.subscribe((event) => {
      appendLog(event.channel, 'NoteOff', event.note, event.velocity, event.paramKey);
    });

    const unsubscribeCC = MIDIMAN.onCC.subscribe((event) => {
      appendLog(event.channel, 'CC', event.cc, event.value, event.paramKey);
    });

    return () => {
      unsubscribeNoteOn();
      unsubscribeNoteOff();
      unsubscribeCC();
    };
  }, [appendLog]);

  return (
    <SettingsItemBase name="MIDI Monitor">
      <div className="grow flex flex-col mr-2 whitespace-pre py-1 px-2 rounded bg-input-back text-[10px] font-normal font-mono">
        {log.map((message, i) => (
          <span key={i}>{message}</span>
        ))}
      </div>
    </SettingsItemBase>
  );
}
