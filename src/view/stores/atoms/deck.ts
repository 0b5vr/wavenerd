import { atom } from 'jotai';
import { defaultCodeA, defaultCodeB } from '../../../defaultCode';

// == atoms ========================================================================================
export const deckACodeAtom = atom<string>(defaultCodeA);
export const deckBCodeAtom = atom<string>(defaultCodeB);

export const deckAHasEditAtom = atom(false);
export const deckBHasEditAtom = atom(false);

export const deckACueStatusAtom = atom<'none' | 'compiling' | 'ready' | 'applying'>('none');
export const deckBCueStatusAtom = atom<'none' | 'compiling' | 'ready' | 'applying'>('none');

export const deckAErrorAtom = atom<string | null>(null);
export const deckBErrorAtom = atom<string | null>(null);

export const deckACompileTimeAtom = atom(0.0);
export const deckBCompileTimeAtom = atom(0.0);

export const deckTimeAtom = atom(0.0);
export const deckIsPlayingAtom = atom(false);
export const deckBeatsAtom = atom({
  beat: 0.0,
  bar: 0.0,
  sixteenBar: 0.0,
});
export const deckBPMAtom = atom(140.0);

export const deckShowBAtom = atom(true);
