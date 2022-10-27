import { Mixer, XFaderModeType } from '../../Mixer';
import React, { useCallback } from 'react';
import { settingsIsOpeningState, settingsLatencyBlocksState, settingsXFaderModeState } from '../states/settings';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { Modal } from './Modal';
import { SETTINGSMAN } from '../../SettingsManager';
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
  const latencyBlocks = useRecoilValue( settingsLatencyBlocksState );
  const xFaderMode = useRecoilValue( settingsXFaderModeState );
  const isOpening = useRecoilValue( settingsIsOpeningState );

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
      ) }
    </Modal>
  );
};
