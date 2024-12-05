import React, { useMemo } from 'react';
import { Knob } from './Knob';
import { LevelMeters } from './LevelMeters';
import { MixerChannelView } from './MixerChannelView';
import styled from 'styled-components';
import { useMidiValue } from '../stores/hooks/useMidiValue';

// == styles =======================================================================================
const StyledKnob = styled(Knob)`
  width: 16px;
  height: 16px;
`;

const KnobLabel = styled.div`
font-size: 8px;
line-height: 1;
opacity: 0.7;
`;

const KnobAndStuff = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const CenterRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  width: 24px;
  padding: 4px 0;
  margin: 8px 0;
`;

const StyledMixerChannelA = styled(MixerChannelView)`
  flex-grow: 1;
`;

const StyledMixerChannelB = styled(MixerChannelView)`
  flex-grow: 1;
`;

const Root = styled.div`
  display: flex;
`;

// == children =====================================================================================
function CueMixKnob(): JSX.Element {
  const paramName = '/cue/master_mix';
  const value = useMidiValue(paramName);

  const stalkerTextWithValue = useMemo(() => {
    return `Cue Master Mix: ${(value * 100.0).toFixed()}%`;
  }, [value]);

  return (
    <KnobAndStuff>
      <StyledKnob
        midiParamName={paramName}
        resetValue={0.0}
        deltaValuePerPixel={1.0 / 64.0}
        stalkerText={stalkerTextWithValue}
      />
      <KnobLabel>MIX</KnobLabel>
    </KnobAndStuff>
  );
}

// == components ===================================================================================
export const MixerView: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <Root
      className={className}
    >
      <StyledMixerChannelA
        paramPrefix="/mixer/channel_a"
        cueParamName="/cue/channel_a"
        side="A"
      />
      <CenterRow>
        <CueMixKnob />
        <LevelMeters />
      </CenterRow>
      <StyledMixerChannelB
        paramPrefix="/mixer/channel_b"
        cueParamName="/cue/channel_b"
        side="B"
      />
    </Root>
  );
};
