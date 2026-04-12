import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import { useCallback } from 'react';
import { MIDILearnable } from './MIDILearnable';
import { MIDIMAN } from '../../MIDIManager';
import { ThemeVars } from '../themes/ThemeVars';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import { saturate } from '@0b5vr/experimental';
import styled from 'styled-components';
import { useMidiValue } from '../stores/hooks/useMidiValue';
import useMeasure from 'react-use-measure';

// == styles =======================================================================================
const Gutter = styled.div`
  position: absolute;
  left: 0;
  top: calc( 50% - 3px );
  width: 100%;
  height: 6px;
  background: ${ThemeVars.knobGutter};
  pointer-events: none;
`;

const GutterGlow = styled.div`
  position: absolute;
  top: calc( 50% - 1px );
  height: 2px;
  background: ${ThemeVars.accent};
  pointer-events: none;
`;

const Ruler = styled.div`
  position: absolute;
  top: 0px;
  width: 2px;
  height: 100%;
  background: ${ThemeVars.knobGuide};
  pointer-events: none;
`;

const ShortRuler = styled.div`
  position: absolute;
  top: 15%;
  width: 1px;
  height: 70%;
  background: ${ThemeVars.knobGuide};
  pointer-events: none;
`;

const RulerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 5%;
  width: 90%;
  height: 100%;
`;

const KnobLine = styled.div`
  position: absolute;
  top: 2px;
  left: 7px;
  width: 2px;
  height: calc( 100% - 4px );
  background: ${ThemeVars.knobNotch};
  border-radius: 1px;
  pointer-events: none;
`;

const Knob = styled.div`
  position: absolute;
  top: 4px;
  width: 16px;
  height: calc( 100% - 8px );
  border-radius: 1px;
  background: ${ThemeVars.knobColor};
  pointer-events: none;
  box-shadow: 0 0 0 2px ${ThemeVars.knobBorder}, 0 4px 8px 2px ${ThemeVars.knobShadow};
`;

const Root = styled.div`
  position: relative;
  cursor: pointer;
`;

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
    <Root
      ref={refRoot}
      onMouseDown={handleClick}
      className={className}
      data-stalker="X Fader"
    >
      <RulerContainer>
        <Ruler style={{ left: '0px' }} />
        <ShortRuler style={{ left: 'calc( 0.1 * ( 100% - 1px ) )' }} />
        <ShortRuler style={{ left: 'calc( 0.2 * ( 100% - 1px ) )' }} />
        <ShortRuler style={{ left: 'calc( 0.3 * ( 100% - 1px ) )' }} />
        <ShortRuler style={{ left: 'calc( 0.4 * ( 100% - 1px ) )' }} />
        <Ruler style={{ left: 'calc( 0.5 * ( 100% - 2px ) )' }} />
        <ShortRuler style={{ left: 'calc( 0.6 * ( 100% - 1px ) )' }} />
        <ShortRuler style={{ left: 'calc( 0.7 * ( 100% - 1px ) )' }} />
        <ShortRuler style={{ left: 'calc( 0.8 * ( 100% - 1px ) )' }} />
        <ShortRuler style={{ left: 'calc( 0.9 * ( 100% - 1px ) )' }} />
        <Ruler style={{ left: 'calc( 100% - 2px )' }} />
      </RulerContainer>
      <Gutter />
      <GutterGlow
        style={{
          left: `${100.0 * Math.min(value, 0.5)}%`,
          right: `${100.0 * (1.0 - Math.max(value, 0.5))}%`,
        }}
      />
      <Knob
        style={{
          left: `calc( ${100.0 * value}% - 8px )`,
        }}
      >
        <KnobLine />
      </Knob>
      <MIDILearnable paramName={midiParamName} />
    </Root>
  );
}
