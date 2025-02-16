import { useCallback, useMemo } from 'react';
import IconCue from '~icons/mdi/headphones';
import { Knob } from './Knob';
import { MIDILearnable } from './MIDILearnable';
import { MIDIMAN } from '../../MIDIManager';
import { MixerFader } from './MixerFader';
import { ThemeVars } from '../themes/ThemeVars';
import styled from 'styled-components';
import { useMidiValue } from '../stores/hooks/useMidiValue';
import { useSettings } from '../stores/hooks/useSettings';
import { UILabel } from './UILabel';

// == styles =======================================================================================
const StyledKnob = styled(Knob)<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

const StyledMixerFader = styled(MixerFader)`
  width: 32px;
  height: 96px;
`;

const KnobAndStuff = styled.div`
  display: flex;
  gap: 2px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const StyledIconCue = styled(IconCue)`
  width: 100%;
  height: 100%;
`;

const CueButtonRoot = styled.div<{ active: boolean }>`
  position: relative;
  width: 20px;
  height: 20px;
  margin: 2px;
  color: ${({ active }) => active ? ThemeVars.accent : ThemeVars.gray};
`;

const Row = styled.div<{ side: 'A' | 'B' }>`
  display: flex;
  gap: 8px;
  flex-direction: ${({ side }) => side === 'A' ? 'row' : 'row-reverse'};
  justify-content: center;
  align-items: center;
`;

const EQs = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Root = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

// == functions ====================================================================================
function valueToDisplayDB(value: number): string {
  if (value === 0.0) {
    return '-INF dB';
  } else {
    const db = 20.0 * Math.log10(4.0 * value * value);
    return db.toFixed(2) + ' dB';
  }
}

function valueToDisplayEQ(value: number): string {
  if (value >= 0.5) {
    return `+${((value - 0.5) * 200.0).toFixed()}%`;
  } else {
    return `-${((0.5 - value) * 200.0).toFixed()}%`;
  }
}

// == microcomponents ==============================================================================
function MixerGainKnob({ label, stalkerText, paramName }: {
  label: string;
  stalkerText: string;
  paramName: string;
}) {
  const value = useMidiValue(paramName);

  const stalkerTextWithValue = useMemo(() => {
    return `${stalkerText}: ${valueToDisplayDB(value)}`;
  }, [value]);

  return (
    <KnobAndStuff>
      <StyledKnob
        size={32}
        midiParamName={paramName}
        resetValue={0.5}
        deltaValuePerPixel={1.0 / 256.0}
        stalkerText={stalkerTextWithValue}
      />
      <UILabel text={label} />
    </KnobAndStuff>
  );
}

function MixerEQKnob({ label, stalkerText, paramName }: {
  label: string;
  stalkerText: string;
  paramName: string;
}) {
  const value = useMidiValue(paramName);

  const stalkerTextWithValue = useMemo(() => {
    return `${stalkerText}: ${valueToDisplayEQ(value)}`;
  }, [value]);

  return (
    <KnobAndStuff>
      <StyledKnob
        size={20}
        midiParamName={paramName}
        resetValue={0.5}
        deltaValuePerPixel={1.0 / 256.0}
        stalkerText={stalkerTextWithValue}
      />
      <UILabel text={label} />
    </KnobAndStuff>
  );
}

function MixerFaderI({ paramName, stalkerText }: {
  paramName: string;
  stalkerText: string;
}) {
  return (
    <StyledMixerFader
      midiParamName={paramName}
      stalkerText={stalkerText}
    />
  );
}

function CueButton({ paramName, stalkerText }: {
  paramName: string;
  stalkerText: string;
}) {
  const value = useMidiValue(paramName);

  const handleClick = useCallback(() => {
    const currentValue = MIDIMAN.values[paramName];
    MIDIMAN.setValue(paramName, currentValue > 0.0 ? 0.0 : 1.0);
  }, []);

  return (
    <CueButtonRoot
      active={value > 0.0}
      onClick={handleClick}
      data-stalker={stalkerText}
    >
      <StyledIconCue />
      <MIDILearnable paramName={paramName} />
    </CueButtonRoot>
  );
}

// == components ===================================================================================
export function MixerChannelView({
  paramPrefix,
  cueParamName,
  side,
  className,
}: {
  paramPrefix: string;
  cueParamName: string;
  side: 'A' | 'B';
  className?: string;
}) {
  const eqMode = useSettings('eqMode');

  return (
    <Root
      className={className}
    >
      <Row side={side}>
        <MixerGainKnob
          label="GAIN"
          stalkerText="Deck Gain"
          paramName={paramPrefix + '/gain'}
        />
        <CueButton
          paramName={cueParamName}
          stalkerText="Deck Cue"
        />
      </Row>
      <Row side={side}>
        { eqMode !== 'none' && (
          <EQs>
            <MixerEQKnob
              label="HI"
              stalkerText="Deck EQ High"
              paramName={paramPrefix + '/eq/high'}
            />
            <MixerEQKnob
              label="MID"
              stalkerText="Deck EQ Mid"
              paramName={paramPrefix + '/eq/mid'}
            />
            <MixerEQKnob
              label="LO"
              stalkerText="Deck EQ Low"
              paramName={paramPrefix + '/eq/low'}
            />
          </EQs>
        ) }
        <MixerFaderI
          paramName={paramPrefix + '/volume'}
          stalkerText="Deck Volume"
        />
      </Row>
    </Root>
  );
}
