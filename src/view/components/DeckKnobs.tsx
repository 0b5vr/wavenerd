import { DeckKnob } from './DeckKnob';
import styled from 'styled-components';

// == styles =======================================================================================
const StyledDeckKnob = styled(DeckKnob)`
`;

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

`;

// == components ===================================================================================
export function DeckKnobs({ paramPrefix, className }: {
  paramPrefix: string;
  className?: string;
}): JSX.Element {
  const paramNames = [
    'knob0',
    'knob1',
    'knob2',
    'knob3',
    'knob4',
    'knob5',
    'knob6',
    'knob7',
  ];

  return (
    <Root className={className}>
      { paramNames.map((paramName) => (
        <StyledDeckKnob
          key={paramName}
          paramPrefix={paramPrefix}
          paramName={paramName}
          stalker={`param_${paramName}`}
        />
      )) }
    </Root>
  );
};
