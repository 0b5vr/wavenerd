import React, { useCallback } from 'react';
import { RecoilState, useRecoilValue } from 'recoil';
import styled, { css, keyframes } from 'styled-components';
import IconApply from '~icons/mdi/skip-forward';
import IconBuild from '~icons/mdi/hammer';
import IconCheck from '~icons/mdi/check-bold';
import IconCircle from '~icons/mdi/circle-medium';
import IconError from '~icons/mdi/close-octagon';
import IconMute from '~icons/mdi/volume-mute';
import IconPlay from '~icons/mdi/play';
import { ThemeVars } from '../themes/ThemeVars';
import { useMidiValue } from '../utils/useMidiValue';

// == styles =======================================================================================
const StyleIcon = css`
  width: 20px;
  height: 20px;
  margin: 2px;
`;

const StyleIconButton = css`
  ${ StyleIcon }

  color: ${ ThemeVars.fore };
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
  color: ${ ThemeVars.accentBright };
`;

const StyledIconPlay = styled( IconPlay )`
  ${ StyleIcon }
  color: ${ ThemeVars.gray };
`;

const StyledIconBuilding = styled( IconBuild )`
  ${ StyleIcon }
  color: ${ ThemeVars.accent };
`;

const StyledIconError = styled( IconError )`
  ${ StyleIcon }
  color: ${ ThemeVars.error };
`;

const StyledIconMute = styled( IconMute )`
  ${ StyleIcon }
  color: ${ ThemeVars.error };
`;

const StyledIconCheck = styled( IconCheck )`
  ${ StyleIcon }
  color: ${ ThemeVars.green };
`;

const StyledIconApplying = styled( IconApply )`
  position: absolute;
  width: 100%;
  height: 100%;
  color: ${ ThemeVars.accent };
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
    0% { color: ${ ThemeVars.fore }; }
    50% { color: ${ altColor }; }
    100% { color: ${ ThemeVars.fore }; }
  ` } ${ duration } ${ timing } infinite;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-grow: 1;
  flex-shrink: 1;
`;

const Text = styled.div`
`;

const TextGray = styled( Text )`
  color: ${ ThemeVars.gray };
`;

const TextHasChangeBlink = styled( Text )`
  ${ animationBlink( ThemeVars.accentBright, '2s', 'ease-in-out' ) }
`;

const TextReadyBlink = styled( Text )`
  ${ animationBlink( ThemeVars.green, '2s', 'ease-in-out' ) }
`;

const TextApplyingBlink = styled( Text )`
  ${ animationBlink( ThemeVars.accent, '0.2s', 'step-start' ) }
`;

const TextErrorBlink = styled( Text )`
  ${ animationBlink( ThemeVars.error, '0.5s', 'step-start' ) }
`;

const Root = styled.div`
  display: flex;
  align-items: center;
  font: 400 16px 'Roboto', sans-serif;
  line-height: 1;
  background: ${ ThemeVars.back3 };
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
    content = <Content>
      <StyledIconError />
      <Text>{ error }</Text>
    </Content>;
  } else if ( cueStatus === 'compiling' ) {
    content = <Content
      data-stalker="The shader code is being compiled"
    >
      <StyledIconBuilding />
      <TextApplyingBlink>Compiling...</TextApplyingBlink>
    </Content>;
  } else if ( cueStatus === 'ready' ) {
    content = <Content
      data-stalker="A shader is successfully compiled and ready to be applied&#10;Ctrl+R to apply the shader at the next bar"
    >
      <StyledIconCheck />
      <TextReadyBlink>Ready to apply</TextReadyBlink>
    </Content>;
  } else if ( cueStatus === 'applying' ) {
    content = <Content
      data-stalker="The shader will be applied at the next bar"
    >
      <IconStopwatchContainer>
        <StyledIconApplying />
      </IconStopwatchContainer>
      <TextApplyingBlink>Applying...</TextApplyingBlink>
    </Content>;
  } else if ( hasEdit ) {
    content = <Content
      data-stalker="The code has been edited&#10;Ctrl+S to compile or Ctrl+R to apply"
    >
      <StyledIconHasChange />
      <TextHasChangeBlink>The code has been edited</TextHasChangeBlink>
    </Content>;
  } else if ( gainValue === 0.0 ) {
    content = <Content
      data-stalker="Gain is -INF dB so no sound is output from the deck&#10;Turn the gain knob!"
    >
      <StyledIconMute />
      <TextErrorBlink>Gain is -INF dB</TextErrorBlink>
    </Content>;
  } else {
    content = <Content>
      <StyledIconPlay />
      <TextGray>Playing</TextGray>
    </Content>;
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
