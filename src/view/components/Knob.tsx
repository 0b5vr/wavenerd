import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import { useCallback } from 'react';
import { MIDILearnable } from './MIDILearnable';
import { MIDIMAN } from '../../MIDIManager';
import { ThemeVars } from '../themes/ThemeVars';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import { linearstep, saturate, vecAdd, vecScale } from '@0b5vr/experimental';
import styled from 'styled-components';
import { useDoubleTap } from '../utils/useDoubleTap';
import { useMidiValue } from '../stores/hooks/useMidiValue';

// == constants ====================================================================================
const PI = Math.PI;

const SIZE = 64;

// == styles =======================================================================================
const Body = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10000px;
  background: ${ThemeVars.knobColor};
  transform: scale(0.72);
  box-shadow: 0 4px 8px 2px ${ThemeVars.knobShadow};
`;

const RingPath = styled.path`
  fill: none;
  stroke-width: 4;
  stroke-linecap: round;
`;

const RingPathBack = styled(RingPath)`
  stroke-width: 6;
  stroke: ${ThemeVars.knobGutter};
`;

const RingPathFore = styled(RingPath)`
  stroke-width: 4;
  stroke: ${ThemeVars.accent};
`;

const HeadLine = styled.line`
  stroke: ${ThemeVars.knobNotch};
  stroke-width: 4;
  stroke-linecap: round;
`;

const SVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

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
      <RingPathBack
        d={`M ${xb0} ${yb0} A ${radius} ${radius} 0 1 1 ${xb1} ${yb1}`}
      />
      <RingPathFore
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
    <HeadLine
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

    const y0 = event.clientY;
    const v0 = MIDIMAN.midi(midiParamName);

    registerMouseEvent(
      (event) => {
        const y = y0 - event.clientY;
        const mod = event.ctrlKey ? 0.1 : 1.0;
        const dv = y * deltaValuePerPixel * mod;
        const v = saturate(v0 + dv);
        MIDIMAN.setValue(midiParamName, v);
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
    <Root
      onMouseDown={handleClick}
      className={className}
      data-stalker={stalkerText}
    >
      <SVG viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 2 - 4} fill={ThemeVars.knobBorder} />
        <Ring value={value} ringOrigin={ringOrigin} />
      </SVG>
      <Body />
      <SVG viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Head value={value} />
      </SVG>
      <MIDILearnable paramName={midiParamName} />
    </Root>
  );
}
