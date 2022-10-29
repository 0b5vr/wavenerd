import { Mixer, XFaderModeType } from '../../Mixer';
import React, { useCallback } from 'react';
import { SETTINGSMAN, VectorscopeModeType } from '../../SettingsManager';
import { settingsIsOpeningState, settingsLatencyBlocksState, settingsVectorscopeColorState, settingsVectorscopeModeState, settingsVectorscopeOpacityState, settingsXFaderModeState } from '../states/settings';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { Modal } from './Modal';
import styled from 'styled-components';

// == styles =======================================================================================
const Sans = styled.div`
  font-size: 0.7em;
  font-family: 'Comic Sans MS', serif;
  margin-bottom: 2em;
`;

const StyledNumberInput = styled.input`
  width: 4em;
`;

// == components ===================================================================================
export const SettingsModal: React.FC<{
  mixer: Mixer,
}> = () => {
  const isOpening = useRecoilValue( settingsIsOpeningState );
  const latencyBlocks = useRecoilValue( settingsLatencyBlocksState );
  const xFaderMode = useRecoilValue( settingsXFaderModeState );
  const vectorscopeMode = useRecoilValue( settingsVectorscopeModeState );
  const vectorscopeOpacity = useRecoilValue( settingsVectorscopeOpacityState );
  const vectorscopeColor = useRecoilValue( settingsVectorscopeColorState );

  const handleClose = useRecoilCallback(
    ( { set } ) => () => {
      set( settingsIsOpeningState, false );
    },
    [],
  );

  const handleChangeLatencyBlocks = useCallback( ( event: React.ChangeEvent ) => {
    const value = ( event.target as HTMLInputElement ).value;
    const valueInt = parseInt( value, 10 );
    const valueValid = valueInt > 0 ? valueInt : 32;

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
      Latency Blocks: { (
        <StyledNumberInput
          type="number"
          step="1"
          value={ latencyBlocks }
          onChange={ handleChangeLatencyBlocks }
        />
      ) }<br />
      X Fader Curve Mode: { (
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
      <br />
      Vectorscope Mode: { (
        <select
          value={ vectorscopeMode }
          onChange={ handleChangeVectorscopeMode }
        >
          <option value="none">None</option>
          <option value="line">Line</option>
          <option value="points">Points</option>
        </select>
      ) }<br />
      Vectorscope Opacity: <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={ vectorscopeOpacity }
        onChange={ handleChangeVectorscopeOpacity }
      /><br />
      Vectorscope Color: <input
        type="color"
        value={ vectorscopeColor }
        onChange={ handleChangeVectorscopeColor }
      />
    </Modal>
  );
};
