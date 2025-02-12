import { useCallback, useContext, useState } from 'react';
import IconPlay from '~icons/mdi/play';
import { ThemeVars } from '../themes/ThemeVars';
import styled from 'styled-components';
import { StuffContext } from '../StuffContext';

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
export function PlayOverlay({ className }: { className?: string }) {
  const { hostDeck } = useContext(StuffContext)!;

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
}
