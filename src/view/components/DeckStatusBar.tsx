import styled, { css, keyframes } from 'styled-components';
import { Colors } from '../constants/Colors';
import IconApply from '../assets/apply.svg';
import IconBuild from '../assets/build.svg';
import IconCat from '../assets/cat.svg';
import IconError from '../assets/error.svg';
import IconReady from '../assets/ready.svg';
import IconStopwatchBody from '../assets/stopwatch-body.svg';
import IconStopwatchHand from '../assets/stopwatch-hand.svg';
import React from 'react';
import { RecoilState } from '../utils/RecoilState';
import { useRecoilValue } from 'recoil';

// == styles =======================================================================================
const StyleIcon = css`
  width: 24px;
  height: 24px;
`;

const StyleIconButton = css`
  ${ StyleIcon }

  fill: ${ Colors.fore };
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;

const StyledIconCat = styled( IconCat )`
  ${ StyleIcon }
  fill: ${ Colors.fore };
`;

const StyledIconError = styled( IconError )`
  ${ StyleIcon }
  fill: ${ Colors.error };
`;

const StyledIconReady = styled( IconReady )`
  ${ StyleIcon }
  fill: ${ Colors.green };
`;

const StyledIconStopwatchBody = styled( IconStopwatchBody )`
  position: absolute;
  width: 100%;
  height: 100%;
  fill: ${ Colors.accent };
`;

const StyleAnimationRotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const StyledIconStopwatchHand = styled( IconStopwatchHand )`
  position: absolute;
  top: 2px;
  width: 100%;
  height: 100%;
  fill: ${ Colors.accent };
  animation: 1s linear infinite ${ StyleAnimationRotate };
`;

const IconStopwatchContainer = styled.div`
  ${ StyleIcon }
  position: relative;
`;

const StyledIconBuild = styled( IconBuild )`
  ${ StyleIconButton }
`;

const StyledIconApply = styled( IconApply )`
  ${ StyleIconButton }
`;

const Text = styled.div`
  margin-left: 4px;
  flex-grow: 1;
  flex-shrink: 1;
`;

const Root = styled.div`
  display: flex;
  align-items: center;
  font: 500 16px monospace;
  background: ${ Colors.back4 };
  overflow: hidden;

  * {
    flex-shrink: 0;
  }
`;

// == components ===================================================================================
function DeckStatusBar( { className, onCompile, onApply, cueStatusState, errorState }: {
  onCompile: () => void;
  onApply: () => void;
  cueStatusState: RecoilState<'none' | 'ready' | 'applying'>;
  errorState: RecoilState<string | null>;
  className?: string;
} ): JSX.Element {
  const cueStatus = useRecoilValue( cueStatusState );
  const error = useRecoilValue( errorState );

  let content: JSX.Element;
  if ( error != null ) {
    content = <>
      <StyledIconError />
      <Text>{ error }</Text>
    </>;
  } else if ( cueStatus === 'none' ) {
    content = <>
      <StyledIconCat
        data-stalker="A cat that has been used as a placeholder icon for no reason"
      />
      <Text>Playing</Text>
    </>;
  } else if ( cueStatus === 'ready' ) {
    content = <>
      <StyledIconReady
        data-stalker="A shader is successfully compiled and ready to be applied"
      />
      <Text>Ready to apply</Text>
    </>;
  } else {
    content = <>
      <IconStopwatchContainer
        data-stalker="Applying..."
      >
        <StyledIconStopwatchBody />
        <StyledIconStopwatchHand />
      </IconStopwatchContainer>
      <Text>Applying...</Text>
    </>;
  }

  return (
    <Root
      className={ className }
    >
      { content }
      <StyledIconBuild
        onClick={ onCompile }
        data-stalker="Compile the shader code (Ctrl+S)"
      />
      <StyledIconApply
        onClick={ onApply }
        data-stalker="Apply the compiled shader code (Ctrl+R)"
      />
    </Root>
  );
}

export { DeckStatusBar };
