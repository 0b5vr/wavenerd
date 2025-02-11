import { useAtomValue } from 'jotai';
import { useState, useEffect, useCallback } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { MIDIMAN } from '../../../MIDIManager';
import { midiMappingsSortedAtom } from '../../stores/atoms/midi';
import { ThemeVars } from '../../themes/ThemeVars';
import { SettingsItemBase } from './SettingsItemBase';
import IconClose from '~icons/mdi/close';

// == styles =======================================================================================
const RemoveButton = styled(IconClose)`
  width: 12px;
  height: 12px;
  cursor: pointer;
  color: ${ThemeVars.gray};

  &:hover {
    opacity: 0.8;
  }
`;

const blink = keyframes`
  0% { background: ${ThemeVars.modalFg}; }
  100% { background: ${ThemeVars.modalBg}; }
`;

const Indicator = styled.div<{ isActive: boolean }>`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background: ${ThemeVars.modalBg};
  box-shadow: 0 0 0 1px ${ThemeVars.gray};

  ${({ isActive }) => isActive && css`
    animation: step-end ${blink} 0.2s forwards;
  `}
`;

const MidiKey = styled.div`
  width: 56px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding-left: 4px;
`;

const Root = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-right: 8px;
  height: 240px;
  overflow-y: auto;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${ThemeVars.inputBack};
  font: 400 10px 'Roboto Mono', sans-serif;
`;

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
    <Row>
      <Indicator key={eventIndex} isActive={eventIndex > 0} />
      <MidiKey>{midiKey}</MidiKey>
      <RemoveButton onClick={handleClickRemove} data-stalker="Remove mapping" />
      {`${paramKey}`}
    </Row>
  );
}

export function SettingsItemMIDIMappings() {
  const mappings = useAtomValue(midiMappingsSortedAtom);

  return (
    <SettingsItemBase name="MIDI Mappings">
      <Root>
        {mappings.map(([midiKey, paramKey]) => (
          <MappingItem key={midiKey} midiKey={midiKey} paramKey={paramKey} />
        ))}
      </Root>
    </SettingsItemBase>
  );
}
