import { deckBPMAtom, deckBeatsAtom } from '../../stores/atoms/deck';
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

  const stepCount = Math.floor(16.0 * bar / barSeconds).toString(16).toUpperCase();
  const barCount = Math.floor(16.0 * sixteenBar / sixteenBarSeconds).toString(16).toUpperCase();

  return (
    <Root
      className={className}
      data-stalker="Bars, Steps"
    >
      <Label>BEAT</Label>
      <ValueRow>
        {`${barCount}${stepCount}`}
      </ValueRow>
    </Root>
  );
}
