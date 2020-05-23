import { atom, selector } from 'recoil';
import { MIDIParams } from '../../MIDIParams';

// == atoms ========================================================================================
export const midiLearningState = atom<string | null>( {
  key: 'midiLearningState',
  default: null
} );

// == selectors ====================================================================================
export const midiIsLearningXFaderState = selector( {
  key: 'midiIsLearningXFaderState',
  get: ( { get } ) => {
    const learning = get( midiLearningState );
    return learning === MIDIParams.XFader;
  }
} );
