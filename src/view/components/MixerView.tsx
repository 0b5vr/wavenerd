import { useMemo } from 'react';
import { Knob } from './Knob';
import { LevelMeters } from './LevelMeters';
import { MixerChannelView } from './MixerChannelView';
import { useMidiValue } from '../stores/hooks/useMidiValue';
import { UILabel } from './UILabel';
import clsx from 'clsx';

function CueMixKnob() {
  const paramName = '/cue/master_mix';
  const value = useMidiValue(paramName);

  const stalkerTextWithValue = useMemo(() => {
    return `Cue Master Mix: ${(value * 100.0).toFixed()}%`;
  }, [value]);

  return (
    <div className="flex flex-col justify-center items-center cursor-pointer">
      <Knob
        className="w-5 h-5"
        midiParamName={paramName}
        resetValue={0.0}
        deltaValuePerPixel={1.0 / 64.0}
        stalkerText={stalkerTextWithValue}
      />
      <UILabel text="MIX" />
    </div>
  );
}

export function MixerView({ className }: { className?: string }) {
  return (
    <div className={clsx('flex', className)}>
      <MixerChannelView
        className="grow"
        paramPrefix="/mixer/channel_a"
        cueParamName="/cue/channel_a"
        side="A"
      />
      <div className="flex flex-col justify-center items-center gap-4 w-6 py-1">
        <CueMixKnob />
        <LevelMeters />
      </div>
      <MixerChannelView
        className="grow"
        paramPrefix="/mixer/channel_b"
        cueParamName="/cue/channel_b"
        side="B"
      />
    </div>
  );
}
