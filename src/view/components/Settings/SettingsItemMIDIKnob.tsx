import { SettingsItemBase, type SettingsItemBaseProps } from './SettingsItemBase';
import { Knob } from '../Knob';
import { useMidiValue } from '../../stores/hooks/useMidiValue';

export function SettingsItemMIDIKnob(props: {
  midiParamName: string;
  deltaValuePerPixel: number;
  resetValue: number;
  ringOrigin?: number;
  suffixFn?: (value: number) => React.ReactNode;
} & SettingsItemBaseProps) {
  const { midiParamName, deltaValuePerPixel, resetValue, ringOrigin, suffixFn } = props;
  const value = useMidiValue(midiParamName);

  return (
    <SettingsItemBase {...props}>
      <Knob
        className="w-8 h-8"
        midiParamName={midiParamName}
        deltaValuePerPixel={deltaValuePerPixel}
        resetValue={resetValue}
        ringOrigin={ringOrigin}
      />
      {suffixFn && suffixFn(value)}
    </SettingsItemBase>
  );
}
