import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import { useCallback } from 'react';
import { MIDILearnable } from './MIDILearnable';
import { MIDIMAN } from '../../MIDIManager';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import { saturate } from '@0b5vr/experimental';
import { useMidiValue } from '../stores/hooks/useMidiValue';
import useMeasure from 'react-use-measure';
import { clsx } from 'clsx';
import styles from './Fader.module.css';

// == constants ====================================================================================
const rulerCls = 'absolute top-0 w-0.5 h-full bg-knob-guide pointer-events-none';
const shortRulerCls = 'absolute top-[15%] w-px h-[70%] bg-knob-guide pointer-events-none';

// == components ===================================================================================
export function Fader({
  midiParamName,
  className,
}: {
  midiParamName: string;
  className?: string;
}) {
  const [refRoot, rectRoot] = useMeasure();

  const value = useMidiValue(midiParamName);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      mouseCombo({
        [MouseComboBit.LMB]: () => {
          const left = event.clientX - event.nativeEvent.offsetX;
          const x0 = (event.nativeEvent.offsetX);
          const v0 = saturate(x0 / rectRoot.width);
          MIDIMAN.setValue(midiParamName, v0);

          registerMouseEvent(
            (event) => {
              const x = (event.clientX - left);
              const v = saturate(x / rectRoot.width);
              MIDIMAN.setValue(midiParamName, v);
            },
          );
        },
      })(event);
    },
    [midiParamName, rectRoot.width],
  );

  return (
    <div
      ref={refRoot}
      className={`relative cursor-pointer ${className ?? ''}`}
      onMouseDown={handleClick}
      data-stalker="X Fader"
    >
      <div className="absolute top-0 left-[5%] w-[90%] h-full">
        <div className={rulerCls} style={{ left: '0px' }} />
        <div className={shortRulerCls} style={{ left: 'calc( 0.1 * ( 100% - 1px ) )' }} />
        <div className={shortRulerCls} style={{ left: 'calc( 0.2 * ( 100% - 1px ) )' }} />
        <div className={shortRulerCls} style={{ left: 'calc( 0.3 * ( 100% - 1px ) )' }} />
        <div className={shortRulerCls} style={{ left: 'calc( 0.4 * ( 100% - 1px ) )' }} />
        <div className={rulerCls} style={{ left: 'calc( 0.5 * ( 100% - 2px ) )' }} />
        <div className={shortRulerCls} style={{ left: 'calc( 0.6 * ( 100% - 1px ) )' }} />
        <div className={shortRulerCls} style={{ left: 'calc( 0.7 * ( 100% - 1px ) )' }} />
        <div className={shortRulerCls} style={{ left: 'calc( 0.8 * ( 100% - 1px ) )' }} />
        <div className={shortRulerCls} style={{ left: 'calc( 0.9 * ( 100% - 1px ) )' }} />
        <div className={rulerCls} style={{ left: 'calc( 100% - 2px )' }} />
      </div>
      <div className="absolute left-0 top-[calc(50%-3px)] w-full h-1.5 bg-knob-gutter pointer-events-none" />
      <div
        className="absolute top-[calc(50%-1px)] h-0.5 bg-accent pointer-events-none"
        style={{
          left: `${100.0 * Math.min(value, 0.5)}%`,
          right: `${100.0 * (1.0 - Math.max(value, 0.5))}%`,
        }}
      />
      <div
        className={clsx('absolute top-1 w-4 h-[calc(100%-8px)] rounded-[1px] pointer-events-none', styles.knob)}
        style={{ left: `calc( ${100.0 * value}% - 8px )` }}
      >
        <div className="absolute top-0.5 left-1.75 w-0.5 h-[calc(100%-4px)] bg-knob-notch rounded-[1px] pointer-events-none" />
      </div>
      <MIDILearnable paramName={midiParamName} />
    </div>
  );
}
