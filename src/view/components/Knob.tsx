import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import { useCallback } from 'react';
import { MIDILearnable } from './MIDILearnable';
import { MIDIMAN } from '../../MIDIManager';
import { ThemeVars } from '../themes/ThemeVars';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import { saturate } from '@0b5vr/experimental';
import styled from 'styled-components';
import { useDoubleTap } from '../utils/useDoubleTap';
import { useMidiValue } from '../stores/hooks/useMidiValue';

// == styles =======================================================================================
const Head = styled.div`
  position: absolute;
  top: 10%;
  left: 45%;
  width: 10%;
  height: 35%;
  background: ${ThemeVars.knobNotch};
  border-radius: 10000px;
  pointer-events: none;
`;

const HeadContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Body = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10000px;
  background: ${ThemeVars.knobColor};
  box-shadow: 0 0 0 2px ${ThemeVars.knobBorder}, 0 4px 8px 2px ${ThemeVars.knobShadow};
`;

const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

// == components ===================================================================================
interface Props {
  midiParamName: string;
  resetValue: number;
  deltaValuePerPixel: number;
  className?: string;
  stalkerText?: string;
}

export function Knob(props: Props) {
  const { midiParamName, deltaValuePerPixel, resetValue, className, stalkerText } = props;

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

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      mouseCombo({
        [MouseComboBit.LMB]: beginDrag,
        [MouseComboBit.LMB | MouseComboBit.Ctrl]: beginDrag,
      })(event);
    },
    [beginDrag],
  );

  return (
    <Root
      onMouseDown={handleClick}
      className={className}
      data-stalker={stalkerText}
    >
      <Body />
      <HeadContainer
        style={{
          transform: `rotate( ${210 + 300.0 * value}deg )`,
        }}
      >
        <Head />
      </HeadContainer>
      <MIDILearnable paramName={midiParamName} />
    </Root>
  );
}
