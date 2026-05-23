import { NumberParam } from '../NumberParam';
import { useCallback, useContext, useState } from 'react';
import { UILabel } from '../UILabel';
import { UINumber } from '../UINumber';
import { clamp } from '@0b5vr/experimental';
import { useSettings } from '../../stores/hooks/useSettings';
import { SETTINGSMAN } from '../../../SettingsManager';
import { useFrame } from '../../utils/useFrame';
import { StuffContext } from '../../StuffContext';

// == components ===================================================================================
export function HeaderLatencyBlocks({ className }: { className?: string }) {
  const [underrun, setUnderrun] = useState(false);

  const { hostDeck } = useContext(StuffContext)!;
  const latencyBlocks = useSettings('latencyBlocks');

  const handleChange = useCallback((value: number) => {
    const valueValid = clamp(value, 0, 256);
    SETTINGSMAN.set('latencyBlocks', valueValid);
  }, []);

  useFrame(
    useCallback(() => {
      const isPlaying = hostDeck.isPlaying;
      const blocksAhead = hostDeck.bufferWriteBlocks - hostDeck.bufferReadBlocks;
      setUnderrun(isPlaying && blocksAhead < 0);
    }, [hostDeck]),
  );

  return (
    <div
      className={`flex flex-col text-center ${className ?? ''}`}
      data-stalker="Latency Blocks&#10;Drag up/down to change latency blocks, Double click to edit"
    >
      <UILabel className="text-header-fg" text="LAT." />
      <NumberParam
        type="int"
        className="font-mono text-[14px] leading-none min-w-8"
        value={latencyBlocks}
        onChange={handleChange}
        deltaCoarse={0.25}
      >
        <UINumber
          text={('00' + latencyBlocks).slice(-3)}
          activeColor={underrun ? 'var(--color-error)' : 'var(--color-header-fg)'}
          inactiveColor="var(--color-gray)"
        />
      </NumberParam>
    </div>
  );
}
