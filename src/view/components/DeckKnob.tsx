import { useMemo } from 'react';
import { Knob } from './Knob';
import { ThemeVars } from '../themes/ThemeVars';
import styled from 'styled-components';
import { useMidiValue } from '../stores/hooks/useMidiValue';
import { UILabel } from './UILabel';

// == styles =======================================================================================
const StyledKnob = styled(Knob)`
  width: 32px;
  height: 32px;
`;

const Root = styled.div<{ isLearning: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  box-shadow: ${({ isLearning }) => (
    isLearning
      ? `0 0 0 2px ${ThemeVars.accent}`
      : 'none'
  )};
`;

// == components ===================================================================================
export function DeckKnob({ paramName, paramPrefix, label, stalker, className }: {
  paramName: string;
  paramPrefix: string;
  label: string;
  stalker?: string;
  className?: string;
}) {
  const paramFullname = useMemo(
    () => `${paramPrefix}/${paramName}`,
    [paramPrefix, paramName],
  );

  const value = useMidiValue(paramFullname);

  const stalkerWithValue = useMemo(() => {
    return `${stalker}: ${value.toFixed(3)}`;
  }, [stalker, value]);

  return (
    <Root
      isLearning={false}
      className={className}
      data-stalker={stalkerWithValue}
    >
      <StyledKnob
        midiParamName={paramFullname}
        resetValue={0.0}
        deltaValuePerPixel={1.0 / 64.0}
      />
      <UILabel text={label} />
    </Root>
  );
}
