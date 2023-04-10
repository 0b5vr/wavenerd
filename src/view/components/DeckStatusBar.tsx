import React, { useCallback } from 'react';
import { RecoilState, useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';
import { Colors } from '../constants/Colors';
import IconApply from '~icons/mdi/skip-forward';
import IconBuild from '~icons/mdi/hammer';
import IconCheck from '~icons/mdi/check-bold';
import IconError from '~icons/mdi/close-octagon';
import IconPlay from '~icons/mdi/play';

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

const StyledIconBuilding = styled( IconBuild )`
  ${ StyleIcon }
  color: ${ Colors.accent };
`;

const StyledIconError = styled( IconError )`
  ${ StyleIcon }
  color: ${ Colors.error };
`;

const StyledIconCheck = styled( IconCheck )`
  ${ StyleIcon }
  color: ${ Colors.green };
`;

const StyledIconApplying = styled( IconApply )`
  position: absolute;
  width: 100%;
  height: 100%;
  color: ${ Colors.accent };
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
  font: 400 16px 'Poppins', sans-serif;
  line-height: 1;
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
  onApplyImmediately: () => void;
  cueStatusState: RecoilState<'none' | 'compiling' | 'ready' | 'applying'>;
  errorState: RecoilState<string | null>;
  className?: string;
}> = ( { className, onCompile, onApply, onApplyImmediately, cueStatusState, errorState } ) => {
  const cueStatus = useRecoilValue( cueStatusState );
  const error = useRecoilValue( errorState );

  const handleClickApply = useCallback( ( event: React.MouseEvent ) => {
    if ( event.shiftKey ) {
      onApplyImmediately();
    } else {
      onApply();
    }
  }, [ onApplyImmediately, onApply ] );

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
        <StyledIconApplying />
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
        onClick={ handleClickApply }
        data-stalker="Apply the compiled shader code (Ctrl+R)&#10;Shift+Ctrl+R to apply immediately"
      />
    </Root>
  );
};
