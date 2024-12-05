import React, { useCallback, useEffect, useState } from 'react';
import { MIDIMAN } from '../../MIDIManager';
import { Modal } from './Modal';
import { ThemeVars } from '../themes/ThemeVars';
import { midiModalIsOpeningAtom } from '../stores/atoms/midi';
import styled from 'styled-components';
import { useAtom } from 'jotai';

// == styles =======================================================================================
const Description = styled.p`
  font-size: 12px;
  margin: 8px 0;
`;

const Header = styled.h2`
  font-size: 16px;
  margin: 16px 0 8px;
`;

const MonitorBox = styled.div`
  display: flex;
  flex-direction: column;
  white-space: pre;
  width: 100%;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${ThemeVars.inputBack};
  font: 400 10px 'Roboto Mono', sans-serif;
`;

// == children =====================================================================================
function MIDIMonitor(): JSX.Element {
  const [log, setLog] = useState<string[]>([...Array(10)].fill('...'));

  const appendLog = useCallback(
    (channel: number, event: string, value1: number, value2: number, paramKey: string | null) => {
      const chStr = (channel + 1).toString().padStart(2, '0');
      const eventStr = event.padEnd(8, ' ');
      const value1Str = value1.toString().padStart(3, ' ');
      const value2Str = (127.0 * value2).toFixed().padStart(3, ' ');
      const paramKeyStr = paramKey ? `${paramKey}` : '';

      const message = `Ch.${chStr} ${eventStr} ${value1Str} ${value2Str} ${paramKeyStr}`;

      setLog((prev) => [...prev, message].slice(-10));
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
    <MonitorBox>
      {log.map((message, i) => (
        <span key={i}>{message}</span>
      ))}
    </MonitorBox>
  );
}

// == component ====================================================================================
export function MIDIModal(): JSX.Element | null {
  const [isOpening, setOpening] = useAtom(midiModalIsOpeningAtom);

  const handleClose = useCallback(() => {
    setOpening(false);
  }, [setOpening]);

  if (!isOpening) {
    return null;
  }

  return (
    <Modal onClose={handleClose}>
      <Description>
        MIDI devices can be assigned to control parameters.
        Right click on a knob or a fader and select &quot;MIDI Learn&quot; to assign a MIDI device.
      </Description>
      <Header>Monitor</Header>
      <MIDIMonitor />
    </Modal>
  );
}
