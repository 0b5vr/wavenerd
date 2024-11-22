import { ANALYSER_FREQUENCY_SIZE, ANALYSER_TIME_DOMAIN_SIZE, AnalyserResult } from '../../../Analyser';
import { LevelMeterResult } from '../../../LevelMeter';
import { atom } from 'jotai';

export const analyserInAAtom = atom<AnalyserResult>( {
  deltaTime: 0.0,
  timeDomainL: new Float32Array( ANALYSER_TIME_DOMAIN_SIZE ),
  timeDomainR: new Float32Array( ANALYSER_TIME_DOMAIN_SIZE ),
  frequencyL: new Float32Array( ANALYSER_FREQUENCY_SIZE ),
  frequencyR: new Float32Array( ANALYSER_FREQUENCY_SIZE ),
} );

export const analyserInBAtom = atom<AnalyserResult>( {
  deltaTime: 0.0,
  timeDomainL: new Float32Array( ANALYSER_TIME_DOMAIN_SIZE ),
  timeDomainR: new Float32Array( ANALYSER_TIME_DOMAIN_SIZE ),
  frequencyL: new Float32Array( ANALYSER_FREQUENCY_SIZE ),
  frequencyR: new Float32Array( ANALYSER_FREQUENCY_SIZE ),
} );

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
