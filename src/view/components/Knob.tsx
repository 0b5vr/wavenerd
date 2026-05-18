import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import { useCallback } from 'react';
import { MIDILearnable } from './MIDILearnable';
import { MIDIMAN } from '../../MIDIManager';
import { ThemeVars } from '../themes/ThemeVars';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import { linearstep, saturate, vecAdd, vecScale } from '@0b5vr/experimental';
import { useDoubleTap } from '../utils/useDoubleTap';
import { useMidiValue } from '../stores/hooks/useMidiValue';
import clsx from 'clsx';
import styles from './Knob.module.css';

// == constants ====================================================================================
const PI = Math.PI;

const SIZE = 64;

// == functions ====================================================================================
function valueToDir(value: number): [number, number] {
  const x = Math.cos(PI / 6 * (10 * value + 4));
  const y = Math.sin(PI / 6 * (10 * value + 4));
  return [x, y];
}

// == children =====================================================================================
export function Ring({
  value,
  ringOrigin,
}: {
  value: number;
  ringOrigin: number;
}) {
  const center = SIZE / 2;
  const radius = (SIZE - 6) / 2;

  const [xb0, yb0] = vecAdd(vecScale(valueToDir(0.0), radius), [center, center]);
  const [xb1, yb1] = vecAdd(vecScale(valueToDir(1.0), radius), [center, center]);
  const [x0, y0] = vecAdd(vecScale(valueToDir(ringOrigin), radius), [center, center]);
  const [x1, y1] = vecAdd(vecScale(valueToDir(value), radius), [center, center]);

  const largeArcFlag = Math.abs(ringOrigin - value) > 6 / 10 ? 1 : 0;
  const sweepFlag = (ringOrigin < value) ? 1 : 0;

  const opacity = linearstep(0.0, 0.01, Math.abs(value - ringOrigin));

  return (
    <>
      <path
        className="fill-none stroke-6 [stroke-linecap:round] stroke-knob-gutter"
        d={`M ${xb0} ${yb0} A ${radius} ${radius} 0 1 1 ${xb1} ${yb1}`}
      />
      <path
        className="fill-none stroke-4 [stroke-linecap:round] stroke-accent"
        d={`M ${x0} ${y0} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x1} ${y1}`}
        opacity={opacity}
      />
    </>
  );
}

export function Head({
  value,
}: {
  value: number;
}) {
  const center = SIZE / 2;
  const r1 = 0.1 * SIZE;
  const r2 = 0.28 * SIZE;
  const [x1, y1] = vecAdd(vecScale(valueToDir(value), r1), [center, center]);
  const [x2, y2] = vecAdd(vecScale(valueToDir(value), r2), [center, center]);

  return (
    <line
      className="[stroke-linecap:round] stroke-4 stroke-knob-notch"
      style={{ stroke: ThemeVars.knobNotch }}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
    />
  );
}

// == components ===================================================================================
interface Props {
  midiParamName: string;
  resetValue: number;
  deltaValuePerPixel: number;
  ringOrigin?: number;
  className?: string;
  stalkerText?: string;
}

export function Knob(props: Props) {
  const { midiParamName, deltaValuePerPixel, resetValue, className, stalkerText } = props;
  const ringOrigin = props.ringOrigin ?? resetValue;

  const value = useMidiValue(midiParamName);

  const checkDoubleClick = useDoubleTap();

  const beginDrag = useCallback((event: React.MouseEvent<Element>) => {
    if (checkDoubleClick()) {
      MIDIMAN.setValue(midiParamName, resetValue);
      return;
    }

    let x = event.clientX - event.clientY;
    let v = MIDIMAN.midi(midiParamName);

    registerMouseEvent(
      (event) => {
        const x1 = event.clientX - event.clientY;
        const dx = x1 - x;
        x = x1;

        const multiplier = event.ctrlKey ? 0.1 : 1.0;
        const dv = dx * deltaValuePerPixel * multiplier;
        v += dv;
        MIDIMAN.setValue(midiParamName, saturate(v));
      },
    );
  }, [checkDoubleClick, midiParamName, resetValue, deltaValuePerPixel]);

  const handleClick = useCallback((event: React.MouseEvent) => {
    mouseCombo({
      [MouseComboBit.LMB]: beginDrag,
      [MouseComboBit.LMB | MouseComboBit.Ctrl]: beginDrag,
    })(event);
  }, [beginDrag]);

  return (
    <div
      className={clsx('relative flex flex-col justify-center items-center cursor-pointer', className)}
      onMouseDown={handleClick}
      data-stalker={stalkerText}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 2 - 4} fill={ThemeVars.knobBorder} />
        <Ring value={value} ringOrigin={ringOrigin} />
      </svg>
      <div className={clsx('absolute inset-0 w-full h-full rounded-full scale-[0.72]', styles.body)} />
      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Head value={value} />
      </svg>
      <MIDILearnable paramName={midiParamName} />
    </div>
  );
}
