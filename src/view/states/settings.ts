import { XFaderModeType } from '../../Mixer';
import { atom } from 'recoil';

// == atoms ========================================================================================
export const settingsIsOpeningState = atom( {
  key: 'settingsIsOpeningState',
  default: false
} );

export const settingsLatencyBlocksState = atom( {
  key: 'settingsLatencyBlocksState',
  default: 32,
} );

export const settingsXFaderModeState = atom<XFaderModeType>( {
  key: 'settingsXFaderModeState',
  default: 'transition',
} );
