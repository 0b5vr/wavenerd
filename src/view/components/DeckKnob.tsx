import { useMemo } from 'react';
import { Knob } from './Knob';
import { useMidiValue } from '../stores/hooks/useMidiValue';
import { UILabel } from './UILabel';
import clsx from 'clsx';

export function DeckKnob({ paramName, paramPrefix, label, stalker, className }: {
  paramName: string;
  paramPrefix: string;
  label: string;
  stalker?: string;
  className?: string;
}) {
  const paramFullname = useMemo(
    () => `${paramPrefix}/${paramName}`,
    [paramPrefix, paramName],
  );

  const value = useMidiValue(paramFullname);

  const stalkerWithValue = useMemo(() => {
    return `${stalker}: ${value.toFixed(3)}`;
  }, [stalker, value]);

  return (
    <div
      className={clsx('flex flex-col justify-center items-center cursor-pointer', className)}
      data-stalker={stalkerWithValue}
    >
      <Knob
        className="w-8 h-8"
        midiParamName={paramFullname}
        resetValue={0.0}
        deltaValuePerPixel={1.0 / 64.0}
      />
      <UILabel text={label} />
    </div>
  );
}
