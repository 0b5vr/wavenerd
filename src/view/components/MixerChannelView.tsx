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
import { linearstep } from '@0b5vr/experimental';
import { voltageToDisplayDB } from '../utils/valueToDisplayDB';

// == styles =======================================================================================
const StyledKnob = styled(Knob)`
  width: 28px;
  height: 28px;
`;

const StyledMixerFader = styled(MixerFader)`
  flex-grow: 1;
  margin: 4px 0;
`;

const KnobAndStuff = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledIconCue = styled(IconCue)`
  width: 100%;
  height: 100%;
`;

const CueButtonRoot = styled.div<{ active: boolean }>`
  position: relative;
  width: 32px;
  height: 36px;
  padding: 6px;
  color: ${({ active }) => active ? ThemeVars.accent : ThemeVars.gray};
  cursor: pointer;
`;

const GainAndFader = styled.div`
  width: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div<{ side: 'A' | 'B'; height: string }>`
  display: flex;
  gap: 8px;
  flex-direction: ${({ side }) => side === 'A' ? 'row' : 'row-reverse'};
  justify-content: center;
  align-items: stretch;
  height: ${({ height }) => height};
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
  gap: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// == functions ====================================================================================
function valueToDisplayDB(value: number): string {
  return voltageToDisplayDB(4.0 * value * value);
}

function valueToDisplayEQ(value: number): string {
  if (value >= 0.5) {
    return `+${((value - 0.5) * 200.0).toFixed()}%`;
  } else {
    return `-${((0.5 - value) * 200.0).toFixed()}%`;
  }
}

function valueToDisplayFilter(value: number): string {
  if (value === 0.5) {
    return 'OFF';
  } else if (value >= 0.5) {
    return `HPF ${(linearstep(0.5, 1.0, value) * 100.0).toFixed()}%`;
  } else {
    return `LPF ${(linearstep(0.5, 0.0, value) * 100.0).toFixed()}%`;
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
        midiParamName={paramName}
        resetValue={0.5}
        deltaValuePerPixel={1.0 / 256.0}
        stalkerText={stalkerTextWithValue}
      />
      <UILabel text={label} />
    </KnobAndStuff>
  );
}

function MixerFilterKnob({ label, stalkerText, paramName }: {
  label: string;
  stalkerText: string;
  paramName: string;
}) {
  const value = useMidiValue(paramName);

  const stalkerTextWithValue = useMemo(() => {
    return `${stalkerText}: ${valueToDisplayFilter(value)}`;
  }, [value]);

  return (
    <KnobAndStuff>
      <StyledKnob
        midiParamName={paramName}
        resetValue={0.5}
        deltaValuePerPixel={1.0 / 256.0}
        stalkerText={stalkerTextWithValue}
      />
      <UILabel text={label} />
    </KnobAndStuff>
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
  const filterMode = useSettings('filterMode');

  return (
    <Root
      className={className}
    >
      <Row side={side} height="36px">
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
      <Row side={side} height="124px">
        {eqMode !== 'none' && (
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
        )}
        <GainAndFader>
          {filterMode !== 'none' && (
            <MixerFilterKnob
              label="FILT"
              stalkerText="Deck Filter"
              paramName={paramPrefix + '/filter'}
            />
          )}
          <StyledMixerFader
            midiParamName={paramPrefix + '/volume'}
            stalkerText="Deck Volume"
          />
        </GainAndFader>
      </Row>
    </Root>
  );
}
