import { type PrimitiveAtom, useAtomValue } from 'jotai';
import styles from './DeckStatusBar.module.css';
import { useCallback, useMemo } from 'react';
import IconApply from '~icons/mdi/skip-forward';
import IconBuild from '~icons/mdi/hammer';
import IconCheck from '~icons/mdi/check-bold';
import IconCircle from '~icons/mdi/circle-medium';
import IconError from '~icons/mdi/close-octagon';
import IconMute from '~icons/mdi/volume-mute';
import IconPlay from '~icons/mdi/play';
import { useMidiValue } from '../stores/hooks/useMidiValue';
import { useSettings } from '../stores/hooks/useSettings';

// == constants ====================================================================================
const iconCls = 'w-5 h-5 m-0.5';
const iconButtonCls = `${iconCls} text-fore cursor-pointer hover:opacity-80 active:opacity-60`;
const contentCls = 'flex items-center gap-1 grow shrink';

// == children =====================================================================================
function CompileTime({ compileTimeAtom }: { compileTimeAtom: PrimitiveAtom<number> }) {
  const compileTime = useAtomValue(compileTimeAtom);

  return (
    <div className="text-xs mx-1" data-stalker="The last compilation time taken">
      {`${compileTime.toFixed()}ms`}
    </div>
  );
}

function Message({
  cueStatusAtom,
  errorAtom,
  hasEditAtom,
  gainParamName,
  filterParamName,
  onJumpToLine,
}: {
  cueStatusAtom: PrimitiveAtom<'none' | 'compiling' | 'ready' | 'applying'>;
  errorAtom: PrimitiveAtom<string | null>;
  hasEditAtom: PrimitiveAtom<boolean>;
  gainParamName: string;
  filterParamName: string;
  onJumpToLine: (line: number) => void;
}) {
  const cueStatus = useAtomValue(cueStatusAtom);
  const error = useAtomValue(errorAtom);
  const hasEdit = useAtomValue(hasEditAtom);
  const gainValue = useMidiValue(gainParamName);
  const filterValue = useMidiValue(filterParamName);

  const errorFirstLine = useMemo(() => {
    return error?.split('\n')[0];
  }, [error]);

  const onClickError = useCallback(() => {
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

  if (error != null) {
    return (
      <div
        className={`${contentCls} cursor-pointer hover:opacity-80`}
        data-stalker="Click here to jump to the line of the error"
        onClick={onClickError}
      >
        <IconError className={`${iconCls} text-error`} />
        <div className="text-error">{errorFirstLine}</div>
      </div>
    );
  } else if (cueStatus === 'compiling') {
    return (
      <div className={contentCls} data-stalker="The shader code is being compiled">
        <IconBuild className={`${iconCls} text-accent`} />
        <div className={styles.blinkAccent}>Compiling...</div>
      </div>
    );
  } else if (cueStatus === 'ready') {
    const text = hasEdit
      ? 'Ready to apply (+ has edit)'
      : 'Ready to apply';

    return (
      <div
        className={contentCls}
        data-stalker="A shader is successfully compiled and ready to be applied&#10;Ctrl+R to apply the shader at the next bar"
      >
        <IconCheck className={`${iconCls} text-green`} />
        <div className={styles.blinkGreen}>{text}</div>
      </div>
    );
  } else if (cueStatus === 'applying') {
    const text = hasEdit
      ? 'Applying... (+ has edit)'
      : 'Applying...';

    return (
      <div
        className={contentCls}
        data-stalker="The shader will be applied at the next bar"
      >
        <div className={`${iconCls} relative`}>
          <IconApply className="absolute w-full h-full text-accent" />
        </div>
        <div className={styles.blinkAccent}>{text}</div>
      </div>
    );
  } else if (hasEdit) {
    return (
      <div
        className={contentCls}
        data-stalker="The code has been edited&#10;Ctrl+S to compile or Ctrl+R to apply"
      >
        <IconCircle className={`${iconCls} text-accent-bright`} />
        <div className={styles.blinkAccentBright}>The code has been edited</div>
      </div>
    );
  } else if (gainValue === 0.0) {
    return (
      <div
        className={contentCls}
        data-stalker="Gain is -INF dB so no sound is output from the deck&#10;Turn the gain knob!"
      >
        <IconMute className={`${iconCls} text-error`} />
        <div className={styles.blinkError}>Gain is -INF dB</div>
      </div>
    );
  } else if (filterValue === 0.0) {
    return (
      <div
        className={contentCls}
        data-stalker="Filter is LPF 100%, it might not output any sound&#10;Turn the filter knob!"
      >
        <IconMute className={`${iconCls} text-error`} />
        <div className={styles.blinkError}>Filter is LPF 100%</div>
      </div>
    );
  } else if (filterValue === 1.0) {
    return (
      <div
        className={contentCls}
        data-stalker="Filter is HPF 100%, it might not output any sound&#10;Turn the filter knob!"
      >
        <IconMute className={`${iconCls} text-error`} />
        <div className={styles.blinkError}>Filter is HPF 100%</div>
      </div>
    );
  } else {
    return (
      <div className={contentCls}>
        <IconPlay className={`${iconCls} text-gray`} />
        <div className="text-gray">Playing</div>
      </div>
    );
  }
}

// == component ====================================================================================
export function DeckStatusBar({
  onCompile,
  onApply,
  onApplyImmediately,
  onJumpToLine,
  cueStatusAtom,
  hasEditAtom,
  errorAtom,
  compileTimeAtom,
  gainParamName,
  filterParamName,
  className,
}: {
  onCompile: () => void;
  onApply: () => void;
  onApplyImmediately: () => void;
  onJumpToLine: (line: number) => void;
  cueStatusAtom: PrimitiveAtom<'none' | 'compiling' | 'ready' | 'applying'>;
  hasEditAtom: PrimitiveAtom<boolean>;
  errorAtom: PrimitiveAtom<string | null>;
  compileTimeAtom: PrimitiveAtom<number>;
  gainParamName: string;
  filterParamName: string;
  className?: string;
}) {
  const compileTimeEnabled = useSettings('editorCompileTimeEnabled');

  const handleClickApply = useCallback((event: React.MouseEvent) => {
    if (event.shiftKey) {
      onApplyImmediately();
    } else {
      onApply();
    }
  }, [onApplyImmediately, onApply]);

  return (
    <div
      className={`flex items-center leading-none bg-bar-bg text-bar-fg overflow-hidden *:shrink-0 ${className ?? ''}`}
    >
      <Message
        cueStatusAtom={cueStatusAtom}
        errorAtom={errorAtom}
        hasEditAtom={hasEditAtom}
        gainParamName={gainParamName}
        filterParamName={filterParamName}
        onJumpToLine={onJumpToLine}
      />
      {compileTimeEnabled && <CompileTime compileTimeAtom={compileTimeAtom} />}
      <IconBuild
        className={iconButtonCls}
        onClick={onCompile}
        data-stalker="Compile the shader code (Ctrl+S)"
      />
      <IconApply
        className={iconButtonCls}
        onClick={handleClickApply}
        data-stalker="Apply the compiled shader code (Ctrl+R)&#10;Shift+Ctrl+R to apply immediately"
      />
    </div>
  );
}
