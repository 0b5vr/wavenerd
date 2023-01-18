import { Mixer, XFaderModeType } from '../../Mixer';
import React, { useCallback, useMemo } from 'react';
import { SETTINGSMAN, SpectrumModeType, VectorscopeModeType } from '../../SettingsManager';
import { settingsIsOpeningState, settingsLatencyBlocksState, settingsMasterReverbGain, settingsSpectrumColorState, settingsSpectrumModeState, settingsSpectrumOpacityState, settingsVectorscopeColorState, settingsVectorscopeModeState, settingsVectorscopeOpacityState, settingsXFaderModeState } from '../states/settings';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { Colors } from '../constants/Colors';
import { Modal } from './Modal';
import { NumberParam } from './NumberParam';
import styled from 'styled-components';

// == constants ====================================================================================
const BLOCK_SIZE = 128;

// == styles =======================================================================================
const Sans = styled.div`
  font-size: 0.7em;
  font-family: 'Comic Sans MS', serif;
  margin-bottom: 2em;
`;

const Name = styled.div`
  width: 12em;
`;

const Line = styled.div`
  display: flex;
  align-items: center;

  & + & {
    margin-top: 4px;
  }
`;

const StyledNumberParam = styled( NumberParam )`
  display: inline-block;
  background: ${ Colors.back4 };
  padding: 2px;
  border-radius: 4px;
  width: 4em;
`;

// == components ===================================================================================
export const SettingsModal: React.FC<{
  mixer: Mixer,
}> = ( { mixer } ) => {
  const isOpening = useRecoilValue( settingsIsOpeningState );
  const latencyBlocks = useRecoilValue( settingsLatencyBlocksState );
  const masterReverbGain = useRecoilValue( settingsMasterReverbGain );
  const xFaderMode = useRecoilValue( settingsXFaderModeState );
  const vectorscopeMode = useRecoilValue( settingsVectorscopeModeState );
  const vectorscopeOpacity = useRecoilValue( settingsVectorscopeOpacityState );
  const vectorscopeColor = useRecoilValue( settingsVectorscopeColorState );
  const spectrumMode = useRecoilValue( settingsSpectrumModeState );
  const spectrumOpacity = useRecoilValue( settingsSpectrumOpacityState );
  const spectrumColor = useRecoilValue( settingsSpectrumColorState );

  const latencyTime = useMemo( () => (
    latencyBlocks * BLOCK_SIZE / mixer.audio.sampleRate * 1000.0
  ), [ latencyBlocks ] );

  const handleClose = useRecoilCallback(
    ( { set } ) => () => {
      set( settingsIsOpeningState, false );
    },
    [],
  );

  const handleChangeLatencyBlocks = useCallback( ( value: number ) => {
    const valueValid = Math.max( 1, value );

    SETTINGSMAN.latencyBlocks = valueValid;
  }, [] );

  const handleChangeMasterReverbGain = useCallback( ( event: React.ChangeEvent ) => {
    const gain = ( event.target as HTMLInputElement ).value;
    SETTINGSMAN.masterReverbGain = parseFloat( gain );
  }, [] );

  const handleChangeXFaderCurveMode = useCallback( ( event: React.ChangeEvent ) => {
    const mode = ( event.target as HTMLSelectElement ).value;
    SETTINGSMAN.xfaderMode = mode as XFaderModeType;
  }, [] );

  const handleChangeVectorscopeMode = useCallback( ( event: React.ChangeEvent ) => {
    const mode = ( event.target as HTMLSelectElement ).value;
    SETTINGSMAN.vectorscopeMode = mode as VectorscopeModeType;
  }, [] );

  const handleChangeVectorscopeOpacity = useCallback( ( event: React.ChangeEvent ) => {
    const opacity = ( event.target as HTMLInputElement ).value;
    SETTINGSMAN.vectorscopeOpacity = parseFloat( opacity );
  }, [] );

  const handleChangeVectorscopeColor = useCallback( ( event: React.ChangeEvent ) => {
    const color = ( event.target as HTMLInputElement ).value;
    SETTINGSMAN.vectorscopeColor = color;
  }, [] );

  const handleChangeSpectrumMode = useCallback( ( event: React.ChangeEvent ) => {
    const mode = ( event.target as HTMLSelectElement ).value;
    SETTINGSMAN.spectrumMode = mode as SpectrumModeType;
  }, [] );

  const handleChangeSpectrumOpacity = useCallback( ( event: React.ChangeEvent ) => {
    const opacity = ( event.target as HTMLInputElement ).value;
    SETTINGSMAN.spectrumOpacity = parseFloat( opacity );
  }, [] );

  const handleChangeSpectrumColor = useCallback( ( event: React.ChangeEvent ) => {
    const color = ( event.target as HTMLInputElement ).value;
    SETTINGSMAN.spectrumColor = color;
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
          value={ masterReverbGain }
          onChange={ handleChangeMasterReverbGain }
        /><br />
      </Line>

      <Line
        data-stalker="Change the curve of the cross fader."
      >
        <Name>X Fader Curve Mode</Name>
        { (
          <select
            value={ xFaderMode }
            onChange={ handleChangeXFaderCurveMode }
          >
            <option value="constantPower">Constant Power</option>
            <option value="cut">Cut</option>
            <option value="linear">Linear</option>
            <option value="transition">Transition</option>
          </select>
        ) }<br />
      </Line>

      <Line
        data-stalker="Change the type of the vectorscope.&#10;Consumes the performance, yes. Select &quot;None&quot; if you need no funky"
      >
        <Name>Vectorscope Mode</Name>
        { (
          <select
            value={ vectorscopeMode }
            onChange={ handleChangeVectorscopeMode }
          >
            <option value="none">None</option>
            <option value="line">Line</option>
            <option value="points">Points</option>
          </select>
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
          value={ vectorscopeOpacity }
          onChange={ handleChangeVectorscopeOpacity }
        /><br />
      </Line>
      <Line
        data-stalker="Change the color of the vectorscope."
      >
        <Name>Vectorscope Color</Name>
        <input
          type="color"
          value={ vectorscopeColor }
          onChange={ handleChangeVectorscopeColor }
        />
      </Line>

      <Line
        data-stalker="Change the type of the spectrum.&#10;&quot;Line&quot; should work fine, but you can use &quot;None&quot; if you need no funky"
      >
        <Name>Spectrum Mode</Name>
        { (
          <select
            value={ spectrumMode }
            onChange={ handleChangeSpectrumMode }
          >
            <option value="none">None</option>
            <option value="line">Line</option>
          </select>
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
          value={ spectrumOpacity }
          onChange={ handleChangeSpectrumOpacity }
        /><br />
      </Line>
      <Line
        data-stalker="Change the color of the spectrum."
      >
        <Name>spectrum Color</Name>
        <input
          type="color"
          value={ spectrumColor }
          onChange={ handleChangeSpectrumColor }
        />
      </Line>
    </Modal>
  );
};
