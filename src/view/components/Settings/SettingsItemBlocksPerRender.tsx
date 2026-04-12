import { useAtomValue } from 'jotai';
import { useMemo, useCallback, useContext } from 'react';
import { SETTINGSMAN } from '../../../SettingsManager';
import { settingsAtom } from '../../stores/atoms/settings';
import { SettingsItemBase } from './SettingsItemBase';
import styled from 'styled-components';
import { ThemeVars } from '../../themes/ThemeVars';
import { NumberParam } from '../NumberParam';
import { StuffContext } from '../../StuffContext';

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
export function SettingsItemBlocksPerRender() {
  const { mixer } = useContext(StuffContext)!;

  const settings = useAtomValue(settingsAtom);

  const blocksPerRender = settings.blocksPerRender;
  const latencyTime = useMemo(() => (
    blocksPerRender * BLOCK_SIZE / mixer.audio.sampleRate * 1000.0
  ), [blocksPerRender, mixer.audio.sampleRate]);

  const handleChangeBlocksPerRender = useCallback((value: number) => {
    const valueValid = Math.max(1, value);

    SETTINGSMAN.set('blocksPerRender', valueValid);
  }, []);

  return (
    <SettingsItemBase
      settingsKey="blocksPerRender"
      name="Blocks Per Render"
      resettable
      stalkerText="Faster = more noises, slower = less interactive.&#10;I usually use 16."
    >
      <StyledNumberParam
        type="int"
        value={blocksPerRender}
        onChange={handleChangeBlocksPerRender}
      >
        {blocksPerRender}
      </StyledNumberParam>
      <Suffix>{`(${latencyTime.toFixed(0)} ms)`}</Suffix>
    </SettingsItemBase>
  );
}
