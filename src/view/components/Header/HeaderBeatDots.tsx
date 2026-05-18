import { deckBPMAtom, deckBeatsAtom } from '../../stores/atoms/deck';
import { BeatManager } from '@0b5vr/wavenerd-deck';
import clsx from 'clsx';
import { atom, useAtomValue } from 'jotai';

// == atoms ========================================================================================
const beatAtom = atom((get) => {
  const bpm = get(deckBPMAtom);
  const { bar } = get(deckBeatsAtom);

  const barSeconds = BeatManager.CalcBarSeconds(bpm);

  return Math.floor(4.0 * bar / barSeconds);
});

// == components ===================================================================================
export function HeaderBeatDots({ className }: { className?: string }) {
  const beat = useAtomValue(beatAtom);

  return (
    <div
      className={`flex flex-row gap-1.5 text-center ${className ?? ''}`}
      data-stalker="Beat"
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={clsx(
            'w-1.5 h-1.5 rounded-full shadow-[0_0_0_1.5px_var(--color-header-fg)]',
            beat === i ? 'bg-header-fg' : 'bg-header-bg',
          )}
        />
      ))}
    </div>
  );
}
