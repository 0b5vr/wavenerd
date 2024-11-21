import { LevelMeters } from './LevelMeters';
import { Mixer } from '../../Mixer';
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
  mixer: Mixer;
  className?: string;
}> = ( { mixer, className } ) => {
  return (
    <Root
      className={ className }
    >
      <StyledMixerChannelA
        paramPrefix="/mixer/channelA"
        channel={ mixer.channelA }
        side='A'
      />
      <StyledLevelMeters />
      <StyledMixerChannelB
        paramPrefix="/mixer/channelB"
        channel={ mixer.channelB }
        side='B'
      />
    </Root>
  );
};
