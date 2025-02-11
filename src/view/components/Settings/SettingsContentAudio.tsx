import { Mixer } from '../../../audio/Mixer';
import { SettingsItemBool } from './SettingsItemBool';
import { SettingsItemLatencyBlocks } from './SettingsItemLatencyBlocks';
import { SettingsItemRange } from './SettingsItemRange';
import { SettingsItemSelect } from './SettingsItemSelect';
import { SettingsItemText } from './SettingsItemText';

export function SettingsContentAudio({ mixer }: { mixer: Mixer }) {
  return (
    <>
      <SettingsItemLatencyBlocks mixer={mixer} />

      <SettingsItemText
        settingsKey="channelRouting"
        name="Channel Routing"
        resettable
        stalkerText="Channel routing.&#10;Available source: master, cue, deckA, deckB.&#10;I recommend VB-Audio Matrix to bind two or more channels at once.&#10;I will implement a proper UI for this later 😅"
      />

      <SettingsItemBool
        settingsKey="masterDCRemoval"
        name="Master DC Removal"
        stalkerText="Remove the DC offset from the master output.&#10;You usually want to keep this switch on to prevent damaging your speakers unless you are going to draw your masterpiece onto your oscilloscope."
      />

      <SettingsItemRange
        settingsKey="masterReverbGain"
        name="Master Reverb Gain"
        stalkerText="Add a reverb to the master (cheating)"
        min={0}
        max={1}
        step={0.01}
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
    </>
  );
}
