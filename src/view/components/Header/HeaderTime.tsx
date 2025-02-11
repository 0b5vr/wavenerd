import { deckTimeAtom } from '../../stores/atoms/deck';
import styled from 'styled-components';
import { useAtomValue } from 'jotai';

// == styles =======================================================================================
const Label = styled.div`
  font-size: 8px;
  line-height: 1;
  opacity: 0.7;
`;

const Value = styled.div`
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
export function HeaderTime({ className }: { className?: string }) {
  const time = useAtomValue(deckTimeAtom);

  return (
    <Root
      className={className}
      data-stalker="Current Global Time (time.w)"
    >
      <Label>TIME</Label>
      <Value>{ time.toFixed(2) }</Value>
    </Root>
  );
}
