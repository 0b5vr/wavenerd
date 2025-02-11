import { Settings, defaultSettings } from '../../../SettingsManager';
import { atom } from 'jotai';

export type SettingsCategory = 'audio' | 'visualization' | 'appearance' | 'editor' | 'about';

export const settingsIsOpeningAtom = atom(false);

export const settingsCategoryAtom = atom<SettingsCategory>('audio');

export const settingsAtom = atom<Settings>(defaultSettings);
