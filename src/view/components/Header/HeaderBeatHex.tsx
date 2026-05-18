import { deckBPMAtom, deckBeatsAtom } from '../../stores/atoms/deck';
import { BeatManager } from '@0b5vr/wavenerd-deck';
import { atom, useAtomValue } from 'jotai';
import { UILabel } from '../UILabel';
import { UINumber } from '../UINumber';

// == atoms ========================================================================================
const textAtom = atom((get) => {
  const bpm = get(deckBPMAtom);
  const { bar, sixteenBar } = get(deckBeatsAtom);

  const barSeconds = BeatManager.CalcBarSeconds(bpm);
  const sixteenBarSeconds = BeatManager.CalcSixteenBarSeconds(bpm);

  const stepCount = Math.floor(16.0 * bar / barSeconds).toString(16);
  const barCount = Math.floor(16.0 * sixteenBar / sixteenBarSeconds).toString(16);

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
