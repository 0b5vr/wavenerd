import { deckBeatPositionAtom } from '../../stores/atoms/deck';
import { mod } from '@0b5vr/experimental';
import { atom, useAtomValue } from 'jotai';
import { UILabel } from '../UILabel';
import { UINumber } from '../UINumber';

// == atoms ========================================================================================
const textAtom = atom((get) => {
  const beatPosition = get(deckBeatPositionAtom);

  const stepCount = Math.floor(4.0 * mod(beatPosition, 4.0)).toString(16);
  const barCount = Math.floor(mod(beatPosition, 64.0) / 4.0).toString(16);

  return `${barCount}${stepCount}`;
});

// == components ===================================================================================
export function HeaderBeatHex({ className }: { className?: string }) {
  const text = useAtomValue(textAtom);

  return (
    <div
      className={`flex flex-col text-center ${className ?? ''}`}
      data-stalker="Bars, Steps"
    >
      <UILabel className="text-header-fg" text="BEAT" />
      <UINumber
        text={text}
        activeColor="var(--color-header-fg)"
        inactiveColor="var(--color-gray)"
        forceActiveFrom={0}
      />
    </div>
  );
}
