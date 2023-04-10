import { useRecoilCallback, useRecoilValue } from 'recoil';
import { Colors } from '../constants/Colors';
import IconPlay from '~icons/mdi/play';
import React from 'react';
import { playOverlayIsOpeningState } from '../states/playOverlay';
import styled from 'styled-components';

// == styles =======================================================================================
const StyledIconPlay = styled( IconPlay )`
  width: 128px;
  height: 128px;
  fill: ${ Colors.fore };
`;

const Description = styled.div`
  font: 400 16px 'Poppins', sans-serif;
  line-height: 1;
`;

const Underlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: ${ Colors.black };
  opacity: 0.5;
`;

const Content = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
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
  audio: AudioContext;
  className?: string;
}> = ( { audio, className } ) => {
  const isOpening = useRecoilValue( playOverlayIsOpeningState );

  const handleClick = useRecoilCallback(
    ( { set } ) => () => {
      audio.resume();
      set( playOverlayIsOpeningState, false );
    },
    []
  );

  if ( !isOpening ) {
    return null;
  }

  return (
    <Root
      onClick={ handleClick }
      className={ className }
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
