import { deckBPMAtom, deckBeatsAtom } from '../../stores/atoms/deck';
import { BeatManager } from '@0b5vr/wavenerd-deck';
import styled from 'styled-components';
import { useAtomValue } from 'jotai';
import { UILabel } from '../UILabel';
import { UINumber } from '../UINumber';
import { ThemeVars } from '../../themes/ThemeVars';

// == styles =======================================================================================
const StyledUILabel = styled(UILabel)`
  color: ${ThemeVars.headerFg};
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// == components ===================================================================================
export function HeaderBeatNumber({ className }: { className?: string }) {
  const bpm = useAtomValue(deckBPMAtom);
  const { beat, bar, sixteenBar } = useAtomValue(deckBeatsAtom);

  const beatSeconds = BeatManager.CalcBeatSeconds(bpm);
  const barSeconds = BeatManager.CalcBarSeconds(bpm);
  const sixteenBarSeconds = BeatManager.CalcSixteenBarSeconds(bpm);

  const stepCount = 1 + Math.floor(4.0 * beat / beatSeconds);
  const beatCount = 1 + Math.floor(4.0 * bar / barSeconds);
  const barCount = 1 + Math.floor(16.0 * sixteenBar / sixteenBarSeconds);

  return (
    <Root
      className={className}
      data-stalker="Bars, Beats, Steps"
    >
      <StyledUILabel text="BEAT" />
      <UINumber
        text={`${('0' + barCount).slice(-2)}.${beatCount}.${stepCount}`}
        activeColor={ThemeVars.headerFg}
        inactiveColor={ThemeVars.gray}
      />
    </Root>
  );
}
