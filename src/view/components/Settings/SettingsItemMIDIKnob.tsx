import { SettingsItemBase, type SettingsItemBaseProps } from './SettingsItemBase';
import styled from 'styled-components';
import { Knob } from '../Knob';
import { useMidiValue } from '../../stores/hooks/useMidiValue';

const StyledKnob = styled(Knob)`
  width: 32px;
  height: 32px;
`;

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
      <StyledKnob
        midiParamName={midiParamName}
        deltaValuePerPixel={deltaValuePerPixel}
        resetValue={resetValue}
        ringOrigin={ringOrigin}
      />
      {suffixFn && suffixFn(value)}
    </SettingsItemBase>
  );
}
