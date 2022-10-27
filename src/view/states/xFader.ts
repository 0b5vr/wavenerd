import { atom, selector } from 'recoil';
import { XFaderModeType } from '../../Mixer';
import { saturate } from '@0b5vr/experimental';

const xFaderInternalState = atom( {
  key: 'xFaderInternalState',
  default: 0.5
} );

export const xFaderModeState = atom<XFaderModeType>( {
  key: 'xFaderModeState',
  default: 'transition',
} );

export const xFaderState = selector<number>( {
  key: 'xFaderState',
  get: ( { get } ) => get( xFaderInternalState ),
  set: ( { set }, newValue ) => set( xFaderInternalState, saturate( newValue as number ) ) // 🔥
} );
