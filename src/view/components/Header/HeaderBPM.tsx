import { NumberParam } from '../NumberParam';
import { deckBPMAtom } from '../../stores/atoms/deck';
import styled from 'styled-components';
import { useAtomValue } from 'jotai';
import { useContext } from 'react';
import { StuffContext } from '../../StuffContext';
import { UILabel } from '../UILabel';
import { UINumber } from '../UINumber';
import { ThemeVars } from '../../themes/ThemeVars';
import { clamp } from '@0b5vr/experimental';

// == styles =======================================================================================
const StyledUILabel = styled(UILabel)`
  color: ${ThemeVars.headerFg};
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
      <StyledUILabel text="BPM" />
      <Value
        type="float"
        value={bpm}
        onChange={(value) => {
          hostDeck.bpm = clamp(value, 40.0, 999.0);
        }}
        deltaCoarse={1.0}
        deltaFine={0.1}
      >
        <UINumber
          text={('0' + bpm.toFixed(2)).slice(-6)}
          activeColor={ThemeVars.headerFg}
          inactiveColor={ThemeVars.gray}
        />
      </Value>
    </Root>
  );
}
