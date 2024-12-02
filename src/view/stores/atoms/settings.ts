import { Settings, defaultSettings } from '../../../SettingsManager';
import { atom } from 'jotai';

export const settingsIsOpeningAtom = atom(false);

export const settingsAtom = atom<Settings>(defaultSettings);
