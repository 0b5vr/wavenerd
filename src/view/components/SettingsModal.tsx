import { Mixer, XFaderModeType } from '../../Mixer';
import React, { useCallback } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { Modal } from './Modal';
import { settingsIsOpeningState } from '../states/settings';
import styled from 'styled-components';
import { xFaderModeState } from '../states/xFader';

// == styles =======================================================================================
const Sans = styled.div`
  font-size: 0.7em;
  font-family: 'Comic Sans MS', serif;
  margin-bottom: 2em;
`;

// == components ===================================================================================
export const SettingsModal: React.FC<{
  mixer: Mixer,
}> = ( { mixer } ) => {
  const xFaderMode = useRecoilValue( xFaderModeState );
  const isOpening = useRecoilValue( settingsIsOpeningState );

  const handleClose = useRecoilCallback(
    ( { set } ) => () => {
      set( settingsIsOpeningState, false );
    },
    [],
  );

  const handleChangeXFaderCurveMode = useCallback( ( event: React.ChangeEvent ) => {
    const mode = ( event.target as HTMLInputElement ).value;
    mixer.xfaderMode = mode as XFaderModeType;
  }, [] );

  if ( !isOpening ) {
    return null;
  }

  return (
    <Modal onClose={handleClose}>
      <Sans>decent settings modal window</Sans>
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
