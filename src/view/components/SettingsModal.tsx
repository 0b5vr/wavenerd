import { Mixer } from '../../Mixer';
import React, { useCallback, useMemo } from 'react';
import { Settings, SETTINGSMAN } from '../../SettingsManager';
import { settingsAtom, settingsIsOpeningAtom } from '../stores/atoms/settings';
import { useAtom, useAtomValue } from 'jotai';
import { Modal } from './Modal';
import { NumberParam } from './NumberParam';
import { ThemeVars } from '../themes/ThemeVars';
import styled from 'styled-components';
import { themes } from '../themes/themes';
import { useSettings } from '../stores/hooks/useSettings';

// == constants ====================================================================================
const BLOCK_SIZE = 128;

// == styles =======================================================================================
const Sans = styled.div`
  font-size: 0.7em;
  font-family: 'Comic Sans MS', serif;
  margin-bottom: 2em;
`;

const Name = styled.div`
  width: 16em;
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  font: 400 12px 'Roboto', sans-serif;

  & + & {
    margin-top: 4px;
  }
`;

const StyledNumberParam = styled(NumberParam)`
  display: inline-block;
  color: ${ThemeVars.inputFore};
  background: ${ThemeVars.inputBack};
  padding: 2px;
  border-radius: 4px;
  width: 4em;
`;

const StyledSelect = styled.select`
  display: inline-block;
  color: ${ThemeVars.inputFore};
  background: ${ThemeVars.inputBack};
  padding: 2px;
  border: none;
  border-radius: 4px;
`;

const StyledColorInput = styled.input`
  display: inline-block;
  color: ${ThemeVars.inputFore};
  background: ${ThemeVars.inputBack};
  padding: 2px;
  border: none;
  border-radius: 4px;
  width: 3em;
`;

const StyledTextInput = styled.input`
  display: inline-block;
  color: ${ThemeVars.inputFore};
  background: ${ThemeVars.inputBack};
  padding: 2px;
  border: none;
  border-radius: 4px;
  width: 12em;
`;

// == items ========================================================================================
function ItemBase(props: {
  name: string;
  stalkerText?: string;
  children: React.ReactNode;
}): JSX.Element {
  const { name, children, stalkerText } = props;

  return (
    <Line data-stalker={stalkerText}>
      <Name>{name}</Name>
      {children}
    </Line>
  );
}

function LatencyBlocksItem(props: {
  mixer: Mixer;
}): JSX.Element {
  const { mixer } = props;

  const settings = useAtomValue(settingsAtom);

  const latencyBlocks = settings.latencyBlocks;
  const latencyTime = useMemo(() => (
    latencyBlocks * BLOCK_SIZE / mixer.audio.sampleRate * 1000.0
  ), [latencyBlocks]);

  const handleChangeLatencyBlocks = useCallback((value: number) => {
    const valueValid = Math.max(1, value);

    SETTINGSMAN.set('latencyBlocks', valueValid);
  }, []);

  return (
    <ItemBase
      name="Latency Blocks"
      stalkerText="Faster = more noises, slower = less interactive.&#10;I usually use 32 or 64."
    >
      <StyledNumberParam
        type="int"
        value={latencyBlocks}
        onChange={handleChangeLatencyBlocks}
      />
      {`(${latencyTime.toFixed(0)} ms)`}
    </ItemBase>
  );
}

function BoolItem(props: {
  settingsKey: keyof Settings;
  name: string;
  stalkerText?: string;
}): JSX.Element {
  const { settingsKey, name, stalkerText } = props;
  const value = useSettings(settingsKey) as boolean;

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const checked = (event.target as HTMLInputElement).checked;
    SETTINGSMAN.set(settingsKey, checked);
  }, []);

  return (
    <ItemBase
      name={name}
      stalkerText={stalkerText}
    >
      <input
        type="checkbox"
        checked={value}
        onChange={handleChange}
      />
    </ItemBase>
  );
}

function RangeItem(props: {
  settingsKey: keyof Settings;
  name: string;
  stalkerText?: string;
  min: number;
  max: number;
  step: number;
}): JSX.Element {
  const { settingsKey, name, min, max, step, stalkerText } = props;
  const value = useSettings(settingsKey) as number;

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value;
    SETTINGSMAN.set(settingsKey, parseFloat(value));
  }, []);

  return (
    <ItemBase
      name={name}
      stalkerText={stalkerText}
    >
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
    </ItemBase>
  );
}

function TextItem(props: {
  settingsKey: keyof Settings;
  name: string;
  stalkerText?: string;
}): JSX.Element {
  const { settingsKey, name, stalkerText } = props;
  const value = useSettings(settingsKey) as string;

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value;
    SETTINGSMAN.set(settingsKey, value);
  }, []);

  return (
    <ItemBase
      name={name}
      stalkerText={stalkerText}
    >
      <StyledTextInput
        value={value}
        onChange={handleChange}
      />
    </ItemBase>
  );
}

function ColorItem(props: {
  settingsKey: keyof Settings;
  name: string;
  stalkerText?: string;
}): JSX.Element {
  const { settingsKey, name, stalkerText } = props;
  const value = useSettings(settingsKey) as string;

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value;
    SETTINGSMAN.set(settingsKey, value);
  }, []);

  return (
    <ItemBase
      name={name}
      stalkerText={stalkerText}
    >
      <StyledColorInput
        type="color"
        value={value}
        onChange={handleChange}
      />
    </ItemBase>
  );
}

