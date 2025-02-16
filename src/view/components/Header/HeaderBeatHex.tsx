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
export function HeaderBeatHex({ className }: { className?: string }) {
  const bpm = useAtomValue(deckBPMAtom);
  const { bar, sixteenBar } = useAtomValue(deckBeatsAtom);

  const barSeconds = BeatManager.CalcBarSeconds(bpm);
  const sixteenBarSeconds = BeatManager.CalcSixteenBarSeconds(bpm);

  const stepCount = Math.floor(16.0 * bar / barSeconds).toString(16);
  const barCount = Math.floor(16.0 * sixteenBar / sixteenBarSeconds).toString(16);

  return (
    <Root
      className={className}
      data-stalker="Bars, Steps"
    >
      <StyledUILabel text="BEAT" />
      <UINumber
        text={`${barCount}${stepCount}`}
        activeColor={ThemeVars.headerFg}
        inactiveColor={ThemeVars.gray}
        forceActiveFrom={0}
      />
    </Root>
  );
}
