import { atom } from 'jotai';
import { deckCodeStorage } from '../../../deckCodeStorage';
import { defaultCodeA, defaultCodeB } from '../../../defaultCode';

// == atoms ========================================================================================
export const deckACodeAtom = atom<string>(deckCodeStorage.get('a') ?? defaultCodeA);
export const deckBCodeAtom = atom<string>(deckCodeStorage.get('b') ?? defaultCodeB);

export const deckAHasEditAtom = atom(false);
export const deckBHasEditAtom = atom(false);

export const deckACueStatusAtom = atom<'none' | 'compiling' | 'ready' | 'applying'>('none');
export const deckBCueStatusAtom = atom<'none' | 'compiling' | 'ready' | 'applying'>('none');

export const deckAErrorAtom = atom<string | null>(null);
export const deckBErrorAtom = atom<string | null>(null);

export const deckTimeAtom = atom(0.0);
export const deckIsPlayingAtom = atom(false);
export const deckBeatsAtom = atom({
  beat: 0.0,
  bar: 0.0,
  sixteenBar: 0.0,
});
export const deckBPMAtom = atom(140.0);

export const deckSampleListAtom = atom(new Set<string>());
export const deckWavetableListAtom = atom(new Set<string>());
export const deckImageListAtom = atom(new Set<string>());

export const deckShowBAtom = atom(true);

// == sorted assets ================================================================================
export const deckSortedSampleListAtom = atom((get) => {
  const sampleList = get(deckSampleListAtom);
  const array = Array.from(sampleList);
  array.sort();
  return array;
});

export const deckSortedWavetableListAtom = atom((get) => {
  const wavetableList = get(deckWavetableListAtom);
  const array = Array.from(wavetableList);
  array.sort();
  return array;
});

export const deckSortedImageListAtom = atom((get) => {
  const imageList = get(deckImageListAtom);
  const array = Array.from(imageList);
  array.sort();
  return array;
});

// == asset actions ================================================================================
export const deckSampleListAddAtom = atom(null, (get, set, name: string) => {
  const sampleList = new Set(get(deckSampleListAtom));
  sampleList.add(name);
  set(deckSampleListAtom, sampleList);
});

export const deckSampleListDeleteAtom = atom(null, (get, set, name: string) => {
  const sampleList = new Set(get(deckSampleListAtom));
  sampleList.delete(name);
  set(deckSampleListAtom, sampleList);
});

export const deckWavetableListAddAtom = atom(null, (get, set, name: string) => {
  const wavetableList = new Set(get(deckWavetableListAtom));
  wavetableList.add(name);
  set(deckWavetableListAtom, wavetableList);
});

export const deckWavetableListDeleteAtom = atom(null, (get, set, name: string) => {
  const wavetableList = new Set(get(deckWavetableListAtom));
  wavetableList.delete(name);
  set(deckWavetableListAtom, wavetableList);
});

export const deckImageListAddAtom = atom(null, (get, set, name: string) => {
  const imageList = new Set(get(deckImageListAtom));
  imageList.add(name);
  set(deckImageListAtom, imageList);
});

export const deckImageListDeleteAtom = atom(null, (get, set, name: string) => {
  const imageList = new Set(get(deckImageListAtom));
  imageList.delete(name);
  set(deckImageListAtom, imageList);
});
