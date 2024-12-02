import { atom } from 'jotai';

export const midiParamsAtom = atom<Record<string, number>>({});

export const midiLearningAtom = atom<string | null>(null);

export const midiModalIsOpeningAtom = atom(false);
