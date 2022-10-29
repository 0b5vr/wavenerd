import { Mixer, XFaderModeType } from '../../Mixer';
import React, { useCallback, useMemo } from 'react';
import { SETTINGSMAN, VectorscopeModeType } from '../../SettingsManager';
import { settingsIsOpeningState, settingsLatencyBlocksState, settingsVectorscopeColorState, settingsVectorscopeModeState, settingsVectorscopeOpacityState, settingsXFaderModeState } from '../states/settings';
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
  const xFaderMode = useRecoilValue( settingsXFaderModeState );
  const vectorscopeMode = useRecoilValue( settingsVectorscopeModeState );
  const vectorscopeOpacity = useRecoilValue( settingsVectorscopeOpacityState );
  const vectorscopeColor = useRecoilValue( settingsVectorscopeColorState );

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
        data-stalker="Change the type of the vectorscope.&#10;&quot;Line&quot; should work fine, but you can use &quot;None&quot; if you need no funky&#10;&quot;Points&quot; is way too expensive to use right now. I will improve later"
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
    </Modal>
  );
};
