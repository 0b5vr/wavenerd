import { SettingsItemButton } from './SettingsItemButton';
import { openVisualizerWindow } from '../VisualizerWindow/openVisualizerWindow';
import { SettingsItemColor } from './SettingsItemColor';
import { SettingsItemRange } from './SettingsItemRange';
import { SettingsItemSelect } from './SettingsItemSelect';
import { useCallback } from 'react';
import { useContext } from 'react';
import { StuffContext } from '../../StuffContext';

function suffixFnPercent(value: number) {
  return <span className="w-8 text-xs text-right">{`${(value * 100).toFixed(0)}%`}</span>;
}

export function SettingsContentVisualization() {
  const { mixer, frameEmitter } = useContext(StuffContext)!;

  const handleClickOpenVisualizerWindow = useCallback(() => {
    openVisualizerWindow(mixer.analyserOut, frameEmitter);
  }, [frameEmitter, mixer.analyserOut]);

  return (
    <>
      <SettingsItemSelect
        settingsKey="vectorscopeMode"
        name="Vectorscope Mode"
        stalkerText="Change the type of the vectorscope.&#10;Consumes the performance, yes. Select &quot;None&quot; if you need no funky"
      >
        <option value="none">None</option>
        <option value="line">Line</option>
        <option value="crisp-line">Crisp Line</option>
        <option value="points">Points</option>
        <option value="crisp-points">Crisp Points</option>
      </SettingsItemSelect>

      <SettingsItemRange
        settingsKey="vectorscopeOpacity"
        name="Vectorscope Opacity"
        stalkerText="Change the opacity of the vectorscope."
        min={0}
        max={1}
        step={0.01}
        suffixFn={suffixFnPercent}
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
        <option value="crisp-line">Crisp Line</option>
      </SettingsItemSelect>

      <SettingsItemRange
        settingsKey="spectrumOpacity"
        name="Spectrum Opacity"
        stalkerText="Change the opacity of the spectrum."
        min={0}
        max={1}
        step={0.01}
        suffixFn={suffixFnPercent}
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
        <option value="crisp-line">Crisp Line</option>
      </SettingsItemSelect>

      <SettingsItemRange
        settingsKey="oscilloscopeOpacity"
        name="Oscilloscope Opacity"
        stalkerText="Change the opacity of the oscilloscope."
        min={0}
        max={1}
        step={0.01}
        suffixFn={suffixFnPercent}
      />

      <SettingsItemColor
        settingsKey="oscilloscopeColor"
        name="Oscilloscope Color"
        stalkerText="Change the color of the oscilloscope."
      />

      <SettingsItemSelect
        settingsKey="waveformMode"
        name="Waveform Mode"
        stalkerText="Change the type of the waveform.&#10;&quot;Line&quot; should work fine, but you can use &quot;None&quot; if you need no funky"
      >
        <option value="none">None</option>
        <option value="line">Line</option>
        <option value="crisp-line">Crisp Line</option>
      </SettingsItemSelect>

      <SettingsItemRange
        settingsKey="waveformOpacity"
        name="Waveform Opacity"
        stalkerText="Change the opacity of the waveform."
        min={0}
        max={1}
        step={0.01}
        suffixFn={suffixFnPercent}
      />

      <SettingsItemColor
        settingsKey="waveformColor"
        name="Waveform Color"
        stalkerText="Change the color of the waveform."
      />

      <SettingsItemButton
        name="Open Visualizer Window"
        label="Open"
        stalkerText="Open a new window for the visualizer."
        onClick={handleClickOpenVisualizerWindow}
      />
    </>
  );
}
