import { useCallback, useMemo } from 'react';
import IconCue from '~icons/mdi/headphones';
import { Knob } from './Knob';
import { MIDILearnable } from './MIDILearnable';
import { MIDIMAN } from '../../MIDIManager';
import { MixerFader } from './MixerFader';
import { useMidiValue } from '../stores/hooks/useMidiValue';
import { useSettings } from '../stores/hooks/useSettings';
import { UILabel } from './UILabel';
import { linearstep } from '@0b5vr/experimental';
import { voltageToDisplayDB } from '../utils/valueToDisplayDB';
import clsx from 'clsx';

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
function KnobAndStuff({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center items-center">
      {children}
    </div>
  );
}

function MixerGainKnob({ label, stalkerText, paramName }: {
  label: string;
  stalkerText: string;
  paramName: string;
}) {
  const value = useMidiValue(paramName);

  const stalkerTextWithValue = useMemo(() => {
    return `${stalkerText}: ${valueToDisplayDB(value)}`;
  }, [stalkerText, value]);

  return (
    <KnobAndStuff>
      <Knob
        className="w-7 h-7"
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
  }, [stalkerText, value]);

  return (
    <KnobAndStuff>
      <Knob
        className="w-7 h-7"
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
  }, [stalkerText, value]);

  return (
    <KnobAndStuff>
      <Knob
        className="w-7 h-7"
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
  }, [paramName]);

  return (
    <div
      className={clsx(
        'relative w-8 h-9 p-1.5 cursor-pointer',
        value > 0.0 ? 'text-accent' : 'text-gray',
      )}
      onClick={handleClick}
      data-stalker={stalkerText}
    >
      <IconCue className="w-full h-full" />
      <MIDILearnable paramName={paramName} />
    </div>
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
    <div className={clsx('flex gap-2 flex-col justify-center items-center', className)}>
      <div
        className={clsx(
          'flex gap-2 items-stretch justify-center',
          side === 'A' ? 'flex-row' : 'flex-row-reverse',
        )}
        style={{ height: '36px' }}
      >
        <MixerGainKnob
          label="GAIN"
          stalkerText="Deck Gain"
          paramName={paramPrefix + '/gain'}
        />
        <CueButton
          paramName={cueParamName}
          stalkerText="Deck Cue"
        />
      </div>
      <div
        className={clsx(
          'flex gap-2 items-stretch justify-center',
          side === 'A' ? 'flex-row' : 'flex-row-reverse',
        )}
        style={{ height: '124px' }}
      >
        {eqMode !== 'none' && (
          <div className="flex gap-2 flex-col justify-center items-center">
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
          </div>
        )}
        <div className="w-8 flex flex-col gap-2">
          {filterMode !== 'none' && (
            <MixerFilterKnob
              label="FILT"
              stalkerText="Deck Filter"
              paramName={paramPrefix + '/filter'}
            />
          )}
          <MixerFader
            className="grow my-1"
            midiParamName={paramPrefix + '/volume'}
            stalkerText="Deck Volume"
          />
        </div>
      </div>
    </div>
  );
}
