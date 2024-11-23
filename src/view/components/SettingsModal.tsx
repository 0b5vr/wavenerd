import { Mixer, XFaderModeType } from '../../Mixer';
import React, { useCallback, useMemo } from 'react';
import { SETTINGSMAN, SpectrumModeType, VectorscopeModeType } from '../../SettingsManager';
import { settingsAtom, settingsIsOpeningAtom } from '../stores/atoms/settings';
import { useAtom, useAtomValue } from 'jotai';
import { Modal } from './Modal';
import { NumberParam } from './NumberParam';
import { ThemeVars } from '../themes/ThemeVars';
import styled from 'styled-components';
import { themes } from '../themes/themes';

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

const StyledNumberParam = styled( NumberParam )`
  display: inline-block;
  color: ${ ThemeVars.inputFore };
  background: ${ ThemeVars.inputBack };
  padding: 2px;
  border-radius: 4px;
  width: 4em;
`;

const StyledSelect = styled.select`
  display: inline-block;
  color: ${ ThemeVars.inputFore };
  background: ${ ThemeVars.inputBack };
  padding: 2px;
  border: none;
  border-radius: 4px;
`;

const StyledColorInput = styled.input`
  display: inline-block;
  color: ${ ThemeVars.inputFore };
  background: ${ ThemeVars.inputBack };
  padding: 2px;
  border: none;
  border-radius: 4px;
  width: 3em;
`;

const StyledTextInput = styled.input`
  display: inline-block;
  color: ${ ThemeVars.inputFore };
  background: ${ ThemeVars.inputBack };
  padding: 2px;
  border: none;
  border-radius: 4px;
  width: 12em;
`;

