import { atom } from 'jotai';

export const midiParamsAtom = atom<Record<string, number>>({});

export const midiIndicatorAtom = atom(false);

export const midiLearningAtom = atom<string | null>(null);

export const midiModalIsOpeningAtom = atom(false);
