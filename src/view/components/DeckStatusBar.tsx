import { PrimitiveAtom, useAtomValue } from 'jotai';
import { useCallback, useMemo } from 'react';
import styled, { css, keyframes } from 'styled-components';
import IconApply from '~icons/mdi/skip-forward';
import IconBuild from '~icons/mdi/hammer';
import IconCheck from '~icons/mdi/check-bold';
import IconCircle from '~icons/mdi/circle-medium';
import IconError from '~icons/mdi/close-octagon';
import IconMute from '~icons/mdi/volume-mute';
import IconPlay from '~icons/mdi/play';
import IconMaximize from '~icons/mdi/arrow-expand-all';
import IconMinimize from '~icons/mdi/arrow-collapse-all';
import { ThemeVars } from '../themes/ThemeVars';
import { useMidiValue } from '../stores/hooks/useMidiValue';
import { useSettings } from '../stores/hooks/useSettings';
import { deckMaximizedAtom } from '../stores/atoms/deck';

// == styles =======================================================================================
const StyleIcon = css`
  width: 20px;
  height: 20px;
  margin: 2px;
`;

const StyleIconButton = css`
  ${StyleIcon}

  color: ${ThemeVars.fore};
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;

const DivCompileTime = styled.div`
  font-size: 12px;
  margin: 0 4px;
`;

const StyledIconHasChange = styled(IconCircle)`
  ${StyleIcon}
  color: ${ThemeVars.accentBright};
`;

const StyledIconPlay = styled(IconPlay)`
  ${StyleIcon}
  color: ${ThemeVars.gray};
`;

const StyledIconBuilding = styled(IconBuild)`
  ${StyleIcon}
  color: ${ThemeVars.accent};
`;

const StyledIconError = styled(IconError)`
  ${StyleIcon}
  color: ${ThemeVars.error};
`;

const StyledIconMute = styled(IconMute)`
  ${StyleIcon}
  color: ${ThemeVars.error};
`;

const StyledIconCheck = styled(IconCheck)`
  ${StyleIcon}
  color: ${ThemeVars.green};
`;

const StyledIconApplying = styled(IconApply)`
  position: absolute;
  width: 100%;
  height: 100%;
  color: ${ThemeVars.accent};
`;

const IconStopwatchContainer = styled.div`
  ${StyleIcon}
  position: relative;
`;

const StyledIconBuild = styled(IconBuild)`
  ${StyleIconButton}
`;

const StyledIconApply = styled(IconApply)`
  ${StyleIconButton}
`;

const StyledIconMaximize = styled(IconMaximize)`
  ${StyleIconButton}
`;

const StyledIconMinimize = styled(IconMinimize)`
  ${StyleIconButton}
`;

const animationBlink = (altColor: string, duration: string, timing: string) => css`
  animation: ${keyframes`
    0% { color: ${ThemeVars.fore}; }
    50% { color: ${altColor}; }
    100% { color: ${ThemeVars.fore}; }
  `} ${duration} ${timing} infinite;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-grow: 1;
  flex-shrink: 1;
`;

const CodeErrorContent = styled(Content)`
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const Text = styled.div`
`;

const TextGray = styled(Text)`
  color: ${ThemeVars.gray};
`;

const TextError = styled(Text)`
  color: ${ThemeVars.error};
`;

const TextHasChangeBlink = styled(Text)`
  ${animationBlink(ThemeVars.accentBright, '2s', 'ease-in-out')}
`;

const TextReadyBlink = styled(Text)`
  ${animationBlink(ThemeVars.green, '2s', 'ease-in-out')}
`;

const TextApplyingBlink = styled(Text)`
  ${animationBlink(ThemeVars.accent, '0.2s', 'step-start')}
`;

const TextErrorBlink = styled(Text)`
  ${animationBlink(ThemeVars.error, '0.5s', 'step-start')}
`;

const Root = styled.div`
  display: flex;
  align-items: center;
  line-height: 1;
  background: ${ThemeVars.barBg};
  color: ${ThemeVars.barFg};
  overflow: hidden;

  * {
    flex-shrink: 0;
  }
`;

// == children =====================================================================================
function CompileTime({ compileTimeAtom }: { compileTimeAtom: PrimitiveAtom<number> }) {
  const compileTime = useAtomValue(compileTimeAtom);

  return (
    <DivCompileTime
      data-stalker="The last compilation time taken"
    >
      {`${compileTime.toFixed()}ms`}
    </DivCompileTime>
  );
}

