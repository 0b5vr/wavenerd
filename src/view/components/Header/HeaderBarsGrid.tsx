import { deckBeatPositionAtom } from '../../stores/atoms/deck';
import clsx from 'clsx';
import { atom, useAtomValue } from 'jotai';
import { arraySerial, mod } from '@0b5vr/experimental';

// == atoms ========================================================================================
const barAtom = atom((get) => {
  const beatPosition = get(deckBeatPositionAtom);

  return Math.floor(mod(beatPosition, 64.0) / 4.0);
});

// == components ===================================================================================
export function HeaderBarsGrid({ className }: { className?: string }) {
  const bar = useAtomValue(barAtom);

  return (
    <div
      className={`grid grid-cols-4 gap-0.5 text-center ${className ?? ''}`}
      data-stalker="Bars"
    >
      {arraySerial(16).map((i) => (
        <div
          key={i}
          className={clsx('w-1 h-1', bar >= i ? 'bg-header-fg' : 'bg-gray')}
        />
      ))}
    </div>
  );
}
