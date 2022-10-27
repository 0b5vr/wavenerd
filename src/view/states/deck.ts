import { atom, selector, useRecoilCallback } from 'recoil';
import { defaultCode } from '../../defaultCode';

// == atoms ========================================================================================
export const deckACodeState = atom( {
  key: 'deckACodeState',
  default: defaultCode
} );

export const deckBCodeState = atom( {
  key: 'deckBCodeState',
  default: defaultCode
} );

export const deckACueStatusState = atom<'none' | 'compiling' | 'ready' | 'applying'>( {
  key: 'deckACueStatusState',
  default: 'none'
} );

export const deckBCueStatusState = atom<'none' | 'compiling' | 'ready' | 'applying'>( {
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

export const deckIsPlayingState = atom( {
  key: 'deckIsPlayingState',
  default: false,
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

export const deckSampleListState = atom<Set<string>>( {
  key: 'deckSampleListState',
  default: new Set(),
} );

export const deckWavetableListState = atom<Set<string>>( {
  key: 'deckWavetableListState',
  default: new Set(),
} );

export const deckImageListState = atom<Set<string>>( {
  key: 'deckImageListState',
  default: new Set(),
} );

export const deckShowBState = atom( {
  key: 'deckShowBState',
  default: true,
} );

// == selectors ====================================================================================
export const deckSortedSampleListState = selector( {
  key: 'deckSortedSampleListState',
  get: ( { get } ) => {
    const sampleList = get( deckSampleListState );
    const array = Array.from( sampleList );
    array.sort();
    return array;
  }
} );

export const deckSortedWavetableListState = selector( {
  key: 'deckSortedWavetableListState',
  get: ( { get } ) => {
    const wavetableList = get( deckWavetableListState );
    const array = Array.from( wavetableList );
    array.sort();
    return array;
  }
} );

export const deckSortedImageListState = selector( {
  key: 'deckSortedImageListState',
  get: ( { get } ) => {
    const imageList = get( deckImageListState );
    const array = Array.from( imageList );
    array.sort();
    return array;
  }
} );

// == hooks ========================================================================================
/**
 * @todo 🔥 It will conflict when you use {@link useDeleteSampleAction} simultaneously
 */
export function useAddSampleAction(): ( name: string ) => Promise<void> {
  return useRecoilCallback(
    ( { snapshot, set } ) => async ( name ) => {
      const sampleList = await snapshot.getPromise( deckSampleListState );

      const newSamples = new Set( sampleList );
      newSamples.add( name );

      set( deckSampleListState, newSamples );
    },
    []
  );
}

/**
 * @todo 🔥 It will conflict when you use {@link useAddSampleAction} simultaneously
 */
export function useDeleteSampleAction(): ( name: string ) => Promise<void> {
  return useRecoilCallback(
    ( { snapshot, set } ) => async ( name ) => {
      const sampleList = await snapshot.getPromise( deckSampleListState );

      const newSamples = new Set( sampleList );
      if ( newSamples.has( name ) ) {
        newSamples.delete( name );
      }

      set( deckSampleListState, newSamples );
    },
    []
  );
}

export function useAddWavetableAction(): ( name: string ) => Promise<void> {
  return useRecoilCallback(
    ( { snapshot, set } ) => async ( name ) => {
      const wavetableList = await snapshot.getPromise( deckWavetableListState );

      const newWavetables = new Set( wavetableList );
      newWavetables.add( name );

      set( deckWavetableListState, newWavetables );
    },
    []
  );
}

export function useDeleteWavetableAction(): ( name: string ) => Promise<void> {
  return useRecoilCallback(
    ( { snapshot, set } ) => async ( name ) => {
      const wavetableList = await snapshot.getPromise( deckWavetableListState );

      const newWavetables = new Set( wavetableList );
      if ( newWavetables.has( name ) ) {
        newWavetables.delete( name );
      }

      set( deckWavetableListState, newWavetables );
    },
    []
  );
}

export function useAddImageAction(): ( name: string ) => Promise<void> {
  return useRecoilCallback(
    ( { snapshot, set } ) => async ( name ) => {
      const imageList = await snapshot.getPromise( deckImageListState );

      const newImages = new Set( imageList );
      newImages.add( name );

      set( deckImageListState, newImages );
    },
    []
  );
}

export function useDeleteImageAction(): ( name: string ) => Promise<void> {
  return useRecoilCallback(
    ( { snapshot, set } ) => async ( name ) => {
      const imageList = await snapshot.getPromise( deckImageListState );

      const newImages = new Set( imageList );
      if ( newImages.has( name ) ) {
        newImages.delete( name );
      }

      set( deckImageListState, newImages );
    },
    []
  );
}
