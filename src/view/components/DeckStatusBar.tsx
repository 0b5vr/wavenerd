import React, { useCallback } from 'react';
import { RecoilState, useRecoilValue } from 'recoil';
import styled, { css, keyframes } from 'styled-components';
import { Colors } from '../constants/Colors';
import IconApply from '~icons/mdi/skip-forward';
import IconBuild from '~icons/mdi/hammer';
import IconCheck from '~icons/mdi/check-bold';
import IconCircle from '~icons/mdi/circle-medium';
import IconError from '~icons/mdi/close-octagon';
import IconMute from '~icons/mdi/volume-mute';
import IconPlay from '~icons/mdi/play';
import { useMidiValue } from '../utils/useMidiValue';

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

const StyledIconHasChange = styled( IconCircle )`
  ${ StyleIcon }
  color: ${ Colors.accentbright };
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

const StyledIconMute = styled( IconMute )`
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

const animationBlink = ( altColor: string, duration: string, timing: string ) => css`
  animation: ${ keyframes`
    0% { color: ${ Colors.fore }; }
    50% { color: ${ altColor }; }
    100% { color: ${ Colors.fore }; }
  ` } ${ duration } ${ timing } infinite;
`;

const Text = styled.div`
  margin-left: 4px;
  flex-grow: 1;
  flex-shrink: 1;
`;

const TextHasChangeBlink = styled( Text )`
  ${ animationBlink( Colors.accentbright, '2s', 'ease-in-out' ) }
`;

const TextReadyBlink = styled( Text )`
  ${ animationBlink( Colors.green, '2s', 'ease-in-out' ) }
`;

const TextApplyingBlink = styled( Text )`
  ${ animationBlink( Colors.accent, '0.2s', 'step-start' ) }
`;

const TextErrorBlink = styled( Text )`
  ${ animationBlink( Colors.error, '0.5s', 'step-start' ) }
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
  hasEditState: RecoilState<boolean>;
  errorState: RecoilState<string | null>;
  gainParamName: string;
  className?: string;
}> = ( {
  className,
  onCompile,
  onApply,
  onApplyImmediately,
  cueStatusState,
  hasEditState,
  errorState,
  gainParamName,
} ) => {
  const cueStatus = useRecoilValue( cueStatusState );
  const error = useRecoilValue( errorState );
  const hasEdit = useRecoilValue( hasEditState );
  const gainValue = useMidiValue( gainParamName );

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
  } else if ( cueStatus === 'compiling' ) {
    content = <>
      <StyledIconBuilding
        data-stalker="Compiling..."
      />
      <TextApplyingBlink>Compiling...</TextApplyingBlink>
    </>;
  } else if ( cueStatus === 'ready' ) {
    content = <>
      <StyledIconCheck
        data-stalker="A shader is successfully compiled and ready to be applied"
      />
      <TextReadyBlink>Ready to apply</TextReadyBlink>
    </>;
  } else if ( cueStatus === 'applying' ) {
    content = <>
      <IconStopwatchContainer
        data-stalker="Applying..."
      >
        <StyledIconApplying />
      </IconStopwatchContainer>
      <TextApplyingBlink>Applying...</TextApplyingBlink>
    </>;
  } else if ( hasEdit ) {
    content = <>
      <StyledIconHasChange />
      <TextHasChangeBlink>The code has been edited. Ctrl+R to apply</TextHasChangeBlink>
    </>;
  } else if ( gainValue === 0.0 ) {
    content = <>
      <StyledIconMute />
      <TextErrorBlink>Gain is -INF dB. Turn the gain knob!</TextErrorBlink>
    </>;
  } else {
    content = <>
      <StyledIconPlay />
      <Text>Playing</Text>
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
