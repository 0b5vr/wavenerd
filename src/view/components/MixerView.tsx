import { LevelMeters } from './LevelMeters';
import { MixerChannelView } from './MixerChannelView';
import React from 'react';
import styled from 'styled-components';

// == styles =======================================================================================
const StyledLevelMeters = styled( LevelMeters )`
  flex-grow: 3;
  margin: 4px 0;
`;

const StyledMixerChannelA = styled( MixerChannelView )`
  flex-grow: 3;
`;

const StyledMixerChannelB = styled( MixerChannelView )`
  flex-grow: 3;
`;

const Root = styled.div`
  display: flex;
`;

// == components ===================================================================================
export const MixerView: React.FC<{
  className?: string;
}> = ( { className } ) => {
  return (
    <Root
      className={ className }
    >
      <StyledMixerChannelA
        paramPrefix="/mixer/channel_a"
        side="A"
      />
      <StyledLevelMeters />
      <StyledMixerChannelB
        paramPrefix="/mixer/channel_b"
        side="B"
      />
    </Root>
  );
};
