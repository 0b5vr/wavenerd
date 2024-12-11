import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import React, { useCallback, useRef } from 'react';
import { MIDILearnable } from './MIDILearnable';
import { MIDIMAN } from '../../MIDIManager';
import { ThemeVars } from '../themes/ThemeVars';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import { saturate } from '@0b5vr/experimental';
import styled from 'styled-components';
import { useMidiValue } from '../stores/hooks/useMidiValue';
import { useRect } from '../utils/useRect';

// == styles =======================================================================================
const Gutter = styled.div`
  position: absolute;
  top: 0;
  left: calc( 50% - 3px );
  width: 6px;
  height: 100%;
  background: ${ThemeVars.knobGutter};
  pointer-events: none;
`;

const GutterGlow = styled.div`
  position: absolute;
  bottom: 0;
  left: calc( 50% - 1px );
  width: 2px;
  background: ${ThemeVars.accent};
  pointer-events: none;
`;

const Ruler = styled.div`
  position: absolute;
  top: 0px;
  width: 100%;
  height: 1px;
  background: ${ThemeVars.knobGuide};
  pointer-events: none;
`;

const ShortRuler = styled(Ruler)`
  width: 50%;
  left: 25%;
`;

const KnobLine = styled.div`
  position: absolute;
  left: 2px;
  top: 3px;
  width: calc( 100% - 4px );
  height: 2px;
  background: ${ThemeVars.knobNotch};
  border-radius: 1px;
  pointer-events: none;
`;

const Knob = styled.div`
  position: absolute;
  top: 4px;
  width: 100%;
  height: 8px;
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
export const MixerFader: React.FC<{
  midiParamName: string;
  stalkerText?: string;
  className?: string;
}> = ({ midiParamName, stalkerText, className }) => {
  const refRoot = useRef<HTMLDivElement>(null);
  const rectRoot = useRect(refRoot);

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
    <Root
      ref={refRoot}
      onMouseDown={handleClick}
      className={className}
      data-stalker={stalkerText}
    >
      <Ruler style={{ top: '0px' }} />
      <ShortRuler style={{ top: 'calc( 0.1 * ( 100% - 1px ) )' }} />
      <ShortRuler style={{ top: 'calc( 0.2 * ( 100% - 1px ) )' }} />
      <ShortRuler style={{ top: 'calc( 0.3 * ( 100% - 1px ) )' }} />
      <ShortRuler style={{ top: 'calc( 0.4 * ( 100% - 1px ) )' }} />
      <ShortRuler style={{ top: 'calc( 0.5 * ( 100% - 1px ) )' }} />
      <ShortRuler style={{ top: 'calc( 0.6 * ( 100% - 1px ) )' }} />
      <ShortRuler style={{ top: 'calc( 0.7 * ( 100% - 1px ) )' }} />
      <ShortRuler style={{ top: 'calc( 0.8 * ( 100% - 1px ) )' }} />
      <ShortRuler style={{ top: 'calc( 0.9 * ( 100% - 1px ) )' }} />
      <Ruler style={{ top: 'calc( 100% - 1px )' }} />
      <Gutter />
      <GutterGlow style={{ height: `${100.0 * value}%` }} />
      <Knob
        style={{
          top: `calc( ${100.0 * (1.0 - value)}% - 4px )`,
        }}
      >
        <KnobLine />
      </Knob>
      <MIDILearnable paramName={midiParamName} />
    </Root>
  );
};
