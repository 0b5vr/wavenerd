import styled from 'styled-components';
import { voltageToDisplayDB } from '../../utils/valueToDisplayDB';
import { SettingsItemBlocksPerRender } from './SettingsItemBlocksPerRender';
import { SettingsItemBool } from './SettingsItemBool';
import { SettingsItemChannelRouting } from './SettingsItemChannelRouting';
import { SettingsItemLatencyBlocks } from './SettingsItemLatencyBlocks';
import { SettingsItemMIDIKnob } from './SettingsItemMIDIKnob';
import { SettingsItemSelect } from './SettingsItemSelect';
import { ThemeVars } from '../../themes/ThemeVars';

const Suffix = styled.div`
  font-size: 12px;
  color: ${ThemeVars.foresub};
  align-self: flex-end;
  margin-left: 8px;
`;

function suffixFnPercent(value: number) {
  const str = (value * 100).toFixed() + '%';
  return <Suffix>{str}</Suffix>;
}

function suffixFnSquaredDB(value: number) {
  const str = voltageToDisplayDB(value * value);
  return <Suffix>{str}</Suffix>;
}

export function SettingsContentAudio() {
  return (
    <>
      <SettingsItemBlocksPerRender />

      <SettingsItemLatencyBlocks />

      <SettingsItemChannelRouting />

      <SettingsItemBool
        settingsKey="masterDCRemoval"
        name="Master DC Removal"
        stalkerText="Remove the DC offset from the master output.&#10;You usually want to keep this switch on to prevent damaging your speakers unless you are going to draw your masterpiece onto your oscilloscope."
      />

      <SettingsItemMIDIKnob
        midiParamName="/mixer/master/reverb/mix"
        name="Master Reverb Mix"
        stalkerText="Add a reverb to the master (cheating)"
        suffixFn={suffixFnPercent}
        deltaValuePerPixel={1.0 / 256.0}
        resetValue={0.0}
        ringOrigin={0.0}
      />

      <SettingsItemMIDIKnob
        midiParamName="/mixer/master/volume"
        name="Master Volume"
        stalkerText="Attenuates the master output."
        suffixFn={suffixFnSquaredDB}
        deltaValuePerPixel={1.0 / 256.0}
        resetValue={1.0}
        ringOrigin={0.0}
      />

      <SettingsItemSelect
        settingsKey="xfaderMode"
        name="X Fader Curve Mode"
        stalkerText="Change the curve of the cross fader.&#10;None: Disables the X fader. This will also hide the X fader from the UI.&#10;Constant Power: The sine-cosine constant power curve.&#10;Cut: The cutting style cross fader, best for scratching (????).&#10;Linear: The linear curve. Both channels output 0.5 at the center position. &#10;Transition: The linear curve. Both channels output 1.0 at the center position."
      >
        <option value="none">None</option>
        <option value="constantPower">Constant Power</option>
        <option value="cut">Cut</option>
        <option value="linear">Linear</option>
        <option value="transition">Transition</option>
      </SettingsItemSelect>

      <SettingsItemSelect
        settingsKey="eqMode"
        name="Equalizer Mode"
        stalkerText="Change the equalizer mode.&#10;None: Disables the equalizer. This will also hide the EQ knobs from the UI.&#10;Isolator: The &quot;isolator&quot; style equalizer. Turning all knobs to the left will kill the sound."
      >
        <option value="none">None</option>
        <option value="isolator">Isolator</option>
      </SettingsItemSelect>

      <SettingsItemSelect
        settingsKey="filterMode"
        name="Filter Mode"
        stalkerText="Change the filter mode.&#10;None: Disables the filter. This will also hide the filter knob from the UI.&#10;Biquad: The stock LPF and HPF that comes with the Web Audio API."
      >
        <option value="none">None</option>
        <option value="biquad">Biquad</option>
      </SettingsItemSelect>
    </>
  );
}
