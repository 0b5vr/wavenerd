import { deckBPMAtom, deckBeatsAtom } from '../../stores/atoms/deck';
import { BeatManager } from '@0b5vr/wavenerd-deck';
import { atom, useAtomValue } from 'jotai';
import { UILabel } from '../UILabel';
import { UINumber } from '../UINumber';
import { ThemeVars } from '../../themes/ThemeVars';

// == atoms ========================================================================================
const textAtom = atom((get) => {
  const bpm = get(deckBPMAtom);
  const { beat, bar, sixteenBar } = get(deckBeatsAtom);

  const beatSeconds = BeatManager.CalcBeatSeconds(bpm);
  const barSeconds = BeatManager.CalcBarSeconds(bpm);
  const sixteenBarSeconds = BeatManager.CalcSixteenBarSeconds(bpm);

  const stepCount = 1 + Math.floor(4.0 * beat / beatSeconds);
  const beatCount = 1 + Math.floor(4.0 * bar / barSeconds);
  const barCount = 1 + Math.floor(16.0 * sixteenBar / sixteenBarSeconds);

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
        activeColor={ThemeVars.headerFg}
        inactiveColor={ThemeVars.gray}
      />
    </div>
  );
}
