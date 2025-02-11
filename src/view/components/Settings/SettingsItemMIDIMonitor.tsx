import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { MIDIMAN } from '../../../MIDIManager';
import { ThemeVars } from '../../themes/ThemeVars';
import { SettingsItemBase } from './SettingsItemBase';

// == styles =======================================================================================
const MonitorBox = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-right: 8px;
  white-space: pre;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${ThemeVars.inputBack};
  font: 400 10px 'Roboto Mono', sans-serif;
`;

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
    const handleNoteOn = MIDIMAN.on('noteOn', (event) => {
      appendLog(event.channel, 'NoteOn', event.note, event.velocity, event.paramKey);
    });

    const handleNoteOff = MIDIMAN.on('noteOff', (event) => {
      appendLog(event.channel, 'NoteOff', event.note, event.velocity, event.paramKey);
    });

    const handleCC = MIDIMAN.on('cc', (event) => {
      appendLog(event.channel, 'CC', event.cc, event.value, event.paramKey);
    });

    return () => {
      MIDIMAN.off('noteOn', handleNoteOn);
      MIDIMAN.off('noteOff', handleNoteOff);
      MIDIMAN.off('cc', handleCC);
    };
  }, [appendLog]);

  return (
    <SettingsItemBase name="MIDI Monitor">
      <MonitorBox>
        {log.map((message, i) => (
          <span key={i}>{message}</span>
        ))}
      </MonitorBox>
    </SettingsItemBase>
  );
}
