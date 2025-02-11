import { SettingsItemColor } from './SettingsItemColor';
import { SettingsItemRange } from './SettingsItemRange';
import { SettingsItemSelect } from './SettingsItemSelect';

export function SettingsContentVisualization() {
  return (
    <>
      <SettingsItemSelect
        settingsKey="vectorscopeMode"
        name="Vectorscope Mode"
        stalkerText="Change the type of the vectorscope.&#10;Consumes the performance, yes. Select &quot;None&quot; if you need no funky"
      >
        <option value="none">None</option>
        <option value="line">Line</option>
        <option value="points">Points</option>
      </SettingsItemSelect>

      <SettingsItemRange
        settingsKey="vectorscopeOpacity"
        name="Vectorscope Opacity"
        stalkerText="Change the opacity of the vectorscope."
        min={0}
        max={1}
        step={0.01}
      />

      <SettingsItemColor
        settingsKey="vectorscopeColor"
        name="Vectorscope Color"
        stalkerText="Change the color of the vectorscope."
      />

      <SettingsItemSelect
        settingsKey="spectrumMode"
        name="Spectrum Mode"
        stalkerText="Change the type of the spectrum.&#10;&quot;Line&quot; should work fine, but you can use &quot;None&quot; if you need no funky"
      >
        <option value="none">None</option>
        <option value="line">Line</option>
      </SettingsItemSelect>

      <SettingsItemRange
        settingsKey="spectrumOpacity"
        name="Spectrum Opacity"
        stalkerText="Change the opacity of the spectrum."
        min={0}
        max={1}
        step={0.01}
      />

      <SettingsItemColor
        settingsKey="spectrumColor"
        name="Spectrum Color"
        stalkerText="Change the color of the spectrum."
      />

      <SettingsItemSelect
        settingsKey="oscilloscopeMode"
        name="Oscilloscope Mode"
        stalkerText="Change the type of the oscilloscope.&#10;&quot;Line&quot; should work fine, but you can use &quot;None&quot; if you need no funky"
      >
        <option value="none">None</option>
        <option value="line">Line</option>
      </SettingsItemSelect>

      <SettingsItemRange
        settingsKey="oscilloscopeOpacity"
        name="Oscilloscope Opacity"
        stalkerText="Change the opacity of the oscilloscope."
        min={0}
        max={1}
        step={0.01}
      />

      <SettingsItemColor
        settingsKey="oscilloscopeColor"
        name="Oscilloscope Color"
        stalkerText="Change the color of the oscilloscope."
      />
    </>
  );
}
