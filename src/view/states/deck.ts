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
