import { NumberParam } from '../NumberParam';
import { deckBPMAtom } from '../../stores/atoms/deck';
import styled from 'styled-components';
import { useAtomValue } from 'jotai';
import { useContext } from 'react';
import { StuffContext } from '../../StuffContext';

// == styles =======================================================================================
const Label = styled.div`
  font-size: 8px;
  line-height: 1;
  opacity: 0.7;
`;

const Value = styled(NumberParam)`
  font: 14px 'Roboto Mono', monospace;
  line-height: 1.0;
  min-width: 52px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// == components ===================================================================================
export function HeaderBPM({ className }: { className?: string }) {
  const { hostDeck } = useContext(StuffContext)!;

  const bpm = useAtomValue(deckBPMAtom);

  return (
    <Root
      className={className}
      data-stalker="Beat Per Minute&#10;Drag up/down to change BPM, Double click to edit"
    >
      <Label>BPM</Label>
      <Value
        type="float"
        value={bpm}
        onChange={(value) => {
          hostDeck.bpm = Math.max(40.0, value);
        }}
        fixedDigits={2}
        deltaCoarse={1.0}
        deltaFine={0.1}
      />
    </Root>
  );
}
