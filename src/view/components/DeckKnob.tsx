import React, { useMemo } from 'react';
import { Knob } from './Knob';
import { ThemeVars } from '../themes/ThemeVars';
import styled from 'styled-components';
import { useMidiValue } from '../stores/hooks/useMidiValue';

// == styles =======================================================================================
const StyledKnob = styled(Knob)`
  width: 28px;
  height: 28px;
`;

const Label = styled.div`
  font-size: 8px;
  color: ${ThemeVars.foresub};
  line-height: 1;
`;

const Root = styled.div<{ isLearning: boolean }>`
  display: flex;
  gap: 4px;
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
export const DeckKnob: React.FC<{
  paramName: string;
  paramPrefix: string;
  stalker?: string;
  className?: string;
}> = ({ paramName, paramPrefix, stalker, className }) => {
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
      <Label>{ paramName }</Label>
    </Root>
  );
};
