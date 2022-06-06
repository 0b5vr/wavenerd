import { RecoilState, useRecoilValue } from 'recoil';
import styled, { css, keyframes } from 'styled-components';
import { Colors } from '../constants/Colors';
import IconApply from '~icons/mdi/reload';
import IconBuild from '~icons/mdi/hammer';
import IconCheck from '~icons/mdi/check-bold';
import IconError from '~icons/mdi/close-octagon';
import IconLoading from '~icons/mdi/loading';
import IconPlay from '~icons/mdi/play';
import React from 'react';

// == styles =======================================================================================
const StyleIcon = css`
  width: 20px;
  height: 20px;
  margin: 2px;
`;

const StyleIconButton = css`
  ${ StyleIcon }

  color: ${ Colors.fore };
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;

const StyledIconPlay = styled( IconPlay )`
  ${ StyleIcon }
  color: ${ Colors.foresub };
`;

const StyleAnimationBuild = keyframes`
  0% { transform: rotate(-20deg); }
  50% { transform: rotate(10deg); }
`;

const StyledIconBuilding = styled( IconBuild )`
  ${ StyleIcon }
  color: ${ Colors.accent };
  animation: 0.1s steps(1) infinite ${ StyleAnimationBuild };
`;

const StyledIconError = styled( IconError )`
  ${ StyleIcon }
  color: ${ Colors.error };
`;

const StyledIconCheck = styled( IconCheck )`
  ${ StyleIcon }
  color: ${ Colors.green };
`;

const StyleAnimationRotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const StyledIconLoading = styled( IconLoading )`
  position: absolute;
  width: 100%;
  height: 100%;
  color: ${ Colors.accent };
  animation: 1.0s linear infinite ${ StyleAnimationRotate };
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
export const DeckStatusBar: React.FC<{
  onCompile: () => void;
  onApply: () => void;
  cueStatusState: RecoilState<'none' | 'compiling' | 'ready' | 'applying'>;
  errorState: RecoilState<string | null>;
  className?: string;
}> = ( { className, onCompile, onApply, cueStatusState, errorState } ) => {
  const cueStatus = useRecoilValue( cueStatusState );
  const error = useRecoilValue( errorState );

  let content: React.ReactNode;
  if ( error != null ) {
    content = <>
      <StyledIconError />
      <Text>{ error }</Text>
    </>;
  } else if ( cueStatus === 'none' ) {
    content = <>
      <StyledIconPlay />
      <Text>Playing</Text>
    </>;
  } else if ( cueStatus === 'compiling' ) {
    content = <>
      <StyledIconBuilding
        data-stalker="Compiling..."
      />
      <Text>Compiling...</Text>
    </>;
  } else if ( cueStatus === 'ready' ) {
    content = <>
      <StyledIconCheck
        data-stalker="A shader is successfully compiled and ready to be applied"
      />
      <Text>Ready to apply</Text>
    </>;
  } else {
    content = <>
      <IconStopwatchContainer
        data-stalker="Applying..."
      >
        <StyledIconLoading />
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
};