// == components ===================================================================================
export const SettingsModal: React.FC<{
  mixer: Mixer,
}> = ( { mixer } ) => {
  const [ isOpening, setOpening ] = useAtom( settingsIsOpeningAtom );
  const settings = useAtomValue( settingsAtom );

  const latencyBlocks = settings.latencyBlocks;
  const latencyTime = useMemo( () => (
    latencyBlocks * BLOCK_SIZE / mixer.audio.sampleRate * 1000.0
  ), [ latencyBlocks ] );

  const handleClose = useCallback( () => {
    setOpening( false );
  }, [] );

  const handleChangeLatencyBlocks = useCallback( ( value: number ) => {
    const valueValid = Math.max( 1, value );

    SETTINGSMAN.set( 'latencyBlocks', valueValid );
  }, [] );

  const handleChangeMasterReverbGain = useCallback( ( event: React.ChangeEvent ) => {
    const gain = ( event.target as HTMLInputElement ).value;
    SETTINGSMAN.set( 'masterReverbGain', parseFloat( gain ) );
  }, [] );

  const handleChangeXFaderCurveMode = useCallback( ( event: React.ChangeEvent ) => {
    const mode = ( event.target as HTMLSelectElement ).value;
    SETTINGSMAN.set( 'xfaderMode', mode as XFaderModeType );
  }, [] );

  const handleChangeEQMode = useCallback( ( event: React.ChangeEvent ) => {
    const mode = ( event.target as HTMLSelectElement ).value;
    SETTINGSMAN.set( 'eqMode', mode );
  }, [] );

  const handleChangeVectorscopeMode = useCallback( ( event: React.ChangeEvent ) => {
    const mode = ( event.target as HTMLSelectElement ).value;
    SETTINGSMAN.set( 'vectorscopeMode', mode as VectorscopeModeType );
  }, [] );

  const handleChangeVectorscopeOpacity = useCallback( ( event: React.ChangeEvent ) => {
    const opacity = ( event.target as HTMLInputElement ).value;
    SETTINGSMAN.set( 'vectorscopeOpacity', parseFloat( opacity ) );
  }, [] );

  const handleChangeVectorscopeColor = useCallback( ( event: React.ChangeEvent ) => {
    const color = ( event.target as HTMLInputElement ).value;
    SETTINGSMAN.set( 'vectorscopeColor', color );
  }, [] );

  const handleChangeSpectrumMode = useCallback( ( event: React.ChangeEvent ) => {
    const mode = ( event.target as HTMLSelectElement ).value;
    SETTINGSMAN.set( 'spectrumMode', mode as SpectrumModeType );
  }, [] );

  const handleChangeSpectrumOpacity = useCallback( ( event: React.ChangeEvent ) => {
    const opacity = ( event.target as HTMLInputElement ).value;
    SETTINGSMAN.set( 'spectrumOpacity', parseFloat( opacity ) );
  }, [] );

  const handleChangeSpectrumColor = useCallback( ( event: React.ChangeEvent ) => {
    const color = ( event.target as HTMLInputElement ).value;
    SETTINGSMAN.set( 'spectrumColor', color );
  }, [] );

  const handleChangeTheme = useCallback( ( event: React.ChangeEvent ) => {
    const theme = ( event.target as HTMLSelectElement ).value;
    SETTINGSMAN.set( 'theme', theme );
  }, [] );

  const handleChangeEditorFont = useCallback( ( event: React.ChangeEvent ) => {
    const font = ( event.target as HTMLSelectElement ).value;
    SETTINGSMAN.set( 'editorFont', font );
  }, [] );

  if ( !isOpening ) {
    return null;
  }

  return (
    <Modal onClose={handleClose}>
      <Sans>decent settings modal window</Sans>

      <Line
        data-stalker="Faster = more noises, slower = less interactive.&#10;I usually use 32 or 64."
      >
        <Name>Latency Blocks</Name>
        { (
          <StyledNumberParam
            type="int"
            value={ latencyBlocks }
            onChange={ handleChangeLatencyBlocks }
          />
        ) }
        ({ latencyTime.toFixed( 0 ) } ms)
      </Line>

      <Line
        data-stalker="Add a reverb to the master (cheating)"
      >
        <Name>Master Reverb Gain</Name>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={ settings.masterReverbGain }
          onChange={ handleChangeMasterReverbGain }
        /><br />
      </Line>

      <Line
        data-stalker="Change the curve of the cross fader."
      >
        <Name>X Fader Curve Mode</Name>
        { (
          <StyledSelect
            value={ settings.xfaderMode }
            onChange={ handleChangeXFaderCurveMode }
          >
            <option value="constantPower">Constant Power</option>
            <option value="cut">Cut</option>
            <option value="linear">Linear</option>
            <option value="transition">Transition</option>
          </StyledSelect>
        ) }<br />
      </Line>

      <Line
        data-stalker="Change the equalizer mode. Setting this to &quot;None&quot; will also hide the EQ knobs from the UI."
      >
        <Name>Equalizer Mode</Name>
        { (
          <StyledSelect
            value={ settings.eqMode }
            onChange={ handleChangeEQMode }
          >
            <option value="none">None</option>
            <option value="isolator">Isolator</option>
          </StyledSelect>
        ) }<br />
      </Line>

      <Line
        data-stalker="Change the type of the vectorscope.&#10;Consumes the performance, yes. Select &quot;None&quot; if you need no funky"
      >
        <Name>Vectorscope Mode</Name>
        { (
          <StyledSelect
            value={ settings.vectorscopeMode }
            onChange={ handleChangeVectorscopeMode }
          >
            <option value="none">None</option>
            <option value="line">Line</option>
            <option value="points">Points</option>
          </StyledSelect>
        ) }<br />
      </Line>
      <Line
        data-stalker="Change the opacity of the vectorscope."
      >
        <Name>Vectorscope Opacity</Name>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={ settings.vectorscopeOpacity }
          onChange={ handleChangeVectorscopeOpacity }
        /><br />
      </Line>
      <Line
        data-stalker="Change the color of the vectorscope."
      >
        <Name>Vectorscope Color</Name>
        <StyledColorInput
          type="color"
          value={ settings.vectorscopeColor }
          onChange={ handleChangeVectorscopeColor }
        />
      </Line>

      <Line
        data-stalker="Change the type of the spectrum.&#10;&quot;Line&quot; should work fine, but you can use &quot;None&quot; if you need no funky"
      >
        <Name>Spectrum Mode</Name>
        { (
          <StyledSelect
            value={ settings.spectrumMode }
            onChange={ handleChangeSpectrumMode }
          >
            <option value="none">None</option>
            <option value="line">Line</option>
          </StyledSelect>
        ) }<br />
      </Line>
      <Line
        data-stalker="Change the opacity of the spectrum."
      >
        <Name>spectrum Opacity</Name>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={ settings.spectrumOpacity }
          onChange={ handleChangeSpectrumOpacity }
        /><br />
      </Line>
      <Line
        data-stalker="Change the color of the spectrum."
      >
        <Name>spectrum Color</Name>
        <StyledColorInput
          type="color"
          value={ settings.spectrumColor }
          onChange={ handleChangeSpectrumColor }
        />
      </Line>
      <Line
        data-stalker="Change the appearance theme."
      >
        <Name>Theme</Name>
        <StyledSelect
          value={ settings.theme }
          onChange={ handleChangeTheme }
        >
          { Object.entries( themes ).map( ( [ key, { displayName } ] ) => (
            <option key={ key } value={ key }>{ displayName }</option>
          ) ) }
        </StyledSelect>
      </Line>
      <Line
        data-stalker="Change the font of the editor.&#10;The syntax is same as the CSS font property."
      >
        <Name>Editor Font</Name>
        <StyledTextInput
          value={ settings.editorFont }
          onChange={ handleChangeEditorFont }
        />
      </Line>
    </Modal>
  );
};
