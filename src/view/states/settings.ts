import { VectorscopeModeType } from '../../SettingsManager';
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

export const settingsVectorscopeModeState = atom<VectorscopeModeType>( {
  key: 'settingsVectorscopeModeState',
  default: 'none',
} );

export const settingsVectorscopeOpacityState = atom<number>( {
  key: 'settingsVectorscopeOpacityState',
  default: 0.2,
} );

export const settingsVectorscopeColorState = atom<string>( {
  key: 'settingsVectorscopeColorState',
  default: '#ffffff',
} );
