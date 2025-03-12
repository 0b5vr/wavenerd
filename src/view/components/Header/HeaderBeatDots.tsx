import { deckBPMAtom, deckBeatsAtom } from '../../stores/atoms/deck';
import { BeatManager } from '@0b5vr/wavenerd-deck';
import styled, { css } from 'styled-components';
import { atom, useAtomValue } from 'jotai';
import { ThemeVars } from '../../themes/ThemeVars';

// == atoms ========================================================================================
const beatAtom = atom((get) => {
  const bpm = get(deckBPMAtom);
  const { bar } = get(deckBeatsAtom);

  const barSeconds = BeatManager.CalcBarSeconds(bpm);

  return Math.floor(4.0 * bar / barSeconds);
});

// == styles =======================================================================================
const Dot = styled.div<{ isActive: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${ThemeVars.headerBg};
  box-shadow: 0 0 0 1.5px ${ThemeVars.headerFg};

  ${({ isActive }) => isActive && css`
    background-color: ${ThemeVars.headerFg};
  `}
`;

const Root = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  text-align: center;
`;

// == components ===================================================================================
export function HeaderBeatDots({ className }: { className?: string }) {
  const beat = useAtomValue(beatAtom);

  return (
    <Root
      className={className}
      data-stalker="Beat"
    >
      <Dot isActive={beat === 0} />
      <Dot isActive={beat === 1} />
      <Dot isActive={beat === 2} />
      <Dot isActive={beat === 3} />
    </Root>
  );
}
