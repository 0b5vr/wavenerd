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
export function SettingsItemLatencyBlocks() {
  const { mixer } = useContext(StuffContext)!;

  const settings = useAtomValue(settingsAtom);

  const latencyBlocks = settings.latencyBlocks;
  const latencyTime = useMemo(() => (
    latencyBlocks * BLOCK_SIZE / mixer.audio.sampleRate * 1000.0
  ), [latencyBlocks, mixer.audio.sampleRate]);

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
      <NumberParam
        className="inline-block text-input-fore bg-input-back p-0.5 rounded w-[4em] h-4"
        type="int"
        value={latencyBlocks}
        onChange={handleChangeLatencyBlocks}
      >
        {latencyBlocks}
      </NumberParam>
      <div className="text-xs text-foresub ml-1">{`(${latencyTime.toFixed(0)} ms)`}</div>
    </SettingsItemBase>
  );
}
