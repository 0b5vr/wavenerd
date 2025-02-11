import { deckBPMAtom, deckBeatsAtom } from '../stores/atoms/deck';
import { BeatManager } from '@0b5vr/wavenerd-deck';
import styled from 'styled-components';
import { useAtomValue } from 'jotai';

// == styles =======================================================================================
const Label = styled.div`
  font-size: 8px;
  line-height: 1;
  opacity: 0.7;
`;

const ValueRow = styled.div`
  font: 14px 'Roboto Mono', monospace;
  line-height: 1.0;
  min-width: 64px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// == components ===================================================================================
export function HeaderBeatIndicators({ className }: { className?: string }) {
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
      <Label>BARS</Label>
      <ValueRow>
        { `${('0' + barCount).slice(-2)}.${beatCount}.${stepCount}` }
      </ValueRow>
    </Root>
  );
}
