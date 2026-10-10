import { deckBeatPositionAtom } from '../../stores/atoms/deck';
import { mod } from '@0b5vr/experimental';
import { atom, useAtomValue } from 'jotai';
import { UILabel } from '../UILabel';
import { UINumber } from '../UINumber';

// == atoms ========================================================================================
const textAtom = atom((get) => {
  const beatPosition = get(deckBeatPositionAtom);

  const stepCount = 1 + Math.floor(4.0 * mod(beatPosition, 1.0));
  const beatCount = 1 + Math.floor(mod(beatPosition, 4.0));
  const barCount = 1 + Math.floor(mod(beatPosition, 64.0) / 4.0);

  return `${('0' + barCount).slice(-2)}.${beatCount}.${stepCount}`;
});

// == components ===================================================================================
export function HeaderBeatNumber({ className }: { className?: string }) {
  const text = useAtomValue(textAtom);

  return (
    <div
      className={`flex flex-col text-center ${className ?? ''}`}
      data-stalker="Bars, Beats, Steps"
    >
      <UILabel className="text-header-fg" text="BEAT" />
      <UINumber
        text={text}
        activeColor="var(--color-header-fg)"
        inactiveColor="var(--color-gray)"
      />
    </div>
  );
}
