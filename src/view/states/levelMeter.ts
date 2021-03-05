import { LevelMeterResult } from '../../LevelMeter';
import { atom } from 'recoil';

export const levelMeterState = atom<{
  inputL: LevelMeterResult;
  inputR: LevelMeterResult;
  output: LevelMeterResult;
}>( {
  key: 'levelMeterState',
  default: {
    inputL: { level: 0.0, levelL: 0.0, levelR: 0.0, peak: 0.0, peakL: 0.0, peakR: 0.0 },
    inputR: { level: 0.0, levelL: 0.0, levelR: 0.0, peak: 0.0, peakL: 0.0, peakR: 0.0 },
    output: { level: 0.0, levelL: 0.0, levelR: 0.0, peak: 0.0, peakL: 0.0, peakR: 0.0 },
  },
} );
