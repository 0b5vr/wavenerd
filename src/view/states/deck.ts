import { atom } from 'recoil';
import { defaultCode } from '../../defaultCode';

export const deckACodeState = atom( {
  key: 'deckACodeState',
  default: defaultCode
} );

export const deckBCodeState = atom( {
  key: 'deckBCodeState',
  default: defaultCode
} );

export const deckACueStatusState = atom<'none' | 'ready' | 'applying'>( {
  key: 'deckACueStatusState',
  default: 'none'
} );

export const deckBCueStatusState = atom<'none' | 'ready' | 'applying'>( {
  key: 'deckBCueStatusState',
  default: 'none'
} );

export const deckAErrorState = atom<string | null>( {
  key: 'deckAErrorState',
  default: null
} );

export const deckBErrorState = atom<string | null>( {
  key: 'deckBErrorState',
  default: null
} );

export const deckTimeState = atom( {
  key: 'deckTimeState',
  default: 0.0
} );

export const deckBeatsState = atom( {
  key: 'deckBeatsState',
  default: {
    beat: 0.0,
    bar: 0.0,
    sixteenBar: 0.0
  }
} );

export const deckBPMState = atom( {
  key: 'deckBPMState',
  default: 140.0
} );
