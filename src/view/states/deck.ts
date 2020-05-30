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

export const deckSampleListState = atom<Set<string>>( {
  key: 'deckSampleListState',
  default: new Set()
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

// == hooks ========================================================================================
/**
 * @todo 🔥 It will conflict when you use {@link useDeleteSampleAction} simultaneously
 */
export function useAddSampleAction(): ( name: string ) => Promise<void> {
  return useRecoilCallback(
    async ( { getPromise, set }, name ) => {
      const sampleList = await getPromise( deckSampleListState );

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
    async ( { getPromise, set }, name ) => {
      const sampleList = await getPromise( deckSampleListState );

      const newSamples = new Set( sampleList );
      if ( newSamples.has( name ) ) {
        newSamples.delete( name );
      }

      set( deckSampleListState, newSamples );
    },
    []
  );
}