function SelectItem(props: {
  settingsKey: keyof Settings;
  name: string;
  stalkerText?: string;
  children?: React.ReactNode;
}): JSX.Element {
  const { settingsKey, name, stalkerText, children } = props;
  const value = useSettings(settingsKey) as string;

  const handleChange = useCallback((event: React.ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value;
    SETTINGSMAN.set(settingsKey, value);
  }, []);

  return (
    <ItemBase
      name={name}
      stalkerText={stalkerText}
    >
      <StyledSelect
        value={value}
        onChange={handleChange}
      >
        {children}
      </StyledSelect>
    </ItemBase>
  );
}

// == components ===================================================================================
export const SettingsModal: React.FC<{
  mixer: Mixer;
}> = ({ mixer }) => {
  const [isOpening, setOpening] = useAtom(settingsIsOpeningAtom);

  const handleClose = useCallback(() => {
    setOpening(false);
  }, []);

  if (!isOpening) {
    return null;
  }

  return (
    <Modal onClose={handleClose}>
      <Sans>decent settings modal window</Sans>

      <LatencyBlocksItem mixer={mixer} />

      <TextItem
        settingsKey="channelRouting"
        name="Channel Routing"
        stalkerText="Channel routing.&#10;Available source: master, cue, deckA, deckB.&#10;I recommend VB-Audio Matrix to bind two or more channels at once.&#10;I will implement a proper UI for this later 😅"
      />

      <BoolItem
        settingsKey="masterDCRemoval"
        name="Master DC Removal"
        stalkerText="Remove the DC offset from the master output.&#10;You usually want to keep this switch on to prevent damaging your speakers unless you are going to draw your masterpiece onto your oscilloscope."
      />

      <RangeItem
        settingsKey="masterReverbGain"
        name="Master Reverb Gain"
        stalkerText="Add a reverb to the master (cheating)"
        min={0}
        max={1}
        step={0.01}
      />

      <SelectItem
        settingsKey="xfaderMode"
        name="X Fader Curve Mode"
        stalkerText="Change the curve of the cross fader."
      >
        <option value="constantPower">Constant Power</option>
        <option value="cut">Cut</option>
        <option value="linear">Linear</option>
        <option value="transition">Transition</option>
      </SelectItem>

      <SelectItem
        settingsKey="eqMode"
        name="Equalizer Mode"
        stalkerText="Change the equalizer mode.&#10;None: Disables the equalizer. This will also hide the EQ knobs from the UI.&#10;Isolator: The &quot;isolator&quot; style equalizer. Turning all knobs to the left will kill the sound."
      >
        <option value="none">None</option>
        <option value="isolator">Isolator</option>
      </SelectItem>

      <SelectItem
        settingsKey="vectorscopeMode"
        name="Vectorscope Mode"
        stalkerText="Change the type of the vectorscope.&#10;Consumes the performance, yes. Select &quot;None&quot; if you need no funky"
      >
        <option value="none">None</option>
        <option value="line">Line</option>
        <option value="points">Points</option>
      </SelectItem>

      <RangeItem
        settingsKey="vectorscopeOpacity"
        name="Vectorscope Opacity"
        stalkerText="Change the opacity of the vectorscope."
        min={0}
        max={1}
        step={0.01}
      />

      <ColorItem
        settingsKey="vectorscopeColor"
        name="Vectorscope Color"
        stalkerText="Change the color of the vectorscope."
      />

      <SelectItem
        settingsKey="spectrumMode"
        name="Spectrum Mode"
        stalkerText="Change the type of the spectrum.&#10;&quot;Line&quot; should work fine, but you can use &quot;None&quot; if you need no funky"
      >
        <option value="none">None</option>
        <option value="line">Line</option>
      </SelectItem>

      <RangeItem
        settingsKey="spectrumOpacity"
        name="Spectrum Opacity"
        stalkerText="Change the opacity of the spectrum."
        min={0}
        max={1}
        step={0.01}
      />

      <ColorItem
        settingsKey="spectrumColor"
        name="Spectrum Color"
        stalkerText="Change the color of the spectrum."
      />

      <SelectItem
        settingsKey="theme"
        name="Theme"
        stalkerText="Change the appearance theme."
      >
        { Object.entries(themes).map(([key, { displayName }]) => (
          <option key={key} value={key}>{ displayName }</option>
        )) }
      </SelectItem>

      <TextItem
        settingsKey="editorFont"
        name="Editor Font"
        stalkerText="Change the font of the editor.&#10;The syntax is same as the CSS font property."
      />

      <SelectItem
        settingsKey="editorFontVariantLigatures"
        name="Editor Font Variant Ligatures"
        stalkerText="Whether to enable font variant ligatures in the editor."
      >
        <option value="none">None</option>
        <option value="normal">Normal</option>
      </SelectItem>

      <BoolItem
        settingsKey="editorLogEnabled"
        name="Show Editor Log"
        stalkerText="Whether to show the editor log in the bottom right corner."
      />
    </Modal>
  );
};
