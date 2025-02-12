import { useAtomValue } from 'jotai';
import { useMemo, useCallback } from 'react';
import { Mixer } from '../../../audio/Mixer';
import { SETTINGSMAN } from '../../../SettingsManager';
import { settingsAtom } from '../../stores/atoms/settings';
import { SettingsItemBase } from './SettingsItemBase';
import styled from 'styled-components';
import { ThemeVars } from '../../themes/ThemeVars';
import { NumberParam } from '../NumberParam';

const BLOCK_SIZE = 128;

const StyledNumberParam = styled(NumberParam)`
  display: inline-block;
  color: ${ThemeVars.inputFore};
  background: ${ThemeVars.inputBack};
  padding: 2px;
  border-radius: 4px;
  width: 4em;
  height: 16px;
`;

const Suffix = styled.div`
  font-size: 12px;
  color: ${ThemeVars.foresub};
  margin-left: 4px;
`;

// is not a SettingsItemNumber because it have to show the latency time in ms
// might refactor this later
export function SettingsItemLatencyBlocks(props: {
  mixer: Mixer;
}) {
  const { mixer } = props;

  const settings = useAtomValue(settingsAtom);

  const latencyBlocks = settings.latencyBlocks;
  const latencyTime = useMemo(() => (
    latencyBlocks * BLOCK_SIZE / mixer.audio.sampleRate * 1000.0
  ), [latencyBlocks]);

  const handleChangeLatencyBlocks = useCallback((value: number) => {
    const valueValid = Math.max(1, value);

    SETTINGSMAN.set('latencyBlocks', valueValid);
  }, []);

  return (
    <SettingsItemBase
      settingsKey="latencyBlocks"
      name="Latency Blocks"
      resettable
      stalkerText="Faster = more noises, slower = less interactive.&#10;I usually use 32 or 64."
    >
      <StyledNumberParam
        type="int"
        value={latencyBlocks}
        onChange={handleChangeLatencyBlocks}
      />
      <Suffix>{`(${latencyTime.toFixed(0)} ms)`}</Suffix>
    </SettingsItemBase>
  );
}
