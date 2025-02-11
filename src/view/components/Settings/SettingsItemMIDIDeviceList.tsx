import { useAtomValue } from 'jotai';
import { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { MIDIMAN } from '../../../MIDIManager';
import { midiDevicesSortedAtom } from '../../stores/atoms/midi';
import { ThemeVars } from '../../themes/ThemeVars';
import { SettingsItemBase } from './SettingsItemBase';
import SimpleBar from 'simplebar-react';

// == styles =======================================================================================
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

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding-left: 4px;
`;

const Root = styled(SimpleBar)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-right: 8px;
  height: 120px;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${ThemeVars.inputBack};
  font: 400 10px 'Roboto Mono', sans-serif;
`;

// == components ===================================================================================
function MidiDeviceListItem({ deviceId, deviceName }: { deviceId: string; deviceName: string }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    MIDIMAN.on('message', (event) => {
      if (event.deviceId === deviceId) {
        setMessageIndex((i) => i + 1);
      }
    });
  }, []);

  return (
    <Row>
      <Indicator key={messageIndex} isActive={messageIndex > 0} />
      {deviceName}
    </Row>
  );
}

export function SettingsItemMIDIDeviceList() {
  const devices = useAtomValue(midiDevicesSortedAtom);

  return (
    <SettingsItemBase name="Detected Devices">
      <Root>
        {devices.map(({ deviceId, deviceName }) => (
          <MidiDeviceListItem
            key={deviceId}
            deviceId={deviceId}
            deviceName={deviceName}
          />
        ))}
      </Root>
    </SettingsItemBase>
  );
}
