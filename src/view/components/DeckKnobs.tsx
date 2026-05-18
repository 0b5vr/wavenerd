import clsx from 'clsx';
import { DeckKnob } from './DeckKnob';

const paramNames = [
  'knob0',
  'knob1',
  'knob2',
  'knob3',
  'knob4',
  'knob5',
  'knob6',
  'knob7',
];

const labels = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
];

export function DeckKnobs({ paramPrefix, className }: {
  paramPrefix: string;
  className?: string;
}) {
  return (
    <div className={clsx('flex justify-center items-center gap-1', className)}>
      {paramNames.map((paramName, index) => (
        <DeckKnob
          key={paramName}
          paramPrefix={paramPrefix}
          label={labels[index]}
          paramName={paramName}
          stalker={`param_${paramName}`}
        />
      ))}
    </div>
  );
}
