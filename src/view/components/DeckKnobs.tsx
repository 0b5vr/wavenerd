import { DeckKnob } from './DeckKnob';
import styled from 'styled-components';

// == constants ====================================================================================
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

const labels = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
];

// == styles =======================================================================================
const StyledDeckKnob = styled(DeckKnob)`
`;

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;

`;

// == components ===================================================================================
export function DeckKnobs({ paramPrefix, className }: {
  paramPrefix: string;
  className?: string;
}) {
  return (
    <Root className={className}>
      {paramNames.map((paramName, index) => (
        <StyledDeckKnob
          key={paramName}
          paramPrefix={paramPrefix}
          label={labels[index]}
          paramName={paramName}
          stalker={`param_${paramName}`}
        />
      ))}
    </Root>
  );
};