// == component ====================================================================================
export function DeckStatusBar({
  onCompile,
  onApply,
  onApplyImmediately,
  onMaximize,
  onJumpToLine,
  cueStatusAtom,
  hasEditAtom,
  errorAtom,
  compileTimeAtom,
  gainParamName,
  storageKeyName,
  className,
}: {
  onCompile: () => void;
  onApply: () => void;
  onApplyImmediately: () => void;
  onMaximize: () => void;
  onJumpToLine: (line: number) => void;
  cueStatusAtom: PrimitiveAtom<'none' | 'compiling' | 'ready' | 'applying'>;
  hasEditAtom: PrimitiveAtom<boolean>;
  errorAtom: PrimitiveAtom<string | null>;
  compileTimeAtom: PrimitiveAtom<number>;
  gainParamName: string;
  storageKeyName: 'a' | 'b';
  className?: string;
}) {
  const cueStatus = useAtomValue(cueStatusAtom);
  const error = useAtomValue(errorAtom);
  const hasEdit = useAtomValue(hasEditAtom);
  const gainValue = useMidiValue(gainParamName);
  const maximizedDeck = useAtomValue(deckMaximizedAtom);
  
  const isMaximized = maximizedDeck === storageKeyName;

  const errorFirstLine = useMemo(() => {
    return error?.split('\n')[0];
  }, [error]);

  const compileTimeEnabled = useSettings('editorCompileTimeEnabled');

  const handleClickApply = useCallback((event: React.MouseEvent) => {
    if (event.shiftKey) {
      onApplyImmediately();
    } else {
      onApply();
    }
  }, [onApplyImmediately, onApply]);

  const handleClickCodeError = useCallback(() => {
    if (error == null) {
      return;
    }

    const match = error.match(/ERROR: (\d+):(\d+)/);
    const line = match?.[2];
    if (line == null) {
      return;
    }

    onJumpToLine(parseInt(line, 10));
  }, [error, onJumpToLine]);

  let content: JSX.Element;

  if (error != null) {
    content = (
      <CodeErrorContent
        data-stalker="Click here to jump to the line of the error"
        onClick={handleClickCodeError}
      >
        <StyledIconError />
        <TextError>{errorFirstLine}</TextError>
      </CodeErrorContent>
    );
  } else if (cueStatus === 'compiling') {
    content = (
      <Content
        data-stalker="The shader code is being compiled"
      >
        <StyledIconBuilding />
        <TextApplyingBlink>Compiling...</TextApplyingBlink>
      </Content>
    );
  } else if (cueStatus === 'ready') {
    const text = hasEdit
      ? 'Ready to apply (+ has edit)'
      : 'Ready to apply';

    content = (
      <Content
        data-stalker="A shader is successfully compiled and ready to be applied&#10;Ctrl+R to apply the shader at the next bar"
      >
        <StyledIconCheck />
        <TextReadyBlink>{text}</TextReadyBlink>
      </Content>
    );
  } else if (cueStatus === 'applying') {
    const text = hasEdit
      ? 'Applying... (+ has edit)'
      : 'Applying...';

    content = (
      <Content
        data-stalker="The shader will be applied at the next bar"
      >
        <IconStopwatchContainer>
          <StyledIconApplying />
        </IconStopwatchContainer>
        <TextApplyingBlink>{text}</TextApplyingBlink>
      </Content>
    );
  } else if (hasEdit) {
    content = (
      <Content
        data-stalker="The code has been edited&#10;Ctrl+S to compile or Ctrl+R to apply"
      >
        <StyledIconHasChange />
        <TextHasChangeBlink>The code has been edited</TextHasChangeBlink>
      </Content>
    );
  } else if (gainValue === 0.0) {
    content = (
      <Content
        data-stalker="Gain is -INF dB so no sound is output from the deck&#10;Turn the gain knob!"
      >
        <StyledIconMute />
        <TextErrorBlink>Gain is -INF dB</TextErrorBlink>
      </Content>
    );
  } else {
    content = (
      <Content>
        <StyledIconPlay />
        <TextGray>Playing</TextGray>
      </Content>
    );
  }

  return (
    <Root
      className={className}
    >
      { content }
      {compileTimeEnabled && <CompileTime compileTimeAtom={compileTimeAtom} />}
      <StyledIconBuild
        onClick={onCompile}
        data-stalker="Compile the shader code (Ctrl+S)"
      />
      <StyledIconApply
        onClick={handleClickApply}
        data-stalker="Apply the compiled shader code (Ctrl+R)&#10;Shift+Ctrl+R to apply immediately"
      />
      {isMaximized ? (
        <StyledIconMinimize
          onClick={onMaximize}
          data-stalker={`Restore deck to normal view (Ctrl+${storageKeyName === 'a' ? '1' : '2'})`}
        />
      ) : (
        <StyledIconMaximize
          onClick={onMaximize}
          data-stalker={`Maximize deck (Ctrl+${storageKeyName === 'a' ? '1' : '2'})`}
        />
      )}
    </Root>
  );
}
