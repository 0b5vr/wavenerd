import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import { useCallback } from 'react';
import { MIDILearnable } from './MIDILearnable';
import { MIDIMAN } from '../../MIDIManager';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import { saturate } from '@0b5vr/experimental';
import { useMidiValue } from '../stores/hooks/useMidiValue';
import useMeasure from 'react-use-measure';
import { clsx } from 'clsx';
import styles from './MixerFader.module.css';

// == constants ====================================================================================
const rulerCls = 'absolute top-0 w-full h-px bg-knob-guide pointer-events-none';
const shortRulerCls = 'absolute top-0 w-1/2 left-1/4 h-px bg-knob-guide pointer-events-none';

// == components ===================================================================================
export function MixerFader({
  midiParamName,
  stalkerText,
  className,
}: {
  midiParamName: string;
  stalkerText?: string;
  className?: string;
}) {
  const [refRoot, rectRoot] = useMeasure();

  const value = useMidiValue(midiParamName);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      mouseCombo({
        [MouseComboBit.LMB]: () => {
          const bottom = event.clientY - event.nativeEvent.offsetY + rectRoot.height;
          const y0 = (bottom - event.clientY);
          const v0 = saturate(y0 / rectRoot.height);
          MIDIMAN.setValue(midiParamName, v0);

          registerMouseEvent(
            (event) => {
              const y = (bottom - event.clientY);
              const v = saturate(y / rectRoot.height);
              MIDIMAN.setValue(midiParamName, v);
            },
          );
        },
      })(event);
    },
    [midiParamName, rectRoot.height],
  );

  return (
    <div
      ref={refRoot}
      className={`relative cursor-pointer ${className ?? ''}`}
      onMouseDown={handleClick}
      data-stalker={stalkerText}
    >
      <div className={rulerCls} style={{ top: '0px' }} />
      <div className={shortRulerCls} style={{ top: 'calc( 0.1 * ( 100% - 1px ) )' }} />
      <div className={shortRulerCls} style={{ top: 'calc( 0.2 * ( 100% - 1px ) )' }} />
      <div className={shortRulerCls} style={{ top: 'calc( 0.3 * ( 100% - 1px ) )' }} />
      <div className={shortRulerCls} style={{ top: 'calc( 0.4 * ( 100% - 1px ) )' }} />
      <div className={shortRulerCls} style={{ top: 'calc( 0.5 * ( 100% - 1px ) )' }} />
      <div className={shortRulerCls} style={{ top: 'calc( 0.6 * ( 100% - 1px ) )' }} />
      <div className={shortRulerCls} style={{ top: 'calc( 0.7 * ( 100% - 1px ) )' }} />
      <div className={shortRulerCls} style={{ top: 'calc( 0.8 * ( 100% - 1px ) )' }} />
      <div className={shortRulerCls} style={{ top: 'calc( 0.9 * ( 100% - 1px ) )' }} />
      <div className={rulerCls} style={{ top: 'calc( 100% - 1px )' }} />
      <div className="absolute top-0 left-[calc(50%-3px)] w-1.5 h-full bg-knob-gutter pointer-events-none" />
      <div
        className="absolute bottom-0 left-[calc(50%-1px)] w-0.5 bg-accent pointer-events-none"
        style={{ height: `${100.0 * value}%` }}
      />
      <div
        className={clsx('absolute w-full h-2 rounded-[1px] pointer-events-none', styles.knob)}
        style={{ top: `calc( ${100.0 * (1.0 - value)}% - 4px )` }}
      >
        <div className="absolute left-0.5 top-0.75 w-[calc(100%-4px)] h-0.5 bg-knob-notch rounded-[1px] pointer-events-none" />
      </div>
      <MIDILearnable paramName={midiParamName} />
    </div>
  );
}
