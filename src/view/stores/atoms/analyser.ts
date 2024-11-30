import { LevelMeterResult } from '../../../LevelMeter';
import { atom } from 'jotai';

export const levelMeterInAAtom = atom<LevelMeterResult>( {
  level: 0.0,
  levelL: 0.0,
  levelR: 0.0,
  peak: 0.0,
  peakL: 0.0,
  peakR: 0.0,
} );

export const levelMeterInBAtom = atom<LevelMeterResult>( {
  level: 0.0,
  levelL: 0.0,
  levelR: 0.0,
  peak: 0.0,
  peakL: 0.0,
  peakR: 0.0,
} );

export const levelMeterOutAtom = atom<LevelMeterResult>( {
  level: 0.0,
  levelL: 0.0,
  levelR: 0.0,
  peak: 0.0,
  peakL: 0.0,
  peakR: 0.0,
} );
