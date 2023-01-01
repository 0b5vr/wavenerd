import { SpectrumModeType, VectorscopeModeType } from '../../SettingsManager';
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

export const settingsSpectrumModeState = atom<SpectrumModeType>( {
  key: 'settingsSpectrumModeState',
  default: 'none',
} );

export const settingsSpectrumOpacityState = atom<number>( {
  key: 'settingsSpectrumOpacityState',
  default: 0.2,
} );

export const settingsSpectrumColorState = atom<string>( {
  key: 'settingsSpectrumColorState',
  default: '#ffffff',
} );
