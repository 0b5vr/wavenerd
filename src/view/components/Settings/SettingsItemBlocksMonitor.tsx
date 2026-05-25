import { useCallback, useContext, useState } from 'react';
import { SettingsItemBase } from './SettingsItemBase';
import { StuffContext } from '../../StuffContext';
import { useSettings } from '../../stores/hooks/useSettings';
import clsx from 'clsx';
import { deckIsPlayingAtom } from '../../stores/atoms/deck';
import { useAtomValue } from 'jotai';
import { useFrame } from '../../utils/useFrame';
import { useUnderrun } from '../../utils/useUnderrun';

const BLOCK_SIZE = 128;

export function SettingsItemBlocksMonitor() {
  const [blocksAhead, setBlocksAhead] = useState(0);
  const [msAhead, setMsAhead] = useState(0);
  const underrun = useUnderrun();
  const { hostDeck } = useContext(StuffContext)!;
  const latencyBlocks = useSettings('latencyBlocks');
  const isPlaying = useAtomValue(deckIsPlayingAtom);

  // check blocks ahead every frame during playback
  useFrame(
    useCallback(() => {
      setBlocksAhead(hostDeck.bufferWriteBlocks - hostDeck.bufferReadBlocks);
      setMsAhead(((hostDeck.bufferWriteBlocks - hostDeck.bufferReadBlocks) * BLOCK_SIZE) / hostDeck.sampleRate * 1000);
    }, [hostDeck]),
  );

  if (!isPlaying) {
    return (
      <SettingsItemBase
        name="Blocks Monitor"
        stalkerText="Shows the current buffer block status. Only active during playback."
      >
        <div className="text-xs text-foresub">----</div>
      </SettingsItemBase>
    );
  }

  return (
    <SettingsItemBase
      name="Blocks Monitor"
      stalkerText={`Showing the current buffer block status.
Blocks ahead: ${blocksAhead} (${msAhead.toFixed()} ms)`}
    >
      <div className="flex gap-px ml-0.5 h-4 items-center">
        {[...Array(Math.max(blocksAhead, 0))].map ((_, i) => {
          const isExcess = i >= latencyBlocks;
          return (
            <div
              key={i}
              className={clsx(
                'w-0.5 h-2',
                isExcess ? 'bg-gray' : underrun ? 'bg-error' : 'bg-fore',
              )}
            />
          );
        })}
      </div>
    </SettingsItemBase>
  );
}
