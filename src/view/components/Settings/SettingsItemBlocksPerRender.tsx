import { useAtomValue } from 'jotai';
import { useMemo, useCallback, useContext } from 'react';
import { SETTINGSMAN } from '../../../SettingsManager';
import { settingsAtom } from '../../stores/atoms/settings';
import { SettingsItemBase } from './SettingsItemBase';
import { NumberParam } from '../NumberParam';
import { StuffContext } from '../../StuffContext';

const BLOCK_SIZE = 128;

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
      <NumberParam
        type="int"
        className="inline-block text-input-fore bg-input-back p-0.5 rounded w-[4em] h-4"
        value={blocksPerRender}
        onChange={handleChangeBlocksPerRender}
      >
        {blocksPerRender}
      </NumberParam>
      <div className="text-xs text-foresub ml-1">{`(${latencyTime.toFixed(0)} ms)`}</div>
    </SettingsItemBase>
  );
}
