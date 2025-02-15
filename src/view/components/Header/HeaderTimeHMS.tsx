import { deckTimeAtom } from '../../stores/atoms/deck';
import styled, { css } from 'styled-components';
import { useAtomValue } from 'jotai';
import { ThemeVars } from '../../themes/ThemeVars';

// == styles =======================================================================================
const Label = styled.div`
  font-size: 8px;
  line-height: 1;
  opacity: 0.7;
`;

const Seg = styled.span<{ isActive: boolean }>`
  color: ${ThemeVars.gray};

  ${({ isActive }) => isActive && css`
    color: ${ThemeVars.headerFg};
  `}
`;

const Value = styled.div`
  display: flex;
  flex-direction: row;
  font: 14px 'Roboto Mono', monospace;
  line-height: 1.0;
  min-width: 60px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// == components ===================================================================================
export function HeaderTimeHMS({ className }: { className?: string }) {
  const time = useAtomValue(deckTimeAtom);

  const hours = Math.floor(time / 3600).toString();
  const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');

  return (
    <Root
      className={className}
      data-stalker="Current Global Time"
    >
      <Label>TIME</Label>
      <Value>
        <Seg isActive={time >= 3600}>{hours}</Seg>
        <Seg isActive={time >= 3600}>:</Seg>
        <Seg isActive={time >= 600}>{minutes[0]}</Seg>
        <Seg isActive={time >= 60}>{minutes[1]}</Seg>
        <Seg isActive={time >= 60}>:</Seg>
        <Seg isActive={time >= 10}>{seconds[0]}</Seg>
        <Seg isActive>{seconds[1]}</Seg>
      </Value>
    </Root>
  );
}
