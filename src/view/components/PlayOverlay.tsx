import React, { useCallback, useState } from 'react';
import IconPlay from '~icons/mdi/play';
import { ThemeVars } from '../themes/ThemeVars';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import styled from 'styled-components';

// == styles =======================================================================================
const StyledIconPlay = styled(IconPlay)`
  width: 128px;
  height: 128px;
  fill: ${ThemeVars.white};
`;

const Description = styled.div`
  line-height: 1;
`;

const Underlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: ${ThemeVars.black};
  opacity: 0.8;
`;

const Content = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color: ${ThemeVars.white};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Root = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

// == components ===================================================================================
export const PlayOverlay: React.FC<{
  hostDeck: WavenerdDeck;
  className?: string;
}> = ({ hostDeck, className }) => {
  const [isOpening, setIsOpening] = useState(true);

  const handleClick = useCallback(() => {
    hostDeck.audio.resume();
    hostDeck.play();
    setIsOpening(false);
  }, [hostDeck]);

  if (!isOpening) {
    return null;
  }

  return (
    <Root
      onClick={handleClick}
      className={className}
    >
      <Underlay />
      <Content>
        <StyledIconPlay />
        <Description>
          Wavenerd needs you to press here to activate its audio context.
        </Description>
      </Content>
    </Root>
  );
};
