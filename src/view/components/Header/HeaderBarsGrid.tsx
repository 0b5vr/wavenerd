import { deckBPMAtom, deckBeatsAtom } from '../../stores/atoms/deck';
import { BeatManager } from '@0b5vr/wavenerd-deck';
import clsx from 'clsx';
import { atom, useAtomValue } from 'jotai';
import { arraySerial } from '@0b5vr/experimental';

// == atoms ========================================================================================
const barAtom = atom((get) => {
  const bpm = get(deckBPMAtom);
  const { sixteenBar } = get(deckBeatsAtom);

  const barSeconds = BeatManager.CalcBarSeconds(bpm);

  return Math.floor(sixteenBar / barSeconds);
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
