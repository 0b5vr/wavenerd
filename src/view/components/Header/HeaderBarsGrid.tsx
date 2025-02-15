import { deckBPMAtom, deckBeatsAtom } from '../../stores/atoms/deck';
import { BeatManager } from '@0b5vr/wavenerd-deck';
import styled, { css } from 'styled-components';
import { useAtomValue } from 'jotai';
import { ThemeVars } from '../../themes/ThemeVars';
import { arraySerial } from '@0b5vr/experimental';

// == styles =======================================================================================
const Square = styled.div<{ isActive: boolean }>`
  width: 4px;
  height: 4px;
  background-color: ${ThemeVars.gray};

  ${({ isActive }) => isActive && css`
    background-color: ${ThemeVars.headerFg};
  `}
`;

const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
  text-align: center;
`;

// == components ===================================================================================
export function HeaderBarsGrid({ className }: { className?: string }) {
  const bpm = useAtomValue(deckBPMAtom);
  const { sixteenBar } = useAtomValue(deckBeatsAtom);

  const barSeconds = BeatManager.CalcBarSeconds(bpm);

  const bar = Math.floor(sixteenBar / barSeconds);

  return (
    <Root
      className={className}
      data-stalker="Bars"
    >
      {arraySerial(16).map((i) => (
        <Square key={i} isActive={bar >= i} />
      ))}
    </Root>
  );
}
