import { useCallback, useContext } from 'react';
import IconPause from '~icons/mdi/pause';
import IconPlay from '~icons/mdi/play';
import IconRewind from '~icons/mdi/skip-previous';
import { deckIsPlayingAtom } from '../../stores/atoms/deck';
import { useAtomValue } from 'jotai';
import { StuffContext } from '../../StuffContext';
import clsx from 'clsx';

// == styles =======================================================================================
const iconCls = 'w-7 h-7 cursor-pointer hover:opacity-80 active:opacity-60';

// == components ===================================================================================
export function HeaderTransport({ className }: { className?: string }) {
  const { clock } = useContext(StuffContext)!;

  const isPlaying = useAtomValue(deckIsPlayingAtom);

  const handleClickRewind = useCallback(() => {
    clock.rewind();
  }, [clock]);

  const handleClickPlay = useCallback(() => {
    clock.play();
  }, [clock]);

  const handleClickPause = useCallback(() => {
    clock.pause();
  }, [clock]);

  return (
    <div className={clsx('flex', className)}>
      <IconRewind className={iconCls} onClick={handleClickRewind} data-stalker="Rewind" />
      {!isPlaying && (
        <IconPlay className={iconCls} onClick={handleClickPlay} data-stalker="Play" />
      )}
      {isPlaying && (
        <IconPause className={iconCls} onClick={handleClickPause} data-stalker="Pause" />
      )}
    </div>
  );
}
